# HarmonyOS Wrapper for Xie Dynasty Notes

This directory contains the HarmonyOS wrapper for Xie Dynasty Notes, supporting both HarmonyOS phones and HarmonyOS Next for PC.

## Architecture

The HarmonyOS wrapper uses ArkTS (HarmonyOS TypeScript) with a WebView to load the PWA application. This approach maximizes code reuse while providing native integration for HarmonyOS-specific features.

## Prerequisites

- DevEco Studio (latest version)
- HarmonyOS SDK
- Node.js and npm (for building the web app)

## Project Structure

```
harmony/
├── entry/
│   └── src/
│       └── main/
│           ├── ets/
│           │   ├── entryability/
│           │   │   └── EntryAbility.ets
│           │   └── pages/
│           │       └── Index.ets
│           ├── resources/
│           └── module.json5
├── AppScope/
└── build-profile.json5
```

## Implementation Guide

### 1. Create HarmonyOS Project

1. Open DevEco Studio
2. Create new HarmonyOS Application project
3. Select ArkTS as the language
4. Choose "Empty Ability" template

### 2. WebView Integration

Create the main page with WebView in `entry/src/main/ets/pages/Index.ets`:

```typescript
import webview from '@ohos.web.webview';

@Entry
@Component
struct Index {
  controller: webview.WebviewController = new webview.WebviewController();
  
  build() {
    Column() {
      Web({ src: 'https://your-deployed-app-url.com', controller: this.controller })
        .domStorageAccess(true)
        .databaseAccess(true)
        .mixedMode(MixedMode.All)
        .cacheMode(CacheMode.Default)
        .javaScriptAccess(true)
        .fileAccess(true)
        .onlineImageAccess(true)
        .width('100%')
        .height('100%')
    }
    .width('100%')
    .height('100%')
  }
}
```

### 3. Native Bridges

For file access, camera, and other native features, create bridges:

```typescript
// FileBridge.ets
import picker from '@ohos.file.picker';
import fs from '@ohos.file.fs';

export class FileBridge {
  static async pickFile(): Promise<string> {
    const documentPicker = new picker.DocumentViewPicker();
    const result = await documentPicker.select();
    return result.uri;
  }
  
  static async readFile(uri: string): Promise<ArrayBuffer> {
    const file = fs.openSync(uri, fs.OpenMode.READ_ONLY);
    const buffer = new ArrayBuffer(4096);
    fs.readSync(file.fd, buffer);
    fs.closeSync(file);
    return buffer;
  }
}
```

### 4. WebSocket Support

Ensure WebSocket connections work properly:

```typescript
// In module.json5, add network permissions
{
  "module": {
    "requestPermissions": [
      {
        "name": "ohos.permission.INTERNET"
      }
    ]
  }
}
```

### 5. Offline Storage

The WebView supports IndexedDB by default. Enable it:

```typescript
Web({ src: url, controller: this.controller })
  .domStorageAccess(true)
  .databaseAccess(true)
```

### 6. Share Integration

Implement share target for receiving shared content:

```typescript
import Want from '@ohos.app.ability.Want';

export default class EntryAbility extends UIAbility {
  onCreate(want: Want, launchParam: AbilityConstant.LaunchParam) {
    if (want.parameters?.['ohos.extra.param.key.contentTitle']) {
      const sharedText = want.parameters['ohos.extra.param.key.contentTitle'];
      // Pass to WebView via JavaScript bridge
    }
  }
}
```

### 7. JavaScript Bridge

Create a bridge between native and web:

```typescript
// In Index.ets
Web({ src: url, controller: this.controller })
  .javaScriptProxy({
    object: {
      pickFile: () => FileBridge.pickFile(),
      shareContent: (text: string) => ShareBridge.share(text)
    },
    name: "HarmonyBridge",
    methodList: ["pickFile", "shareContent"],
    controller: this.controller
  })
```

Then in the web app:

```javascript
// Check if running in HarmonyOS
if (window.HarmonyBridge) {
  // Use native file picker
  const fileUri = await window.HarmonyBridge.pickFile();
}
```

## Building

### For HarmonyOS Phones

```bash
# In DevEco Studio
Build > Build Hap(s)/App(s) > Build Hap(s)
```

### For HarmonyOS Next PC

```bash
# Same process, but select PC as target device
Build > Build Hap(s)/App(s) > Build Hap(s)
```

## Testing

1. Connect HarmonyOS device or start emulator
2. Click Run in DevEco Studio
3. Test offline functionality by disabling network
4. Test file picker, camera, and share features

## Distribution

### App Gallery

1. Create developer account at AppGallery Connect
2. Create app listing
3. Upload signed HAP file
4. Submit for review

## Known Limitations

- WebView performance may be slightly lower than native UI
- Some CSS features may have limited support
- IndexedDB storage quotas may be lower than desktop

## Troubleshooting

### WebView not loading
- Check INTERNET permission in module.json5
- Verify URL is accessible
- Check DevEco Studio logs

### Storage not persisting
- Ensure domStorageAccess and databaseAccess are enabled
- Check app has storage permissions

### WebSocket connection fails
- Verify INTERNET permission
- Check firewall settings
- Test with WSS (secure WebSocket)

## References

- [HarmonyOS Documentation](https://developer.harmonyos.com/)
- [ArkTS API Reference](https://developer.harmonyos.com/en/docs/documentation/doc-references-V3/arkts-overview-0000001531611153-V3)
- [Web Component Guide](https://developer.harmonyos.com/en/docs/documentation/doc-references-V3/ts-basic-components-web-0000001477981205-V3)
