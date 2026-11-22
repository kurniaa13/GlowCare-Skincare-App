// Route /modul4-missions: Codelab 5 Modul 4 (Jadwal Perawatan: CRUD Supabase + RLS).
// Tabel `missions` dari SQL lab dipakai sebagai daftar perawatan (title = nama perawatan,
// reward_points = Poin Glow, status pending/completed = belum/selesai).
// 1.1 IMPORT SECTION
import React, { useEffect, useState, useCallback } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  FlatList,
  StyleSheet,
  ActivityIndicator,
  RefreshControl,
  Keyboard,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useAuth } from '@/context/AuthContext';
import { supabase } from '@/lib/supabase';
import { notify } from '@/lib/notify';
import { colors, radius, shadow } from '@/styles';

// 1.2 INTERFACE DEFINITION
interface Mission {
  id: string;
  title: string;
  reward_points: number;
  status: 'pending' | 'completed';
  created_at: string;
}

export default function TreatmentScheduleScreen() {
  // 1.3 COMPONENT STATE
  const { user, signOut } = useAuth();
  const [missions, setMissions] = useState<Mission[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [missionTitle, setMissionTitle] = useState('');
  const [rewardXP, setRewardXP] = useState('150');
  const [submitting, setSubmitting] = useState(false);

  // 1.4 SUPABASE CRUD OPERATIONS
  // 2.1 READ: FETCH MISSIONS (PROTECTED BY RLS)
  const fetchMissions = useCallback(async () => {
    try {
      const { data, error } = await supabase
        .from('missions')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) {
        if (error.code === 'PGRST205' || error.message.includes('does not exist')) {
          notify(
            'Database belum siap',
            'Tabel "missions" belum ada. Jalankan SQL di supabase/code4.sql lewat Supabase SQL Editor.'
          );
        } else {
          throw error;
        }
      }
      setMissions(data || []);
    } catch (error: any) {
      notify('Gagal memuat', error.message || 'Daftar perawatan tidak dapat dimuat.');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, []);

  useEffect(() => {
    fetchMissions();
  }, [fetchMissions]);

  const onRefresh = () => {
    setRefreshing(true);
    fetchMissions();
  };

  // 2.2 CREATE: INSERT MISSION (OPTIMISTIC UI + ROLLBACK)
  const handleCreateMission = async () => {
    if (!missionTitle.trim()) {
      notify('Nama perawatan kosong', 'Isi nama perawatan terlebih dahulu.');
      return;
    }
    if (!user) return;

    const title = missionTitle.trim();
    const points = parseInt(rewardXP, 10) || 100;

    // Tampilkan dulu di UI dengan ikon tertunda (id sementara "temp-...")
    const tempId = `temp-${Date.now()}`;
    const optimistic: Mission = {
      id: tempId,
      title,
      reward_points: points,
      status: 'pending',
      created_at: new Date().toISOString(),
    };
    setMissions((prev) => [optimistic, ...prev]);
    setMissionTitle('');
    setRewardXP('150');
    Keyboard.dismiss();

    try {
      setSubmitting(true);
      const { data, error } = await supabase
        .from('missions')
        .insert([{ title, reward_points: points, user_id: user.id }])
        .select()
        .single();

      if (error) throw error;
      // Ganti item sementara dengan baris asli dari database
      setMissions((prev) => prev.map((m) => (m.id === tempId ? (data as Mission) : m)));
    } catch (error: any) {
      // Rollback: hapus item sementara dan kembalikan teks ke form
      setMissions((prev) => prev.filter((m) => m.id !== tempId));
      setMissionTitle(title);
      notify('Gagal menambah jadwal', error.message);
    } finally {
      setSubmitting(false);
    }
  };

  // 2.3 UPDATE: TOGGLE STATUS (OPTIMISTIC UI)
  const handleToggleStatus = async (item: Mission) => {
    if (item.id.startsWith('temp-')) return; // masih tertunda, belum ada di database
    const nextStatus = item.status === 'completed' ? 'pending' : 'completed';

    // Instant local UI state update
    setMissions((prev) => prev.map((m) => (m.id === item.id ? { ...m, status: nextStatus } : m)));

    try {
      const { error } = await supabase
        .from('missions')
        .update({ status: nextStatus })
        .eq('id', item.id);

      if (error) throw error;
    } catch (error: any) {
      notify('Gagal memperbarui', error.message);
      fetchMissions();
    }
  };

  // 2.4 DELETE: REMOVE MISSION (OPTIMISTIC UI)
  const handleDeleteMission = async (id: string) => {
    if (id.startsWith('temp-')) return; // masih tertunda, belum ada di database
    // Instant local removal
    setMissions((prev) => prev.filter((m) => m.id !== id));

    try {
      const { error } = await supabase.from('missions').delete().eq('id', id);
      if (error) throw error;
    } catch (error: any) {
      notify('Gagal menghapus', error.message);
      fetchMissions();
    }
  };

  // 1.5 LIST ITEM RENDER
  const renderMissionItem = ({ item }: { item: Mission }) => {
    const isDone = item.status === 'completed';
    const isPending = item.id.startsWith('temp-'); // optimistic: belum tersimpan di server
    return (
      <View style={styles.missionCard}>
        <TouchableOpacity style={styles.missionMainTouch} onPress={() => handleToggleStatus(item)} activeOpacity={0.75}>
          <View style={[styles.statusChip, isDone ? styles.statusChipDone : styles.statusChipActive]}>
            <View style={[styles.statusDot, isDone ? styles.statusDotDone : styles.statusDotActive]} />
            <Text style={[styles.statusChipText, isDone ? styles.statusTextDone : styles.statusTextActive]}>
              {isPending ? '⏳ MENYIMPAN' : isDone ? '✓ SELESAI' : 'BELUM'}
            </Text>
          </View>

          <View style={styles.missionTextContent}>
            <Text style={[styles.missionTitle, isDone && styles.missionTitleDone]} numberOfLines={2}>
              {item.title}
            </Text>
            <Text style={styles.rewardText}>+{item.reward_points} Poin Glow</Text>
          </View>
        </TouchableOpacity>

        <TouchableOpacity style={styles.deleteChip} onPress={() => handleDeleteMission(item.id)} activeOpacity={0.7}>
          <Text style={styles.deleteChipText}>✕</Text>
        </TouchableOpacity>
      </View>
    );
  };

  // 1.6 COMPACT SCREEN RENDER
  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        <View style={styles.header}>
          <View style={styles.headerLeft}>
            <View style={styles.statusIndicatorRow}>
              <View style={styles.livePulseDot} />
              <Text style={styles.statusLabel}>SESI AKTIF</Text>
            </View>
            <Text style={styles.callsignHeading}>
              {user?.user_metadata?.callsign || user?.email?.split('@')[0] || 'Sahabat Glow'}
            </Text>
            <Text style={styles.emailSub} numberOfLines={1}>
              {user?.email}
            </Text>
          </View>

          <TouchableOpacity style={styles.signOutButton} onPress={signOut} activeOpacity={0.8}>
            <Text style={styles.signOutButtonText}>Keluar</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.dispatchCard}>
          <Text style={styles.cardHeaderLabel}>TAMBAH JADWAL PERAWATAN</Text>
          <TextInput
            style={styles.mainInput}
            placeholder="mis. Facial brightening, Creambath"
            placeholderTextColor="#71717a"
            value={missionTitle}
            onChangeText={setMissionTitle}
          />
          <View style={styles.dispatchRow}>
            <TextInput
              style={[styles.mainInput, styles.xpInput]}
              placeholder="Poin"
              placeholderTextColor="#71717a"
              value={rewardXP}
              onChangeText={setRewardXP}
              keyboardType="numeric"
            />
            <TouchableOpacity
              style={[styles.dispatchButton, submitting && styles.buttonDisabled]}
              onPress={handleCreateMission}
              disabled={submitting}
              activeOpacity={0.85}
            >
              {submitting ? (
                <ActivityIndicator color="#FFFFFF" size="small" />
              ) : (
                <Text style={styles.dispatchButtonText}>Tambah</Text>
              )}
            </TouchableOpacity>
          </View>
        </View>

        <View style={styles.listSectionHeader}>
          <Text style={styles.listTitle}>DAFTAR PERAWATAN</Text>
          <View style={styles.badgeCountPill}>
            <Text style={styles.badgeCountText}>{missions.length} JADWAL</Text>
          </View>
        </View>

        {loading ? (
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="small" color="#BE123C" />
            <Text style={styles.loadingText}>Memuat dari database...</Text>
          </View>
        ) : (
          <FlatList
            data={missions}
            keyExtractor={(item) => item.id}
            renderItem={renderMissionItem}
            contentContainerStyle={styles.listContent}
            showsVerticalScrollIndicator={false}
            refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor="#BE123C" />}
            ListEmptyComponent={
              <View style={styles.emptyState}>
                <Text style={styles.emptyTitle}>Belum ada jadwal perawatan</Text>
                <Text style={styles.emptySubtitle}>Tambahkan perawatan pertamamu di atas.</Text>
              </View>
            }
          />
        )}
      </View>
    </SafeAreaView>
  );
}

// 1.7 STYLESHEET (TEMA GLOWSPA CARE)
const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: colors.rose50 },
  container: { flex: 1, paddingHorizontal: 18, paddingTop: 8, maxWidth: 460, width: '100%', alignSelf: 'center' },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 14, paddingBottom: 12, borderBottomWidth: 1, borderBottomColor: colors.rose200 },
  headerLeft: { flex: 1, marginRight: 10 },
  statusIndicatorRow: { flexDirection: 'row', alignItems: 'center', marginBottom: 3 },
  livePulseDot: { width: 7, height: 7, borderRadius: 3.5, backgroundColor: '#16A34A', marginRight: 6 },
  statusLabel: { color: colors.primaryDeep, fontSize: 10, fontWeight: '800', letterSpacing: 1 },
  callsignHeading: { color: colors.primaryDark, fontSize: 22, fontWeight: '800' },
  emailSub: { color: colors.muted, fontSize: 11, marginTop: 1 },
  signOutButton: { backgroundColor: colors.white, paddingHorizontal: 14, paddingVertical: 8, borderRadius: radius.pill, borderWidth: 1, borderColor: colors.rose300 },
  signOutButtonText: { color: colors.primary, fontWeight: '800', fontSize: 12 },
  dispatchCard: { backgroundColor: colors.white, borderRadius: radius.lg, padding: 14, borderWidth: 1, borderColor: colors.line, marginBottom: 14, ...shadow.card },
  cardHeaderLabel: { color: colors.primaryDeep, fontSize: 10, fontWeight: '800', letterSpacing: 1, marginBottom: 8 },
  mainInput: { backgroundColor: colors.rose50, color: colors.text, height: 44, paddingHorizontal: 14, borderRadius: radius.md, borderWidth: 1, borderColor: colors.rose200, fontSize: 13, marginBottom: 8 },
  dispatchRow: { flexDirection: 'row' },
  xpInput: { flex: 1, marginRight: 8, marginBottom: 0 },
  dispatchButton: { backgroundColor: colors.primary, height: 44, paddingHorizontal: 20, borderRadius: radius.pill, justifyContent: 'center', alignItems: 'center' },
  buttonDisabled: { opacity: 0.5 },
  dispatchButtonText: { color: colors.white, fontWeight: '800', fontSize: 13 },
  listSectionHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 },
  listTitle: { color: colors.primaryDark, fontSize: 12, fontWeight: '800', letterSpacing: 1 },
  badgeCountPill: { backgroundColor: colors.rose100, paddingHorizontal: 10, paddingVertical: 3, borderRadius: radius.pill },
  badgeCountText: { color: colors.primaryDeep, fontSize: 10, fontWeight: '800', letterSpacing: 0.5 },
  listContent: { paddingBottom: 24 },
  missionCard: { backgroundColor: colors.white, borderRadius: radius.md, padding: 12, flexDirection: 'row', alignItems: 'center', marginBottom: 10, borderWidth: 1, borderColor: colors.line, ...shadow.soft },
  missionMainTouch: { flex: 1, flexDirection: 'row', alignItems: 'center' },
  statusChip: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: 8, paddingVertical: 4, borderRadius: radius.pill, marginRight: 10 },
  statusChipActive: { backgroundColor: colors.goldSoft },
  statusChipDone: { backgroundColor: colors.successBg },
  statusDot: { width: 6, height: 6, borderRadius: 3, marginRight: 5 },
  statusDotActive: { backgroundColor: colors.gold },
  statusDotDone: { backgroundColor: '#16A34A' },
  statusChipText: { fontSize: 10, fontWeight: '800', letterSpacing: 0.4 },
  statusTextActive: { color: '#7A5C14' },
  statusTextDone: { color: colors.successText },
  missionTextContent: { flex: 1, marginRight: 6 },
  missionTitle: { color: colors.text, fontSize: 14, fontWeight: '700', lineHeight: 18 },
  missionTitleDone: { textDecorationLine: 'line-through', color: '#9CA3AF' },
  rewardText: { color: colors.primaryDeep, fontSize: 11, fontWeight: '700', marginTop: 2 },
  deleteChip: { width: 30, height: 30, borderRadius: 15, justifyContent: 'center', alignItems: 'center', backgroundColor: colors.rose50, borderWidth: 1, borderColor: colors.rose200 },
  deleteChipText: { color: colors.primary, fontSize: 12, fontWeight: '800' },
  loadingContainer: { alignItems: 'center', marginTop: 30 },
  loadingText: { color: colors.primaryDeep, fontSize: 12, marginTop: 8 },
  emptyState: { alignItems: 'center', marginTop: 30, paddingHorizontal: 16 },
  emptyTitle: { color: colors.primaryDark, fontSize: 15, fontWeight: '800', marginBottom: 4 },
  emptySubtitle: { color: colors.muted, fontSize: 12, textAlign: 'center', lineHeight: 17 },
});
