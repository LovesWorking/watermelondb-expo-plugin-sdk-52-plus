# watermelondb-expo-plugin-sdk-52-plus 🍉

Config plugin to auto configure `@nozbe/watermelondb` for Expo SDK 52 and above.

## Install

> Tested against Expo SDK 52+

```bash
npm install @lovesworking/watermelondb-expo-plugin-sdk-52-plus

# or using yarn
yarn add @lovesworking/watermelondb-expo-plugin-sdk-52-plus
```

> Please make sure you also install **[expo-build-properties](https://docs.expo.dev/versions/latest/sdk/build-properties/)**

After installing this npm package, add the [config plugin](https://docs.expo.io/guides/config-plugins/) to the [`plugins`](https://docs.expo.io/versions/latest/config/app/#plugins) array of your `app.json` or `app.config.js`. Then rebuild your app using a custom development client, as described in the ["Adding custom native code"](https://docs.expo.io/workflow/customizing/) guide.

You also need to add the packaging options pick-first for android.

## Example

In your app.json `plugins` array:

```json
{
  "plugins": [
    ["@lovesworking/watermelondb-expo-plugin-sdk-52-plus"],
    [
      "expo-build-properties",
      {
        "android": {
          "kotlinVersion": "1.6.10",
          "packagingOptions": {
            "pickFirst": ["**/libc++_shared.so"]
          }
        }
      }
    ]
  ]
}
```

## JSI support for Android

This plugin installs automatically JSI support for Android builds, as per [WatermelonDB for Android instructions](https://watermelondb.dev/docs/Installation#android-react-native).
If you wish to disable JSI support during build you may add the option in config plugin:

```json
["@lovesworking/watermelondb-expo-plugin-sdk-52-plus", { "disableJsi": true }]
```

## Build errors with M1 architectures for simulators

There have been errors building with M1 architectures for simulators on iOS, with Error:

```
No such module 'ExpoModulesCore'
```

If you wish to add the excluded architectures configuration, you can add it with option:

```json
[
  "@lovesworking/watermelondb-expo-plugin-sdk-52-plus",
  { "excludeSimArch": true }
]
```

This will add:

```
"EXCLUDED_ARCHS[sdk=iphonesimulator*]" = "arm64"
```

## About

This is a fork of the original [@morrowdigital/watermelondb-expo-plugin](https://github.com/morrowdigital/watermelondb-expo-plugin) updated and maintained for Expo SDK 52 and above.

## Contributing

See [MAINTAINERS.md](./MAINTAINERS.md) for information about making contributions and releasing new versions.
