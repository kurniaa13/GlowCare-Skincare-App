import React, { useCallback, useEffect, useState } from 'react';
import { Image, ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useLocalSearchParams } from 'expo-router';
import { getCharacterById } from '@/services/characterService';
import { isFavorite, toggleFavorite } from '@/services/favoriteService';
import type { Character } from '@/types/character';
import { ErrorMessage } from '@/components/ErrorMessage';
import { Loading } from '@/components/Loading';
import { PageButton } from '@/components/PageButton';
import { StatCard } from '@/components/StatCard';
import { pageStyles } from '@/styles';

// Dynamic route: /character-explorer/character/17, dst. (id = mal_id dari API)
export default function CharacterDetailPage() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const [character, setCharacter] = useState<Character | null>(null);
  const [favorite, setFavorite] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const loadData = useCallback(() => {
    setLoading(true);
    setError(null);
    getCharacterById(Number(id))
      .then((data) => {
        setCharacter(data);
        return isFavorite(data.mal_id);
      })
      .then((fav) => setFavorite(fav))
      .catch((e: unknown) => setError(e instanceof Error ? e.message : 'Terjadi kesalahan.'))
      .finally(() => setLoading(false));
  }, [id]);

  useEffect(() => {
    loadData();
  }, [loadData]);

  const handleToggle = async () => {
    if (!character) return;
    const updated = await toggleFavorite(character);
    setFavorite(updated.some((c) => c.mal_id === character.mal_id));
  };

  return (
    <SafeAreaView style={pageStyles.container} edges={['bottom', 'left', 'right']}>
      <ScrollView contentContainerStyle={pageStyles.content}>
        {loading ? (
          <Loading message="Memuat detail karakter..." />
        ) : error || !character ? (
          <ErrorMessage message={error ?? 'Data tidak tersedia.'} onRetry={loadData} />
        ) : (
          <>
            <Image source={{ uri: character.images.jpg.image_url }} style={styles.image} />
            <Text style={[pageStyles.title, styles.name]}>{character.name}</Text>
            {character.name_kanji ? <Text style={pageStyles.subtitle}>{character.name_kanji}</Text> : null}

            <View style={styles.statsRow}>
              <StatCard label="Favorit" value={character.favorites.toLocaleString('id-ID')} />
              <StatCard label="Nama Panggilan" value={character.nicknames.length} />
              <StatCard label="MAL ID" value={character.mal_id} />
            </View>

            <Text style={pageStyles.sectionTitle}>Tentang</Text>
            <Text style={pageStyles.bodyText}>
              {character.about ? character.about.trim() : 'Belum ada deskripsi untuk karakter ini.'}
            </Text>

            <View style={styles.actions}>
              <PageButton
                title={favorite ? '❤️ Hapus dari Favorit' : '🩶 Tambah ke Favorit'}
                onPress={handleToggle}
              />
            </View>
          </>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  image: {
    width: 160,
    height: 230,
    borderRadius: 12,
    alignSelf: 'center',
    backgroundColor: '#F9FAFB',
  },
  name: { marginTop: 16 },
  statsRow: { flexDirection: 'row', gap: 8, marginTop: 14 },
  actions: { marginTop: 20 },
});
