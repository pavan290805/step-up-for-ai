"use client";

import React, { createContext, useContext, useEffect, useState, useCallback } from "react";
import { useRouter } from "next/navigation";

export interface User {
  id: string;
  email: string;
  role: "student" | "recruiter" | "mentor" | "investor" | "admin" | "super_admin";
  status: "pending" | "active" | "suspended" | "banned";
  emailVerified: boolean;
  twoFactorEnabled: boolean;
}

interface AuthContextType {
  user: User | null;
  loading: boolean;
  login: (credentials: { email: string; password: string; twoFactorCode?: string }) => Promise<void>;
  logout: () => Promise<void>;
  refreshUser: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

interface AuthResponse {
  success: boolean;
  data?: { user: User };
  message?: string;
  error?: { message?: string };
}

async function fetchCurrentUser(): Promise<User | null> {
  const response = await fetch("/api/v1/auth/me");
  const data: AuthResponse = await response.json();
  if (response.status === 401) return null;
  if (!response.ok || !data.success || !data.data?.user) {
    throw new Error(data.error?.message || data.message || "Unable to restore the current session.");
  }
  return data.data.user;
}

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  const refreshUser = useCallback(async () => {
    try {
      setUser(await fetchCurrentUser());
    } catch (error) {
      if (error instanceof Error && error.message !== "Failed to fetch") {
        console.error("Unable to restore the current session.", error);
      }
      setUser(null);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    let active = true;
    void fetchCurrentUser()
      .then((currentUser) => {
        if (active) setUser(currentUser);
      })
      .catch((error: unknown) => {
        if (active) {
          if (!(error instanceof Error) || error.message !== "Failed to fetch") {
            console.error("Unable to restore the current session.", error);
          }
          setUser(null);
        }
      })
      .finally(() => {
        if (active) setLoading(false);
      });
    return () => {
      active = false;
    };
  }, []);

  const login = async (credentials: { email: string; password: string; twoFactorCode?: string }) => {
    const res = await fetch("/api/v1/auth/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(credentials),
    });
    const data = await res.json();
    if (data.success) {
      if (data.data.requiresTwoFactor) {
         throw new Error("2FA_REQUIRED");
      }
      setUser(data.data.user);
      router.push(`/${data.data.user.role}/dashboard`);
    } else {
      throw new Error(data.message || "Login failed");
    }
  };

  const logout = async () => {
    const response = await fetch("/api/v1/auth/logout", { method: "POST" });
    const data = await response.json();
    if (!response.ok || !data.success) {
      throw new Error(data.message || "Sign out failed");
    }
    setUser(null);
    router.push("/auth/login");
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, logout, refreshUser }}>
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
