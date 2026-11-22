import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { SkincareProduct } from '../types';
import { ProductCard } from './ProductCard';

interface ProductListProps {
  products: SkincareProduct[];
  onAddToCart: (name: string) => void;
  /** Opsional: dipanggil saat salah satu kartu produk ditekan. */
  onProductPress?: (product: SkincareProduct) => void;
  /** Opsional (Modul 3): daftar id favorit + handler tombol hati. */
  favoriteIds?: string[];
  onToggleFavorite?: (product: SkincareProduct) => void;
}

export const ProductList: React.FC<ProductListProps> = ({
  products,
  onAddToCart,
  onProductPress,
  favoriteIds = [],
  onToggleFavorite,
}) => {
  return (
    <View>
      <Text style={styles.sectionTitle}>Katalog Produk Skincare</Text>
      {products.length === 0 ? (
        <Text style={styles.emptyText}>Belum ada produk pada kategori ini.</Text>
      ) : null}
      {products.map((product) => (
        <ProductCard
          key={product.id}
          item={product}
          onAddToCart={onAddToCart}
          onPress={onProductPress}
          isFavorite={favoriteIds.includes(product.id)}
          onToggleFavorite={onToggleFavorite}
        />
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  sectionTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#881337',
    marginBottom: 10,
  },
  emptyText: {
    fontSize: 12,
    color: '#9F1239',
    marginBottom: 10,
  },
});