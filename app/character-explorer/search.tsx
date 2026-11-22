import React, { useCallback, useState } from 'react';
import { ScrollView, StyleSheet, Text, TextInput, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useFocusEffect, useRouter } from 'expo-router';
import { CharacterCard } from '@/components/CharacterCard';
import { searchCharacters } from '@/services/characterService';
import { getFavorites, toggleFavorite } from '@/services/favoriteService';
import type { Character } from '@/types/character';
import { ErrorMessage } from '@/components/ErrorMessage';
import { Loading } from '@/components/Loading';
import { PageButton } from '@/components/PageButton';
import { pageStyles } from '@/styles';

// Rute: /character-explorer/search
export default function SearchCharacterPage() {
  const router = useRouter();
  const [query, setQuery] = useState<string>('');
  const [results, setResults] = useState<Character[]>([]);
  const [favoriteIds, setFavoriteIds] = useState<number[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [searched, setSearched] = useState<boolean>(false);

  useFocusEffect(
    useCallback(() => {
      getFavorites().then((list) => setFavoriteIds(list.map((c) => c.mal_id)));
    }, [])
  );

  // searchCharacters() mengembalikan Promise -> dipakai dengan .then() / .catch() / .finally()
  const handleSearch = () => {
    setLoading(true);
    setError(null);
    searchCharacters(query)
      .then((data) => {
        setResults(data);
        setSearched(true);
      })
      .catch((e: unknown) => setError(e instanceof Error ? e.message : 'Terjadi kesalahan.'))
      .finally(() => setLoading(false));
  };

  const handleToggleFavorite = async (character: Character) => {
    const updated = await toggleFavorite(character);
    setFavoriteIds(updated.map((c) => c.mal_id));
  };

  return (
    <SafeAreaView style={pageStyles.container} edges={['bottom', 'left', 'right']}>
      <ScrollView contentContainerStyle={pageStyles.content} keyboardShouldPersistTaps="handled">
        <View style={styles.searchRow}>
          <TextInput
            style={styles.input}
            placeholder="Cari karakter, mis. Naruto"
            placeholderTextColor="#9CA3AF"
            value={query}
            onChangeText={setQuery}
            onSubmitEditing={handleSearch}
            returnKeyType="search"
          />
          <PageButton title="Cari" onPress={handleSearch} />
        </View>

        {loading ? (
          <Loading message="Mencari karakter..." />
        ) : error ? (
          <ErrorMessage message={error} onRetry={handleSearch} />
        ) : results.length === 0 ? (
          <Text style={[pageStyles.mutedText, styles.empty]}>
            {searched ? 'Karakter tidak ditemukan.' : 'Ketik nama karakter lalu tekan Cari.'}
          </Text>
        ) : (
          <View style={styles.list}>
            {results.map((character) => (
              <CharacterCard
                key={character.mal_id}
                character={character}
                isFavorite={favoriteIds.includes(character.mal_id)}
                onToggleFavorite={handleToggleFavorite}
                onPress={(c) =>
                  router.push({ pathname: '/character-explorer/character/[id]', params: { id: String(c.mal_id) } })
                }
              />
            ))}
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  searchRow: { flexDirection: 'row', gap: 8, alignItems: 'center' },
  input: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#FECDD3',
    paddingHorizontal: 12,
    paddingVertical: 10,
    fontSize: 13,
    color: '#1F2937',
  },
  list: { marginTop: 16 },
  empty: { marginTop: 24, textAlign: 'center' },
});
