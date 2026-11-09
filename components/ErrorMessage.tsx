import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { PageButton } from '@/components/PageButton';

interface ErrorMessageProps {
  message: string;
  onRetry?: () => void;
}

// Pesan error yang ditampilkan saat promise di-reject (API gagal).
export const ErrorMessage: React.FC<ErrorMessageProps> = ({ message, onRetry }) => (
  <View style={styles.container}>
    <Text style={styles.icon}>⚠️</Text>
    <Text style={styles.text}>{message}</Text>
    {onRetry ? <PageButton title="Coba Lagi" onPress={onRetry} /> : null}
  </View>
);

const styles = StyleSheet.create({
  container: { alignItems: 'center', padding: 24, gap: 10 },
  icon: { fontSize: 32 },
  text: { fontSize: 13, color: '#B91C1C', textAlign: 'center' },
});
