import { createAsyncThunk } from "@reduxjs/toolkit";
import type {
  LoginError,
  LoginResponse,
  SignupRequest,
  SignupResponse,
  Role,
  CurrentUserResponse,
} from "./types";
import { apiFetch } from "../../utils/api";
import { AUTH_SERVICE_URL } from "../../utils/api-constants";

export const loginThunk = createAsyncThunk<
  { username: string; role: Role; token: string; fullName?: string },
  { username: string; password: string },
  { rejectValue: LoginError }
>("auth/loginThunk", async ({ username, password }, { rejectWithValue }) => {
  try {
    const res = (await apiFetch(`${AUTH_SERVICE_URL}/login`, {
      method: "POST",
      body: JSON.stringify({ username, password }),
    })) as LoginResponse;

    sessionStorage.setItem("token", res.token);
    sessionStorage.setItem("tokenType", res.tokenType);

    const me = (await apiFetch(`${AUTH_SERVICE_URL}/me`)) as CurrentUserResponse;
    // persist username/role for components that read sessionStorage
    sessionStorage.setItem("role", me.role);
    sessionStorage.setItem("username", me.username);
    if (me.fullName) sessionStorage.setItem("fullName", me.fullName);

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
    const res = (await apiFetch(`${AUTH_SERVICE_URL}/signup`, {
      method: "POST",
      body: JSON.stringify(data),
    })) as SignupResponse;

    sessionStorage.setItem("token", res.token);
    sessionStorage.setItem("tokenType", res.tokenType);

    const me = (await apiFetch(`${AUTH_SERVICE_URL}/me`)) as CurrentUserResponse;
    // persist username/role for components that read sessionStorage
    sessionStorage.setItem("role", me.role);
    sessionStorage.setItem("username", me.username);
    if (me.fullName) sessionStorage.setItem("fullName", me.fullName);

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
    const token = sessionStorage.getItem("token");
    if (!token) {
      return rejectWithValue("No token found");
    }
    const me = (await apiFetch(
      `${AUTH_SERVICE_URL}/me`
    )) as CurrentUserResponse;
    // keep sessionStorage in sync
    sessionStorage.setItem("role", me.role);
    sessionStorage.setItem("username", me.username);
    if (me.fullName) sessionStorage.setItem("fullName", me.fullName);
    return { username: me.username, role: me.role, fullName: me.fullName };
  } catch (err: any) {
    return rejectWithValue(err?.message || "Failed to fetch user");
  }
});
