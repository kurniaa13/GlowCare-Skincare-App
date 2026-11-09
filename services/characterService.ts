import type { Character } from '../types/character';
import {
  fetchTopCharacters,
  searchCharacters,
  fetchCharacterDetail,
} from './api';

const delay = (ms: number) =>
  new Promise<void>((resolve) => setTimeout(resolve, ms));

export const getTopCharacters = async (): Promise<Character[]> => {
  await delay(500);

  try {
    const characters = await fetchTopCharacters();
    return characters;
  } catch (error) {
    return Promise.reject(error);
  }
};

export const searchCharacter = (
  keyword: string
): Promise<Character[]> => {
  return new Promise((resolve, reject) => {
    if (keyword.trim().length < 3) {
      reject(new Error('Masukkan minimal 3 karakter untuk pencarian'));
      return;
    }

    searchCharacters(keyword)
      .then((characters) => resolve(characters))
      .catch((error) => reject(error));
  });
};

export const getCharacterDetail = async (
  id: number
): Promise<Character> => {
  await delay(300);

  try {
    const character = await fetchCharacterDetail(id);
    return character;
  } catch (error) {
    return Promise.reject(error);
  }
};