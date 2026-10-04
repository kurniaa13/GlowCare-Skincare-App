import React from 'react';
import { View, Text, StyleSheet, Image, Pressable } from 'react-native';
import { SkincareProduct } from '../types';

interface ProductCardProps {
  item: SkincareProduct;
  onAddToCart: (name: string) => void;
}

export const ProductCard: React.FC<ProductCardProps> = ({ item, onAddToCart }) => {
  return (
    <View style={styles.card}>
      <Image source={{ uri: item.image }} style={styles.productImage} />

      <View style={styles.details}>
        <View style={styles.categoryRow}>
          <Text style={styles.categoryText}>{item.category}</Text>
          <View
            style={[
              styles.stockBadge,
              { backgroundColor: item.isReady ? '#DCFCE7' : '#FEE2E2' },
            ]}
          >
            <Text
              style={[
                styles.stockText,
                { color: item.isReady ? '#15803D' : '#B91C1C' },
              ]}
            >
              {item.isReady ? 'Ready' : 'Habis'}
            </Text>
          </View>
        </View>

        <Text style={styles.productName} numberOfLines={2}>
          {item.name}
        </Text>

        <Text style={styles.ratingText}>⭐ {item.rating} / 5.0</Text>

        <View style={styles.bottomRow}>
          <Text style={styles.priceText}>
            Rp {item.price.toLocaleString('id-ID')}
          </Text>

          <Pressable
            style={[
              styles.buyButton,
              { backgroundColor: item.isReady ? '#BE123C' : '#9CA3AF' },
            ]}
            disabled={!item.isReady}
            onPress={() => onAddToCart(item.name)}
          >
            <Text style={styles.buyButtonText}>+ Beli</Text>
          </Pressable>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 12,
    marginBottom: 12,
    flexDirection: 'row',
    borderWidth: 1,
    borderColor: '#F3F4F6',
  },
  productImage: {
    width: 90,
    height: 90,
    borderRadius: 8,
    backgroundColor: '#F9FAFB',
  },
  details: {
    flex: 1,
    marginLeft: 12,
    justifyContent: 'space-between',
  },
  categoryRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  categoryText: {
    fontSize: 10,
    fontWeight: '700',
    color: '#9F1239',
    textTransform: 'uppercase',
  },
  stockBadge: {
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
  },
  stockText: {
    fontSize: 9,
    fontWeight: '700',
  },
  productName: {
    fontSize: 13,
    fontWeight: '700',
    color: '#1F2937',
    marginTop: 2,
  },
  ratingText: {
    fontSize: 11,
    color: '#D97706',
    fontWeight: '600',
    marginTop: 2,
  },
  bottomRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 6,
  },
  priceText: {
    fontSize: 13,
    fontWeight: '800',
    color: '#881337',
  },
  buyButton: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 6,
  },
  buyButtonText: {
    color: '#FFFFFF',
    fontSize: 11,
    fontWeight: '700',
  },
});