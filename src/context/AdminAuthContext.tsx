import React, { createContext, useContext, useState } from 'react';
import { useLoginAdminMutation } from '@/store/api';

interface AuthContextType {
  isAuthenticated: boolean;
  token: string | null;
  adminEmail: string | null;
  login: (email: string, pass: string) => Promise<boolean>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType>({
  isAuthenticated: false,
  token: null,
  adminEmail: null,
  login: async () => false,
  logout: () => {},
});

const isTokenValid = (token: string | null): boolean => {
  if (!token) return false;
  try {
    const parts = token.split('.');
    if (parts.length < 2) return false;
    const payload = JSON.parse(atob(parts[1]));
    if (payload.exp && payload.exp * 1000 < Date.now()) {
      return false; // Token expired
    }
    return true;
  } catch {
    return true;
  }
};

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [token, setToken] = useState<string | null>(() => {
    const saved = localStorage.getItem('adminToken');
    if (isTokenValid(saved)) return saved;
    localStorage.removeItem('adminToken');
    localStorage.removeItem('adminEmail');
    return null;
  });

  const [adminEmail, setAdminEmail] = useState<string | null>(() => {
    return localStorage.getItem('adminEmail') || null;
  });

  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(() => !!token);

  const [loginAdmin] = useLoginAdminMutation();

  const login = async (email: string, pass: string) => {
    try {
      const response = await loginAdmin({ email, password: pass }).unwrap();
      if (response?.token) {
        setIsAuthenticated(true);
        setToken(response.token);
        const userEmail = response.user || email;
        setAdminEmail(userEmail);
        localStorage.setItem('adminToken', response.token);
        localStorage.setItem('adminEmail', userEmail);
        return true;
      }
      return false;
    } catch (err) {
      console.error("Login failed:", err);
      return false;
    }
  };

  const logout = () => {
    setIsAuthenticated(false);
    setToken(null);
    setAdminEmail(null);
    localStorage.removeItem('adminToken');
    localStorage.removeItem('adminEmail');
  };

  return (
    <AuthContext.Provider value={{ isAuthenticated, token, adminEmail, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAdminAuth = () => useContext(AuthContext);
