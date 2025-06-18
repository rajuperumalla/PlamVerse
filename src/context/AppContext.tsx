
"use client";
import type { ReactNode } from 'react';
import React, { createContext, useContext, useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

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
  generateNewReport: (content: string) => void;
  approveCurrentReport: (newContent?: string) => void;
  startLoading: () => void;
  stopLoading: () => void;
  setHasPaid: (paid: boolean) => void;
  clearReport: () => void;
}

const AppContext = createContext<AppContextType | null>(null);

export const AppProvider = ({ children }: { children: ReactNode }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [userName, setUserName] = useState<string | null>(null);
  const [reportData, setReportDataState] = useState<ReportData | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [hasPaid, setHasPaidState] = useState(false);
  const router = useRouter();

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
        setReportDataState(JSON.parse(storedReportData));
      } catch (e) {
        console.error("Failed to parse stored report data", e);
        sessionStorage.removeItem('palmverse_reportData');
      }
    }
  }, []);

  const setReportDataPersistence = (data: ReportData | null) => {
    setReportDataState(data);
    if (data) {
      sessionStorage.setItem('palmverse_reportData', JSON.stringify(data));
    } else {
      sessionStorage.removeItem('palmverse_reportData');
    }
  };

  const login = (name: string) => {
    setIsAuthenticated(true);
    setUserName(name);
    sessionStorage.setItem('palmverse_isAuthenticated', 'true');
    sessionStorage.setItem('palmverse_userName', name);
  };

  const logout = () => {
    setIsAuthenticated(false);
    setUserName(null);
    setReportDataPersistence(null);
    setHasPaidState(false);
    sessionStorage.removeItem('palmverse_isAuthenticated');
    sessionStorage.removeItem('palmverse_userName');
    sessionStorage.removeItem('palmverse_hasPaid');
    sessionStorage.removeItem('palmverse_reportData');
    router.push('/');
  };
  
  const generateNewReport = (content: string) => {
    const newReport: ReportData = { content, status: 'pending_review' };
    setReportDataPersistence(newReport);
  };

  const approveCurrentReport = (newContent?: string) => {
    if (reportData) {
      const approvedReport: ReportData = {
        ...reportData,
        content: newContent || reportData.content,
        status: 'approved',
      };
      setReportDataPersistence(approvedReport);
    }
  };
  
  const clearReport = () => {
    setReportDataPersistence(null);
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
      generateNewReport,
      approveCurrentReport, 
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
