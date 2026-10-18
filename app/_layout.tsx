import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { stackScreenOptions } from '@/styles';

// Root layout: semua halaman di folder app/ dikelola oleh satu Stack Navigator.
export default function RootLayout() {
  return (
    <>
      <StatusBar style="dark" />
      <Stack screenOptions={stackScreenOptions}>
        {/* Home tetap tanpa header supaya tampilannya sama seperti sebelumnya */}
        <Stack.Screen name="index" options={{ title: 'Home', headerShown: false }} />
        <Stack.Screen name="product/[id]" options={{ title: 'Detail Produk' }} />
        {/* docs punya Stack sendiri (nested Stack, lihat app/docs/_layout.tsx) */}
        <Stack.Screen name="docs" options={{ title: 'Panduan Skincare', headerShown: false }} />
        <Stack.Screen name="codelab-1" options={{ title: 'Codelab 1 - useContext' }} />
      </Stack>
    </>
  );
}
