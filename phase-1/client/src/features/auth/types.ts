type Role = "student" | "staff" | "admin";

interface AuthState {
  username: string | null;
  role: Role | null;
  token: string | null;
  isAuthenticated: boolean;
  loading: boolean;
  error: string | null;
}

interface LoginResponse {
  username: string;
  role: Role;
  token: string;
}

type LoginError = string;

export type { AuthState , LoginResponse, LoginError };