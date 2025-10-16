import React, { createContext, useContext, useState } from "react";
import type { ReactNode } from "react";



interface User {
  name: string;
  email: string;
}

interface AuthContextType {
  user: User | null;
  login: (email: string, password: string) => void;
  register: (name: string, email: string, password: string) => void;
  logout: () => void;
  isAuthModalOpen: boolean;
  setIsAuthModalOpen: (open: boolean) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);

  const login = (email: string, password: string) => {
    console.log("Logging in:", email, password);
    setUser({ name: "Người dùng", email });
    setIsAuthModalOpen(false);
  };

  const register = (name: string, email: string, password: string) => {
    console.log("Registering:", name, email, password);
    setUser({ name, email });
    setIsAuthModalOpen(false);
  };

  const logout = () => setUser(null);

  return (
    <AuthContext.Provider
      value={{ user, login, register, logout, isAuthModalOpen, setIsAuthModalOpen }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
};
