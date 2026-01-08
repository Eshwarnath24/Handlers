import React, { createContext, useContext, useState, useEffect } from "react";

interface User {
  id: string;
  name: string;
  email: string;
  hasCompletedTest: boolean;
}

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<boolean>;
  signup: (name: string, email: string, password: string) => Promise<boolean>;
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

  useEffect(() => {
    if (user) {
      localStorage.setItem("truemetric-user", JSON.stringify(user));
    } else {
      localStorage.removeItem("truemetric-user");
    }
  }, [user]);

  const login = async (email: string, password: string): Promise<boolean> => {
    // Simulated login - in production, this would call an API
    await new Promise((resolve) => setTimeout(resolve, 1000));
    
    const savedUsers = JSON.parse(localStorage.getItem("truemetric-users") || "[]");
    const foundUser = savedUsers.find((u: User & { password: string }) => u.email === email && u.password === password);
    
    if (foundUser) {
      const { password: _, ...userData } = foundUser;
      setUser(userData);
      return true;
    }
    return false;
  };

  const signup = async (name: string, email: string, password: string): Promise<boolean> => {
    await new Promise((resolve) => setTimeout(resolve, 1000));
    
    const savedUsers = JSON.parse(localStorage.getItem("truemetric-users") || "[]");
    const exists = savedUsers.some((u: User) => u.email === email);
    
    if (exists) return false;
    
    const newUser = {
      id: crypto.randomUUID(),
      name,
      email,
      password,
      hasCompletedTest: false,
    };
    
    savedUsers.push(newUser);
    localStorage.setItem("truemetric-users", JSON.stringify(savedUsers));
    
    const { password: _, ...userData } = newUser;
    setUser(userData);
    return true;
  };

  const logout = () => {
    setUser(null);
  };

  const updateUser = (updates: Partial<User>) => {
    if (user) {
      const updated = { ...user, ...updates };
      setUser(updated);
      
      const savedUsers = JSON.parse(localStorage.getItem("truemetric-users") || "[]");
      const index = savedUsers.findIndex((u: User) => u.id === user.id);
      if (index >= 0) {
        savedUsers[index] = { ...savedUsers[index], ...updates };
        localStorage.setItem("truemetric-users", JSON.stringify(savedUsers));
      }
    }
  };

  const completeTest = () => {
    updateUser({ hasCompletedTest: true });
  };

  return (
    <AuthContext.Provider value={{ 
      user, 
      isAuthenticated: !!user, 
      login, 
      signup, 
      logout, 
      updateUser,
      completeTest 
    }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within AuthProvider");
  }
  return context;
};
