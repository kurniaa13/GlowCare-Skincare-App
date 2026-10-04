import React from 'react';
import { Text, View } from 'react-native';
import { styles } from '../constants/styles';
import type { SkincareProduct } from '../types';
import { ProductCard } from './ProductCard';

interface ProductListProps {
  products: SkincareProduct[];
}

export function ProductList({ products }: ProductListProps) {
  // Custom function: membuat satu kartu untuk satu produk
  // key wajib unik, jadi pakai product.id (bukan index)
  const renderProduct = (product: SkincareProduct) => (
    <ProductCard key={product.id} product={product} />
  );

  return (
    <View>
      <Text style={styles.sectionTitle}>Produk Pilihan ({products.length})</Text>

      {/* LOOP dengan map(): jumlah kartu mengikuti isi array */}
      {products.map((product) => renderProduct(product))}
    </View>
  );
}
