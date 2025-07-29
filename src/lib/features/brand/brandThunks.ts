import { firestore } from "@/lib/firebase";
import { Brand } from "@/types/product";
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

export const addBrand = createAsyncThunk<
  Response,
  { brand: Brand },
  { rejectValue: Response }
>("brand/addBrand", async ({ brand }, thunkAPI) => {
  try {
    const docRef = doc(collection(firestore, "brands"));
    const newBrand = { ...brand, id: docRef.id };
    await setDoc(docRef, newBrand);

    return {
      success: true,
      message: "Thêm thương hiệu thành công",
      data: {
        ...newBrand,
        createdAt: newBrand.createdAt.toISOString(),
        updatedAt: newBrand.updatedAt.toISOString(),
      },
    };
  } catch (error: any) {
    return thunkAPI.rejectWithValue({
      success: false,
      message: "Thêm thương hiệu thất bại",
    });
  }
});

export const getBrands = createAsyncThunk<
  Response,
  void,
  { rejectValue: Response }
>("brand/getBrands", async (_, thunkAPI) => {
  try {
    const querySnapshot = await getDocs(collection(firestore, "brands"));
    const brands: Brand[] = querySnapshot.docs.map((doc) => {
      const data = doc.data();
      return {
        ...data,
        createdAt: data.createdAt.toDate().toISOString(),
        updatedAt: data.updatedAt.toDate().toISOString(),
      } as Brand;
    });

    return {
      success: true,
      message: "Lấy danh sách thương hiệu thành công",
      data: brands,
    };
  } catch (error: any) {
    return thunkAPI.rejectWithValue({
      success: false,
      message: "Lấy danh sách thương hiệu thất bại",
    });
  }
});

export const updateBrand = createAsyncThunk<
  Response,
  { brand: Partial<Brand> },
  { rejectValue: Response }
>("brand/updateBrand", async ({ brand }, thunkAPI) => {
  try {
    if (!brand.id) {
      return thunkAPI.rejectWithValue({
        success: false,
        message: "Bắt buộc phải có id thương hiệu",
      });
    }

    const docRef = doc(firestore, "brands", brand.id);
    const docSnap = await getDoc(docRef);
    if (!docSnap.exists()) {
      return thunkAPI.rejectWithValue({
        success: false,
        message: "Thương hiệu không tồn tại",
      });
    }

    const updatedBrand = { ...brand, updatedAt: new Date() };
    await updateDoc(docRef, updatedBrand);

    return {
      success: true,
      message: "Cập nhật thương hiệu thành công",
      data: {
        ...updatedBrand,
        createdAt: updatedBrand.createdAt?.toISOString(),
        updatedAt: updatedBrand.updatedAt?.toISOString(),
      },
    };
  } catch (error: any) {
    return thunkAPI.rejectWithValue({
      success: false,
      message: "Cập nhật thương hiệu thất bại",
    });
  }
});

export const deleteBrand = createAsyncThunk<
  Response,
  { brandId: string },
  { rejectValue: Response }
>("brand/deleteBrand", async ({ brandId }, thunkAPI) => {
  try {
    const docRef = doc(firestore, "brands", brandId);
    const docSnap = await getDoc(docRef);
    if (!docSnap.exists()) {
      return thunkAPI.rejectWithValue({
        success: false,
        message: "Thương hiệu không tồn tại",
      });
    }

    await deleteDoc(docRef);

    return {
      success: true,
      message: "Xóa thương hiệu thành công",
      data: brandId,
    };
  } catch (error: any) {
    return thunkAPI.rejectWithValue({
      success: false,
      message: "Xóa thương hiệu thất bại",
    });
  }
});
