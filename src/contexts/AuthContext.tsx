"use client";

import { createContext, useContext, useState, useEffect, ReactNode } from "react";

interface AuthContextType {
  isLoggedIn: boolean;
  userName: string;
  userEmail: string;
  token: string | null;
  login: (name: string, email: string, token: string) => void;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(false);
  const [userName, setUserName] = useState<string>("");
  const [userEmail, setUserEmail] = useState<string>("");
  const [token, setToken] = useState<string | null>(null);

  // ✅ Load from localStorage on first render
  useEffect(() => {
    const storedLogin = localStorage.getItem("isLoggedIn") === "true";
    const storedName = localStorage.getItem("userName") || "";
    const storedEmail = localStorage.getItem("userEmail") || "";
    const storedToken = localStorage.getItem("token");

    setIsLoggedIn(storedLogin);
    setUserName(storedName);
    setUserEmail(storedEmail);
    setToken(storedToken);
  }, []);

  // ✅ Login and store token
  const login = (name: string, email: string, token: string) => {
    setIsLoggedIn(true);
    setUserName(name);
    setUserEmail(email);
    setToken(token);

    localStorage.setItem("isLoggedIn", "true");
    localStorage.setItem("userName", name);
    localStorage.setItem("userEmail", email);
    localStorage.setItem("token", token);
  };

  // ✅ Logout and clear everything
  const logout = () => {
    setIsLoggedIn(false);
    setUserName("");
    setUserEmail("");
    setToken(null);

    localStorage.removeItem("isLoggedIn");
    localStorage.removeItem("userName");
    localStorage.removeItem("userEmail");
    localStorage.removeItem("token");
  };

  return (
    <AuthContext.Provider value={{ isLoggedIn, userName, userEmail, token, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

// ✅ Custom hook for consuming the context
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error("useAuth must be used within AuthProvider");
  return context;
};
