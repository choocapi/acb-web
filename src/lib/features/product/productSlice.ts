import { Product } from "@/types/product";
import { createSlice, isAnyOf } from "@reduxjs/toolkit";
import {
  addProduct,
  deleteProduct,
  getProducts,
  updateProduct,
} from "./productThunks";

interface ProductState {
  products: Product[];
  loading: boolean;
  loadingForm: boolean;
  error: string | null;
}

const initialState: ProductState = {
  products: [],
  loading: false,
  loadingForm: false,
  error: null,
};

const productSlice = createSlice({
  name: "product",
  initialState,
  reducers: {
    clearProducts: (state) => {
      state.products = [];
      state.loading = false;
      state.loadingForm = false;
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(addProduct.fulfilled, (state, action) => {
        state.products = [...state.products, action.payload.data];
        state.loading = false;
        state.loadingForm = false;
        state.error = null;
      })
      .addCase(getProducts.fulfilled, (state, action) => {
        state.products = action.payload.data;
        state.loading = false;
        state.error = null;
      })
      .addCase(updateProduct.fulfilled, (state, action) => {
        state.products = state.products.filter(
          (product) => product.id !== action.payload.data.id
        );
        state.products = [...state.products, action.payload.data];
        state.loading = false;
        state.loadingForm = false;
        state.error = null;
      })
      .addCase(deleteProduct.fulfilled, (state, action) => {
        state.products = state.products.filter(
          (product) => product.id !== action.payload.data
        );
        state.loading = false;
        state.error = null;
      })
      .addMatcher(
        isAnyOf(getProducts.pending, deleteProduct.pending),
        (state) => {
          state.loading = true;
          state.error = null;
        }
      )
      .addMatcher(
        isAnyOf(getProducts.rejected, deleteProduct.rejected),
        (state, action) => {
          state.loading = false;
          state.error = action.payload?.message || null;
        }
      )
      .addMatcher(
        isAnyOf(addProduct.pending, updateProduct.pending),
        (state) => {
          state.loadingForm = true;
          state.error = null;
        }
      )
      .addMatcher(
        isAnyOf(addProduct.rejected, updateProduct.rejected),
        (state, action) => {
          state.loadingForm = false;
          state.error = action.payload?.message || null;
        }
      );
  },
});

export const { clearProducts } = productSlice.actions;
export default productSlice.reducer;
