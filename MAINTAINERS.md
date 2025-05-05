# Maintainer's Guide

This document outlines the process for maintaining and releasing new versions of `@lovesworking/watermelondb-expo-plugin-sdk-52-plus`.

## Making Changes

1. Clone the repository:

```bash
git clone https://github.com/LovesWorking/watermelondb-expo-plugin-sdk-52-plus.git
cd watermelondb-expo-plugin-sdk-52-plus
```

2. Install dependencies:

```bash
yarn install
```

3. Make your changes in the `src` directory

4. Build and test your changes:

```bash
npm run clean     # Clean previous builds
npm run prepare   # Prepare the module
npm run build     # Build the module
```

## Publishing a New Release

### 1. Update Version

Choose one of the following based on your changes:

```bash
# For patch updates (bug fixes)
npm run bump:release   # Increases 1.0.0 to 1.0.1

# For beta releases
npm run bump:beta     # Adds -beta.0 to version
```

### 2. Build and Publish

```bash
# Clean and rebuild
npm run clean
npm run prepare

# Publish to npm
npm publish --access public
```

### 3. Create Git Tag and GitHub Release

```bash
# Create and push git tag (replace X.X.X with your version)
git tag vX.X.X
git push origin vX.X.X
```

### 4. Create GitHub Release

1. Go to [GitHub Releases](https://github.com/LovesWorking/watermelondb-expo-plugin-sdk-52-plus/releases/new)
2. Select the tag you just created
3. Title: `vX.X.X`
4. Description: List the changes made in this release
5. Click "Publish release"

## Troubleshooting

If you encounter issues during publishing:

1. Make sure you're logged into npm:

```bash
npm login
```

2. Check that all files are included in the package:

```bash
npm pack --dry-run
```

3. Verify the build directory exists and contains:
   - withWatermelon.js
   - withWatermelon.d.ts
   - insertLinesHelper.js
   - insertLinesHelper.d.ts

## Package Structure

Important files:

- `src/` - Source code
- `build/` - Compiled code (generated)
- `app.plugin.js` - Plugin entry point
- `package.json` - Package configuration
- `tsconfig.json` - TypeScript configuration

## Scripts

- `clean` - Removes build files
- `prepare` - Prepares the module for publishing
- `build` - Builds the TypeScript code
- `lint` - Runs ESLint
- `test` - Runs tests
- `bump:beta` - Creates a beta version
- `bump:release` - Creates a patch release
