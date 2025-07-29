import { firestore } from "@/lib/firebase";
import { Product } from "@/types/product";
import { Response } from "@/types/response";
import { createAsyncThunk } from "@reduxjs/toolkit";
import {
  collection,
  deleteDoc,
  doc,
  getDoc,
  getDocs,
  query,
  setDoc,
  updateDoc,
  where,
} from "firebase/firestore";

export const addProduct = createAsyncThunk<
  Response,
  { product: Product },
  { rejectValue: Response }
>("product/addProduct", async ({ product }, thunkAPI) => {
  try {
    const docRef = doc(collection(firestore, "products"));
    const newProduct = { ...product, id: docRef.id };
    await setDoc(docRef, newProduct);

    return {
      success: true,
      message: "Thêm sản phẩm thành công",
      data: {
        ...newProduct,
        createdAt: newProduct.createdAt.toISOString(),
        updatedAt: newProduct.updatedAt.toISOString(),
      },
    };
  } catch (error: any) {
    return thunkAPI.rejectWithValue({
      success: false,
      message: "Thêm sản phẩm thất bại",
    });
  }
});

export const getProducts = createAsyncThunk<
  Response,
  { isActive: boolean },
  { rejectValue: Response }
>("product/getProducts", async ({ isActive = false }, thunkAPI) => {
  try {
    let querySnapshot;
    if (isActive) {
      querySnapshot = await getDocs(
        query(collection(firestore, "products"), where("isActive", "==", true))
      );
    } else {
      querySnapshot = await getDocs(collection(firestore, "products"));
    }
    const products: Product[] = querySnapshot.docs.map((doc) => {
      const data = doc.data();
      return {
        ...data,
        createdAt: data.createdAt.toDate().toISOString(),
        updatedAt: data.updatedAt.toDate().toISOString(),
      } as Product;
    });

    return {
      success: true,
      message: "Lấy danh sách sản phẩm thành công",
      data: products,
    };
  } catch (error: any) {
    return thunkAPI.rejectWithValue({
      success: false,
      message: "Lấy danh sách sản phẩm thất bại",
    });
  }
});

export const updateProduct = createAsyncThunk<
  Response,
  { product: Partial<Product> },
  { rejectValue: Response }
>("product/updateProduct", async ({ product }, thunkAPI) => {
  try {
    if (!product.id) {
      return thunkAPI.rejectWithValue({
        success: false,
        message: "Bắt buộc phải có id sản phẩm",
      });
    }

    const docRef = doc(firestore, "products", product.id);
    const docSnap = await getDoc(docRef);
    if (!docSnap.exists()) {
      return thunkAPI.rejectWithValue({
        success: false,
        message: "Sản phẩm không tồn tại",
      });
    }

    const updatedProduct = { ...product, updatedAt: new Date() };
    await updateDoc(docRef, updatedProduct);

    return {
      success: true,
      message: "Cập nhật sản phẩm thành công",
      data: {
        ...updatedProduct,
        createdAt: updatedProduct.createdAt?.toISOString(),
        updatedAt: updatedProduct.updatedAt?.toISOString(),
      },
    };
  } catch (error: any) {
    return thunkAPI.rejectWithValue({
      success: false,
      message: "Cập nhật sản phẩm thất bại",
    });
  }
});

export const deleteProduct = createAsyncThunk<
  Response,
  { productId: string },
  { rejectValue: Response }
>("product/deleteProduct", async ({ productId }, thunkAPI) => {
  try {
    const docRef = doc(firestore, "products", productId);
    const docSnap = await getDoc(docRef);
    if (!docSnap.exists()) {
      return thunkAPI.rejectWithValue({
        success: false,
        message: "Sản phẩm không tồn tại",
      });
    }

    await deleteDoc(docRef);

    return {
      success: true,
      message: "Xóa sản phẩm thành công",
      data: productId,
    };
  } catch (error: any) {
    return thunkAPI.rejectWithValue({
      success: false,
      message: "Xóa sản phẩm thất bại",
    });
  }
});
