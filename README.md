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

## Modul 3 - Asynchronous & API Call

Katalog produk di **Home** dan **halaman detail produk** sekarang mengambil data dari **External API**
(`fetch()` GET ke https://dummyjson.com, kategori `skin-care`) alih-alih data statis di dalam kode.
Home juga punya **cari produk** (`searchProducts`), **favorit** (tombol hati + chip Favorit, disimpan di AsyncStorage), dan **detail** (favorit + StatCard).
Tampilan dan fungsi Modul 1-2 (filter kategori, navigasi, detail, panduan, tombol beli) tetap sama.
Codelab-1 Modul 3 (Character Explorer, API https://api.jikan.moe/v4): **Panduan -> Latihan Modul 3** (`/character-explorer`).

```
types/api.ts                  ApiResponse<T>
types/productApi.ts           Interface data API (ProductApiItem, ProductsApiResponse)
types/character.ts            Interface data Character Explorer (Character, dll.)
utils/delay.ts                delay(ms): Promise<void>
utils/format.ts               usdToRupiah (kurs tetap USD_TO_IDR)
services/http.ts              getJson<T>(): new Promise + fetch().then() + resolve()/reject()
services/productService.ts    getSkincareProducts (async/await), getProductById (Promise + resolve/reject), searchProducts (Promise.reject + .then())
services/api.ts               Fetching data Character Explorer (API Jikan)
services/characterService.ts  async/await, new Promise + .then() + resolve()/reject(), Promise.reject()
services/favoriteService.ts   Favorit karakter (AsyncStorage, dibahas lebih lanjut di Modul 4)
services/productFavoriteService.ts  Favorit produk (AsyncStorage)
components/                   Loading, ErrorMessage, StatCard, CharacterCard
app/character-explorer/             Layout, index, search, favorites, character/[id] (nested Stack)
```

### Pemetaan kriteria penilaian (Tugas Pekan Demo)

1. **Ambil data External API ke Object memakai Interface (10%)**: `types/productApi.ts` dan `getSkincareProducts()` di `services/productService.ts` (JSON -> `ProductsApiResponse` -> `SkincareProduct`).
2. **Custom & Pre-built Async Function (10%)**: custom = `getSkincareProducts`, `withRetry`, `delay`; pre-built = `fetch`, `response.json`, `setTimeout`, `AsyncStorage`.
3. **.then(), .resolve(), .reject() (10%)**: `getJson` (`services/http.ts`), `getProductById` (`services/productService.ts`, dipakai halaman detail), dan `services/characterService.ts` (Character Explorer).

Kategori Serum/Moisturizer/Sunscreen/Cleanser ditentukan dari nama/deskripsi/tag produk API (`detectCategory`).
Harga API (US$) dikonversi ke Rupiah dengan kurs tetap `USD_TO_IDR` di `utils/format.ts`.
Instal paket tambahan (sudah tercatat di package.json): `npx expo install @react-native-async-storage/async-storage`
