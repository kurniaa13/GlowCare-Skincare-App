import { StyleSheet } from 'react-native';

// EXTERNAL STYLING (Modul 1 - 3.2): style dipisah dari komponen supaya rapi & reusable
export const styles = StyleSheet.create({
  // ---- Layar utama ----
  screen: {
    flex: 1,
    backgroundColor: '#FFF1F2',
  },
  screenContent: {
    paddingHorizontal: 20,
    paddingTop: 56,
    paddingBottom: 32,
  },

  // ---- Daftar produk ----
  sectionTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#881337',
    marginBottom: 12,
  },

  // ---- Kartu produk ----
  card: {
    flexDirection: 'row',
    backgroundColor: '#ffffff',
    borderRadius: 16,
    padding: 12,
    marginBottom: 14,
    elevation: 4, // bayangan Android
    shadowColor: '#000', // bayangan iOS
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 6,
  },
  cardImage: {
    width: 96,
    height: 96,
    borderRadius: 12,
    backgroundColor: '#FBCFE8',
  },
  cardBody: {
    flex: 1,
    marginLeft: 12,
    justifyContent: 'space-between',
  },
  categoryBadge: {
    alignSelf: 'flex-start',
    fontSize: 10,
    fontWeight: '700',
    color: '#BE123C',
    backgroundColor: '#FCE7F3',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 8,
    overflow: 'hidden',
  },
  productName: {
    fontSize: 14,
    fontWeight: '700',
    color: '#0f172a',
    marginTop: 4,
  },
  ratingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 2,
  },
  rating: {
    fontSize: 12,
    color: '#64748b',
    marginLeft: 4,
  },
  priceRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 8,
  },
  price: {
    fontSize: 15,
    fontWeight: '800',
    color: '#881337',
  },
  buyButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 14,
    paddingVertical: 6,
    borderRadius: 10,
  },
  buyButtonText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#ffffff',
    marginLeft: 4,
  },
});
