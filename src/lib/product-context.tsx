"use client";

import { Product, ProductBrand, ProductCategory } from "@/types/product";
import {
  collection,
  deleteDoc,
  doc,
  getDoc,
  getDocs,
  setDoc,
  updateDoc,
} from "firebase/firestore";
import { createContext, useContext, useState } from "react";
import { firestore } from "./firebase";
import { Response } from "@/types/response";

interface ProductContextType {
  products: Product[];
  categories: ProductCategory[];
  brands: ProductBrand[];
  addProduct: (product: Product) => Promise<Response>;
  addCategory: (category: ProductCategory) => Promise<Response>;
  addBrand: (brand: ProductBrand) => Promise<Response>;
  getProducts: () => Promise<Response>;
  getCategories: () => Promise<Response>;
  getBrands: () => Promise<Response>;
  updateProduct: (product: Product) => Promise<Response>;
  updateCategory: (category: ProductCategory) => Promise<Response>;
  updateBrand: (brand: ProductBrand) => Promise<Response>;
  deleteProduct: (productId: string) => Promise<Response>;
}

const ProductContext = createContext<ProductContextType | undefined>(undefined);

export function ProductProvider({ children }: { children: React.ReactNode }) {
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<ProductCategory[]>([]);
  const [brands, setBrands] = useState<ProductBrand[]>([]);

  const addProduct = async (product: Product) => {
    try {
      const docRef = doc(collection(firestore, "products"));
      await setDoc(docRef, {
        ...product,
        id: docRef.id,
      });
      setProducts([...products, { ...product, id: docRef.id }]);
      return { success: true, message: "Sản phẩm đã được thêm thành công" };
    } catch (error) {
      console.error("Failed to add product", error);
      return { success: false, message: "Sản phẩm đã được thêm thành công" };
    }
  };
  const addCategory = async (category: ProductCategory) => {
    try {
      const docRef = doc(collection(firestore, "categories"));
      await setDoc(docRef, {
        ...category,
        id: docRef.id,
      });
      setCategories([...categories, { ...category, id: docRef.id }]);
      return { success: true, message: "Thêm danh mục thành công" };
    } catch (error) {
      console.error("Failed to add category", error);
      return { success: false, message: "Thêm danh mục thất bại" };
    }
  };
  const addBrand = async (brand: ProductBrand) => {
    try {
      const docRef = doc(collection(firestore, "brands"));
      await setDoc(docRef, {
        ...brand,
        id: docRef.id,
      });
      setBrands([...brands, { ...brand, id: docRef.id }]);
      return { success: true, message: "Thêm thương hiệu thành công" };
    } catch (error) {
      console.error("Failed to add brand", error);
      return { success: false, message: "Thêm thương hiệu thất bại" };
    }
  };
  const getProducts = async () => {
    try {
      const querySnapshot = await getDocs(collection(firestore, "products"));
      const products = querySnapshot.docs.map((doc) => doc.data() as Product);
      setProducts(products);
      return { success: true, message: "Lấy sản phẩm thành công" };
    } catch (error) {
      console.error("Failed to get products", error);
      return { success: false, message: "Lấy sản phẩm thất bại" };
    }
  };
  const getCategories = async () => {
    try {
      const querySnapshot = await getDocs(collection(firestore, "categories"));
      const categories = querySnapshot.docs.map(
        (doc) => doc.data() as ProductCategory
      );
      setCategories(categories);
      return { success: true, message: "Lấy danh mục thành công" };
    } catch (error) {
      console.error("Failed to get categories", error);
      return { success: false, message: "Lấy danh mục thất bại" };
    }
  };
  const getBrands = async () => {
    try {
      const querySnapshot = await getDocs(collection(firestore, "brands"));
      const brands = querySnapshot.docs.map(
        (doc) => doc.data() as ProductBrand
      );
      setBrands(brands);
      return { success: true, message: "Lấy thương hiệu thành công" };
    } catch (error) {
      console.error("Failed to get brands", error);
      return { success: false, message: "Lấy thương hiệu thất bại" };
    }
  };
  const updateProduct = async (product: Partial<Product>) => {
    try {
      const docRef = doc(firestore, "products", product.id!);
      const docSnap = await getDoc(docRef);
      if (docSnap.exists()) {
        await updateDoc(docRef, {
          ...product,
          updatedAt: new Date(),
        });
      }
      setProducts(
        products.map((p) =>
          p.id === product.id
            ? {
                ...p,
                ...product,
                updatedAt: new Date(),
              }
            : p
        )
      );
      return { success: true, message: "Cập nhật sản phẩm thành công" };
    } catch (error) {
      console.error("Failed to update product", error);
      return { success: false, message: "Cập nhật sản phẩm thất bại" };
    }
  };
  const updateCategory = async (category: Partial<ProductCategory>) => {
    try {
      const docRef = doc(firestore, "categories", category.id!);
      const docSnap = await getDoc(docRef);
      if (docSnap.exists()) {
        await updateDoc(docRef, {
          ...category,
          updatedAt: new Date(),
        });
      }
      setCategories(
        categories.map((c) =>
          c.id === category.id
            ? {
                ...c,
                ...category,
                updatedAt: new Date(),
              }
            : c
        )
      );
      return { success: true, message: "Cập nhật danh mục thành công" };
    } catch (error) {
      console.error("Failed to update category", error);
      return { success: false, message: "Cập nhật danh mục thất bại" };
    }
  };
  const updateBrand = async (brand: Partial<ProductBrand>) => {
    try {
      const docRef = doc(firestore, "brands", brand.id!);
      const docSnap = await getDoc(docRef);
      if (docSnap.exists()) {
        await updateDoc(docRef, {
          ...brand,
          updatedAt: new Date(),
        });
      }
      setBrands(
        brands.map((b) =>
          b.id === brand.id
            ? {
                ...b,
                ...brand,
                updatedAt: new Date(),
              }
            : b
        )
      );
      return { success: true, message: "Cập nhật thương hiệu thành công" };
    } catch (error) {
      console.error("Failed to update brand", error);
      return { success: false, message: "Cập nhật thương hiệu thất bại" };
    }
  };
  const deleteProduct = async (productId: string) => {
    try {
      const docRef = doc(firestore, "products", productId);
      await deleteDoc(docRef);
      setProducts(products.filter((product) => product.id !== productId));
      return { success: true, message: "Xóa sản phẩm thành công" };
    } catch (error) {
      console.error("Failed to delete product", error);
      return { success: false, message: "Xóa sản phẩm thất bại" };
    }
  };

  return (
    <ProductContext.Provider
      value={{
        products,
        categories,
        brands,
        addProduct,
        addCategory,
        addBrand,
        getProducts,
        getCategories,
        getBrands,
        updateProduct,
        updateCategory,
        updateBrand,
        deleteProduct,
      }}
    >
      {children}
    </ProductContext.Provider>
  );
}

export function useProduct() {
  const context = useContext(ProductContext);
  if (context === undefined) {
    throw new Error("useProduct must be used within a ProductProvider");
  }
  return context;
}
