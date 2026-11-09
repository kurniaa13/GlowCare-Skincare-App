import type {
  Character,
  CharacterResponse,
  CharacterDetailResponse,
} from '../types/character';

const BASE_URL = 'https://api.jikan.moe/v4';

export const fetchTopCharacters = async (): Promise<Character[]> => {
  const response = await fetch(`${BASE_URL}/top/characters`);

  if (!response.ok) {
    throw new Error('Gagal mengambil daftar karakter');
  }

  const result: CharacterResponse = await response.json();
  return result.data;
};

export const searchCharacters = async (
  keyword: string
): Promise<Character[]> => {
  const response = await fetch(
    `${BASE_URL}/characters?q=${encodeURIComponent(keyword)}&limit=20`
  );

  if (!response.ok) {
    throw new Error('Gagal mencari karakter');
  }

  const result: CharacterResponse = await response.json();
  return result.data;
};

export const fetchCharacterDetail = async (
  id: number
): Promise<Character> => {
  const response = await fetch(`${BASE_URL}/characters/${id}/full`);

  if (!response.ok) {
    throw new Error('Gagal mengambil detail karakter');
  }

  const result: CharacterDetailResponse = await response.json();
  return result.data;
};