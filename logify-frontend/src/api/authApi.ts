import axiosInstance from "./axiosInstance";
import type { LoginRequest, RegisterRequest, AuthResponse } from "../types/auth";

export const loginUser = async (data: LoginRequest): Promise<AuthResponse> => {
  const response = await axiosInstance.post<AuthResponse>("/auth/login", data);
  return response.data;
};

export const registerUser = async (data: RegisterRequest) => {
  const response = await axiosInstance.post("/auth/register", data);
  return response.data;
};