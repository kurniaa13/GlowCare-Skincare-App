import { Stack } from 'expo-router';
import { stackScreenOptions } from '@/styles';

// Nested Stack: halaman-halaman di dalam folder docs/ punya navigasi sendiri.
export default function DocsLayout() {
  return (
    <Stack screenOptions={stackScreenOptions}>
      <Stack.Screen name="index" options={{ title: 'Panduan Skincare' }} />
      <Stack.Screen name="[...slug]" options={{ title: 'Panduan' }} />
    </Stack>
  );
}
