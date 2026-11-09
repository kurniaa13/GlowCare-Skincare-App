import React from 'react';
import { ActivityIndicator, StyleSheet, Text, View } from 'react-native';

interface LoadingProps {
  message?: string;
}

// Indikator loading, ditampilkan selama data dari API belum selesai diambil.
export const Loading: React.FC<LoadingProps> = ({ message = 'Memuat data...' }) => (
  <View style={styles.container}>
    <ActivityIndicator size="large" color="#BE123C" />
    <Text style={styles.text}>{message}</Text>
  </View>
);

const styles = StyleSheet.create({
  container: { alignItems: 'center', justifyContent: 'center', padding: 32 },
  text: { marginTop: 12, fontSize: 12, color: '#9F1239' },
});
