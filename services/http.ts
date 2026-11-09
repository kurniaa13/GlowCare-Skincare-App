import type { ApiResponse } from '@/types/api';

const REQUEST_TIMEOUT_MS = 10000;

// Pembungkus fetch() (GET request) yang dipakai semua service.
//
// Modul 3 - Kriteria 3: memakai Promise constructor, resolve(), reject(), dan .then().
// - resolve() dipanggil kalau request berhasil
// - reject()  dipanggil kalau request gagal (HTTP error, tidak ada internet, atau timeout)
// Generic <T> memberi tahu TypeScript bentuk JSON yang akan dikembalikan.
export function getJson<T>(url: string): Promise<ApiResponse<T>> {
  return new Promise<ApiResponse<T>>((resolve, reject) => {
    // Server lambat / tidak merespons -> gagal setelah 10 detik.
    const timer = setTimeout(() => {
      reject(new Error('Server terlalu lama merespons. Coba lagi nanti.'));
    }, REQUEST_TIMEOUT_MS);

    fetch(url) // fetch() = async function bawaan (pre-built)
      .then((response) => {
        if (response.status === 429) {
          throw new Error('Terlalu banyak permintaan. Tunggu sebentar lalu coba lagi.');
        }
        if (!response.ok) {
          const httpError = new Error(`Data gagal diambil (HTTP ${response.status}).`) as Error & {
            status?: number;
          };
          httpError.status = response.status; // dipakai untuk mengenali 404 (data tidak ada)
          throw httpError;
        }
        return response.json() as Promise<T>;
      })
      .then((json) => {
        clearTimeout(timer);
        resolve({ success: true, data: json, message: 'Data berhasil diambil' });
      })
      .catch((error: unknown) => {
        clearTimeout(timer);
        const isNetworkError =
          error instanceof Error && error.message.includes('Network request failed');
        reject(
          isNetworkError
            ? new Error('Tidak ada koneksi internet.')
            : error instanceof Error
              ? error
              : new Error('Terjadi kesalahan saat mengambil data.')
        );
      });
  });
}
