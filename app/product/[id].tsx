import React, { useEffect, useMemo } from 'react';
import { Image, ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { PageButton } from '@/components/PageButton';
import { getGuidePathForCategory } from '@/data/guides';
import { pageStyles } from '@/styles';
import { skincareData } from '@/types';
import { showAddedToCartAlert } from '@/utils/cart';

// Dynamic route: /product/skin-1, /product/skin-2, dst.
export default function ProductDetailPage() {
  const router = useRouter();
  const { id } = useLocalSearchParams<{ id: string }>();

  const product = useMemo(() => skincareData.find((item) => item.id === id), [id]);

  // Jika id tidak ditemukan (mis. dibuka lewat link yang salah), kembali ke Home.
  // replace() dipakai agar halaman yang tidak valid tidak tersisa di riwayat navigasi.
  useEffect(() => {
    if (!product) {
      router.replace('/');
    }
  }, [product, router]);

  if (!product) return null;

  const handleBack = () => {
    // canGoBack() false jika halaman ini dibuka langsung (deep link), jadi arahkan ke Home.
    if (router.canGoBack()) {
      router.back();
    } else {
      router.replace('/');
    }
  };

  return (
    <SafeAreaView style={pageStyles.container} edges={['bottom', 'left', 'right']}>
      <ScrollView contentContainerStyle={pageStyles.content}>
        <Image source={{ uri: product.image }} style={styles.image} />

        <View style={styles.categoryRow}>
          <Text style={styles.categoryText}>{product.category}</Text>
          <View
            style={[
              styles.stockBadge,
              { backgroundColor: product.isReady ? '#DCFCE7' : '#FEE2E2' },
            ]}
          >
            <Text style={[styles.stockText, { color: product.isReady ? '#15803D' : '#B91C1C' }]}>
              {product.isReady ? 'Ready' : 'Habis'}
            </Text>
          </View>
        </View>

        <Text style={[pageStyles.title, styles.name]}>{product.name}</Text>
        <Text style={styles.ratingText}>⭐ {product.rating} / 5.0</Text>
        <Text style={styles.priceText}>Rp {product.price.toLocaleString('id-ID')}</Text>

        <View style={styles.actions}>
          <PageButton
            title="+ Beli"
            disabled={!product.isReady}
            onPress={() => showAddedToCartAlert(product.name)}
          />
          <PageButton
            title={`Baca Panduan ${product.category}`}
            variant="outline"
            onPress={() => router.push(`/docs/${getGuidePathForCategory(product.category)}`)}
          />
          <PageButton title="Kembali" variant="outline" onPress={handleBack} />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  image: {
    width: '100%',
    height: 260,
    borderRadius: 12,
    backgroundColor: '#F9FAFB',
  },
  categoryRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 16,
  },
  categoryText: {
    fontSize: 11,
    fontWeight: '700',
    color: '#9F1239',
    textTransform: 'uppercase',
  },
  stockBadge: {
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 4,
  },
  stockText: {
    fontSize: 10,
    fontWeight: '700',
  },
  name: {
    marginTop: 8,
  },
  ratingText: {
    fontSize: 12,
    color: '#D97706',
    fontWeight: '600',
    marginTop: 6,
  },
  priceText: {
    fontSize: 18,
    fontWeight: '800',
    color: '#881337',
    marginTop: 6,
  },
  actions: {
    gap: 10,
    marginTop: 20,
  },
});
