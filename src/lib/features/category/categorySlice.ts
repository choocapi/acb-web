import { Category } from "@/types/product";
import { Response } from "@/types/response";
import { createSlice, isAnyOf } from "@reduxjs/toolkit";
import {
  addCategory,
  getCategories,
  updateCategory,
  deleteCategory,
} from "./categoryThunks";

interface CategoryState {
  categories: Category[];
  loading: boolean;
  error: string | null;
}

const initialState: CategoryState = {
  categories: [],
  loading: false,
  error: null,
};

const categorySlice = createSlice({
  name: "category",
  initialState,
  reducers: {
    clearCategories: (state) => {
      state.categories = [];
      state.loading = false;
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(addCategory.fulfilled, (state, action) => {
        state.categories = [...state.categories, action.payload.data];
        state.loading = false;
        state.error = null;
      })
      .addCase(getCategories.fulfilled, (state, action) => {
        state.categories = action.payload.data;
        state.loading = false;
        state.error = null;
      })
      .addCase(updateCategory.fulfilled, (state, action) => {
        state.categories = state.categories.filter(
          (category) => category.id !== action.payload.data.id
        );
        state.categories = [...state.categories, action.payload.data];
        state.loading = false;
        state.error = null;
      })
      .addCase(deleteCategory.fulfilled, (state, action) => {
        state.categories = state.categories.filter(
          (category) => category.id !== action.payload.data
        );
        state.loading = false;
        state.error = null;
      })
      .addMatcher(
        isAnyOf(
          addCategory.pending,
          getCategories.pending,
          updateCategory.pending,
          deleteCategory.pending
        ),
        (state) => {
          state.loading = true;
          state.error = null;
        }
      )
      .addMatcher(
        isAnyOf(
          addCategory.rejected,
          getCategories.rejected,
          updateCategory.rejected,
          deleteCategory.rejected
        ),
        (state, action) => {
          state.loading = false;
          state.error = (action.payload as Response).message || null;
        }
      );
  },
});

export const { clearCategories } = categorySlice.actions;
export default categorySlice.reducer;
