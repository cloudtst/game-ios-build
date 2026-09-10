# Gyaru Beya — iOS 26 Xcode project

This project wraps the supplied RPG Maker MV web game in a native iOS WKWebView.

## Features
- iOS 26 deployment target
- iPhone/iPad target
- Local bundled RPG Maker MV `www`-style assets extracted from the supplied APK
- Native on-screen touch controls: D-pad, A, B, Menu, Enter
- Direct touchscreen input remains available inside the game
- Original game icon extracted from the APK
- Inline media playback enabled

## Open
1. Open `GyaruBeya.xcodeproj` in Xcode 26.
2. Select your Apple Developer team under Signing & Capabilities.
3. Change the bundle identifier to one you control.
4. Build to an iPhone.
5. For an IPA: Product → Archive → Distribute App.

The project intentionally does not contain or depend on Android, NW.js, or Windows runtime code.
