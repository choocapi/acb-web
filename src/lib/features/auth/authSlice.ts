import { User } from "@/types/user";
import { createSlice, isAnyOf, PayloadAction } from "@reduxjs/toolkit";
import {
  login,
  loginWithGoogle,
  logout,
  signUp,
  updateUser,
} from "./authThunks";

interface AuthState {
  user: User | null;
  role: string;
  loading: boolean;
  error: string | null;
}

const initialState: AuthState = {
  user: null,
  role: "",
  loading: false,
  error: null,
};

export const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    setUser: (state, action: PayloadAction<User>) => {
      state.user = action.payload;
      state.role = action.payload.role;
      state.error = null;
    },
    setRole: (state, action: PayloadAction<string>) => {
      state.role = action.payload;
      state.error = null;
    },
    resetAuth: (state) => {
      state.user = null;
      state.role = "";
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(signUp.fulfilled, (state, action) => {
        if (action.payload.success) {
          state.loading = false;
          state.error = null;
        }
      })
      .addCase(logout.fulfilled, (state) => {
        state.user = null;
        state.role = "";
        state.loading = false;
        state.error = null;
      })
      .addMatcher(
        isAnyOf(
          login.pending,
          loginWithGoogle.pending,
          signUp.pending,
          logout.pending,
          updateUser.pending
        ),
        (state) => {
          state.loading = true;
          state.error = null;
        }
      )
      .addMatcher(
        isAnyOf(
          login.fulfilled,
          loginWithGoogle.fulfilled,
          updateUser.fulfilled
        ),
        (state, action) => {
          if (action.payload.success && action.payload.data) {
            state.user = action.payload.data;
            state.role = action.payload.data.role;
            state.loading = false;
            state.error = null;
          }
        }
      )
      .addMatcher(
        isAnyOf(
          login.rejected,
          loginWithGoogle.rejected,
          signUp.rejected,
          logout.rejected,
          updateUser.rejected
        ),
        (state, action) => {
          state.loading = false;
          state.error = action.payload?.message || null;
        }
      );
  },
});

export const { setUser, setRole, resetAuth } = authSlice.actions;
export default authSlice.reducer;
