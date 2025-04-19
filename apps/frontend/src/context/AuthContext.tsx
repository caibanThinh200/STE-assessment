"use client";

import type React from "react";
import { createContext, useState, useEffect, useContext } from "react";
import type { User } from "@/types";
import { login, register, getCurrentUser } from "../api/auth";
import { useCookies } from "react-cookie";

interface AuthContextType {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
  login: (email: string, password: string) => Promise<void>;
  register: (name: string, email: string, password: string) => Promise<void>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [cookie, setCookie] = useCookies(["access_token"]);

  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // Check if user is already logged in
    const storedToken = cookie.access_token;
    if (storedToken) {
      setToken(storedToken);
      getCurrentUser()
        .then((userData) => {
          setUser(userData);
        })
        .catch(() => {
          // If token is invalid, clear it
          cookie.access_token;
          setToken(null);
        })
        .finally(() => {
          setIsLoading(false);
        });
    } else {
      setIsLoading(false);
    }
  }, []);

  const loginUser = async (email: string, password: string) => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await login(email, password);
      setUser(response.user);
      setToken(response.accessToken);
      setCookie("access_token", response.accessToken);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Login failed");
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  const registerUser = async (
    name: string,
    email: string,
    password: string
  ) => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await register(name, email, password);
      setUser(response.user);
      setToken(response.accessToken);
      localStorage.setItem("token", response.accessToken);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Registration failed");
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  const logout = () => {
    localStorage.removeItem("token");
    setUser(null);
    setToken(null);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        isAuthenticated: !!user,
        isLoading,
        error,
        login: loginUser,
        register: registerUser,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
