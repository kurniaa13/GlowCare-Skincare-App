import React, { useCallback, useEffect, useState } from 'react';
import { ScrollView, Text, StyleSheet, Pressable, TextInput, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useFocusEffect, useRouter } from 'expo-router';
import { ErrorMessage } from '@/components/ErrorMessage';
import { HeaderBanner } from '@/components/HeaderBanner';
import { Loading } from '@/components/Loading';
import { PageButton } from '@/components/PageButton';
import { ProductList } from '@/components/ProductList';
import { useAuth } from '@/context/AuthContext';
import { colors, radius, shadow } from '@/styles';
import { supabase } from '@/lib/supabase';
import { getFavorites, toggleFavorite } from '@/services/productFavoriteService';
import { getSkincareProducts, searchProducts } from '@/services/productService';
import { type ProductCategory, type SkincareProduct } from '@/types';
import { showAddedToCartAlert } from '@/utils/cart';

type CategoryFilter = ProductCategory | 'Semua' | 'Favorit';

const categories: CategoryFilter[] = ['Semua', 'Favorit', 'Serum', 'Moisturizer', 'Sunscreen', 'Cleanser'];

export default function HomePage() {
  const router = useRouter();
  // Modul 4: data user dari AuthContext + tombol keluar
  const { user, signOut } = useAuth();

  // Codelab 2 (Verifikasi): URL cloud harus muncul di console tanpa error.
  useEffect(() => {
    console.log('Supabase URL:', (supabase as any).supabaseUrl);
  }, []);
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

        {/* Modul 4: data sesi yang sedang login (Codelab 3 & 4) + akses ke codelab */}
        <View style={styles.accountBox}>
          <View style={styles.accountHeader}>
            <View style={styles.avatar}>
              <Text style={styles.avatarText}>
                {String(user?.user_metadata?.callsign ?? user?.email ?? '?').charAt(0).toUpperCase()}
              </Text>
            </View>
            <View style={styles.accountHeaderText}>
              <Text style={styles.accountGreeting} numberOfLines={1}>
                Halo, {user?.user_metadata?.callsign ?? 'Sahabat Glow'} 👋
              </Text>
              <Text style={styles.accountEmail} numberOfLines={1}>{user?.email}</Text>
            </View>
            <View style={styles.sessionPill}>
              <View style={styles.sessionDot} />
              <Text style={styles.sessionText}>Sesi Aktif</Text>
            </View>
          </View>

          <View style={styles.infoGrid}>
            <View style={styles.infoTile}>
              <Text style={styles.accountLabel}>Nama Panggilan</Text>
              <Text style={styles.accountValue} numberOfLines={1}>{user?.user_metadata?.callsign ?? '-'}</Text>
            </View>
            <View style={styles.infoTile}>
              <Text style={styles.accountLabel}>Role</Text>
              <Text style={styles.accountValue} numberOfLines={1}>{user?.user_metadata?.role ?? '-'}</Text>
            </View>
            <View style={[styles.infoTile, styles.infoTileWide]}>
              <Text style={styles.accountLabel}>User UID</Text>
              <Text style={styles.accountValue} numberOfLines={1}>{user?.id}</Text>
            </View>
          </View>

          <View style={styles.featureRow}>
            <Pressable style={styles.featureTile} onPress={() => router.push('/modul4-vault' as any)}>
              <Text style={styles.featureIcon}>🔐</Text>
              <Text style={styles.featureLabel}>Brankas Token</Text>
            </Pressable>
            <Pressable style={styles.featureTile} onPress={() => router.push('/modul4-cloud' as any)}>
              <Text style={styles.featureIcon}>☁️</Text>
              <Text style={styles.featureLabel}>Cek Cloud</Text>
            </Pressable>
            <Pressable style={styles.featureTile} onPress={() => router.push('/modul4-missions' as any)}>
              <Text style={styles.featureIcon}>💆</Text>
              <Text style={styles.featureLabel}>Jadwal Perawatan</Text>
            </Pressable>
          </View>

          <PageButton title="Keluar & Kunci Aplikasi" variant="outline" onPress={signOut} />
        </View>

        <View style={styles.searchRow}>
          <TextInput
            style={styles.input}
            placeholder="🔍  Cari produk, mis. serum"
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

        <Text style={styles.filterTitle}>Pilih Kategori</Text>
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
  accountBox: {
    marginBottom: 18,
    gap: 12,
    padding: 14,
    borderRadius: radius.lg,
    borderWidth: 1,
    borderColor: colors.rose200,
    backgroundColor: colors.white,
    ...shadow.card,
  },
  accountHeader: { flexDirection: 'row', alignItems: 'center', gap: 10 },
  avatar: {
    width: 42,
    height: 42,
    borderRadius: 21,
    backgroundColor: colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarText: { color: colors.white, fontSize: 18, fontWeight: '800' },
  accountHeaderText: { flex: 1 },
  accountGreeting: { fontSize: 15, fontWeight: '800', color: colors.primaryDark },
  accountEmail: { fontSize: 11, color: colors.muted, marginTop: 1 },
  sessionPill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    backgroundColor: colors.successBg,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: radius.pill,
  },
  sessionDot: { width: 6, height: 6, borderRadius: 3, backgroundColor: '#16A34A' },
  sessionText: { fontSize: 10, fontWeight: '800', color: colors.successText },
  infoGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
  infoTile: {
    flexGrow: 1,
    flexBasis: '45%',
    backgroundColor: colors.rose50,
    borderRadius: radius.md,
    paddingHorizontal: 12,
    paddingVertical: 8,
  },
  infoTileWide: { flexBasis: '100%' },
  accountLabel: { fontSize: 10, fontWeight: '700', color: colors.primaryDeep, letterSpacing: 0.5 },
  accountValue: { fontSize: 12, fontWeight: '600', color: colors.text, marginTop: 2 },
  featureRow: { flexDirection: 'row', gap: 8 },
  featureTile: {
    flex: 1,
    alignItems: 'center',
    gap: 4,
    paddingVertical: 12,
    borderRadius: radius.md,
    backgroundColor: colors.goldSoft,
    borderWidth: 1,
    borderColor: '#F1E2B5',
  },
  featureIcon: { fontSize: 22 },
  featureLabel: { fontSize: 11, fontWeight: '700', color: '#7A5C14', textAlign: 'center' },
  searchRow: {
    flexDirection: 'row',
    gap: 8,
    alignItems: 'center',
    marginBottom: 14,
  },
  input: {
    flex: 1,
    backgroundColor: colors.white,
    borderRadius: radius.pill,
    borderWidth: 1,
    borderColor: colors.rose200,
    paddingHorizontal: 16,
    paddingVertical: 11,
    fontSize: 13,
    color: colors.text,
  },
  container: {
    flex: 1,
    backgroundColor: '#FFF1F2',
  },
  scrollContent: {
    padding: 18,
    paddingBottom: 32,
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
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: radius.pill,
    backgroundColor: colors.white,
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
