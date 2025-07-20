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

export interface ProductCategory {
  id?: string;
  name: string;
  description: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface ProductBrand {
  id?: string;
  name: string;
  description: string;
  createdAt: Date;
  updatedAt: Date;
}
