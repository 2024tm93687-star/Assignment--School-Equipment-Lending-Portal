import { createSlice } from "@reduxjs/toolkit";
import { loginThunk, signupThunk, fetchCurrentUserThunk } from "./auth-thunks";
import type { AuthState } from "./types";
import type { PayloadAction } from "@reduxjs/toolkit";

const token = localStorage.getItem("token");

const initialState: AuthState = {
  username: null,
  role: null,
  token: token,
  fullName: null,
  isAuthenticated: !!token,
  loading: false,
  error: null,
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    logout: (state) => {
      state.username = null;
      state.role = null;
      state.token = null;
      state.isAuthenticated = false;
      localStorage.removeItem("token");
      localStorage.removeItem("tokenType");
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(loginThunk.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(
        loginThunk.fulfilled,
        (state, action: PayloadAction<{ username: string; role: AuthState["role"]; token: string; fullName?: string }>) => {
          state.loading = false;
          state.username = action.payload.username;
          state.role = action.payload.role;
          state.token = action.payload.token;
          state.fullName = action.payload.fullName;
          state.isAuthenticated = true;
        }
      )
      .addCase(loginThunk.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      .addCase(signupThunk.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(
        signupThunk.fulfilled,
        (state, action: PayloadAction<{ username: string; role: AuthState["role"]; token: string; fullName?: string }>) => {
          state.loading = false;
          state.username = action.payload.username;
          state.role = action.payload.role;
          state.token = action.payload.token;
          state.fullName = action.payload.fullName;
          state.isAuthenticated = true;
        }
      )
      .addCase(signupThunk.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      .addCase(fetchCurrentUserThunk.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(
        fetchCurrentUserThunk.fulfilled,
        (state, action: PayloadAction<{ username: string; role: AuthState["role"]; fullName?: string }>) => {
          state.loading = false;
          state.username = action.payload.username;
          state.role = action.payload.role;
          state.fullName = action.payload.fullName;
          state.isAuthenticated = !!state.token;
        }
      )
      .addCase(fetchCurrentUserThunk.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  },
});

export const { logout } = authSlice.actions;
export default authSlice.reducer;
