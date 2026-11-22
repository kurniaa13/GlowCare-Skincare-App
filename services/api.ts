// Fungsi-fungsi "fetching data" ke External API (GET request).
import { getJson } from '@/services/http';
import type { ApiResponse } from '@/types/api';
import type {
  Character,
  CharacterDetailResponse,
  CharacterListResponse,
} from '@/types/character';

const BASE_URL = 'https://api.jikan.moe/v4';

// Custom async function: async/await + hasilnya dibungkus ApiResponse<T>.
export async function fetchTopCharacters(): Promise<ApiResponse<Character[]>> {
  const response = await getJson<CharacterListResponse>(`${BASE_URL}/top/characters?limit=20`);
  return { success: true, data: response.data.data, message: 'Karakter teratas berhasil diambil' };
}

export async function fetchCharactersByName(name: string): Promise<ApiResponse<Character[]>> {
  const url = `${BASE_URL}/characters?q=${encodeURIComponent(name)}&limit=20&order_by=favorites&sort=desc`;
  const response = await getJson<CharacterListResponse>(url);
  return { success: true, data: response.data.data, message: 'Pencarian karakter berhasil' };
}

export async function fetchCharacterById(id: number): Promise<ApiResponse<Character>> {
  const response = await getJson<CharacterDetailResponse>(`${BASE_URL}/characters/${id}`);
  return { success: true, data: response.data.data, message: 'Detail karakter berhasil diambil' };
}
