import { createAsyncThunk } from "@reduxjs/toolkit";
import type { LoginError, LoginResponse, SignupRequest, SignupResponse, Role, CurrentUserResponse } from "./types";
import { apiFetch } from "../../utils/api";

const AUTH_BASE_URL = "http://localhost:8080/api/auth";

export const loginThunk = createAsyncThunk<
  { username: string; role: Role; token: string; fullName?: string },
  { username: string; password: string },
  { rejectValue: LoginError }
>("auth/loginThunk", async ({ username, password }, { rejectWithValue }) => {
  try {
    const res = (await apiFetch(`${AUTH_BASE_URL}/login`, {
      method: "POST",
      body: JSON.stringify({ username, password }),
    })) as LoginResponse;

    localStorage.setItem("token", res.token);
    localStorage.setItem("tokenType", res.tokenType);

    const me = (await apiFetch(`${AUTH_BASE_URL}/me`)) as CurrentUserResponse;

    return {
      username: me.username,
      role: me.role,
      token: res.token,
      fullName: me.fullName,
    };
  } catch (err: any) {
    return rejectWithValue(err?.message || "Login failed");
  }
});

export const signupThunk = createAsyncThunk<
  { username: string; role: Role; token: string; fullName?: string },
  SignupRequest,
  { rejectValue: LoginError }
>("auth/signupThunk", async (data, { rejectWithValue }) => {
  try {
    const res = (await apiFetch(`${AUTH_BASE_URL}/signup`, {
      method: "POST",
      body: JSON.stringify(data),
    })) as SignupResponse;

    localStorage.setItem("token", res.token);
    localStorage.setItem("tokenType", res.tokenType);

    const me = (await apiFetch(`${AUTH_BASE_URL}/me`)) as CurrentUserResponse;

    return {
      username: me.username,
      role: me.role,
      token: res.token,
      fullName: me.fullName,
    };
  } catch (err: any) {
    return rejectWithValue(err?.message || "Signup failed");
  }
});

export const fetchCurrentUserThunk = createAsyncThunk<
  { username: string; role: Role; fullName?: string },
  void,
  { rejectValue: LoginError }
>("auth/fetchCurrentUser", async (_, { rejectWithValue }) => {
  try {
    const token = localStorage.getItem("token");
    if (!token) {
      return rejectWithValue("No token found");
    }
    const me = (await apiFetch(`${AUTH_BASE_URL}/me`)) as CurrentUserResponse;
    return { username: me.username, role: me.role, fullName: me.fullName };
  } catch (err: any) {
    return rejectWithValue(err?.message || "Failed to fetch user");
  }
});
