import React from 'react';
import { Image, Pressable, StyleSheet, Text, View } from 'react-native';
import type { Character } from '@/types/character';

interface CharacterCardProps {
  character: Character;
  onPress: (character: Character) => void;
  isFavorite?: boolean;
  onToggleFavorite?: (character: Character) => void;
}

export const CharacterCard: React.FC<CharacterCardProps> = ({
  character,
  onPress,
  isFavorite = false,
  onToggleFavorite,
}) => (
  <Pressable style={styles.card} onPress={() => onPress(character)}>
    <Image source={{ uri: character.images.jpg.image_url }} style={styles.image} />
    <View style={styles.info}>
      <Text style={styles.name} numberOfLines={2}>
        {character.name}
      </Text>
      {character.name_kanji ? <Text style={styles.kanji}>{character.name_kanji}</Text> : null}
      <Text style={styles.favorites}>❤️ {character.favorites.toLocaleString('id-ID')} favorit</Text>
    </View>
    {onToggleFavorite ? (
      <Pressable onPress={() => onToggleFavorite(character)} hitSlop={10}>
        <Text style={styles.heart}>{isFavorite ? '❤️' : '🩶'}</Text>
      </Pressable>
    ) : null}
  </Pressable>
);

const styles = StyleSheet.create({
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 12,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#F3F4F6',
  },
  image: { width: 64, height: 90, borderRadius: 8, backgroundColor: '#F9FAFB' },
  info: { flex: 1, marginLeft: 12 },
  name: { fontSize: 14, fontWeight: '700', color: '#1F2937' },
  kanji: { fontSize: 12, color: '#6B7280', marginTop: 2 },
  favorites: { fontSize: 11, color: '#9F1239', marginTop: 6, fontWeight: '600' },
  heart: { fontSize: 22, marginLeft: 8 },
});
