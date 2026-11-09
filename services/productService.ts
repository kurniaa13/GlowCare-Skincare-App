import { getJson } from '@/services/http';
import type { ProductCategory, SkincareProduct } from '@/types';
import type { ProductApiItem, ProductsApiResponse } from '@/types/productApi';
import { delay } from '@/utils/delay';
import { usdToRupiah } from '@/utils/format';

// External API publik (gratis): https://dummyjson.com
const BASE_URL = 'https://dummyjson.com';
const SKINCARE_CATEGORY = 'skin-care';

// Nama error khusus: dipakai halaman detail untuk tahu bahwa produk memang tidak ada.
export const PRODUCT_NOT_FOUND = 'ProductNotFound';

const notFoundError = (): Error => {
  const error = new Error('Produk tidak ditemukan.');
  error.name = PRODUCT_NOT_FOUND;
  return error;
};

// API tidak punya kategori Serum/Moisturizer/Sunscreen/Cleanser, jadi ditentukan dari
// nama, deskripsi, dan tag produk.
function detectCategory(item: ProductApiItem): ProductCategory {
  const text = `${item.title} ${item.description} ${(item.tags ?? []).join(' ')}`.toLowerCase();
  if (/sunscreen|sunblock|spf|sun protect/.test(text)) return 'Sunscreen';
  if (/serum|essence|ampoule/.test(text)) return 'Serum';
  if (/cleanser|cleansing|face wash|body wash|shower|soap|wash/.test(text)) return 'Cleanser';
  return 'Moisturizer';
}

// Mapping data mentah API -> Object aplikasi (SkincareProduct, tipe yang sama dengan Modul 1-2).
function toSkincareProduct(item: ProductApiItem): SkincareProduct {
  return {
    id: String(item.id),
    name: item.title,
    category: detectCategory(item),
    price: usdToRupiah(item.price),
    rating: item.rating,
    image: item.thumbnail,
    isReady: item.stock > 0,
    stock: item.stock,
    discountPercentage: item.discountPercentage,
  };
}

// Custom async function: kalau gagal, tunggu 1 detik (delay) lalu coba lagi.
async function withRetry<T>(task: () => Promise<T>, retries = 1): Promise<T> {
  try {
    return await task();
  } catch (error) {
    if (retries <= 0) throw error;
    await delay(1000);
    return withRetry(task, retries - 1);
  }
}

// Modul 3 - Kriteria 2: Custom Async Function (async/await).
export async function getSkincareProducts(): Promise<SkincareProduct[]> {
  const response = await withRetry(() =>
    getJson<ProductsApiResponse>(`${BASE_URL}/products/category/${SKINCARE_CATEGORY}?limit=30`)
  );
  // Kriteria 1: JSON dimasukkan ke Object ber-interface ProductsApiResponse.
  const body: ProductsApiResponse = response.data;
  return body.products.map(toSkincareProduct);
}

// Modul 3 - Kriteria 3: new Promise + .then() + resolve() + reject().
export function getProductById(id: string): Promise<SkincareProduct> {
  return new Promise<SkincareProduct>((resolve, reject) => {
    getJson<ProductApiItem>(`${BASE_URL}/products/${encodeURIComponent(id)}`)
      .then((response) => {
        const item = response.data;
        if (response.success && item && item.category === SKINCARE_CATEGORY) {
          resolve(toSkincareProduct(item));
        } else {
          reject(notFoundError());
        }
      })
      .catch((error: unknown) => {
        const status = (error as { status?: number }).status;
        reject(status === 404 ? notFoundError() : error);
      });
  });
}

// Modul 3 - Kriteria 3: Promise.reject() untuk validasi + chaining .then() + delay().
export function searchProducts(name: string): Promise<SkincareProduct[]> {
  const keyword = name.trim();
  if (keyword.length < 3) {
    return Promise.reject(new Error('Ketik minimal 3 huruf untuk mencari.'));
  }
  return delay(300) // jeda kecil agar tidak terlalu sering menembak API
    .then(() => getJson<ProductsApiResponse>(`${BASE_URL}/products/search?q=${encodeURIComponent(keyword)}&limit=50`))
    .then((response) =>
      response.data.products
        .filter((item) => item.category === SKINCARE_CATEGORY)
        .map(toSkincareProduct)
    );
}
