MoPay Agent Portal (Expo)

This is a frontend-only React Native (Expo) scaffold for a Mobile Money Agent Dashboard.

What is included

- Expo-ready React Native project
- Navigation (stack + bottom tabs)
- Core screens: Home, History, Reports, Profile
- Mock API service and AppContext for demo data
- Components: Header, ActionGrid, TransactionCard
- Reanimated plugin added to `babel.config.js`

Run locally (Windows PowerShell)

1. Install dependencies

```powershell
npm install
npx expo install expo-linear-gradient
npx expo install react-native-reanimated
```

2. Start Expo (clear Metro cache if you changed Babel config)

```powershell
npx expo start -c
```

Notes & next steps

- Replace `react-native-vector-icons` imports with `@expo/vector-icons` (done) to be fully Expo-friendly.
- Reanimated is configured in `babel.config.js`; restart Metro with `-c` after changing Babel.
- Future improvements to implement:
  - Add Reanimated micro-interactions to `ActionGrid` and `Header`.
  - Integrate Victory Native charts into `ReportsScreen`.
  - Implement biometric auth, push notifications, QR code scanning, and deep linking (requires native config).
  - Add i18n (English/Twi) and onboarding flow.

If you want, I can implement any of the next steps above and add tests and more polished styling.
