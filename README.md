# Dynatrace Cordova plugin wrapper for OutSystems

This plugin is based on the code published by Dynatrace as an NPM package at [this location](https://www.npmjs.com/package/@dynatrace/cordova-plugin).
It gives you the ability to use the Dynatrace instrumentation in your hybrid application.

## Dynatrace Cordova plugin version

This is based on @dynatrace/cordova-plugin version 2.309.1.

## Agent Versions

This agent versions are configured in this plugin:
- Android Agent: 8.309.2.1011
- iOS Agent: 8.309.1.1009

## MABS Version
This plugin uses MABS version 11.

## How to Update this Wrapper

### Install the NPM and prepare folders
1. Create a new branch of the following repository and clone it into your PC: https://github.com/OutSystems/dynatrace-cordova-plugin
2. Create a new temp folder in another location
3. Run the following command inside your temp folder:
```cordova create cordovaapp dynatraceRUM```
4. Enter the newly created folder called cordovaapp, move all its content to the temp folder you created before.
5. In your temp folder run this command:
```cordova plugin add @dynatrace/cordova-plugin --save```

### Copy files
1. Go to the folder for the repo you just cloned. Copy the folder *OutSystems* under folder *scripts*.
2. Go back to the folder *node_modules\\@dynatrace\cordova-plugin\scripts* under your temp folder and paste the folder *OutSystems* there

### Add Hooks to plugin.xml
1. Go to the folder *node_modules\\@dynatrace\cordova-plugin* under your temp folder and open file *plugin.xml* in a code editor
2. Add these two lines
```
  <hook src="scripts/Outsystems/npmInstall.js" type="before_plugin_install"/>
  <hook src="scripts/Outsystems/copyConfig.js" type="before_prepare"/>

```

Before
```
  <hook src="scripts/pluginAdd.js" type="before_plugin_add"/>
  <hook src="scripts/install.js" type="after_plugin_add"/>
  <hook src="scripts/uninstall.js" type="before_plugin_rm"/>
  <hook src="scripts/instrument.js" type="after_prepare"/>
  <hook src="scripts/close-log.js" type="after_build"/>
  <hook src="scripts/close-log.js" type="after_run"/>
```

After
```
  <hook src="scripts/pluginAdd.js" type="before_plugin_add"/>
  <hook src="scripts/Outsystems/npmInstall.js" type="before_plugin_install"/>
  <hook src="scripts/install.js" type="after_plugin_add"/>
  <hook src="scripts/uninstall.js" type="before_plugin_rm"/>
  <hook src="scripts/Outsystems/copyConfig.js" type="before_prepare"/>
  <hook src="scripts/instrument.js" type="after_prepare"/>
  <hook src="scripts/close-log.js" type="after_build"/>
  <hook src="scripts/close-log.js" type="after_run"/>
```

### Add the new code to the repo
1. Go to your temp folder and copy the content of *node_modules\\@dynatrace\cordova-plugin* (except for file *README.md*) into the folder where you cloned the *dynatrace-cordova-plugin* repo
2. Commit your changes to *origin*

## Identify users in the native side

### Add JavaScript bindings
1. Create a new file in your repo called *IdentifyUserNative.js* under folder *other*
2. Add the following content
```
// Empty constructor
function IdentifyUserNative() {}
 
// The function that passes work along to native shells
IdentifyUserNative.prototype.identifyUserNative = function(userId, successCallback, errorCallback) {
 var options = {};
 options.userId = userId;
 cordova.exec(successCallback, errorCallback, 'DynatraceCordovaPlugin', 'identifyUser', [options]);
}
 
// Installation constructor that binds IdentifyUserNative to window
IdentifyUserNative.install = function() {
 if (!window.plugins) {
   window.plugins = {};
 }
 window.plugins.identifyUserNative = new IdentifyUserNative();
 return window.plugins.identifyUserNative;
};
cordova.addConstructor(IdentifyUserNative.install);
```
3. Modify file plugin.xml and add the following
```
 <js-module src="other/IdentifyUserNative.js" name="identifyUserNative">
     <clobbers target="window.plugins.identifyUserNative" />
 </js-module>
```

Before
```
  <js-module src="other/DynatraceCordovaPlugin.js" name="dynatraceMobile">
	  <clobbers target="dynatraceMobile"/>
  </js-module>

  <platform name="ios">
```

After
```
  <js-module src="other/DynatraceCordovaPlugin.js" name="dynatraceMobile">
	  <clobbers target="dynatraceMobile"/>
  </js-module>

  <js-module src="other/IdentifyUserNative.js" name="identifyUserNative">
      <clobbers target="window.plugins.identifyUserNative" />
  </js-module>

  <platform name="ios">
```

### Add Android code
1. Open file *DynatraceCordovaPlugin.java* in folder *other*
2. Go to the top of *DynatraceCordovaPlugin* class declaration, where there are some constants declared, and add a new one called *ACTION_UEM_IDENTIFY_USER* with value *identifyUser*
```
public static final String ACTION_UEM_IDENTIFY_USER = "identifyUser";
```

Before
```
  public static final String ACTION_UEM_END_SESSION = "endVisit";
  public static final String ACTION_UEM_GET_USERPRIVACYOPTIONS = "getUserPrivacyOptions";
  public static final String ACTION_UEM_APPLY_USERPRIVACYOPTIONS = "applyUserPrivacyOptions";
```

After
```
  public static final String ACTION_UEM_END_SESSION = "endVisit";
  public static final String ACTION_UEM_GET_USERPRIVACYOPTIONS = "getUserPrivacyOptions";
  public static final String ACTION_UEM_APPLY_USERPRIVACYOPTIONS = "applyUserPrivacyOptions";
  public static final String ACTION_UEM_IDENTIFY_USER = "identifyUser";
```

3. Go to the last *else if* of method execute and add the following code
```
else if (action.equals(ACTION_UEM_IDENTIFY_USER)) {
  String userId = args.getJSONObject(0).getString("userId");

  Dynatrace.identifyUser(userId);
  callbackContext.success("UserId: " + userId);
  return true;
}
```

Before
```
...
  } else if (action.equals(ACTION_UEM_APPLY_USERPRIVACYOPTIONS)) {
    UserPrivacyOptions.Builder optionsBuilder = UserPrivacyOptions.builder();
    optionsBuilder.withDataCollectionLevel(DataCollectionLevel.values()[(args.getJSONObject(0).getInt("_dataCollectionLevel"))]);
    optionsBuilder.withCrashReportingOptedIn(args.getJSONObject(0).getBoolean("_crashReportingOptedIn"));

    Dynatrace.applyUserPrivacyOptions(optionsBuilder.build());
    callbackContext.success("Privacy settings updated!");

    return true;
  }
} catch(Exception e) {
  System.err.println("Exception: " + e.getMessage());
  callbackContext.error(e.getMessage());
  return false;
}
...
```

After
```
...
  } else if (action.equals(ACTION_UEM_APPLY_USERPRIVACYOPTIONS)) {
    UserPrivacyOptions.Builder optionsBuilder = UserPrivacyOptions.builder();
    optionsBuilder.withDataCollectionLevel(DataCollectionLevel.values()[(args.getJSONObject(0).getInt("_dataCollectionLevel"))]);
    optionsBuilder.withCrashReportingOptedIn(args.getJSONObject(0).getBoolean("_crashReportingOptedIn"));

    Dynatrace.applyUserPrivacyOptions(optionsBuilder.build());
    callbackContext.success("Privacy settings updated!");

    return true;
  } else if (action.equals(ACTION_UEM_IDENTIFY_USER)) {
    String userId = args.getJSONObject(0).getString("userId");

    Dynatrace.identifyUser(userId);
    callbackContext.success("UserId: " + userId);
    return true;
  }
} catch(Exception e) {
  System.err.println("Exception: " + e.getMessage());
  callbackContext.error(e.getMessage());
  return false;
}
...
```

### Adding iOS code
1. Open the file *DynatraceCordovaPlugin.h* in folder *other*
2. Add the following line of code at the bottom of it before the *@end* keyword
```
- (void)identifyUser:(CDVInvokedUrlCommand*)command;
```

Before
```
@interface DynatraceCordovaPlugin : CDVPlugin

- (void)endVisit:(CDVInvokedUrlCommand*)command;

- (void) getUserPrivacyOptions:(CDVInvokedUrlCommand*)command;

- (void) applyUserPrivacyOptions:(CDVInvokedUrlCommand*)command;

@end
```

After
```
@interface DynatraceCordovaPlugin : CDVPlugin

- (void)endVisit:(CDVInvokedUrlCommand*)command;

- (void) getUserPrivacyOptions:(CDVInvokedUrlCommand*)command;

- (void) applyUserPrivacyOptions:(CDVInvokedUrlCommand*)command;

- (void)identifyUser:(CDVInvokedUrlCommand*)command;

@end
```

3. Open the file *DynatraceCordovaPlugin.m* in folder other
4. Add the following code at the bottom of it before the *@end* keyword
```
- (void)identifyUser:(CDVInvokedUrlCommand*)command
{   
    CDVPluginResult* pluginResult;

    if ([command.arguments objectAtIndex:0]) {

        NSString* userId = [[command.arguments objectAtIndex:0] valueForKey:@"userId"];
        
        DTX_StatusCode result = [Dynatrace identifyUser:userId];
        
        pluginResult = [CDVPluginResult resultWithStatus:CDVCommandStatus_OK messageAsString:@("Success")];
    } else {
        pluginResult = [CDVPluginResult resultWithStatus:CDVCommandStatus_ERROR];
    }

    [self.commandDelegate sendPluginResult:pluginResult callbackId:command.callbackId];
}
```

Before
```
...
    [self.commandDelegate sendPluginResult:pluginResult callbackId:command.callbackId];
}

@end
```

After
```
...
    [self.commandDelegate sendPluginResult:pluginResult callbackId:command.callbackId];
}

- (void)identifyUser:(CDVInvokedUrlCommand*)command
{   
    CDVPluginResult* pluginResult;

    if ([command.arguments objectAtIndex:0]) {

        NSString* userId = [[command.arguments objectAtIndex:0] valueForKey:@"userId"];
        
        DTX_StatusCode result = [Dynatrace identifyUser:userId];
        
        pluginResult = [CDVPluginResult resultWithStatus:CDVCommandStatus_OK messageAsString:@("Success")];
    } else {
        pluginResult = [CDVPluginResult resultWithStatus:CDVCommandStatus_ERROR];
    }

    [self.commandDelegate sendPluginResult:pluginResult callbackId:command.callbackId];
}

@end
```

### Access this code from your plugin
In order to access this code from your plugin, you can execute the JavaScript function:
```
window.plugins.identifyUserNative.identifyUserNative($parameters.Value);
```

## Merge code into main branch
To finish the process
1. Commit and push all your code to your fork
2. Create a release with a tag
3. Create a PR to merge your code into main, or point your plugin to your private repo by:
   * Opening it with Service Studio
   * Clicking on the plugin name in the right-side panel
   * Going to extensibility
   * And changing the URL of the repository

