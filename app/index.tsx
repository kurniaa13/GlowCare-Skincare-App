import React, { useCallback, useEffect, useState } from 'react';
import { ScrollView, Text, StyleSheet, Pressable, TextInput, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useFocusEffect, useRouter } from 'expo-router';
import { ErrorMessage } from '@/components/ErrorMessage';
import { HeaderBanner } from '@/components/HeaderBanner';
import { Loading } from '@/components/Loading';
import { PageButton } from '@/components/PageButton';
import { ProductList } from '@/components/ProductList';
import { getFavorites, toggleFavorite } from '@/services/productFavoriteService';
import { getSkincareProducts, searchProducts } from '@/services/productService';
import { type ProductCategory, type SkincareProduct } from '@/types';
import { showAddedToCartAlert } from '@/utils/cart';

type CategoryFilter = ProductCategory | 'Semua' | 'Favorit';

const categories: CategoryFilter[] = ['Semua', 'Favorit', 'Serum', 'Moisturizer', 'Sunscreen', 'Cleanser'];

export default function HomePage() {
  const router = useRouter();
  const [selectedCategory, setSelectedCategory] = useState<CategoryFilter>('Semua');

  // Modul 3: data produk diambil dari External API (bukan lagi data statis di dalam kode).
  const [products, setProducts] = useState<SkincareProduct[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const loadProducts = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await getSkincareProducts();
      setProducts(data);
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Terjadi kesalahan.');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadProducts();
  }, [loadProducts]);

  // Modul 3: favorit disimpan di AsyncStorage, dibaca ulang setiap Home kembali fokus
  // (mis. setelah mengubah favorit di halaman detail).
  const [favorites, setFavorites] = useState<SkincareProduct[]>([]);
  useFocusEffect(
    useCallback(() => {
      getFavorites().then((list) => setFavorites(list));
    }, [])
  );

  const handleToggleFavorite = async (product: SkincareProduct) => {
    const updated = await toggleFavorite(product);
    setFavorites(updated);
  };

  // Modul 3: fitur cari. searchProducts() mengembalikan Promise -> .then() / .catch() / .finally()
  const [query, setQuery] = useState<string>('');
  const [searchResults, setSearchResults] = useState<SkincareProduct[] | null>(null);
  const [searching, setSearching] = useState<boolean>(false);
  const [searchError, setSearchError] = useState<string | null>(null);

  const handleSearch = () => {
    setSearching(true);
    setSearchError(null);
    searchProducts(query)
      .then((data) => setSearchResults(data))
      .catch((e: unknown) => setSearchError(e instanceof Error ? e.message : 'Terjadi kesalahan.'))
      .finally(() => setSearching(false));
  };

  const handleClearSearch = () => {
    setQuery('');
    setSearchResults(null);
    setSearchError(null);
  };

  const getFilteredProducts = () => {
    if (selectedCategory === 'Favorit') return favorites;
    const source = searchResults ?? products;
    if (selectedCategory === 'Semua') return source;
    return source.filter((item) => item.category === selectedCategory);
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

        <View style={styles.searchRow}>
          <TextInput
            style={styles.input}
            placeholder="Cari produk, mis. serum"
            placeholderTextColor="#9CA3AF"
            value={query}
            onChangeText={setQuery}
            onSubmitEditing={handleSearch}
            returnKeyType="search"
          />
          <PageButton title="Cari" onPress={handleSearch} />
          {searchResults !== null || searchError ? (
            <PageButton title="Reset" variant="outline" onPress={handleClearSearch} />
          ) : null}
        </View>

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

        {searching ? (
          <Loading message="Mencari produk..." />
        ) : searchError ? (
          <ErrorMessage message={searchError} onRetry={handleSearch} />
        ) : loading ? (
          <Loading message="Mengambil data produk dari server..." />
        ) : error ? (
          <ErrorMessage message={error} onRetry={loadProducts} />
        ) : (
          <ProductList
            products={getFilteredProducts()}
            onAddToCart={handleAddToCart}
            onProductPress={handleProductPress}
            favoriteIds={favorites.map((p) => p.id)}
            onToggleFavorite={handleToggleFavorite}
          />
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  searchRow: {
    flexDirection: 'row',
    gap: 8,
    alignItems: 'center',
    marginBottom: 14,
  },
  input: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#FECDD3',
    paddingHorizontal: 12,
    paddingVertical: 10,
    fontSize: 13,
    color: '#1F2937',
  },
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
