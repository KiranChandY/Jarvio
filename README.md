# AwareMVP (Expo SDK 51)

React Native + Expo app for scanning product barcodes and displaying clean-score/health insights from Supabase Edge Functions.

## 1) Install dependencies

```bash
npm install
```

## 2) Start the Expo dev server

```bash
npm run start
```

Then scan the QR code using Expo Go on iOS/Android.

## 3) Test flow

1. Open app (scanner screen is default route).
2. Grant camera permission when prompted.
3. Scan barcode `3017620422003`.
4. App calls Supabase Edge Function `scan-product` and routes to product detail page.

## 4) Project structure

- `app/_layout.tsx` — Expo Router stack configuration (Scan → Product).
- `app/index.tsx` — Camera scanner screen and function invoke logic.
- `app/product/[barcode].tsx` — Product result page with score, health badges, ingredients, and source links.
- `lib/supabase.ts` — Supabase client with AsyncStorage persistence.
- `store/useScanStore.ts` — Zustand store for retaining scan results.
- `types/product.ts` — Shared product/health TypeScript types.
