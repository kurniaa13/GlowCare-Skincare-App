import { StyleSheet } from 'react-native';

// External styling (Modul 2): style layar-layar baru dipisah dari file screen.
// Warna mengikuti palet GlowCare yang sudah dipakai di HeaderBanner / ProductCard.
export const pageStyles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFF1F2',
  },
  content: {
    padding: 16,
  },
  title: {
    fontSize: 20,
    fontWeight: '800',
    color: '#881337',
  },
  subtitle: {
    fontSize: 12,
    color: '#9F1239',
    marginTop: 2,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#881337',
    marginTop: 20,
    marginBottom: 10,
  },
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 12,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#F3F4F6',
  },
  bodyText: {
    fontSize: 13,
    lineHeight: 20,
    color: '#1F2937',
  },
  mutedText: {
    fontSize: 11,
    lineHeight: 16,
    color: '#6B7280',
  },
});
