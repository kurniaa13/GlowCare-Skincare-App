import AsyncStorage from '@react-native-async-storage/async-storage';
import type { Character } from '../types/character';

const FAVORITE_KEY = '@character_favorites';

export const getFavorites = async (): Promise<Character[]> => {
  try {
    const data = await AsyncStorage.getItem(FAVORITE_KEY);
    return data ? JSON.parse(data) : [];
  } catch (error) {
    return Promise.reject(error);
  }
};

export const addFavorite = async (
  character: Character
): Promise<void> => {
  const favorites = await getFavorites();

  const exists = favorites.some(
    (item) => item.mal_id === character.mal_id
  );

  if (!exists) {
    favorites.push(character);
    await AsyncStorage.setItem(
      FAVORITE_KEY,
      JSON.stringify(favorites)
    );
  }
};

export const removeFavorite = async (id: number): Promise<void> => {
  const favorites = await getFavorites();

  const updated = favorites.filter(
    (item) => item.mal_id !== id
  );

  await AsyncStorage.setItem(
    FAVORITE_KEY,
    JSON.stringify(updated)
  );
};

export const isFavorite = async (id: number): Promise<boolean> => {
  const favorites = await getFavorites();
  return favorites.some((item) => item.mal_id === id);
};