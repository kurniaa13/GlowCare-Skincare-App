import React from 'react';
import {
  View,
  Text,
  Image,
  StyleSheet,
  TouchableOpacity,
} from 'react-native';
import type { Character } from '../types/character';

interface CharacterCardProps {
  character: Character;
  onPress: () => void;
  isFavorite: boolean;
  onToggleFavorite: () => void;
}

export default function CharacterCard({
  character,
  onPress,
  isFavorite,
  onToggleFavorite,
}: CharacterCardProps) {
  const imageUrl =
    character.images?.webp?.image_url ||
    character.images?.jpg?.image_url;

  return (
    <TouchableOpacity
      style={styles.card}
      onPress={onPress}
      activeOpacity={0.8}
    >
      <Image
        source={{ uri: imageUrl }}
        style={styles.image}
        resizeMode="cover"
      />

      <View style={styles.info}>
        <Text style={styles.name} numberOfLines={2}>
          {character.name}
        </Text>

        <Text style={styles.favorites}>
          ❤️ {character.favorites} Favorites
        </Text>
      </View>

      <TouchableOpacity
        style={styles.favoriteButton}
        onPress={(event) => {
          event.stopPropagation();
          onToggleFavorite();
        }}
      >
        <Text style={styles.favoriteIcon}>
          {isFavorite ? '❤️' : '🤍'}
        </Text>
      </TouchableOpacity>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 12,
    marginVertical: 6,
    marginHorizontal: 12,
    elevation: 2,
  },
  image: {
    width: 75,
    height: 90,
    borderRadius: 8,
    backgroundColor: '#EEEEEE',
  },
  info: {
    flex: 1,
    marginLeft: 12,
  },
  name: {
    fontSize: 15,
    fontWeight: 'bold',
    color: '#333333',
  },
  favorites: {
    marginTop: 8,
    fontSize: 12,
    color: '#777777',
  },
  favoriteButton: {
    padding: 8,
  },
  favoriteIcon: {
    fontSize: 24,
  },
});