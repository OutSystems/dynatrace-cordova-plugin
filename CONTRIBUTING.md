# Contributing to Dynatrace Cordova Plugin

This plugin is a wrapper of the Dynatrace Cordova plugin for OutSystems. It wraps the [@dynatrace/cordova-plugin](https://www.npmjs.com/package/@dynatrace/cordova-plugin) NPM package and adds OutSystems-specific customizations.

## Development Setup

### Prerequisites

- Node.js >= 18 (see `engines` in package.json)
- Cordova CLI: `npm install -g cordova`
- Git
- For Android development: Android SDK
- For iOS development: Xcode and CocoaPods

### Installation

1. Clone the repository:
```bash
git clone https://github.com/OutSystems/dynatrace-cordova-plugin.git
cd dynatrace-cordova-plugin
```

2. Install dependencies:
```bash
npm install
```

This will automatically run the `install` hook which executes `scripts/InstallCap.js` and sets up Husky for git hooks.

## Development Workflow

### Branch Naming

Branch names follow a descriptive pattern based on the target MABS (Mobile Apps Build Service) version or feature:

- MABS version updates: `MABS[version]` (e.g., `MABS11`, `MABS10`, `MABS9`)
- Feature branches: descriptive names (e.g., `configFile`, `importDynatrace`)

Check existing branches for reference:
```bash
git branch -r
```

### Commit Messages

Commits follow a simple descriptive format. Examples from the repository:

- Feature additions: `Add hook to copy configuration file`
- Updates: `Update dynatrace plugin code (#9)`, `MABS9 Update (#7)`
- Fixes: `Fix: replace @dynatrace mentions with plugin name`
- Upgrades: `Upgraded to last Dynatrace Version and MABS 10`

Reference recent commits for style:
```bash
git log --oneline -20
```

### Making Changes

1. Create a feature branch from `main`
2. Make your changes
3. Run linting and formatting:
```bash
npm run lint
npm run prettier:check
```
4. Fix any issues:
```bash
npm run prettier:write
```
5. Commit your changes
6. Push and create a pull request

## Building and Testing

### Code Quality

| Command | Description |
|---------|-------------|
| `npm run lint` | Lint TypeScript source files with ESLint |
| `npm run lint:spec` | Lint test files |
| `npm run prettier:check` | Check code formatting |
| `npm run prettier:write` | Auto-format code with Prettier |

### TypeScript Compilation

| Command | Description |
|---------|-------------|
| `npm run tsc` | Compile TypeScript (development) |
| `npm run tsc:prod` | Compile TypeScript for release |

### Testing

| Command | Description |
|---------|-------------|
| `npm test` | Run Jest tests |
| `npm run test:debug` | Run tests with Node inspector |

### Plugin Utilities

| Command | Description |
|---------|-------------|
| `npx doctorDynatrace` | Diagnostic tool for plugin configuration |

## Code Standards

### Linting

The project uses ESLint with TypeScript support. Configuration is embedded in package.json with these plugins:

- `@typescript-eslint/eslint-plugin`
- `eslint-plugin-import`
- `eslint-plugin-jsdoc`
- `eslint-plugin-prefer-arrow`
- `eslint-plugin-unicorn`
- `eslint-config-prettier` (to avoid conflicts with Prettier)

Linting is enforced via lint-staged on commit.

### Formatting

Prettier is configured for consistent code formatting. All TypeScript files are automatically formatted on commit via Husky and lint-staged.

### Git Hooks

Pre-commit hooks (via Husky) automatically run:
- ESLint with auto-fix on `*.ts` files
- Prettier on all files

This is configured in `package.json` under `lint-staged`.

## Pull Request Process

1. Ensure all linting and formatting checks pass
2. Verify TypeScript compilation succeeds
3. Update the README.md if you've made changes that affect:
   - Plugin version
   - Agent versions (Android/iOS)
   - MABS version
   - Installation or usage instructions

4. Create a pull request to `main` branch
5. PR titles should be descriptive and reference any issue numbers

### After Merge

When changes are merged to `main`:

1. Update the version number in:
   - `package.json`
   - `plugin.xml`
2. Create a git tag following the versioning pattern (e.g., `v11.0`)
3. Create a GitHub release

Check existing tags for versioning reference:
```bash
git tag
```

## Updating the Plugin Wrapper

The detailed process for updating this wrapper with a new version of the upstream Dynatrace plugin is documented in the README.md under "How to Update this Wrapper".

Key steps involve:
1. Installing the new `@dynatrace/cordova-plugin` version
2. Copying OutSystems-specific customizations
3. Adding required hooks to `plugin.xml`
4. Updating native code (Android Java, iOS Objective-C)
5. Updating version numbers and agent versions

**Always refer to README.md for the complete update procedure.**

## Project Structure

For a detailed directory structure with file annotations, see [CLAUDE.md - Repository Structure](./CLAUDE.md#repository-structure).

Key directories:
- `scripts/` - Cordova hooks and build-time instrumentation
- `scripts/Outsystems/` - OutSystems-specific hooks
- `other/` - Native bridge code (Java, Objective-C, JavaScript)
- `files/` - iOS frameworks and configuration templates

## Platform Support

This plugin supports:
- Android (requires Android SDK)
- iOS (requires Xcode)
- Windows (limited support)

Agent versions are defined in:
- Android: `plugin.xml` (see `framework` tag with `com.dynatrace.agent:agent-android`)
- iOS: `files/iOS/Dynatrace.xcframework`

## Getting Help

- Check the doctorDynatrace diagnostic tool: `npx doctorDynatrace`
- Review the upstream documentation: https://www.npmjs.com/package/@dynatrace/cordova-plugin
- Open an issue in the GitHub repository
