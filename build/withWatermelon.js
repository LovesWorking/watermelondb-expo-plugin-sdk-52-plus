"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.withSDK50 = withSDK50;
const config_plugins_1 = require("@expo/config-plugins");
const fs_1 = __importDefault(require("fs"));
const fs = fs_1.default.promises;
// 2. In android/settings.gradle, add:
function settingGradle(gradleConfig) {
    return (0, config_plugins_1.withSettingsGradle)(gradleConfig, (mod) => {
        if (!mod.modResults.contents.includes(":watermelondb-jsi")) {
            console.log("[WatermelonDB] Adding watermelondb-jsi to settings.gradle");
            // Keep original implementation but with logging
            mod.modResults.contents += `
          include ':watermelondb-jsi'
          project(':watermelondb-jsi').projectDir = new File([
              "node", "--print", 
              "require.resolve('@nozbe/watermelondb/package.json')"
          ].execute(null, rootProject.projectDir).text.trim(), "../native/android-jsi")
        `;
            console.log("[WatermelonDB] Successfully added watermelondb-jsi configuration");
        }
        else {
            console.log("[WatermelonDB] watermelondb-jsi already configured in settings.gradle");
        }
        return mod;
    });
}
// 3. In android/app/build.gradle, add:
function buildGradle(config) {
    return (0, config_plugins_1.withAppBuildGradle)(config, (mod) => {
        console.log("[WatermelonDB] Checking android/app/build.gradle configuration...");
        if (!mod.modResults.contents.includes("pickFirst '**/libc++_shared.so'")) {
            console.log("[WatermelonDB] Adding pickFirst configuration for libc++_shared.so");
            mod.modResults.contents = mod.modResults.contents.replace("android {", `
        android {
          packagingOptions {
             pickFirst '**/libc++_shared.so' 
          }
        `);
        }
        else {
            console.log("[WatermelonDB] pickFirst configuration already exists");
        }
        if (!mod.modResults.contents.includes("implementation project(':watermelondb-jsi')")) {
            console.log("[WatermelonDB] Adding watermelondb-jsi implementation to dependencies");
            mod.modResults.contents = mod.modResults.contents.replace("dependencies {", `
        dependencies {
          implementation project(':watermelondb-jsi')
        `);
            console.log("[WatermelonDB] Successfully added watermelondb-jsi dependency");
        }
        else {
            console.log("[WatermelonDB] watermelondb-jsi dependency already exists");
        }
        return mod;
    });
}
// https://github.com/morrowdigital/watermelondb-expo-plugin/pull/51/files#diff-ac4d678cfe00980f9ba9c66167516e4ab4139b78c94ff9c5083553ae8ad1f79e
function mainApplicationSDK52(config) {
    return (0, config_plugins_1.withMainApplication)(config, (mod) => {
        if (!mod.modResults.contents.includes("import com.nozbe.watermelondb.jsi.WatermelonDBJSIPackage")) {
            mod.modResults["contents"] = mod.modResults.contents.replace("import android.app.Application", `
import android.app.Application
import com.nozbe.watermelondb.jsi.WatermelonDBJSIPackage;        
`);
        }
        if (!mod.modResults.contents.includes("packages.add(WatermelonDBJSIPackage())")) {
            const newContents2 = mod.modResults.contents.replace("return packages", `
            packages.add(WatermelonDBJSIPackage())
        return packages`);
            mod.modResults.contents = newContents2;
        }
        return mod;
    });
}
// 4. If you're using Proguard, in android/app/proguard-rules.pro add:
function proGuardRules(config) {
    return (0, config_plugins_1.withDangerousMod)(config, [
        "android",
        async (config) => {
            const contents = await fs.readFile(`${config.modRequest.platformProjectRoot}/app/proguard-rules.pro`, "utf-8");
            if (!contents.includes("-keep class com.nozbe.watermelondb.** { *; }")) {
                const newContents = `
      ${contents}
      -keep class com.nozbe.watermelondb.** { *; }
      `;
                await fs.writeFile(`${config.modRequest.platformProjectRoot}/app/proguard-rules.pro`, newContents);
            }
            return config;
        },
    ]);
}
// @ts-ignore
function withSDK50(options) {
    return (config) => {
        let currentConfig = config;
        // Android
        if (options?.disableJsi !== true) {
            currentConfig = settingGradle(config);
            currentConfig = buildGradle(currentConfig);
            currentConfig = proGuardRules(currentConfig);
            // Only manual link package on sdk 52+ as descripted here:
            // https://github.com/Nozbe/WatermelonDB/issues/1769#issuecomment-2600274652
            currentConfig = mainApplicationSDK52(currentConfig);
        }
        return currentConfig;
    };
}
exports.default = (config, options) => {
    return withSDK50(options)(config);
};
