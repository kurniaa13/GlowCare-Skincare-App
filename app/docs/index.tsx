import React from 'react';
import { Pressable, ScrollView, StyleSheet, Text } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Link, useRouter } from 'expo-router';
import { PageButton } from '@/components/PageButton';
import { guides, type Guide } from '@/data/guides';
import { pageStyles } from '@/styles';

const GuideLink = ({ guide }: { guide: Guide }) => (
  // Navigasi declarative dengan <Link>. asChild: Pressable ini yang menjadi tombolnya.
  // Catatan: style child dari <Link asChild> harus di-flatten, tidak boleh berupa array.
  <Link href={`/docs/${guide.path}`} asChild>
    <Pressable style={StyleSheet.flatten([pageStyles.card, styles.linkCard])}>
      <Text style={styles.linkTitle}>{guide.title}</Text>
      <Text style={pageStyles.mutedText}>{guide.summary}</Text>
    </Pressable>
  </Link>
);

// Rute: /docs
export default function DocsIndexPage() {
  const router = useRouter();

  return (
    <SafeAreaView style={pageStyles.container} edges={['bottom', 'left', 'right']}>
      <ScrollView contentContainerStyle={pageStyles.content}>
        <Text style={pageStyles.title}>Panduan Skincare</Text>
        <Text style={pageStyles.subtitle}>Pilih topik untuk mulai membaca</Text>

        <Text style={pageStyles.sectionTitle}>Berdasarkan Kategori</Text>
        {guides
          .filter((guide) => guide.group === 'kategori')
          .map((guide) => (
            <GuideLink key={guide.path} guide={guide} />
          ))}

        <Text style={pageStyles.sectionTitle}>Rutinitas</Text>
        {guides
          .filter((guide) => guide.group === 'rutinitas')
          .map((guide) => (
            <GuideLink key={guide.path} guide={guide} />
          ))}

        <Text style={pageStyles.sectionTitle}>Latihan Modul 2</Text>
        <PageButton
          title="Codelab 1 - useContext (Dark Mode)"
          variant="outline"
          onPress={() => router.push('/codelab-1')}
        />

        {/* Contoh inline style (Modul 2): style ditulis langsung di komponen */}
        <Text style={{ textAlign: 'center', color: '#999999', marginTop: 10 }}>
          GlowCare Skincare Guide
        </Text>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  linkCard: {
    gap: 4,
  },
  linkTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: '#881337',
  },
});
