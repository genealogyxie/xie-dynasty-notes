# Android App Build Instructions

## Overview
The Android project has been created using Capacitor and is ready to build. The web app has been bundled and synced with the Android project.

## Prerequisites

1. **Android Studio** (latest version)
   - Download from: https://developer.android.com/studio
   
2. **Java Development Kit (JDK) 17 or higher**
   - Download from: https://www.oracle.com/java/technologies/downloads/

3. **Android SDK** (installed via Android Studio)
   - Android SDK Platform 34 (or latest)
   - Android SDK Build-Tools
   - Android SDK Platform-Tools

## Quick Build (Using Android Studio)

### Method 1: Build APK in Android Studio

1. **Open the project in Android Studio:**
   ```bash
   cd apps/mobile
   npx cap open android
   ```
   Or manually open Android Studio and select "Open an Existing Project", then navigate to `apps/mobile/android`

2. **Wait for Gradle sync to complete** (first time may take several minutes)

3. **Build the APK:**
   - Go to: `Build` → `Build Bundle(s) / APK(s)` → `Build APK(s)`
   - Or use keyboard shortcut: `Ctrl+Shift+A` (Windows/Linux) or `Cmd+Shift+A` (Mac), then type "Build APK"

4. **Locate the APK:**
   - After build completes, click "locate" in the notification
   - Or find it at: `apps/mobile/android/app/build/outputs/apk/debug/app-debug.apk`

5. **Install on device:**
   - Connect your Android device via USB (with USB debugging enabled)
   - Click the "Run" button in Android Studio
   - Or drag and drop the APK to your device

### Method 2: Build APK via Command Line

1. **Set ANDROID_HOME environment variable:**
   
   **Windows:**
   ```cmd
   set ANDROID_HOME=C:\Users\YourUsername\AppData\Local\Android\Sdk
   ```
   
   **Mac/Linux:**
   ```bash
   export ANDROID_HOME=$HOME/Library/Android/sdk  # Mac
   export ANDROID_HOME=$HOME/Android/Sdk          # Linux
   ```

2. **Navigate to the Android project:**
   ```bash
   cd apps/mobile/android
   ```

3. **Build the debug APK:**
   ```bash
   ./gradlew assembleDebug
   ```
   
   Or on Windows:
   ```cmd
   gradlew.bat assembleDebug
   ```

4. **Find the APK:**
   ```
   apps/mobile/android/app/build/outputs/apk/debug/app-debug.apk
   ```

## Building a Release APK (for distribution)

### 1. Generate a signing key:

```bash
keytool -genkey -v -keystore xie-dynasty-notes.keystore -alias xie-notes -keyalg RSA -keysize 2048 -validity 10000
```

### 2. Create `android/key.properties`:

```properties
storePassword=YOUR_KEYSTORE_PASSWORD
keyPassword=YOUR_KEY_PASSWORD
keyAlias=xie-notes
storeFile=../xie-dynasty-notes.keystore
```

### 3. Update `android/app/build.gradle`:

Add before `android {`:
```gradle
def keystoreProperties = new Properties()
def keystorePropertiesFile = rootProject.file('key.properties')
if (keystorePropertiesFile.exists()) {
    keystoreProperties.load(new FileInputStream(keystorePropertiesFile))
}
```

Add inside `android { ... }`:
```gradle
signingConfigs {
    release {
        keyAlias keystoreProperties['keyAlias']
        keyPassword keystoreProperties['keyPassword']
        storeFile keystoreProperties['storeFile'] ? file(keystoreProperties['storeFile']) : null
        storePassword keystoreProperties['storePassword']
    }
}
buildTypes {
    release {
        signingConfig signingConfigs.release
        minifyEnabled false
        proguardFiles getDefaultProguardFile('proguard-android-optimize.txt'), 'proguard-rules.pro'
    }
}
```

### 4. Build release APK:

```bash
cd apps/mobile/android
./gradlew assembleRelease
```

Release APK will be at: `app/build/outputs/apk/release/app-release.apk`

## Updating the Web App

If you make changes to the web app, rebuild and sync:

```bash
# In apps/web directory
npm run build

# In apps/mobile directory
npx cap sync android
```

Then rebuild the Android app.

## Configuring Backend URL

To change the backend URL (currently set to localhost):

1. Edit `apps/web/.env`:
   ```
   VITE_API_URL=https://your-backend-url.com
   VITE_WS_URL=wss://your-backend-url.com
   ```

2. Rebuild the web app:
   ```bash
   cd apps/web
   npm run build
   ```

3. Sync with Android:
   ```bash
   cd apps/mobile
   npx cap sync android
   ```

4. Rebuild the Android app

## Troubleshooting

### Gradle sync failed
- Make sure Android SDK is installed
- Check that ANDROID_HOME is set correctly
- Try: `File` → `Invalidate Caches / Restart` in Android Studio

### Build failed with SDK not found
- Open Android Studio → SDK Manager
- Install Android SDK Platform 34 (or latest)
- Install Android SDK Build-Tools

### App crashes on launch
- Check that the web app was built successfully
- Verify the backend URL is accessible
- Check Android Logcat in Android Studio for errors

### WebView not loading
- Make sure the web assets were synced: `npx cap sync android`
- Check that `dist` folder exists in `apps/web/`
- Verify capacitor.config.json has correct webDir path

## Testing on Emulator

1. In Android Studio: `Tools` → `Device Manager`
2. Create a new virtual device (recommended: Pixel 6 with Android 13+)
3. Click "Run" button to install and launch the app

## Installing on Physical Device

1. Enable Developer Options on your Android device:
   - Go to Settings → About Phone
   - Tap "Build Number" 7 times
   
2. Enable USB Debugging:
   - Settings → Developer Options → USB Debugging

3. Connect device via USB

4. In Android Studio, select your device from the device dropdown

5. Click "Run" button

## App Permissions

The app requires the following permissions (already configured):
- INTERNET (for API calls and WebSocket sync)
- ACCESS_NETWORK_STATE (for offline detection)

## Additional Resources

- Capacitor Documentation: https://capacitorjs.com/docs
- Android Developer Guide: https://developer.android.com/guide
- Gradle Build Guide: https://developer.android.com/build

## Support

For issues with:
- The web app: Check `apps/web/README.md`
- Capacitor: https://capacitorjs.com/docs/troubleshooting
- Android Studio: https://developer.android.com/studio/intro
