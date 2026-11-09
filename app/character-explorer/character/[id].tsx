
import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  Image,
  ScrollView,
  StyleSheet,
  ActivityIndicator,
  TouchableOpacity,
  Alert,
} from 'react-native';
import { useLocalSearchParams } from 'expo-router';

import type { Character } from '../../../types/character';
import { getCharacterDetail } from '../../../services/characterService';
import {
  addFavorite,
  removeFavorite,
  isFavorite,
} from '../../../services/favoriteService';

export default function CharacterDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();

  const [character, setCharacter] = useState<Character | null>(null);
  const [favorite, setFavorite] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadDetail = async () => {
      try {
        const data = await getCharacterDetail(Number(id));
        setCharacter(data);

        const favoriteStatus = await isFavorite(Number(id));
        setFavorite(favoriteStatus);
      } catch {
        Alert.alert('Error', 'Gagal memuat detail karakter.');
      } finally {
        setLoading(false);
      }
    };

    loadDetail();
  }, [id]);

  const toggleFavorite = async () => {
    if (!character) return;

    try {
      if (favorite) {
        await removeFavorite(character.mal_id);
        setFavorite(false);
      } else {
        await addFavorite(character);
        setFavorite(true);
      }
    } catch {
      Alert.alert('Error', 'Gagal mengubah status favorit.');
    }
  };

  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color="#D66A91" />
        <Text>Memuat detail karakter...</Text>
      </View>
    );
  }

  if (!character) {
    return (
      <View style={styles.center}>
        <Text>Detail karakter tidak ditemukan.</Text>
      </View>
    );
  }

  const imageUrl =
    character.images?.webp?.image_url ||
    character.images?.jpg?.image_url;

  return (
    <ScrollView style={styles.container}>
      <Image
        source={{ uri: imageUrl }}
        style={styles.image}
        resizeMode="contain"
      />

      <View style={styles.content}>
        <Text style={styles.name}>{character.name}</Text>

        {character.name_kanji ? (
          <Text style={styles.kanji}>{character.name_kanji}</Text>
        ) : null}

        <Text style={styles.favorites}>
          ❤️ {character.favorites} Favorites
        </Text>

        <TouchableOpacity
          style={styles.favoriteButton}
          onPress={toggleFavorite}
        >
          <Text style={styles.favoriteButtonText}>
            {favorite ? '❤️ Hapus dari Favorit' : '🤍 Tambah ke Favorit'}
          </Text>
        </TouchableOpacity>

        <Text style={styles.sectionTitle}>Nickname</Text>
        <Text style={styles.description}>
          {character.nicknames?.length
            ? character.nicknames.join(', ')
            : 'Tidak ada nickname.'}
        </Text>

        <Text style={styles.sectionTitle}>Tentang Karakter</Text>
        <Text style={styles.description}>
          {character.about || 'Informasi karakter belum tersedia.'}
        </Text>
      </View>
    </ScrollView>
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
  image: {
    width: '100%',
    height: 300,
    backgroundColor: '#F8E8EF',
  },
  content: {
    padding: 18,
  },
  name: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333333',
  },
  kanji: {
    fontSize: 16,
    color: '#777777',
    marginTop: 4,
  },
  favorites: {
    fontSize: 14,
    color: '#777777',
    marginTop: 10,
  },
  favoriteButton: {
    backgroundColor: '#D66A91',
    padding: 13,
    borderRadius: 10,
    marginTop: 16,
    alignItems: 'center',
  },
  favoriteButtonText: {
    color: '#FFFFFF',
    fontWeight: 'bold',
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333333',
    marginTop: 22,
    marginBottom: 8,
  },
  description: {
    fontSize: 14,
    lineHeight: 22,
    color: '#555555',
    textAlign: 'justify',
  },
});
