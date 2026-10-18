import { Alert } from 'react-native';

// Dipakai bersama oleh halaman Home dan halaman Detail Produk.
export const showAddedToCartAlert = (productName: string) => {
  Alert.alert('Keranjang', `${productName} telah ditambahkan ke keranjang!`);
};
