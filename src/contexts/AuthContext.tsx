import React, { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { User } from "@/lib/mock-api";

interface AuthContextType {
  user: User | null;
  login: (user: User) => void;
  logout: () => void;
  isAuthenticated: boolean;
}

const AuthContext = createContext<AuthContextType | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    const stored = localStorage.getItem("collab-user");
    if (stored) {
      try { setUser(JSON.parse(stored)); } catch { /* ignore */ }
    }
  }, []);

  const login = (u: User) => {
    setUser(u);
    localStorage.setItem("collab-user", JSON.stringify(u));
    localStorage.setItem("collab-token", u.token);
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem("collab-user");
    localStorage.removeItem("collab-token");
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, isAuthenticated: !!user }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}
