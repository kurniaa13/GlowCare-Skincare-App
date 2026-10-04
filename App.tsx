import React, { useState } from 'react';
import {
  SafeAreaView,
  ScrollView,
  Text,
  StyleSheet,
  Pressable,
  Alert,
  StatusBar,
} from 'react-native';
import { skincareData } from './types';
import { HeaderBanner } from './components/HeaderBanner';
import { ProductList } from './components/ProductList';

export default function App() {
  const [selectedCategory, setSelectedCategory] = useState<string>('Semua');

  const getFilteredProducts = () => {
    if (selectedCategory === 'Semua') return skincareData;
    return skincareData.filter((item) => item.category === selectedCategory);
  };

  const handleAddToCart = (productName: string) => {
    Alert.alert('Keranjang', `${productName} telah ditambahkan ke keranjang!`);
  };

  const categories = ['Semua', 'Serum', 'Moisturizer', 'Sunscreen', 'Cleanser'];

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#FFF1F2" />

      <ScrollView contentContainerStyle={styles.scrollContent}>
        <HeaderBanner />

        <Text style={styles.filterTitle}>Pilih Kategori:</Text>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.filterScroll}>
          {categories.map((cat) => (
            <Pressable
              key={cat}
              style={[
                styles.categoryChip,
                selectedCategory === cat && styles.categoryChipActive,
              ]}
              onPress={() => setSelectedCategory(cat)}
            >
              <Text
                style={[
                  styles.categoryText,
                  selectedCategory === cat && styles.categoryTextActive,
                ]}
              >
                {cat}
              </Text>
            </Pressable>
          ))}
        </ScrollView>

        <ProductList
          products={getFilteredProducts()}
          onAddToCart={handleAddToCart}
        />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFF1F2',
  },
  scrollContent: {
    padding: 16,
  },
  filterTitle: {
    fontSize: 12,
    fontWeight: '700',
    color: '#9F1239',
    marginBottom: 8,
  },
  filterScroll: {
    marginBottom: 16,
  },
  categoryChip: {
    paddingHorizontal: 14,
    paddingVertical: 6,
    borderRadius: 20,
    backgroundColor: '#FFFFFF',
    marginRight: 8,
    borderWidth: 1,
    borderColor: '#FECDD3',
  },
  categoryChipActive: {
    backgroundColor: '#BE123C',
    borderColor: '#BE123C',
  },
  categoryText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#9F1239',
  },
  categoryTextActive: {
    color: '#FFFFFF',
  },
});