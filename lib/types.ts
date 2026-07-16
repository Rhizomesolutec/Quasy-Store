export interface ProductColor {
  name: string;
  hex: string;
}

export interface Review {
  id: string;
  author: string;
  rating: number;
  date: string;
  title: string;
  body: string;
  verified: boolean;
}

export interface Product {
  id: string;
  slug: string;
  name: string;
  category: string;
  collection: string;
  price: number;
  compareAtPrice?: number;
  images: string[];
  colors: ProductColor[];
  sizes: string[];
  rating: number;
  reviewCount: number;
  isNew: boolean;
  isBestSeller: boolean;
  inStock: boolean;
  stockCount: number;
  variantLabel: string;
  tagline: string;
  description: string;
  details: string[];
  shippingInfo: string;
  reviews: Review[];
  video?: string;
}

export interface CartItem {
  productId: string;
  slug: string;
  name: string;
  price: number;
  image: string;
  variant: string;
  size?: string;
  quantity: number;
}

export interface WishlistItem {
  productId: string;
  slug: string;
  name: string;
  price: number;
  image: string;
  variant: string;
}
