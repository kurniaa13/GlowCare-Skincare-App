import { StatusBar } from 'expo-status-bar';
import React, { useState } from 'react';
import { Alert, Pressable, ScrollView, Text } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { HeaderBanner } from '../../components/HeaderBanner';
import { ProductList } from '../../components/ProductList';
import { styles } from '../../constants/styles';
import { skincareData, type ProductCategory } from '../../types';

type CategoryFilter = ProductCategory | 'Semua';

const categories: CategoryFilter[] = ['Semua', 'Serum', 'Moisturizer', 'Sunscreen', 'Cleanser'];

export default function Index() {
  const [selectedCategory, setSelectedCategory] = useState<CategoryFilter>('Semua');

  const getFilteredProducts = () => {
    if (selectedCategory === 'Semua') return skincareData;
    return skincareData.filter((item) => item.category === selectedCategory);
  };

  const handleAddToCart = (productName: string) => {
    Alert.alert('Keranjang', `${productName} telah ditambahkan ke keranjang!`);
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar style="dark" />

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