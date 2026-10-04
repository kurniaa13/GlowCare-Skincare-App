export interface SkincareProduct {
  id: string;
  name: string;
  category: 'Serum' | 'Moisturizer' | 'Sunscreen' | 'Cleanser';
  price: number;
  rating: number;
  image: string;
  isReady: boolean;
}

export const skincareData: SkincareProduct[] = [
  {
    id: 'skin-1',
    name: 'Glow Vitamin C Brightening Serum',
    category: 'Serum',
    price: 129000,
    rating: 4.8,
    image: 'https://images.unsplash.com/photo-1620916566398-39f1143ab7be?w=400',
    isReady: true,
  },
  {
    id: 'skin-2',
    name: 'Hydrasoothe Gel Moisturizer 50ml',
    category: 'Moisturizer',
    price: 89000,
    rating: 4.9,
    image: 'https://images.unsplash.com/photo-1608248597260-509200424a1b?w=400',
    isReady: true,
  },
  {
    id: 'skin-3',
    name: 'UV Shield Physical Sunscreen SPF 50+',
    category: 'Sunscreen',
    price: 115000,
    rating: 4.7,
    image: 'https://images.unsplash.com/photo-1598440947619-2c35fc9aa908?w=400',
    isReady: false,
  },
  {
    id: 'skin-4',
    name: 'Gentle Low pH Amino Cleanser',
    category: 'Cleanser',
    price: 75000,
    rating: 4.6,
    image: 'https://images.unsplash.com/photo-1556228720-195a672e8a03?w=400',
    isReady: true,
  },
];