import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from "react";
import { useAuth } from "./AuthContext"; // ✅ Connects to real Auth

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
  setUser: (user: User | null) => void; // Deprecated: Warning wrapper
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
  // ✅ SOURCE OF TRUTH: Get user from the real Auth Context
  const { user: authUser, isAuthenticated } = useAuth();

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

  // Persist test attempts
  useEffect(() => {
    localStorage.setItem("truemetric_attempts", JSON.stringify(testAttempts));
  }, [testAttempts]);

  // Handle Theme
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
    <AppContext.Provider
      value={{
        // ✅ Map AuthContext user to AppContext user
        user: authUser ? {
          id: authUser.id?.toString() || "0",
          email: authUser.email,
          name: authUser.name || authUser.email.split('@')[0]
        } : null,
        isAuthenticated,
        // Warning: Don't set user here, use login() in AuthContext
        setUser: () => console.warn("Use useAuth().login() instead of setUser"),
        
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