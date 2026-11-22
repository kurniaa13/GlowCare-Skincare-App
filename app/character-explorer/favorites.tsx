import React, { useCallback, useState } from 'react';
import { ScrollView, Text } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useFocusEffect, useRouter } from 'expo-router';
import { CharacterCard } from '@/components/CharacterCard';
import { getFavorites, toggleFavorite } from '@/services/favoriteService';
import type { Character } from '@/types/character';
import { Loading } from '@/components/Loading';
import { pageStyles } from '@/styles';

// Rute: /character-explorer/favorites
export default function FavoriteCharactersPage() {
  const router = useRouter();
  const [favorites, setFavorites] = useState<Character[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  useFocusEffect(
    useCallback(() => {
      getFavorites()
        .then((list) => setFavorites(list))
        .finally(() => setLoading(false));
    }, [])
  );

  const handleRemove = async (character: Character) => {
    const updated = await toggleFavorite(character);
    setFavorites(updated);
  };

  return (
    <SafeAreaView style={pageStyles.container} edges={['bottom', 'left', 'right']}>
      <ScrollView contentContainerStyle={pageStyles.content}>
        <Text style={pageStyles.title}>Karakter Favorit</Text>
        <Text style={pageStyles.subtitle}>Tersimpan di perangkat (AsyncStorage)</Text>

        {loading ? (
          <Loading message="Memuat favorit..." />
        ) : favorites.length === 0 ? (
          <Text style={[pageStyles.mutedText, { marginTop: 20 }]}>Belum ada karakter favorit.</Text>
        ) : (
          <>
            <Text style={pageStyles.sectionTitle}>{favorites.length} karakter</Text>
            {favorites.map((character) => (
              <CharacterCard
                key={character.mal_id}
                character={character}
                isFavorite
                onToggleFavorite={handleRemove}
                onPress={(c) =>
                  router.push({ pathname: '/character-explorer/character/[id]', params: { id: String(c.mal_id) } })
                }
              />
            ))}
          </>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}
