# Android overlay native module

This is a Kotlin starter module, not a production-certified implementation. Before shipping:
- Verify Expo Modules autolinking for the installed SDK and local module path.
- Add/verify module inclusion via Expo autolinking and run `npx expo prebuild --clean`.
- Validate Android foreground service type and notification requirements against target SDK / Play policy.
- Implement a real break scheduler, snooze/close/start actions, drag handling, lifecycle cleanup, and event bridge.
- Test on multiple physical devices and Android versions. Overlay permission is user-granted.
