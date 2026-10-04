import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { SkincareProduct } from '../types';
import { ProductCard } from './ProductCard';

interface ProductListProps {
  products: SkincareProduct[];
  onAddToCart: (name: string) => void;
}

export const ProductList: React.FC<ProductListProps> = ({ products, onAddToCart }) => {
  return (
    <View>
      <Text style={styles.sectionTitle}>Katalog Produk Skincare</Text>
      {products.map((product) => (
        <ProductCard key={product.id} item={product} onAddToCart={onAddToCart} />
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
});