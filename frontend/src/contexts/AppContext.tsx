import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

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
  status: 'correct' | 'wrong' | 'left';
  category: string;
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
  user: User | null;
  setUser: (user: User | null) => void;
  isAuthenticated: boolean;
  testAttempts: TestAttempt[];
  addTestAttempt: (attempt: TestAttempt) => void;
  currentTestConfig: { role: string; techStack: string[] } | null;
  setCurrentTestConfig: (config: { role: string; techStack: string[] } | null) => void;
  theme: 'light' | 'dark';
  toggleTheme: () => void;
  tabSwitchCount: number;
  incrementTabSwitch: () => void;
  resetTabSwitch: () => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export function AppProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(() => {
    const saved = localStorage.getItem('truemetric_user');
    return saved ? JSON.parse(saved) : null;
  });

  const [testAttempts, setTestAttempts] = useState<TestAttempt[]>(() => {
    const saved = localStorage.getItem('truemetric_attempts');
    return saved ? JSON.parse(saved) : [];
  });

  const [currentTestConfig, setCurrentTestConfig] = useState<{ role: string; techStack: string[] } | null>(null);

  const [theme, setTheme] = useState<'light' | 'dark'>(() => {
    const saved = localStorage.getItem('truemetric_theme');
    return (saved as 'light' | 'dark') || 'light';
  });

  const [tabSwitchCount, setTabSwitchCount] = useState(0);

  useEffect(() => {
    localStorage.setItem('truemetric_user', JSON.stringify(user));
  }, [user]);

  useEffect(() => {
    localStorage.setItem('truemetric_attempts', JSON.stringify(testAttempts));
  }, [testAttempts]);

  useEffect(() => {
    localStorage.setItem('truemetric_theme', theme);
    document.documentElement.classList.toggle('dark', theme === 'dark');
  }, [theme]);

  const addTestAttempt = (attempt: TestAttempt) => {
    setTestAttempts(prev => [attempt, ...prev]);
  };

  const toggleTheme = () => {
    setTheme(prev => prev === 'light' ? 'dark' : 'light');
  };

  const incrementTabSwitch = () => {
    setTabSwitchCount(prev => prev + 1);
  };

  const resetTabSwitch = () => {
    setTabSwitchCount(0);
  };

  return (
    <AppContext.Provider value={{
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
    }}>
      {children}
    </AppContext.Provider>
  );
}

export function useApp() {
  const context = useContext(AppContext);
  if (context === undefined) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
}
