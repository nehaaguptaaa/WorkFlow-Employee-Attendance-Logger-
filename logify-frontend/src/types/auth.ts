export interface LoginRequest {
  email: string;
  password: string;
}

export interface AuthResponse {
  token: string;
  email: string;
  role: "ADMIN" | "EMPLOYEE";
}

export interface RegisterRequest {
  name: string;
  email: string;
  password: string;
  department: string;
}