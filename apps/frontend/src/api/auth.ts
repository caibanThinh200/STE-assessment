import api from "@/lib/api";
import { AuthResponse, User } from "@/types";
import axios from "axios";

export async function login(
  email: string,
  password: string
): Promise<AuthResponse> {
  try {
    const response = await api.post<AuthResponse>("/auth/login", {
      email,
      password,
    });
    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      throw new Error(error.response?.data?.message || "Login failed");
    }
    throw error;
  }
}

export async function register(
  name: string,
  email: string,
  password: string
): Promise<AuthResponse> {
  try {
    const response = await api.post<AuthResponse>("/auth/register", {
      name,
      email,
      password,
    });
    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      throw new Error(error.response?.data?.message || "Registration failed");
    }
    throw error;
  }
}

export async function getCurrentUser(): Promise<User> {
  try {
    // This is a placeholder - you'll need to create a /auth/me endpoint
    // For now, we'll decode the JWT to get the user info
    const result = await api.get("/auth/me");
    return result.data;
  } catch (error) {
    throw new Error("Failed to get current user");
  }
}
