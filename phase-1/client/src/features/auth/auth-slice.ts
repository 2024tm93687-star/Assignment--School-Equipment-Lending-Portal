import { createSlice } from "@reduxjs/toolkit";
import { loginThunk } from "./auth-thunks";
import type { AuthState } from "./types";
import type { PayloadAction } from "@reduxjs/toolkit";

const token = localStorage.getItem("token");

const initialState: AuthState = {
  username: localStorage.getItem("username"),
  role: (localStorage.getItem("role") as AuthState["role"]) || null,
  token: token,
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
      localStorage.removeItem("username");
      localStorage.removeItem("role");
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
        (state, action: PayloadAction<{ username: string; role: AuthState["role"]; token: string }>) => {
          state.loading = false;
          state.username = action.payload.username;
          state.role = action.payload.role;
          state.token = action.payload.token;
          state.isAuthenticated = true;
        }
      )
      .addCase(loginThunk.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  },
});

export const { logout } = authSlice.actions;
export default authSlice.reducer;
