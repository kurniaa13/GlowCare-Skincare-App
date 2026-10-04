import { StyleSheet } from 'react-native';

// EXTERNAL STYLING (Modul 1 - 3.2): style layar utama dipisah dari file komponen
export const styles = StyleSheet.create({
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