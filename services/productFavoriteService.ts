import AsyncStorage from '@react-native-async-storage/async-storage';
import type { SkincareProduct } from '@/types';

// Akan dibahas lebih lanjut di Modul 4 (local storage).
// Yang disimpan satu objek produk utuh supaya halaman favorit tidak perlu memanggil API lagi.
const FAVORITES_KEY = 'glowcare:favorites';

export async function getFavorites(): Promise<SkincareProduct[]> {
  try {
    const raw = await AsyncStorage.getItem(FAVORITES_KEY);
    return raw ? (JSON.parse(raw) as SkincareProduct[]) : [];
  } catch {
    return [];
  }
}

export async function isFavorite(id: string): Promise<boolean> {
  const favorites = await getFavorites();
  return favorites.some((p) => p.id === id);
}

// Tambah/hapus produk dari favorit, lalu kembalikan daftar terbaru.
export async function toggleFavorite(product: SkincareProduct): Promise<SkincareProduct[]> {
  const favorites = await getFavorites();
  const exists = favorites.some((p) => p.id === product.id);
  const updated = exists ? favorites.filter((p) => p.id !== product.id) : [...favorites, product];
  await AsyncStorage.setItem(FAVORITES_KEY, JSON.stringify(updated));
  return updated;
}
