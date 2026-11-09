
import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  FlatList,
  StyleSheet,
  ActivityIndicator,
  Alert,
} from 'react-native';
import { useRouter } from 'expo-router';

import type { Character } from '../../types/character';
import CharacterCard from '../../components/CharacterCard';
import { searchCharacter } from '../../services/characterService';
import {
  addFavorite,
  removeFavorite,
  getFavorites,
} from '../../services/favoriteService';

export default function SearchCharacterScreen() {
  const router = useRouter();

  const [keyword, setKeyword] = useState('');
  const [characters, setCharacters] = useState<Character[]>([]);
  const [favoriteIds, setFavoriteIds] = useState<number[]>([]);
  const [loading, setLoading] = useState(false);

  const handleSearch = () => {
    if (keyword.trim().length < 3) {
      Alert.alert(
        'Pencarian',
        'Masukkan minimal 3 karakter.'
      );
      return;
    }

    setLoading(true);

    searchCharacter(keyword)
      .then((data) => {
        setCharacters(data);
      })
      .catch((error) => {
        Alert.alert(
          'Error',
          error.message || 'Gagal mencari karakter.'
        );
        setCharacters([]);
      })
      .finally(() => {
        setLoading(false);
      });
  };

  const toggleFavorite = async (character: Character) => {
    try {
      const favorites = await getFavorites();
      const exists = favorites.some(
        (item) => item.mal_id === character.mal_id
      );

      if (exists) {
        await removeFavorite(character.mal_id);
        setFavoriteIds((prev) =>
          prev.filter((id) => id !== character.mal_id)
        );
      } else {
        await addFavorite(character);
        setFavoriteIds((prev) =>
          prev.includes(character.mal_id)
            ? prev
            : [...prev, character.mal_id]
        );
      }
    } catch {
      Alert.alert('Error', 'Gagal mengubah favorit.');
    }
  };

  React.useEffect(() => {
    getFavorites()
      .then((favorites) => {
        setFavoriteIds(favorites.map((item) => item.mal_id));
      })
      .catch(() => {
        Alert.alert('Error', 'Gagal memuat data favorit.');
      });
  }, []);

  return (
    <View style={styles.container}>
      <View style={styles.searchBox}>
        <TextInput
          style={styles.input}
          placeholder="Cari nama karakter (min. 3 huruf)"
          value={keyword}
          onChangeText={setKeyword}
          onSubmitEditing={handleSearch}
          returnKeyType="search"
        />

        <Text
          style={styles.searchButton}
          onPress={handleSearch}
        >
          Cari
        </Text>
      </View>

      {loading ? (
        <View style={styles.center}>
          <ActivityIndicator size="large" color="#D66A91" />
          <Text>Mencari karakter...</Text>
        </View>
      ) : (
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
            <Text style={styles.empty}>
              Masukkan nama karakter untuk mulai mencari.
            </Text>
          }
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFF8FA',
  },
  searchBox: {
    flexDirection: 'row',
    alignItems: 'center',
    margin: 12,
    gap: 8,
  },
  input: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#E5B6C8',
    borderRadius: 10,
    paddingHorizontal: 12,
    paddingVertical: 10,
  },
  searchButton: {
    backgroundColor: '#D66A91',
    color: '#FFFFFF',
    fontWeight: 'bold',
    padding: 12,
    borderRadius: 10,
    overflow: 'hidden',
  },
  center: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    gap: 10,
  },
  empty: {
    textAlign: 'center',
    marginTop: 30,
    marginHorizontal: 20,
    color: '#777777',
  },
});
