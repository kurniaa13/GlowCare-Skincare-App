
import React, { useCallback, useState } from 'react';
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  ActivityIndicator,
  Alert,
} from 'react-native';
import { useFocusEffect, useRouter } from 'expo-router';

import type { Character } from '../../types/character';
import CharacterCard from '../../components/CharacterCard';
import {
  getFavorites,
  removeFavorite,
} from '../../services/favoriteService';

export default function FavoritesScreen() {
  const router = useRouter();

  const [favorites, setFavorites] = useState<Character[]>([]);
  const [loading, setLoading] = useState(true);

  const loadFavorites = async () => {
    try {
      setLoading(true);
      const data = await getFavorites();
      setFavorites(data);
    } catch {
      Alert.alert('Error', 'Gagal memuat karakter favorit.');
    } finally {
      setLoading(false);
    }
  };

  useFocusEffect(
    useCallback(() => {
      loadFavorites();
    }, [])
  );

  const handleRemoveFavorite = async (character: Character) => {
    try {
      await removeFavorite(character.mal_id);

      setFavorites((prev) =>
        prev.filter((item) => item.mal_id !== character.mal_id)
      );
    } catch {
      Alert.alert('Error', 'Gagal menghapus karakter dari favorit.');
    }
  };

  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color="#D66A91" />
        <Text>Memuat karakter favorit...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.heading}>Karakter Favorit ❤️</Text>

      <FlatList
        data={favorites}
        keyExtractor={(item) => item.mal_id.toString()}
        renderItem={({ item }) => (
          <CharacterCard
            character={item}
            isFavorite={true}
            onPress={() =>
              router.push(
                `/character-explorer/character/${item.mal_id}`
              )
            }
            onToggleFavorite={() => handleRemoveFavorite(item)}
          />
        )}
        ListEmptyComponent={
          <Text style={styles.empty}>
            Belum ada karakter favorit.
          </Text>
        }
        onRefresh={loadFavorites}
        refreshing={loading}
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
  heading: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333333',
    margin: 16,
  },
  empty: {
    textAlign: 'center',
    marginTop: 40,
    color: '#777777',
    fontSize: 14,
  },
});
