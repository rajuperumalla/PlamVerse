# PalmVerse Mobile

Cross-platform React Native (Expo + TypeScript) app for AI-powered palm reading.
**Pay-first flow**: payment is required before image upload.

## Quick start

```bash
cd palmverse-mobile
npm install
npx expo start
```

Press `a` for Android emulator, `i` for iOS simulator, or scan the QR with Expo Go (note: Firebase native + Razorpay/Stripe SDKs require a **dev client build** — `npx expo run:android` / `npx expo run:ios` — Expo Go alone won't load them).

## User flow (strict pay-first)

```
Splash → Onboarding → Login (OTP/Google) → Profile (DOB, place)
       → Reading Selection → Hand Selection → Value Screen
       → 💳 PAYMENT → Photo Upload (camera + AI validation)
       → Status (submitted → review → approved → ready)
       → Report (view + PDF + share) → Products (rings/stones) → Cart → Pay
```

## Folder structure

```
palmverse-mobile/
├── App.tsx                    # Entry: fonts, providers, RootNavigator
├── app.json                   # Expo config + permissions + plugins
├── babel.config.js            # NativeWind + Reanimated + path alias
├── metro.config.js            # NativeWind metro
├── tailwind.config.js         # Cosmic colour palette + fonts
├── global.css                 # Tailwind base
├── tsconfig.json              # @/* path alias → src/*
└── src/
    ├── components/ui/         # GradientButton, GlassCard, StepProgress,
    │                          # Skeleton, Input, ScreenContainer,
    │                          # CosmicBackground, ScreenHeader
    ├── navigation/            # RootNavigator (stack), AppTabs, types
    ├── screens/               # All flow screens + tab screens
    │   └── auth/              # LoginScreen, OtpScreen
    ├── services/              # api, firebase, payment, upload,
    │                          # imageValidation, places, notifications
    ├── store/                 # Zustand: auth, reading, chat, cart
    ├── theme/                 # colours + gradients
    └── types/                 # Shared TS types
```

## State management (Zustand)

| Store         | Purpose                                                |
| ------------- | ------------------------------------------------------ |
| `authStore`   | Auth state, onboarding flag, sign-out                  |
| `readingStore`| Single source of truth for the pay-first flow          |
| `chatStore`   | Editor/user messages                                   |
| `cartStore`   | Product cart (rings/stones)                            |

`readingStore.status` enforces the pay-first invariant — payment screens set
it to `pending_upload`; the upload screen blocks if `paid !== true`.

## Navigation

`RootNavigator` is a native stack. Screens are conditionally registered
based on `authed` and `hasOnboarded` flags. `AppTabs` (bottom tabs) is the
home post-auth: Home / Readings / Shop / Chat / Me.

## Design system

- **Theme**: Dark, cosmic gradients (`#05021a → #120833 → #2a1c66`)
- **Accents**: Aurora (pink → purple → blue → cyan)
- **Components**: Glassmorphism via `expo-blur`
- **Fonts**: Cinzel (display) + Raleway (body) via `@expo-google-fonts`
- **Animations**: `react-native-reanimated` (splash fade/scale, skeletons)
- **Haptics**: `expo-haptics` on every primary CTA

## 🔧 Integration TODOs

These need real keys/SDK wiring before going to production:

### 1. Firebase
- Add `google-services.json` → `android/app/`
- Add `GoogleService-Info.plist` → `ios/PalmVerse/`
- Set `googleWebClientId` in `app.json` → `extra`
- Run `npx expo prebuild` to link native modules

### 2. Razorpay (India)
- Set `razorpayKeyId` in `app.json` → `extra`
- Backend must create order: `POST /orders` returns `{ razorpayOrderId }`

### 3. Stripe (Global)
- Set `stripePublishableKey` in `app.json` → `extra`
- Backend must create PaymentIntent and return `clientSecret`

### 4. Google Maps / Places
- Set `googleMapsApiKey` in `app.json` → `extra`
- Enable Places API + Geocoding API in GCP console

### 5. Image upload (Cloudinary or S3)
- Backend signs upload URL: `POST /uploads/sign` → `{ uploadUrl, publicUrl }`
- Currently uses signed PUT; swap with Cloudinary unsigned preset if preferred

### 6. AI palm reading backend
- `POST /readings { orderId, profile, hand, imageUrls }` → `{ reportId }`
- `GET /readings/:id` → status + report sections
- Backend integrates Gemini (your existing Genkit flows can be ported)

### 7. Push notifications (FCM)
- Call `registerForPush()` after login (currently not auto-called — wire in
  `AppTabs` mount or `LoginScreen` success)
- Backend stores token per user; sends on status changes

### 8. Image validation
- `services/imageValidation.ts` does basic file-size checks only
- For production: integrate TFLite hand-detection model on-device, or call
  a backend `/validate-palm` endpoint with blur/lighting/palm-detection ML

## Security

- JWT stored in `expo-secure-store` (Keychain / Keystore)
- API interceptor attaches Bearer; 401 clears token
- Payment IDs never stored client-side — server verifies signatures
- All API calls over HTTPS; pin certs in production via `react-native-ssl-pinning` (not yet added)

## Edge cases handled

| Case                          | Handling                                    |
| ----------------------------- | ------------------------------------------- |
| Payment failure               | Try/catch with retry CTA on `PaymentScreen` |
| Image too small / too large   | Pre-flight `validatePalmImage` blocks submit |
| Missing profile/hand on upload| Alert + redirect to flow start              |
| 401 on any API call           | Token cleared, user re-authed via `RootNavigator` |
| Network error                 | Axios surfaces error, shown via Alert       |
| Empty cart checkout           | Button hidden when `items.length === 0`     |

## Performance

- `FlatList` virtualisation on Products / Chat / Suggestions
- `react-native-reanimated` runs on UI thread (no JS bridge per frame)
- `expo-image` available for cached, progressive image loading
- Code is tree-shakeable; navigation lazy-loads screens

## Scripts

```bash
npm start               # Expo dev server
npm run android         # Build + run on Android
npm run ios             # Build + run on iOS
npm run typecheck       # tsc --noEmit
npm run lint            # expo lint
```

## Next steps to ship

1. `npm install` + verify `npm run typecheck` is clean
2. Create Firebase project; drop config files; set `googleWebClientId`
3. Provision Razorpay + Stripe; set keys in `app.json` extra
4. Stand up backend with the 5 endpoints listed above
5. Run `npx expo prebuild` to generate native projects
6. `npx expo run:android` and `run:ios` to test on devices
7. EAS Build for store submission: `eas build --platform all`
