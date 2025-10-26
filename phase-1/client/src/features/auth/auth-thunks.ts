import { createAsyncThunk } from "@reduxjs/toolkit";
import type { LoginError, LoginResponse } from "./types";

export const loginThunk = createAsyncThunk<
  LoginResponse, // return type on success
  { username: string; password: string }, // argument type
  { rejectValue: LoginError } // type for rejectWithValue
>("auth/loginThunk", async ({ username, password }, { rejectWithValue }) => {
  try {
    // TODO: Replace this with real API call
    const res = await Promise.resolve({
      username,
      role: "student" as const,
      token: "fake-jwt-token" + password,
    });

    localStorage.setItem("username", res.username);
    localStorage.setItem("role", res.role);
    localStorage.setItem("token", res.token);

    return res;
  } catch (err: any) {
    return rejectWithValue(err.message);
  }
});
