import { firestore } from "@/lib/firebase";
import { Category } from "@/types/product";
import { Response } from "@/types/response";
import { createAsyncThunk } from "@reduxjs/toolkit";
import {
  collection,
  deleteDoc,
  doc,
  getDoc,
  getDocs,
  setDoc,
  updateDoc,
} from "firebase/firestore";

export const addCategory = createAsyncThunk<
  Response,
  { category: Category },
  { rejectValue: Response }
>("category/addCategory", async ({ category }, thunkAPI) => {
  try {
    const docRef = doc(collection(firestore, "categories"));
    const newCategory = { ...category, id: docRef.id };
    await setDoc(docRef, newCategory);

    return {
      success: true,
      message: "Thêm danh mục thành công",
      data: {
        ...newCategory,
        createdAt: newCategory.createdAt.toISOString(),
        updatedAt: newCategory.updatedAt.toISOString(),
      },
    };
  } catch (error: any) {
    return thunkAPI.rejectWithValue({
      success: false,
      message: "Thêm danh mục thất bại",
    });
  }
});

export const getCategories = createAsyncThunk<
  Response,
  void,
  { rejectValue: Response }
>("category/getCategories", async (_, thunkAPI) => {
  try {
    const querySnapshot = await getDocs(collection(firestore, "categories"));
    const categories: Category[] = querySnapshot.docs.map((doc) => {
      const data = doc.data();
      return {
        ...data,
        createdAt: data.createdAt.toDate().toISOString(),
        updatedAt: data.updatedAt.toDate().toISOString(),
      } as Category;
    });

    return {
      success: true,
      message: "Lấy danh sách danh mục thành công",
      data: categories,
    };
  } catch (error: any) {
    return thunkAPI.rejectWithValue({
      success: false,
      message: "Lấy danh sách danh mục thất bại",
    });
  }
});

export const updateCategory = createAsyncThunk<
  Response,
  { category: Partial<Category> },
  { rejectValue: Response }
>("category/updateCategory", async ({ category }, thunkAPI) => {
  try {
    if (!category.id) {
      return thunkAPI.rejectWithValue({
        success: false,
        message: "Bắt buộc phải có id danh mục",
      });
    }

    const docRef = doc(firestore, "categories", category.id);
    const docSnap = await getDoc(docRef);
    if (!docSnap.exists()) {
      return thunkAPI.rejectWithValue({
        success: false,
        message: "Danh mục không tồn tại",
      });
    }

    const updatedCategory = { ...category, updatedAt: new Date() };
    await updateDoc(docRef, updatedCategory);

    return {
      success: true,
      message: "Cập nhật danh mục thành công",
      data: {
        ...updatedCategory,
        createdAt: updatedCategory.createdAt?.toISOString(),
        updatedAt: updatedCategory.updatedAt?.toISOString(),
      },
    };
  } catch (error: any) {
    return thunkAPI.rejectWithValue({
      success: false,
      message: "Cập nhật danh mục thất bại",
    });
  }
});

export const deleteCategory = createAsyncThunk<
  Response,
  { categoryId: string },
  { rejectValue: Response }
>("category/deleteCategory", async ({ categoryId }, thunkAPI) => {
  try {
    const docRef = doc(firestore, "categories", categoryId);
    const docSnap = await getDoc(docRef);
    if (!docSnap.exists()) {
      return thunkAPI.rejectWithValue({
        success: false,
        message: "Danh mục không tồn tại",
      });
    }

    await deleteDoc(docRef);

    return {
      success: true,
      message: "Xóa danh mục thành công",
      data: categoryId,
    };
  } catch (error: any) {
    return thunkAPI.rejectWithValue({
      success: false,
      message: "Xóa danh mục thất bại",
    });
  }
});
