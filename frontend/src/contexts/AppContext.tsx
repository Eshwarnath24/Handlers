<<<<<<< Updated upstream
import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from "react";
=======
import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { useAuth } from './AuthContext'; // ✅ Import Auth Hook
>>>>>>> Stashed changes

// Align generic User type if possible, or keep simple for UI
interface User {
  id: string;
  name: string;
  email: string;
}

interface Question {
  id: number;
  question: string;
  options: string[];
  correctAnswer: number;
  userAnswer?: number;
  status: "correct" | "wrong" | "left";
  category: string;
}

interface CodingQuestion {
  question: string;
  difficulty: string;
}

interface CurrentTestConfig {
  role: string;
  techStack: string[];
  questions: {
    mcq: Question[];
    coding: CodingQuestion[];
  };
}

interface TestAttempt {
  id: string;
  date: string;
  role: string;
  techStack: string[];
  correct: number;
  wrong: number;
  unanswered: number;
  totalQuestions: number;
  strengths: string[];
  weaknesses: string[];
  weakLanguages: { language: string; topics: string[] }[];
  questions?: Question[];
}

interface AppContextType {
  user: User | null; // Derived from AuthContext
  setUser: (user: User | null) => void; // Warning: Prefer useAuth().updateUser
  isAuthenticated: boolean;

  testAttempts: TestAttempt[];
  addTestAttempt: (attempt: TestAttempt) => void;

  currentTestConfig: CurrentTestConfig | null;
  setCurrentTestConfig: (config: CurrentTestConfig | null) => void;

  theme: "light" | "dark";
  toggleTheme: () => void;

  tabSwitchCount: number;
  incrementTabSwitch: () => void;
  resetTabSwitch: () => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export function AppProvider({ children }: { children: ReactNode }) {
<<<<<<< Updated upstream
  const [user, setUser] = useState<User | null>(() => {
    const saved = localStorage.getItem("truemetric_user");
    return saved ? JSON.parse(saved) : null;
  });
=======
  // ✅ LINKED: Get user from the real Auth source
  const { user: authUser, isAuthenticated } = useAuth();
>>>>>>> Stashed changes

  const [testAttempts, setTestAttempts] = useState<TestAttempt[]>(() => {
    const saved = localStorage.getItem("truemetric_attempts");
    return saved ? JSON.parse(saved) : [];
  });

  const [currentTestConfig, setCurrentTestConfig] =
    useState<CurrentTestConfig | null>(null);

  const [theme, setTheme] = useState<"light" | "dark">(() => {
    const saved = localStorage.getItem("truemetric_theme");
    return (saved as "light" | "dark") || "light";
  });

  const [tabSwitchCount, setTabSwitchCount] = useState(0);

  useEffect(() => {
<<<<<<< Updated upstream
    localStorage.setItem("truemetric_user", JSON.stringify(user));
  }, [user]);

  useEffect(() => {
    localStorage.setItem("truemetric_attempts", JSON.stringify(testAttempts));
=======
    localStorage.setItem('truemetric_attempts', JSON.stringify(testAttempts));
>>>>>>> Stashed changes
  }, [testAttempts]);

  useEffect(() => {
    localStorage.setItem("truemetric_theme", theme);
    document.documentElement.classList.toggle("dark", theme === "dark");
  }, [theme]);

  const addTestAttempt = (attempt: TestAttempt) => {
    setTestAttempts((prev) => [attempt, ...prev]);
  };

  const toggleTheme = () => {
    setTheme((prev) => (prev === "light" ? "dark" : "light"));
  };

  const incrementTabSwitch = () => {
    setTabSwitchCount((prev) => prev + 1);
  };

  const resetTabSwitch = () => {
    setTabSwitchCount(0);
  };

  return (
<<<<<<< Updated upstream
    <AppContext.Provider
      value={{
        user,
        setUser,
        isAuthenticated: !!user,
        testAttempts,
        addTestAttempt,
        currentTestConfig,
        setCurrentTestConfig,
        theme,
        toggleTheme,
        tabSwitchCount,
        incrementTabSwitch,
        resetTabSwitch,
      }}
    >
=======
    <AppContext.Provider value={{
      user: authUser, // ✅ Derived from AuthContext
      setUser: () => console.warn("Use useAuth().updateUser instead"),
      isAuthenticated,
      testAttempts,
      addTestAttempt,
      currentTestConfig,
      setCurrentTestConfig,
      theme,
      toggleTheme,
      tabSwitchCount,
      incrementTabSwitch,
      resetTabSwitch,
    }}>
>>>>>>> Stashed changes
      {children}
    </AppContext.Provider>
  );
}

export function useApp() {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error("useApp must be used within an AppProvider");
  }
  return context;
}