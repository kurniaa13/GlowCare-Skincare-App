import React, { useMemo } from 'react';
import { ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Stack, useLocalSearchParams, useRouter } from 'expo-router';
import { PageButton } from '@/components/PageButton';
import { getGuide } from '@/data/guides';
import { pageStyles } from '@/styles';

// Catch-all route: satu file menangani /docs/serum, /docs/serum/vitamin-c,
// /docs/rutinitas/pagi, dan seluruh path lain di bawah /docs.
export default function DocsPage() {
  const router = useRouter();
  const { slug } = useLocalSearchParams<{ slug: string | string[] }>();

  // slug berupa array (mis. ["serum", "vitamin-c"]), digabung menjadi "serum/vitamin-c".
  const path = useMemo(() => (Array.isArray(slug) ? slug.join('/') : (slug ?? '')), [slug]);
  const guide = useMemo(() => getGuide(path), [path]);

  const handleBack = () => {
    if (router.canGoBack()) {
      router.back();
    } else {
      router.replace('/docs');
    }
  };

  if (!guide) {
    return (
      <SafeAreaView style={pageStyles.container} edges={['bottom', 'left', 'right']}>
        <ScrollView contentContainerStyle={pageStyles.content}>
          <Text style={pageStyles.title}>Panduan tidak ditemukan</Text>
          <Text style={[pageStyles.subtitle, styles.spaced]}>Path: /docs/{path}</Text>
          <View style={styles.actions}>
            <PageButton title="Lihat Semua Panduan" onPress={() => router.push('/docs')} />
            <PageButton title="Kembali" variant="outline" onPress={handleBack} />
          </View>
        </ScrollView>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={pageStyles.container} edges={['bottom', 'left', 'right']}>
      {/* Judul header mengikuti panduan yang sedang dibuka */}
      <Stack.Screen options={{ title: guide.title }} />

      <ScrollView contentContainerStyle={pageStyles.content}>
        <Text style={pageStyles.title}>{guide.title}</Text>
        <Text style={[pageStyles.bodyText, styles.spaced]}>{guide.summary}</Text>

        <Text style={pageStyles.sectionTitle}>
          {guide.group === 'rutinitas' ? 'Urutan' : 'Cara Pakai'}
        </Text>
        <View style={pageStyles.card}>
          {guide.steps.map((step, index) => (
            <View key={step} style={styles.stepRow}>
              <Text style={styles.stepNumber}>{index + 1}.</Text>
              <Text style={[pageStyles.bodyText, styles.stepText]}>{step}</Text>
            </View>
          ))}
        </View>

        {guide.tip ? (
          <View style={[pageStyles.card, styles.tipCard]}>
            <Text style={styles.tipLabel}>TIPS</Text>
            <Text style={pageStyles.bodyText}>{guide.tip}</Text>
          </View>
        ) : null}

        <Text style={pageStyles.mutedText}>
          Informasi ini bersifat umum dan bukan pengganti saran dokter kulit.
        </Text>

        <View style={styles.actions}>
          <PageButton title="Lihat Semua Panduan" onPress={() => router.push('/docs')} />
          <PageButton title="Kembali" variant="outline" onPress={handleBack} />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  spaced: {
    marginTop: 8,
  },
  stepRow: {
    flexDirection: 'row',
    marginBottom: 8,
  },
  stepNumber: {
    width: 22,
    fontSize: 13,
    fontWeight: '700',
    color: '#BE123C',
  },
  stepText: {
    flex: 1,
  },
  tipCard: {
    backgroundColor: '#FCE7F3',
    borderColor: 'rgb(249, 199, 227)',
  },
  tipLabel: {
    fontSize: 10,
    fontWeight: '800',
    color: '#BE123C',
    letterSpacing: 1,
    marginBottom: 4,
  },
  actions: {
    gap: 10,
    marginTop: 20,
  },
});
