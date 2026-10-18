import type { ProductCategory } from '@/types';

export type GuideGroup = 'kategori' | 'rutinitas';

export interface Guide {
  /** Path relatif terhadap /docs, mis. "serum" atau "rutinitas/pagi" */
  path: string;
  group: GuideGroup;
  title: string;
  summary: string;
  steps: string[];
  tip?: string;
}

export const guides: Guide[] = [
  {
    path: 'serum',
    group: 'kategori',
    title: 'Panduan Serum',
    summary:
      'Serum berisi bahan aktif dengan konsentrasi lebih tinggi untuk membantu masalah kulit tertentu, seperti kusam atau noda bekas jerawat.',
    steps: [
      'Cuci wajah dengan cleanser, lalu keringkan dengan menepuk lembut menggunakan handuk bersih.',
      'Teteskan 2–3 tetes serum ke telapak tangan atau langsung ke wajah.',
      'Tepuk-tepuk lembut hingga meresap dan hindari area sekitar mata.',
      'Tunggu sebentar, lalu lanjutkan dengan moisturizer.',
    ],
    tip: 'Lakukan patch test di area kecil (misalnya belakang telinga) sebelum memakai serum baru.',
  },
  {
    path: 'serum/vitamin-c',
    group: 'kategori',
    title: 'Serum Vitamin C',
    summary:
      'Vitamin C banyak dipakai untuk membantu mencerahkan kulit dan melindungi kulit dari paparan radikal bebas.',
    steps: [
      'Pakai di pagi hari setelah cleanser, sebelum moisturizer.',
      'Mulai dari 2–3 kali seminggu, lalu tambah frekuensinya jika kulit sudah nyaman.',
      'Selalu akhiri dengan sunscreen di pagi hari.',
      'Simpan di tempat sejuk dan gelap, dan tutup botol dengan rapat.',
    ],
    tip: 'Sensasi sedikit menyengat bisa terjadi di awal pemakaian. Hentikan jika kulit memerah atau perih berkelanjutan.',
  },
  {
    path: 'moisturizer',
    group: 'kategori',
    title: 'Panduan Moisturizer',
    summary:
      'Moisturizer membantu menjaga kelembapan kulit. Tekstur gel umumnya terasa ringan dan nyaman untuk kulit berminyak atau kombinasi.',
    steps: [
      'Pakai setelah serum saat kulit masih sedikit lembap.',
      'Ambil secukupnya, lalu ratakan tipis-tipis ke seluruh wajah dan leher.',
      'Gunakan pagi dan malam hari.',
    ],
    tip: 'Kulit berminyak tetap membutuhkan moisturizer. Pilih tekstur yang ringan.',
  },
  {
    path: 'sunscreen',
    group: 'kategori',
    title: 'Panduan Sunscreen',
    summary:
      'Sunscreen melindungi kulit dari sinar UV dan merupakan langkah terakhir skincare di pagi hari.',
    steps: [
      'Pakai sebagai langkah terakhir skincare pagi, setelah moisturizer.',
      'Gunakan sekitar dua ruas jari untuk wajah dan leher.',
      'Ulangi setiap sekitar 2 jam jika beraktivitas di luar ruangan atau berkeringat.',
      'Bersihkan dengan cleanser di malam hari.',
    ],
    tip: 'Pakai sunscreen walaupun cuaca mendung atau sedang berada di dalam ruangan dekat jendela.',
  },
  {
    path: 'cleanser',
    group: 'kategori',
    title: 'Panduan Cleanser',
    summary:
      'Cleanser dengan pH rendah membersihkan kotoran dan minyak berlebih tanpa membuat kulit terasa ketarik.',
    steps: [
      'Basahi wajah dengan air.',
      'Pijat cleanser dengan lembut sekitar 30–60 detik.',
      'Bilas hingga bersih dengan air bersuhu suam-suam kuku.',
      'Keringkan dengan menepuk lembut, jangan digosok.',
    ],
    tip: 'Jika memakai sunscreen atau makeup, bersihkan dua kali (double cleansing) di malam hari.',
  },
  {
    path: 'rutinitas/pagi',
    group: 'rutinitas',
    title: 'Rutinitas Pagi',
    summary: 'Urutan sederhana skincare pagi agar kulit lembap dan terlindungi seharian.',
    steps: [
      'Cleanser',
      'Serum (mis. Vitamin C)',
      'Moisturizer',
      'Sunscreen',
    ],
  },
  {
    path: 'rutinitas/malam',
    group: 'rutinitas',
    title: 'Rutinitas Malam',
    summary: 'Malam hari adalah waktu kulit memperbaiki diri, jadi fokusnya membersihkan dan melembapkan.',
    steps: [
      'Cleanser (dua kali jika memakai sunscreen atau makeup)',
      'Serum',
      'Moisturizer',
    ],
  },
];

export const getGuide = (path: string): Guide | undefined =>
  guides.find((guide) => guide.path === path);

/** Path panduan yang sesuai dengan kategori produk, mis. "Serum" -> "serum". */
export const getGuidePathForCategory = (category: ProductCategory): string =>
  category.toLowerCase();
