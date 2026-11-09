// Harga dari DummyJSON berupa dolar AS, lalu dikonversi ke Rupiah dengan kurs tetap.
// Ubah USD_TO_IDR kalau ingin menyesuaikan kurs.
export const USD_TO_IDR = 16000;

// Contoh: 9.99 -> 159900 (dibulatkan ke ratusan terdekat)
export const usdToRupiah = (usd: number): number => Math.round((usd * USD_TO_IDR) / 100) * 100;
