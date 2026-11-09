// Modul 3 (Praktik): fungsi utility berbentuk Promise<void>.
// Dipakai untuk menunggu sebentar, misalnya sebelum mencoba ulang request.
export function delay(ms: number): Promise<void> {
  return new Promise((resolve) => {
    setTimeout(resolve, ms);
  });
}
