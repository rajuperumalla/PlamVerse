
"use client";
import type { ReactNode } from 'react';
import React, { createContext, useContext, useState, useEffect } from 'react';
import { useRouter, usePathname } from 'next/navigation';

interface AppState {
  isAuthenticated: boolean;
  report: string | null;
  userName: string | null; // Store user's mobile number as name for now
  isLoading: boolean;
}

interface AppContextType extends AppState {
  login: (name: string) => void;
  logout: () => void;
  setReport: (report: string | null) => void;
  startLoading: () => void;
  stopLoading: () => void;
}

const AppContext = createContext<AppContextType | null>(null);

export const AppProvider = ({ children }: { children: ReactNode }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [report, setReport] = useState<string | null>(null);
  const [userName, setUserName] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    // Basic check for auth state, could be expanded with localStorage/sessionStorage
    // For this scaffold, we reset auth on refresh unless we persist it.
    // Let's try a simple session storage persistence for isAuthenticated and userName
    const storedAuth = sessionStorage.getItem('palmverse_isAuthenticated');
    const storedName = sessionStorage.getItem('palmverse_userName');
    if (storedAuth === 'true' && storedName) {
      setIsAuthenticated(true);
      setUserName(storedName);
    } else {
      // If not authenticated and not on the login page, redirect to login
      if (pathname !== '/') {
        // router.push('/'); // This can cause hydration issues if run on server.
                           // Client-side navigation is better.
      }
    }
  }, [pathname, router]);


  const login = (name: string) => {
    setIsAuthenticated(true);
    setUserName(name);
    sessionStorage.setItem('palmverse_isAuthenticated', 'true');
    sessionStorage.setItem('palmverse_userName', name);
  };

  const logout = () => {
    setIsAuthenticated(false);
    setReport(null);
    setUserName(null);
    sessionStorage.removeItem('palmverse_isAuthenticated');
    sessionStorage.removeItem('palmverse_userName');
    router.push('/');
  };
  
  const startLoading = () => setIsLoading(true);
  const stopLoading = () => setIsLoading(false);

  return (
    <AppContext.Provider value={{ isAuthenticated, login, logout, report, setReport, userName, isLoading, startLoading, stopLoading }}>
      {children}
    </AppContext.Provider>
  );
};

export const useAppContext = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useAppContext must be used within an AppProvider');
  }
  return context;
};
