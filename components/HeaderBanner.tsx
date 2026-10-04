import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

export const HeaderBanner: React.FC = () => {
  return (
    <View style={styles.container}>
      <View style={styles.topRow}>
        <View>
          <Text style={styles.storeName}>✨ GlowCare Beauty</Text>
          <Text style={styles.subTitle}>Temukan Skincare Impianmu</Text>
        </View>
      </View>

      <View style={styles.bannerCard}>
        <Text style={styles.bannerTag}>PROMO SPESIAL</Text>
        <Text style={styles.bannerTitle}>Diskon Hingga 30%</Text>
        <Text style={styles.bannerDesc}>Khusus pembelian produk Glowing Serum hari ini!</Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginBottom: 16,
  },
  topRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 14,
  },
  storeName: {
    fontSize: 20,
    fontWeight: '800',
    color: '#881337',
  },
  subTitle: {
    fontSize: 12,
    color: '#9F1239',
    marginTop: 2,
  },
  bannerCard: {
    backgroundColor: '#FCE7F3',
    borderRadius: 12,
    padding: 16,
    borderWidth: 1,
    borderColor: '#FBCFE8',
  },
  bannerTag: {
    fontSize: 10,
    fontWeight: '800',
    color: '#BE123C',
    letterSpacing: 1,
  },
  bannerTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#881337',
    marginTop: 4,
  },
  bannerDesc: {
    fontSize: 12,
    color: '#9F1239',
    marginTop: 2,
  },
});