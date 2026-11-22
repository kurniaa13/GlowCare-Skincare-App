import type { Character } from '@/types/character';
import { delay } from '@/utils/delay';
import { fetchCharacterById, fetchCharactersByName, fetchTopCharacters } from './api';

// 1) async/await
export async function getTopCharacters(): Promise<Character[]> {
  const response = await fetchTopCharacters();
  return response.data;
}

// 2) new Promise + .then() + resolve() + reject()
export function getCharacterById(id: number): Promise<Character> {
  return new Promise<Character>((resolve, reject) => {
    fetchCharacterById(id)
      .then((response) => {
        if (response.success && response.data) {
          resolve(response.data);
        } else {
          reject(new Error('Karakter tidak ditemukan.'));
        }
      })
      .catch((error) => reject(error));
  });
}

// 3) Promise.reject() untuk validasi + chaining .then() + delay()
export function searchCharacters(name: string): Promise<Character[]> {
  const keyword = name.trim();
  if (keyword.length < 3) {
    return Promise.reject(new Error('Ketik minimal 3 huruf untuk mencari.'));
  }
  return delay(300) // jeda kecil agar tidak terlalu sering menembak API
    .then(() => fetchCharactersByName(keyword))
    .then((response) => response.data);
}
