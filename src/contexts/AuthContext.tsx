"use client";

import { createContext, useContext, useState, useEffect, ReactNode } from "react";
import axios from "axios";

interface UserProfile {
  id: string;
  fullname: string;
  email: string;
  phone_number: string;
  role: string;
  location?: string;
  enrolled_courses?: string[];
  name?: string;
}

interface AuthContextType {
  isLoggedIn: boolean;
  token: string | null;
  user: UserProfile | null;
  loading: boolean;
  login: (token: string) => Promise<void>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);
const API_BASE = process.env.NEXT_PUBLIC_API_URL || "http://127.0.0.1:8000";

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [token, setToken] = useState<string | null>(null);
  const [user, setUser] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);

  // ✅ Safe localStorage access (browser only)
  useEffect(() => {
    if (typeof window === "undefined") return;

    const storedToken = localStorage.getItem("token");
    const storedUser = localStorage.getItem("user");

    if (storedToken) {
      setToken(storedToken);
      setIsLoggedIn(true);

      if (storedUser) {
        try {
          setUser(JSON.parse(storedUser));
        } catch {
          localStorage.removeItem("user");
        }
      }

      fetchUserProfile(storedToken).finally(() => setLoading(false));
    } else {
      setLoading(false);
    }
  }, []);

  const fetchUserProfile = async (authToken: string) => {
    try {
      const res = await axios.get(`${API_BASE}/api/users/profile/`, {
        headers: { Authorization: `Bearer ${authToken}` },
      });
      setUser(res.data.profile);
      if (typeof window !== "undefined")
        localStorage.setItem("user", JSON.stringify(res.data.profile));
    } catch (err) {
      console.error("Error fetching user profile:", err);
      logout();
    }
  };

  const login = async (authToken: string) => {
    setIsLoggedIn(true);
    setToken(authToken);
    if (typeof window !== "undefined") {
      localStorage.setItem("isLoggedIn", "true");
      localStorage.setItem("token", authToken);
    }
    await fetchUserProfile(authToken);
  };

  const logout = () => {
    setIsLoggedIn(false);
    setToken(null);
    setUser(null);
    if (typeof window !== "undefined") localStorage.clear();
  };

  return (
    <AuthContext.Provider value={{ isLoggedIn, token, user, loading, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

// ✅ Custom hook
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error("useAuth must be used within AuthProvider");
  return context;
};
