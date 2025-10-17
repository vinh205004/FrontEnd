import { createContext, useContext, useState } from "react";
import type { ReactNode } from "react";
import { loginUser, registerUser } from "../../services/authService";



interface User {
  name: string;
  email: string;
}

interface AuthContextType {
  user: User | null;
  login: (email: string, password: string) => Promise<void>;
  register: (name: string, email: string, password: string) => Promise<void>;
  logout: () => void;
  isAuthModalOpen: boolean;
  setIsAuthModalOpen: (open: boolean) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);

  const login = async (email: string, password: string) => {
    try {
      const result = await loginUser(email, password);
      if (result.success) {
        setUser({ name: "Người dùng", email });
        setIsAuthModalOpen(false);
      } else {
        throw new Error(result.message);
      }
    } catch (error) {
      console.error("Login error:", error);
      throw error;
    }
  };

  const register = async (name: string, email: string, password: string) => {
    try {
      const result = await registerUser(name, password);
      if (result.success) {
        setUser({ name, email });
        setIsAuthModalOpen(false);
      } else {
        throw new Error(result.message);
      }
    } catch (error) {
      console.error("Register error:", error);
      throw error;
    }
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
