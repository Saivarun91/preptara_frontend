

// "use client";

// import { createContext, useContext, useState, ReactNode } from "react";

// interface AuthContextType {
//   isLoggedIn: boolean;
//   userName: string | null;
//   userEmail: string | null;
//   token: string | null;
//   login: (name: string, email: string, token: string) => void;
//   logout: () => void;
// }

// const AuthContext = createContext<AuthContextType | undefined>(undefined);

// export const AuthProvider = ({ children }: { children: ReactNode }) => {
//   // ✅ Initialize from localStorage immediately
//   const [isLoggedIn, setIsLoggedIn] = useState(
//     () => localStorage.getItem("isLoggedIn") === "true"
//   );
//   const [userName, setUserName] = useState<string | null>(
//     () => localStorage.getItem("userName") || null
//   );
//   const [userEmail, setUserEmail] = useState<string | null>(
//     () => localStorage.getItem("userEmail") || null
//   );


//   // ✅ Login and persist
//   const login = (name: string, email: string, token: string) => {
//     setIsLoggedIn(true);
//     setUserName(name);
//     setUserEmail(email);
//     setToken(token);

//     localStorage.setItem("isLoggedIn", "true");
//     localStorage.setItem("userName", name);
//     localStorage.setItem("userEmail", email);
//     localStorage.setItem("token", token);
//   };

//   // ✅ Logout and clear
//   const logout = () => {
//     setIsLoggedIn(false);
//     setUserName(null);
//     setUserEmail(null);
//     setToken(null);

//     localStorage.removeItem("isLoggedIn");
//     localStorage.removeItem("userName");
//     localStorage.removeItem("userEmail");
//     localStorage.removeItem("token");
//   };

//   return (
//     <AuthContext.Provider
//       value={{ isLoggedIn, userName, userEmail, token, login, logout }}
//     >
//       {children}
//     </AuthContext.Provider>
//   );
// };

// // ✅ Hook to access auth state
// export const useAuth = () => {
//   const context = useContext(AuthContext);
//   if (!context) throw new Error("useAuth must be used within AuthProvider");
//   return context;
// };

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

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  // const [token, setToken] = useState<string | null>(null);
  const [user, setUser] = useState<UserProfile | null>(()=>localStorage.getItem("user") ? JSON.parse(localStorage.getItem("user") || "") : null);
  const [loading, setLoading] = useState(true); // 👈 controls initial delay
  const [token, setToken] = useState<string | null>(
    () => localStorage.getItem("token")
  );


  // ✅ Fetch user profile from backend
  const fetchUserProfile = async (authToken: string) => {
    try {
      const res = await axios.get("http://127.0.0.1:8000/api/users/profile/", {
        headers: { Authorization: `Bearer ${authToken}` },
      });
      setUser(res.data.profile);
      localStorage.setItem("user", JSON.stringify(res.data));
    } catch (err) {
      console.error("Error fetching user profile:", err);
      logout();
    }
  };

  // ✅ Login logic
  const login = async (authToken: string) => {
    setIsLoggedIn(true);
    setToken(authToken);
    localStorage.setItem("isLoggedIn", "true");
    localStorage.setItem("token", authToken);
    await fetchUserProfile(authToken);
  };

  // ✅ Logout logic
  const logout = () => {
    setIsLoggedIn(false);
    setToken(null);
    setUser(null);
    localStorage.clear();
  };

  // ✅ On first mount — load from storage instantly
  useEffect(() => {
    const storedToken = localStorage.getItem("token");
    const storedUser = localStorage.getItem("user");

    if (storedToken) {
      setToken(storedToken);
      setIsLoggedIn(true);

      // 👇 Instantly hydrate user from localStorage if available
      if (storedUser) {
        setUser(JSON.parse(storedUser));
      }

      // 👇 Re-validate in background silently
      fetchUserProfile(storedToken).finally(() => setLoading(false));
    } else {
      setLoading(false);
    }
  }, []);

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
