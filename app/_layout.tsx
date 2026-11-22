// 1.1 IMPORT SECTION
import React, { useEffect } from 'react';
import { Stack, useRouter, useSegments } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { View, ActivityIndicator, StyleSheet } from 'react-native';
import { AuthProvider, useAuth } from '@/context/AuthContext';
import { stackScreenOptions } from '@/styles';

function RootLayoutNav() {
  const { session, isLoading } = useAuth();
  const segments = useSegments();
  const router = useRouter();

  // 1.2 THE NAVIGATION GATEKEEPER / ROUTE GUARD
  useEffect(() => {
    if (isLoading) return; // Rule 1: jangan redirect saat masih loading

    const inAuthGroup = (segments[0] as string) === '(auth)';

    if (!session && !inAuthGroup) {
      // Belum login tapi mencoba masuk ke halaman aplikasi -> ke Login
      router.replace('/(auth)/login' as any);
    } else if (session && inAuthGroup) {
      // Sudah login tapi masih di halaman login -> ke Home
      router.replace('/');
    }
  }, [session, isLoading, segments, router]);

  // 1.3 INITIAL LOADING SPLASH STATE
  if (isLoading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#BE123C" />
      </View>
    );
  }

  // 1.4 NAVIGATION STACK (semua screen Modul 1-3 GlowSpa Care tetap dipertahankan)
  return (
    <>
      <StatusBar style="dark" />
      <Stack screenOptions={stackScreenOptions}>
        <Stack.Screen name="(auth)/login" options={{ headerShown: false }} />
        <Stack.Screen name="index" options={{ title: 'Home', headerShown: false }} />
        <Stack.Screen name="product/[id]" options={{ title: 'Detail Produk' }} />
        {/* docs punya Stack sendiri (nested Stack, lihat app/docs/_layout.tsx) */}
        <Stack.Screen name="docs" options={{ title: 'Panduan Skincare', headerShown: false }} />
        <Stack.Screen name="codelab-1" options={{ title: 'Codelab 1 - useContext' }} />
        {/* Modul 3: Codelab Character Explorer (nested Stack sendiri) */}
        <Stack.Screen name="character-explorer" options={{ title: 'Character Explorer', headerShown: false }} />
        {/* Modul 4: Database & Autentikasi */}
        <Stack.Screen name="modul4-vault" options={{ title: 'Brankas Token' }} />
        <Stack.Screen name="modul4-cloud" options={{ title: 'Cek Koneksi Cloud' }} />
        <Stack.Screen name="modul4-missions" options={{ title: 'Jadwal Perawatan' }} />
      </Stack>
    </>
  );
}

// 1.5 ROOT APP WRAPPER WITH AUTH PROVIDER
export default function RootLayout() {
  return (
    <AuthProvider>
      <RootLayoutNav />
    </AuthProvider>
  );
}

const styles = StyleSheet.create({
  loadingContainer: {
    flex: 1,
    backgroundColor: '#FFF1F2',
    justifyContent: 'center',
    alignItems: 'center',
  },
});
