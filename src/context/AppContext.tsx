
"use client";
import type { ReactNode } from 'react';
import React, { createContext, useContext, useState, useEffect } from 'react';
import { useRouter, usePathname } from 'next/navigation';

interface ReportData {
  content: string;
  status: 'pending_review' | 'approved';
}

interface AppState {
  isAuthenticated: boolean;
  userName: string | null;
  reportData: ReportData | null;
  isLoading: boolean;
  hasPaid: boolean;
}

interface AppContextType extends AppState {
  login: (name: string) => void;
  logout: () => void;
  setReportContent: (content: string) => void; // Renamed to reflect it sets content, status is internal
  approveReport: () => void;
  startLoading: () => void;
  stopLoading: () => void;
  setHasPaid: (paid: boolean) => void;
  clearReport: () => void;
}

const AppContext = createContext<AppContextType | null>(null);

export const AppProvider = ({ children }: { children: ReactNode }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [userName, setUserName] = useState<string | null>(null);
  const [reportData, setReportData] = useState<ReportData | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [hasPaid, setHasPaidState] = useState(false); // Renamed to avoid conflict
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    const storedAuth = sessionStorage.getItem('palmverse_isAuthenticated');
    const storedName = sessionStorage.getItem('palmverse_userName');
    const storedPaid = sessionStorage.getItem('palmverse_hasPaid');
    const storedReportData = sessionStorage.getItem('palmverse_reportData');

    if (storedAuth === 'true' && storedName) {
      setIsAuthenticated(true);
      setUserName(storedName);
    }
    if (storedPaid === 'true') {
      setHasPaidState(true);
    }
    if (storedReportData) {
      try {
        setReportData(JSON.parse(storedReportData));
      } catch (e) {
        console.error("Failed to parse stored report data", e);
        sessionStorage.removeItem('palmverse_reportData');
      }
    }
    
    // Redirect logic handled by individual pages now to avoid premature redirection
  }, []);


  const login = (name: string) => {
    setIsAuthenticated(true);
    setUserName(name);
    sessionStorage.setItem('palmverse_isAuthenticated', 'true');
    sessionStorage.setItem('palmverse_userName', name);
  };

  const logout = () => {
    setIsAuthenticated(false);
    setUserName(null);
    setReportData(null);
    setHasPaidState(false);
    sessionStorage.removeItem('palmverse_isAuthenticated');
    sessionStorage.removeItem('palmverse_userName');
    sessionStorage.removeItem('palmverse_hasPaid');
    sessionStorage.removeItem('palmverse_reportData');
    router.push('/');
  };
  
  const setReportContent = (content: string) => {
    const newReportData = { content, status: 'pending_review' as const };
    setReportData(newReportData);
    sessionStorage.setItem('palmverse_reportData', JSON.stringify(newReportData));
  };

  const approveReport = () => {
    if (reportData) {
      const approvedReportData = { ...reportData, status: 'approved' as const };
      setReportData(approvedReportData);
      sessionStorage.setItem('palmverse_reportData', JSON.stringify(approvedReportData));
    }
  };
  
  const clearReport = () => {
    setReportData(null);
    sessionStorage.removeItem('palmverse_reportData');
  }

  const startLoading = () => setIsLoading(true);
  const stopLoading = () => setIsLoading(false);

  const setHasPaid = (paid: boolean) => {
    setHasPaidState(paid);
    sessionStorage.setItem('palmverse_hasPaid', paid ? 'true' : 'false');
  };

  return (
    <AppContext.Provider value={{ 
      isAuthenticated, 
      login, 
      logout, 
      reportData, 
      setReportContent,
      approveReport, 
      userName, 
      isLoading, 
      startLoading, 
      stopLoading,
      hasPaid,
      setHasPaid,
      clearReport
    }}>
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
