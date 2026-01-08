import React, { createContext, useContext, useState, useEffect } from "react";

interface User {
  id: string;
  name: string;
  email: string;
  hasCompletedTest: boolean;
}

interface AuthContextType {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<void>;
  signup: (name: string, email: string, password: string) => Promise<void>;
  logout: () => void;
  updateUser: (updates: Partial<User>) => void;
  completeTest: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<User | null>(() => {
    const saved = localStorage.getItem("truemetric-user");
    return saved ? JSON.parse(saved) : null;
  });

  const [token, setToken] = useState<string | null>(() =>
    localStorage.getItem("truemetric-token")
  );

  useEffect(() => {
    if (user) {
      localStorage.setItem("truemetric-user", JSON.stringify(user));
    } else {
      localStorage.removeItem("truemetric-user");
    }
  }, [user]);

  useEffect(() => {
    if (token) {
      localStorage.setItem("truemetric-token", token);
    } else {
      localStorage.removeItem("truemetric-token");
    }
  }, [token]);

  const login = async (email: string, password: string): Promise<void> => {
    const res = await fetch("http://localhost:3000/auth/signin", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
    });

    const data = await res.json();

    if (!res.ok) throw new Error(data.message || "Login failed");

    setToken(data.token);
    setUser({
      id: data.user.id,
      name: data.user.name,
      email: data.user.email,
      hasCompletedTest: data.user.hasCompletedTest ?? false, // Safe default
    });
  };

  const signup = async (name: string, email: string, password: string): Promise<void> => {
    const res = await fetch("http://localhost:3000/auth/signup", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name, email, password }),
    });

    const data = await res.json();

    if (!res.ok) throw new Error(data.message || "Signup failed");

    // ✅ SEAMLESS FIX: Use the token immediately returned by signup
    setToken(data.token);
    setUser({
      id: data.user.id,
      name: data.user.name,
      email: data.user.email,
      hasCompletedTest: false, // New users haven't taken the test
    });
  };

  const logout = () => {
    setUser(null);
    setToken(null);
    localStorage.removeItem("truemetric-user");
    localStorage.removeItem("truemetric-token");
  };

  const updateUser = (updates: Partial<User>) => {
    setUser((prev) => (prev ? { ...prev, ...updates } : prev));
  };

  const completeTest = () => updateUser({ hasCompletedTest: true });

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        isAuthenticated: !!token,
        login,
        signup,
        logout,
        updateUser,
        completeTest,
      }}
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