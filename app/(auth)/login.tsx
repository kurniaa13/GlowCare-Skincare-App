// 1.1 IMPORT SECTION
import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
  ScrollView,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import { supabase } from '@/lib/supabase';
import { notify } from '@/lib/notify';
import { colors, radius, shadow } from '@/styles';

export default function LoginScreen() {
  // 1.2 STATE DECLARATION
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [callsign, setCallsign] = useState('');
  const [isRegistering, setIsRegistering] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null); // pesan error inline (tampil juga di web)

  // 1.3 CORE AUTHENTICATION ENGINE (CODELAB 3)
  const handleAuth = async () => {
    if (loading) return; // cegah multiple submission
    setErrorMsg(null);

    // 2.1 SANITIZE INPUTS & VALIDATION
    const cleanEmail = email.trim();
    const cleanPassword = password.trim();
    const cleanCallsign = callsign.trim();

    if (!cleanEmail || !cleanPassword) {
      notify('Data belum lengkap', 'Isi email dan password terlebih dahulu.');
      return;
    }

    if (isRegistering && !cleanCallsign) {
      notify('Nama panggilan kosong', 'Isi nama panggilan untuk akun GlowSpa Care-mu.');
      return;
    }

    setLoading(true);
    try {
      if (isRegistering) {
        // 2.2 SIGN UP: DAFTAR AKUN BARU (callsign dikirim sebagai metadata)
        const { error } = await supabase.auth.signUp({
          email: cleanEmail,
          password: cleanPassword,
          options: {
            data: {
              callsign: cleanCallsign,
              role: 'member',
            },
          },
        });

        if (error) {
          setErrorMsg(error.message);
        } else {
          notify('Pendaftaran berhasil! 🎉', 'Akunmu sudah dibuat. Silakan masuk.');
          setIsRegistering(false);
          setPassword('');
        }
      } else {
        // 2.3 SIGN IN: MASUK KE AKUN
        const { error } = await supabase.auth.signInWithPassword({
          email: cleanEmail,
          password: cleanPassword,
        });

        if (error) {
          setErrorMsg(error.message);
        } else {
          router.replace('/');
        }
      }
    } catch (err: any) {
      setErrorMsg('Tidak dapat terhubung ke server. Periksa koneksi internetmu.');
      console.error('Auth Exception:', err);
    } finally {
      setLoading(false);
    }
  };

  // 1.4 MAIN UI RENDER
  return (
    <SafeAreaView style={styles.screenContainer}>
      <View style={styles.blobTop} />
      <View style={styles.blobBottom} />
      <ScrollView contentContainerStyle={styles.scrollContent} keyboardShouldPersistTaps="handled">
        <View style={styles.cardWrapper}>
          <View style={styles.headerArea}>
            <View style={styles.logoCircle}>
              <Text style={styles.logoEmoji}>🌸</Text>
            </View>
            <Text style={styles.brand}>GlowSpa Care</Text>
            <Text style={styles.headingTitle}>
              {isRegistering ? 'Buat Akun Baru' : 'Selamat Datang Kembali'}
            </Text>
            <Text style={styles.subtitle}>
              {isRegistering
                ? 'Daftar dan mulai rutinitas perawatan kulitmu.'
                : 'Masuk untuk melihat produk dan jadwal perawatanmu.'}
            </Text>
          </View>

          <View style={styles.formCard}>
            {isRegistering && (
              <View style={styles.inputGroup}>
                <Text style={styles.inputLabel}>NAMA PANGGILAN</Text>
                <TextInput
                  style={styles.textInput}
                  placeholder="mis. Nia"
                  placeholderTextColor="#9CA3AF"
                  value={callsign}
                  onChangeText={setCallsign}
                  autoCapitalize="words"
                />
              </View>
            )}

            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>EMAIL</Text>
              <TextInput
                style={styles.textInput}
                placeholder="nama@email.com"
                placeholderTextColor="#9CA3AF"
                value={email}
                onChangeText={setEmail}
                keyboardType="email-address"
                autoCapitalize="none"
                autoCorrect={false}
              />
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>PASSWORD</Text>
              <TextInput
                style={styles.textInput}
                placeholder="Minimal 6 karakter"
                placeholderTextColor="#9CA3AF"
                value={password}
                onChangeText={setPassword}
                secureTextEntry
              />
            </View>

            <TouchableOpacity
              style={[styles.primaryBtn, loading && { opacity: 0.6 }]}
              onPress={handleAuth}
              disabled={loading}
              activeOpacity={0.85}
            >
              {loading ? (
                <ActivityIndicator color="#FFFFFF" size="small" />
              ) : (
                <Text style={styles.primaryBtnText}>
                  {isRegistering ? 'Daftar Sekarang' : 'Masuk'}
                </Text>
              )}
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.switchModeBtn}
              onPress={() => {
                setIsRegistering(!isRegistering);
                setErrorMsg(null);
              }}
              activeOpacity={0.7}
            >
              <Text style={styles.switchModeText}>
                {isRegistering
                  ? 'Sudah punya akun? Masuk di sini'
                  : 'Belum punya akun? Daftar di sini'}
              </Text>
            </TouchableOpacity>

            {errorMsg && (
              <View style={styles.errorBox}>
                <Text style={styles.errorText}>{errorMsg}</Text>
              </View>
            )}
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

// 1.5 STYLESHEET SECTION (TEMA GLOWSPA CARE)
const styles = StyleSheet.create({
  screenContainer: { flex: 1, backgroundColor: colors.rose50 },
  blobTop: {
    position: 'absolute',
    top: -90,
    right: -70,
    width: 260,
    height: 260,
    borderRadius: 130,
    backgroundColor: colors.rose100,
  },
  blobBottom: {
    position: 'absolute',
    bottom: -100,
    left: -80,
    width: 260,
    height: 260,
    borderRadius: 130,
    backgroundColor: colors.goldSoft,
  },
  scrollContent: { padding: 24, justifyContent: 'center', flexGrow: 1 },
  cardWrapper: { maxWidth: 440, width: '100%', alignSelf: 'center' },
  headerArea: { marginBottom: 22, alignItems: 'center' },
  logoCircle: {
    width: 68,
    height: 68,
    borderRadius: 34,
    backgroundColor: colors.white,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: colors.rose200,
    marginBottom: 10,
    ...shadow.card,
  },
  logoEmoji: { fontSize: 34 },
  brand: { color: colors.primaryDeep, fontSize: 13, fontWeight: '800', letterSpacing: 2, marginBottom: 10 },
  headingTitle: { color: colors.primaryDark, fontSize: 26, fontWeight: '800', marginBottom: 6, textAlign: 'center' },
  subtitle: { color: colors.muted, fontSize: 13, textAlign: 'center', lineHeight: 19 },
  formCard: {
    backgroundColor: colors.white,
    borderRadius: radius.lg,
    padding: 20,
    borderWidth: 1,
    borderColor: colors.line,
    gap: 14,
    ...shadow.card,
  },
  inputGroup: { gap: 6 },
  inputLabel: { color: colors.primaryDeep, fontSize: 10, fontWeight: '800', letterSpacing: 1 },
  textInput: {
    backgroundColor: colors.rose50,
    color: colors.text,
    paddingHorizontal: 14,
    paddingVertical: 12,
    borderRadius: radius.md,
    borderWidth: 1,
    borderColor: colors.rose200,
    fontSize: 14,
  },
  primaryBtn: {
    backgroundColor: colors.primary,
    paddingVertical: 14,
    borderRadius: radius.pill,
    alignItems: 'center',
    marginTop: 6,
    boxShadow: '0 6px 14px rgba(190, 18, 60, 0.28)',
  },
  primaryBtnText: { color: colors.white, fontWeight: '800', fontSize: 14 },
  switchModeBtn: { paddingVertical: 6, alignItems: 'center' },
  switchModeText: { color: colors.primaryDeep, fontSize: 13, fontWeight: '700' },
  errorBox: {
    padding: 12,
    borderRadius: radius.md,
    borderWidth: 1,
    borderColor: '#FCA5A5',
    backgroundColor: colors.dangerBg,
  },
  errorText: { color: colors.dangerText, fontSize: 13, fontWeight: '600', textAlign: 'center' },
});
