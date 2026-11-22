import React, { useCallback, useEffect, useState } from 'react';
import { ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { CharacterCard } from '@/components/CharacterCard';
import { getTopCharacters } from '@/services/characterService';
import type { Character } from '@/types/character';
import { ErrorMessage } from '@/components/ErrorMessage';
import { Loading } from '@/components/Loading';
import { PageButton } from '@/components/PageButton';
import { pageStyles } from '@/styles';

// Rute: /character-explorer (landing page Codelab-1 Modul 3)
export default function AnimeHunterHome() {
  const router = useRouter();
  const [characters, setCharacters] = useState<Character[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const loadData = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await getTopCharacters();
      setCharacters(data);
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Terjadi kesalahan.');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadData();
  }, [loadData]);

  return (
    <SafeAreaView style={pageStyles.container} edges={['bottom', 'left', 'right']}>
      <ScrollView contentContainerStyle={pageStyles.content}>
        <Text style={pageStyles.title}>Character Explorer</Text>
        <Text style={pageStyles.subtitle}>Karakter anime terpopuler (API Jikan)</Text>

        <View style={styles.menu}>
          <View style={styles.menuItem}>
            <PageButton title="🔍 Cari Karakter" onPress={() => router.push('/character-explorer/search')} />
          </View>
          <View style={styles.menuItem}>
            <PageButton
              title="❤️ Favorit"
              variant="outline"
              onPress={() => router.push('/character-explorer/favorites')}
            />
          </View>
        </View>

        {loading ? (
          <Loading message="Mengambil data karakter..." />
        ) : error ? (
          <ErrorMessage message={error} onRetry={loadData} />
        ) : (
          <>
            <Text style={pageStyles.sectionTitle}>Top Karakter</Text>
            {characters.map((character) => (
              <CharacterCard
                key={character.mal_id}
                character={character}
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

const styles = StyleSheet.create({
  menu: { flexDirection: 'row', gap: 10, marginTop: 14 },
  menuItem: { flex: 1 },
});
