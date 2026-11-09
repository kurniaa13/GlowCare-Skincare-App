// Modul 3 - Kriteria 1: data dari External API dimasukkan ke Object lewat Interface.
// Bentuk data MENTAH dari API https://dummyjson.com (sebagian field saja).
export interface ProductApiItem {
  id: number;
  title: string;
  description: string;
  category: string;
  price: number;
  discountPercentage: number;
  rating: number;
  stock: number;
  brand?: string;
  tags?: string[];
  thumbnail: string;
}

// Bentuk response untuk endpoint daftar produk.
export interface ProductsApiResponse {
  products: ProductApiItem[];
  total: number;
  skip: number;
  limit: number;
}
