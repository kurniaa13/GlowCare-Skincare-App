import React, { useState } from 'react';
import { ScrollView, Text, StyleSheet, Pressable } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { HeaderBanner } from '@/components/HeaderBanner';
import { ProductList } from '@/components/ProductList';
import { skincareData, type ProductCategory, type SkincareProduct } from '@/types';
import { showAddedToCartAlert } from '@/utils/cart';

type CategoryFilter = ProductCategory | 'Semua';

const categories: CategoryFilter[] = ['Semua', 'Serum', 'Moisturizer', 'Sunscreen', 'Cleanser'];

export default function HomePage() {
  const router = useRouter();
  const [selectedCategory, setSelectedCategory] = useState<CategoryFilter>('Semua');

  const getFilteredProducts = () => {
    if (selectedCategory === 'Semua') return skincareData;
    return skincareData.filter((item) => item.category === selectedCategory);
  };

  const handleAddToCart = (productName: string) => {
    showAddedToCartAlert(productName);
  };

  // push(): halaman detail ditumpuk di atas Home, jadi bisa kembali dengan back().
  const handleProductPress = (product: SkincareProduct) => {
    router.push({ pathname: '/product/[id]', params: { id: product.id } });
  };

  return (
    <SafeAreaView style={styles.container}>
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
          onProductPress={handleProductPress}
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
