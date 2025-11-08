type Role = "STUDENT" | "STAFF" | "ADMIN";

interface AuthState {
  username: string | null;
  role: Role | null;
  token: string | null;
  fullName?: string | null;
  isAuthenticated: boolean;
  loading: boolean;
  error: string | null;
}

interface LoginResponse {
  token: string;
  tokenType: string;
  userId: number;
  username: string;
  fullName?: string;
  email?: string;
  role: Role;
  department?: string;
  roleDescription?: string;
  message?: string;
}

type LoginError = string;

interface SignupRequest {
  username: string;
  password: string;
  fullName: string;
  email: string;
  role: Role;
  department: string;
}

type SignupResponse = LoginResponse;

interface CurrentUserResponse {
  userId: number;
  username: string;
  fullName?: string;
  email?: string;
  role: Role;
  department?: string;
  active?: boolean;
  roleDescription?: string;
  createdAt?: string;
}

export type { AuthState , LoginResponse, LoginError, SignupRequest, SignupResponse, Role, CurrentUserResponse };