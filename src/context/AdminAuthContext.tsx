import React, { createContext, useContext, useState } from 'react';

interface AuthContextType {
  isAuthenticated: boolean;
  login: (email: string, pass: string) => Promise<boolean>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType>({
  isAuthenticated: false,
  login: async () => false,
  logout: () => {},
});

import { useLoginAdminMutation } from '@/store/api';

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(() => {
    // Check local storage on initial load
    return !!localStorage.getItem('adminToken');
  });

  const [loginAdmin] = useLoginAdminMutation();

  const login = async (email: string, pass: string) => {
    try {
      const response = await loginAdmin({ email, password: pass }).unwrap();
      if (response?.token) {
        setIsAuthenticated(true);
        localStorage.setItem('adminToken', response.token);
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
    localStorage.removeItem('adminToken');
  };

  return (
    <AuthContext.Provider value={{ isAuthenticated, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAdminAuth = () => useContext(AuthContext);
