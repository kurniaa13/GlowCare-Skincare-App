import React from 'react';
import { StyleSheet, Text, View } from 'react-native';

interface StatCardProps {
  label: string;
  value: string | number;
}

// Kartu kecil untuk menampilkan satu angka ringkasan.
export const StatCard: React.FC<StatCardProps> = ({ label, value }) => (
  <View style={styles.card}>
    <Text style={styles.value}>{value}</Text>
    <Text style={styles.label}>{label}</Text>
  </View>
);

const styles = StyleSheet.create({
  card: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 10,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#FECDD3',
  },
  value: { fontSize: 16, fontWeight: '800', color: '#881337' },
  label: { fontSize: 10, color: '#9F1239', marginTop: 2, textAlign: 'center' },
});
