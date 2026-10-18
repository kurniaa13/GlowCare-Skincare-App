# GlowCare Skincare App (MAGMA-Mobile-App)

Aplikasi katalog skincare — Expo SDK 57 + Expo Router + TypeScript.

## Menjalankan

```bash
npm install
npx expo start        # tekan a / i / w, atau scan QR dengan Expo Go
```

## Struktur (Modul 2)

```
app/
├─ _layout.tsx          Root Stack (Stack.Screen: index, product/[id], docs, codelab-1)
├─ index.tsx            Home: katalog + filter kategori (useState)
├─ codelab-1.tsx        Menampilkan Codelab-1
├─ product/[id].tsx     Dynamic route detail produk (useLocalSearchParams, useEffect, replace)
└─ docs/
   ├─ _layout.tsx       Nested Stack
   ├─ index.tsx         Daftar panduan (<Link>)
   └─ [...slug].tsx     Catch-all route panduan
codelab/usecontext_example.tsx   Codelab-1 (useContext / Dark Mode)
components/             HeaderBanner, ProductCard, ProductList, PageButton
styles/                 External styling (page, button, navigation) -> import dari "@/styles"
data/guides.ts          Isi panduan skincare
utils/cart.ts           Alert keranjang
types/index.ts          Tipe + data produk
```

Alias `@/` menunjuk ke root project (lihat `tsconfig.json`).

## Cek kualitas

```bash
npx tsc --noEmit
```
