import { Brand } from "@/types/product";
import { createSlice, isAnyOf } from "@reduxjs/toolkit";
import { addBrand, getBrands, updateBrand, deleteBrand } from "./brandThunks";
import { Response } from "@/types/response";

interface BrandState {
  brands: Brand[];
  loading: boolean;
  error: string | null;
}

const initialState: BrandState = {
  brands: [],
  loading: false,
  error: null,
};

const brandSlice = createSlice({
  name: "brand",
  initialState,
  reducers: {
    clearBrands: (state) => {
      state.brands = [];
      state.loading = false;
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(addBrand.fulfilled, (state, action) => {
        state.brands = [...state.brands, action.payload.data];
        state.loading = false;
        state.error = null;
      })
      .addCase(getBrands.fulfilled, (state, action) => {
        state.brands = action.payload.data;
        state.loading = false;
        state.error = null;
      })
      .addCase(updateBrand.fulfilled, (state, action) => {
        state.brands = state.brands.filter(
          (brand) => brand.id !== action.payload.data.id
        );
        state.brands = [...state.brands, action.payload.data];
        state.loading = false;
        state.error = null;
      })
      .addCase(deleteBrand.fulfilled, (state, action) => {
        state.brands = state.brands.filter(
          (brand) => brand.id !== action.payload.data
        );
        state.loading = false;
        state.error = null;
      })
      .addMatcher(
        isAnyOf(
          addBrand.pending,
          getBrands.pending,
          updateBrand.pending,
          deleteBrand.pending
        ),
        (state) => {
          state.loading = true;
          state.error = null;
        }
      )
      .addMatcher(
        isAnyOf(
          addBrand.rejected,
          getBrands.rejected,
          updateBrand.rejected,
          deleteBrand.rejected
        ),
        (state, action) => {
          state.loading = false;
          state.error = (action.payload as Response).message || null;
        }
      );
  },
});

export const { clearBrands } = brandSlice.actions;
export default brandSlice.reducer;
