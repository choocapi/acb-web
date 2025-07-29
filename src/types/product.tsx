export interface Product {
  id?: string;
  title: string;
  price: number;
  stock: number;
  categoryId: string;
  brandId: string;
  image: string;
  description: string;
  createdAt: Date;
  updatedAt: Date;
  isActive: boolean;
}

export interface Category {
  id?: string;
  name: string;
  description: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface Brand {
  id?: string;
  name: string;
  description: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface CartItem extends Product {
  quantity: number;
}

export interface Feedback {
  id?: string;
  productId: string;
  userId: string;
  rating: number;
  content: string;
  createdAt: Date;
  updatedAt: Date;
}
