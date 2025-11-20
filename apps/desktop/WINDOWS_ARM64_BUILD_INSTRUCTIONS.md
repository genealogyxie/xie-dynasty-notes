# Windows 11 ARM64 App Build Instructions

## Overview
This guide will help you build the Xie Dynasty Notes desktop application for Windows 11 ARM64 using Tauri. The app wraps the React PWA in a native Windows application with native performance and system integration.

## Prerequisites

### Required Software

1. **Windows 11 ARM64** (or Windows 10 ARM64)
   - This must be run on an ARM64 Windows machine or VM

2. **Visual Studio 2022** (with C++ build tools)
   - Download from: https://visualstudio.microsoft.com/downloads/
   - During installation, select "Desktop development with C++"
   - Make sure to include:
     - MSVC v143 - VS 2022 C++ ARM64 build tools
     - Windows 11 SDK (or Windows 10 SDK)
     - C++ CMake tools for Windows

3. **Rust** (latest stable version)
   - Download from: https://rustup.rs/
   - Run the installer and follow the prompts
   - Restart your terminal after installation
   - Verify installation: `rustc --version`

4. **Node.js 18+** (LTS recommended)
   - Download from: https://nodejs.org/
   - Verify installation: `node --version` and `npm --version`

5. **Git** (optional, for cloning the repository)
   - Download from: https://git-scm.com/download/win

## Quick Build (Recommended)

### Method 1: Build on Windows ARM64 Machine

1. **Clone or extract the repository:**
   ```powershell
   git clone https://github.com/genealogyxie/xie-dynasty-notes.git
   cd xie-dynasty-notes
   ```

2. **Install web app dependencies:**
   ```powershell
   cd apps/web
   npm install
   cd ..
   ```

3. **Build the web app:**
   ```powershell
   cd apps/web
   npm run build
   cd ..
   ```

4. **Navigate to desktop app:**
   ```powershell
   cd apps/desktop
   ```

5. **Build the Tauri app:**
   ```powershell
   npm install
   npm run tauri build
   ```

6. **Find your executable:**
   - The installer will be at: `apps/desktop/src-tauri/target/release/bundle/msi/Xie Dynasty Notes_0.1.0_arm64_en-US.msi`
   - The portable executable will be at: `apps/desktop/src-tauri/target/release/xie-dynasty-notes.exe`

7. **Install the app:**
   - Double-click the MSI installer to install
   - Or run the portable .exe directly

## Detailed Build Steps

### Step 1: Verify Prerequisites

Open PowerShell and verify all tools are installed:

```powershell
# Check Rust
rustc --version
cargo --version

# Check Node.js
node --version
npm --version

# Check Visual Studio C++ tools
where cl.exe
```

If `cl.exe` is not found, you need to install Visual Studio C++ build tools.

### Step 2: Set Up the Project

```powershell
# Navigate to the project root
cd path\to\xie-dynasty-notes

# Install web app dependencies
cd apps\web
npm install

# Build the web app for production
npm run build

# Verify the build output exists
dir dist
```

You should see `index.html` and an `assets` folder in the `dist` directory.

### Step 3: Configure Backend URL (Important!)

Before building, update the backend URL if you're deploying to production:

1. Edit `apps/web/.env`:
   ```
   VITE_API_URL=https://your-backend-url.com
   VITE_WS_URL=wss://your-backend-url.com
   ```

2. Rebuild the web app:
   ```powershell
   cd apps\web
   npm run build
   ```

### Step 4: Build the Tauri Application

```powershell
# Navigate to desktop app
cd ..\desktop

# Install Tauri dependencies (first time only)
npm install

# Build the application for ARM64
npm run tauri build
```

This will:
- Compile the Rust backend
- Bundle the web app
- Create the Windows installer (MSI)
- Create the portable executable

**Build time:** First build may take 10-30 minutes depending on your machine. Subsequent builds will be faster.

### Step 5: Locate Build Artifacts

After successful build, you'll find:

**MSI Installer:**
```
apps/desktop/src-tauri/target/release/bundle/msi/Xie Dynasty Notes_0.1.0_arm64_en-US.msi
```

**Portable Executable:**
```
apps/desktop/src-tauri/target/release/xie-dynasty-notes.exe
```

**NSIS Installer (if configured):**
```
apps/desktop/src-tauri/target/release/bundle/nsis/Xie Dynasty Notes_0.1.0_arm64-setup.exe
```

## Development Mode

To run the app in development mode with hot reload:

1. **Start the web dev server:**
   ```powershell
   cd apps\web
   npm run dev
   ```

2. **In a new terminal, start Tauri dev mode:**
   ```powershell
   cd apps\desktop
   npm run tauri dev
   ```

The app will open with hot reload enabled. Changes to the web app will automatically refresh.

## Building for Different Architectures

### Build for x64 (Intel/AMD) on ARM64 Machine

If you need to build for x64 Windows on your ARM64 machine:

1. **Add the x64 target:**
   ```powershell
   rustup target add x86_64-pc-windows-msvc
   ```

2. **Build for x64:**
   ```powershell
   npm run tauri build -- --target x86_64-pc-windows-msvc
   ```

### Cross-Compilation from x64 to ARM64

If you're on an x64 Windows machine and want to build for ARM64:

1. **Install ARM64 build tools in Visual Studio**
   - Open Visual Studio Installer
   - Modify your installation
   - Add "MSVC v143 - VS 2022 C++ ARM64 build tools"

2. **Add ARM64 target:**
   ```powershell
   rustup target add aarch64-pc-windows-msvc
   ```

3. **Build for ARM64:**
   ```powershell
   npm run tauri build -- --target aarch64-pc-windows-msvc
   ```

## Customization

### Change App Icon

Replace the icon files in `apps/desktop/src-tauri/icons/`:
- `icon.ico` - Windows icon (256x256 recommended)
- `icon.png` - Base icon for other formats

Then rebuild the app.

### Change App Name or Version

Edit `apps/desktop/src-tauri/tauri.conf.json`:

```json
{
  "productName": "Your App Name",
  "version": "1.0.0",
  "identifier": "com.yourcompany.yourapp"
}
```

### Configure Window Size

Edit `apps/desktop/src-tauri/tauri.conf.json`:

```json
{
  "app": {
    "windows": [
      {
        "title": "Your App",
        "width": 1400,
        "height": 900,
        "minWidth": 800,
        "minHeight": 600
      }
    ]
  }
}
```

## Troubleshooting

### Error: "MSVC not found"

**Solution:**
- Install Visual Studio 2022 with C++ build tools
- Make sure "Desktop development with C++" is selected
- Restart your terminal after installation

### Error: "linker 'link.exe' not found"

**Solution:**
- Open "x64 Native Tools Command Prompt for VS 2022" (or ARM64 version)
- Navigate to your project directory
- Run the build command from there

Or set up the environment:
```powershell
# Find vcvarsall.bat (usually in C:\Program Files\Microsoft Visual Studio\2022\Community\VC\Auxiliary\Build\)
& "C:\Program Files\Microsoft Visual Studio\2022\Community\VC\Auxiliary\Build\vcvarsall.bat" arm64
```

### Error: "failed to run custom build command for 'tauri-build'"

**Solution:**
- Make sure you've built the web app first: `cd apps/web && npm run build`
- Verify the `dist` folder exists in `apps/web/`
- Check that `tauri.conf.json` has the correct `frontendDist` path

### Build is very slow

**First build is always slow** (10-30 minutes) because Rust compiles all dependencies. Subsequent builds will be much faster (1-5 minutes).

To speed up builds:
- Use `npm run tauri build -- --debug` for faster debug builds (larger file size)
- Enable incremental compilation (already enabled by default)

### App crashes on launch

**Check the logs:**
- Windows Event Viewer → Application logs
- Or run from command line to see console output:
  ```powershell
  .\src-tauri\target\release\xie-dynasty-notes.exe
  ```

**Common issues:**
- Backend URL is not accessible (check `.env` file)
- Web assets not bundled correctly (rebuild web app)
- Missing dependencies (reinstall with `npm install`)

### WebView not loading

**Solution:**
- Make sure WebView2 Runtime is installed (usually pre-installed on Windows 11)
- Download from: https://developer.microsoft.com/en-us/microsoft-edge/webview2/
- Verify the web app builds correctly: `cd apps/web && npm run build`

## Distribution

### MSI Installer

The MSI installer is the recommended distribution method for Windows:
- Located at: `src-tauri/target/release/bundle/msi/`
- Users can double-click to install
- Includes automatic updates support (if configured)
- Registers the app in Windows Programs & Features

### Portable Executable

The portable .exe can be distributed without installation:
- Located at: `src-tauri/target/release/xie-dynasty-notes.exe`
- Users can run directly without admin rights
- Requires WebView2 Runtime to be installed on target machine

### Code Signing (Recommended for Distribution)

For production distribution, you should sign your application:

1. **Obtain a code signing certificate**
   - Purchase from a Certificate Authority (DigiCert, Sectigo, etc.)
   - Or use a self-signed certificate for internal distribution

2. **Sign the executable:**
   ```powershell
   signtool sign /f "path\to\certificate.pfx" /p "password" /t http://timestamp.digicert.com "path\to\xie-dynasty-notes.exe"
   ```

3. **Sign the MSI:**
   ```powershell
   signtool sign /f "path\to\certificate.pfx" /p "password" /t http://timestamp.digicert.com "path\to\installer.msi"
   ```

## Performance Optimization

### Reduce Bundle Size

1. **Enable code splitting in Vite** (`apps/web/vite.config.ts`):
   ```typescript
   export default defineConfig({
     build: {
       rollupOptions: {
         output: {
           manualChunks: {
             vendor: ['react', 'react-dom'],
             editor: ['@tiptap/react', 'yjs']
           }
         }
       }
     }
   })
   ```

2. **Use production build:**
   ```powershell
   npm run tauri build
   ```
   (This is already the default)

### Optimize Runtime Performance

- The Tauri app uses native WebView2, which is very fast
- Offline data is cached in IndexedDB for instant loading
- WebSocket connections enable real-time sync

## Updating the App

When you make changes to the code:

1. **Update web app:**
   ```powershell
   cd apps\web
   npm run build
   ```

2. **Rebuild Tauri app:**
   ```powershell
   cd ..\desktop
   npm run tauri build
   ```

3. **Increment version** in `tauri.conf.json` before distributing updates

## Additional Resources

- Tauri Documentation: https://tauri.app/
- Tauri Windows Guide: https://tauri.app/v1/guides/building/windows
- Rust Installation: https://rustup.rs/
- Visual Studio Downloads: https://visualstudio.microsoft.com/downloads/

## Support

For issues with:
- **The web app:** Check `apps/web/README.md`
- **Tauri:** https://tauri.app/v1/guides/debugging/
- **Rust compilation:** https://doc.rust-lang.org/cargo/
- **Visual Studio:** https://docs.microsoft.com/en-us/visualstudio/

## System Requirements

**Minimum:**
- Windows 10 ARM64 (version 1809 or later) or Windows 11 ARM64
- 4 GB RAM
- 500 MB free disk space
- WebView2 Runtime (included in Windows 11)

**Recommended:**
- Windows 11 ARM64
- 8 GB RAM
- 1 GB free disk space
- Active internet connection for sync features
