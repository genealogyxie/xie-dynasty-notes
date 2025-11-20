# Mobile Wrapper (iOS & Android)

This directory contains the Capacitor wrapper for iOS and Android platforms.

## Setup

1. Initialize Capacitor:
```bash
npx cap init
```

2. Add platforms:
```bash
npx cap add android
npx cap add ios
```

3. Build the web app:
```bash
cd ../web
npm run build
```

4. Sync with native projects:
```bash
npx cap sync
```

## Development

### Android
```bash
npx cap open android
```

Then run from Android Studio.

### iOS
```bash
npx cap open ios
```

Then run from Xcode.

## Building for Production

### Android
1. Open in Android Studio
2. Build > Generate Signed Bundle / APK
3. Follow the wizard to create a signed APK

### iOS
1. Open in Xcode
2. Product > Archive
3. Distribute to App Store or Ad Hoc

## Features

- Offline-first with IndexedDB
- Native file picker integration
- Camera access
- Share target support
- Push notifications (future)
