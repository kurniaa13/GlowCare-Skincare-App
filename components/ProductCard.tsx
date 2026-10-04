import { Ionicons } from '@expo/vector-icons';
import React from 'react';
import { Alert, Image, Pressable, Text, View } from 'react-native';
import { styles } from '../constants/styles';
import type { SkincareProduct } from '../types';

interface ProductCardProps {
  product: SkincareProduct;
}

// Custom function: mengubah 129000 menjadi "Rp 129.000"
const formatPrice = (price: number): string => {
  return 'Rp ' + price.toString().replace(/\B(?=(\d{3})+(?!\d))/g, '.');
};

export function ProductCard({ product }: ProductCardProps) {
  // Function bawaan (Alert) dibungkus di function buatan sendiri
  const handleBuy = () => {
    Alert.alert('Berhasil!', `${product.name} masuk ke keranjang.`);
  };

  return (
    <View style={styles.card}>
      <Image source={{ uri: product.image }} style={styles.cardImage} />

      <View style={styles.cardBody}>
        <View>
          <Text style={styles.categoryBadge}>{product.category}</Text>
          <Text style={styles.productName} numberOfLines={2}>
            {product.name}
          </Text>
          <View style={styles.ratingRow}>
            <Ionicons name="star" size={12} color="#F59E0B" />
            <Text style={styles.rating}>{product.rating}</Text>
          </View>
        </View>

        <View style={styles.priceRow}>
          <Text style={styles.price}>{formatPrice(product.price)}</Text>

          {/* INLINE STYLING (Modul 1 - 3.3): warna tombol bergantung pada nilai isReady */}
          <Pressable
            onPress={handleBuy}
            disabled={!product.isReady}
            style={[
              styles.buyButton,
              { backgroundColor: product.isReady ? '#BE123C' : '#9CA3AF' },
            ]}
          >
            <Ionicons
              name={product.isReady ? 'cart' : 'close-circle'}
              size={14}
              color="#ffffff"
            />
            <Text style={styles.buyButtonText}>
              {product.isReady ? 'Beli' : 'Habis'}
            </Text>
          </Pressable>
        </View>
      </View>
    </View>
  );
}
