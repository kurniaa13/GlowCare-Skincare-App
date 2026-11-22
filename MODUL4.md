# GlowSpa Care: Modul 4 Database & Autentikasi (checklist lab)

## Setup
1. `npm install`
2. Salin `.env.example` menjadi `.env`, isi URL dan anon/publishable key Supabase.
3. Supabase: Authentication > Sign In / Providers > Email > matikan **Confirm email**.
4. Supabase: SQL Editor > jalankan `supabase/code4.sql`.
5. `npx expo start -c` (atau `npx expo start --go` untuk Expo Go).

## Peta file
| Codelab | File |
|---|---|
| 1 Secure Vault | `asset/SecureVaultDemo.tsx` (route `app/modul4-vault.tsx`) |
| 2 Cloud Bridge | `lib/supabase.ts` (route `app/modul4-cloud.tsx`, log URL di `app/index.tsx`) |
| 3 Auth flow | `app/(auth)/login.tsx` (`handleAuth`) |
| 4 AuthContext + guard | `context/AuthContext.tsx`, `app/_layout.tsx` |
| 5 Jadwal Perawatan + RLS | `app/modul4-missions.tsx`, `supabase/code4.sql` |

## Skenario verifikasi
- Cold start belum login -> otomatis ke `/(auth)/login`.
- Daftar (callsign + email + password min. 6) -> sukses, kembali ke mode Sign In.
- Password salah -> pesan "Invalid login credentials" tampil, aplikasi tidak crash.
- Login benar -> otomatis ke Home (kartu SESI AKTIF: callsign, email, role, UID).
- Refresh/muat ulang -> tetap login. Keluar -> kembali ke login.
- Akun A buat 2 jadwal perawatan (muncul dengan ikon ⏳ lalu sinkron), akun B melihat daftar kosong.

## Pertanyaan yang sering muncul saat demo
- Kenapa token di SecureStore, bukan AsyncStorage? (terenkripsi Keychain/Keystore vs teks biasa)
- Fungsi `onAuthStateChange` dan `isLoading`? (sinkronisasi sesi global, cegah flicker)
- Bagaimana RLS memisahkan data? (`auth.uid() = user_id` pada setiap policy)
