import AsyncStorage from '@react-native-async-storage/async-storage';
import type { Character } from '@/types/character';

// Akan dibahas lebih lanjut di Modul 4 (local storage).
// Yang disimpan satu objek Character utuh supaya halaman favorit tidak perlu memanggil API lagi.
const FAVORITES_KEY = 'character-explorer:favorites';

export async function getFavorites(): Promise<Character[]> {
  try {
    const raw = await AsyncStorage.getItem(FAVORITES_KEY);
    return raw ? (JSON.parse(raw) as Character[]) : [];
  } catch {
    return [];
  }
}

export async function isFavorite(id: number): Promise<boolean> {
  const favorites = await getFavorites();
  return favorites.some((c) => c.mal_id === id);
}

// Tambah/hapus karakter dari favorit, lalu kembalikan daftar terbaru.
export async function toggleFavorite(character: Character): Promise<Character[]> {
  const favorites = await getFavorites();
  const exists = favorites.some((c) => c.mal_id === character.mal_id);
  const updated = exists
    ? favorites.filter((c) => c.mal_id !== character.mal_id)
    : [...favorites, character];
  await AsyncStorage.setItem(FAVORITES_KEY, JSON.stringify(updated));
  return updated;
}
