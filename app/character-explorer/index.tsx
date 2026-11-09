import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  TouchableOpacity,
  ActivityIndicator,
  Alert,
} from 'react-native';
import { useRouter } from 'expo-router';

import type { Character } from '../../types/character';
import CharacterCard from '../../components/CharacterCard';
import { getTopCharacters } from '../../services/characterService';
import {
  addFavorite,
  removeFavorite,
  getFavorites,
} from '../../services/favoriteService';

export default function CharacterExplorer() {
  const router = useRouter();

  const [characters, setCharacters] = useState<Character[]>([]);
  const [favoriteIds, setFavoriteIds] = useState<number[]>([]);
  const [loading, setLoading] = useState(true);

  const loadCharacters = async () => {
    try {
      setLoading(true);

      const [data, favorites] = await Promise.all([
        getTopCharacters(),
        getFavorites(),
      ]);

      setCharacters(data);
      setFavoriteIds(favorites.map((item) => item.mal_id));
    } catch (error) {
      Alert.alert('Error', 'Gagal mengambil data karakter.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadCharacters();
  }, []);

  const toggleFavorite = async (character: Character) => {
    try {
      const exists = favoriteIds.includes(character.mal_id);

      if (exists) {
        await removeFavorite(character.mal_id);
        setFavoriteIds((prev) =>
          prev.filter((id) => id !== character.mal_id)
        );
      } else {
        await addFavorite(character);
        setFavoriteIds((prev) => [...prev, character.mal_id]);
      }
    } catch {
      Alert.alert('Error', 'Gagal mengubah favorit.');
    }
  };

  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color="#D66A91" />
        <Text>Memuat karakter...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.menu}>
        <TouchableOpacity
          style={styles.button}
          onPress={() => router.push('/character-explorer/search')}
        >
          <Text style={styles.buttonText}>Cari Karakter</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.button}
          onPress={() => router.push('/character-explorer/favorites')}
        >
          <Text style={styles.buttonText}>Favorit ❤️</Text>
        </TouchableOpacity>
      </View>

      <Text style={styles.heading}>Top Karakter Anime</Text>

      <FlatList
        data={characters}
        keyExtractor={(item) => item.mal_id.toString()}
        renderItem={({ item }) => (
          <CharacterCard
            character={item}
            isFavorite={favoriteIds.includes(item.mal_id)}
            onPress={() =>
              router.push(
                `/character-explorer/character/${item.mal_id}`
              )
            }
            onToggleFavorite={() => toggleFavorite(item)}
          />
        )}
        ListEmptyComponent={
          <Text style={styles.empty}>Tidak ada karakter ditemukan.</Text>
        }
        refreshing={loading}
        onRefresh={loadCharacters}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFF8FA',
  },
  center: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    gap: 10,
  },
  menu: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    padding: 12,
  },
  button: {
    backgroundColor: '#D66A91',
    padding: 12,
    borderRadius: 10,
  },
  buttonText: {
    color: '#FFFFFF',
    fontWeight: 'bold',
  },
  heading: {
    fontSize: 20,
    fontWeight: 'bold',
    marginHorizontal: 16,
    marginVertical: 12,
    color: '#333333',
  },
  empty: {
    textAlign: 'center',
    marginTop: 30,
    color: '#777777',
  },
});
