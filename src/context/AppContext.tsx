
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
  isAdmin: boolean;
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

const REPORT_DATA_STORAGE_KEY = 'palmverse_reportData';

export const AppProvider = ({ children }: { children: ReactNode }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [userName, setUserName] = useState<string | null>(null);
  const [reportDataState, setReportDataState] = useState<ReportData | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [hasPaid, setHasPaidState] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const storedAuth = sessionStorage.getItem('palmverse_isAuthenticated');
    const storedName = sessionStorage.getItem('palmverse_userName');
    const storedPaid = sessionStorage.getItem('palmverse_hasPaid');
    const storedIsAdmin = sessionStorage.getItem('palmverse_isAdmin');
    
    // Use localStorage for reportData
    const storedReportData = localStorage.getItem(REPORT_DATA_STORAGE_KEY);

    if (storedAuth === 'true' && storedName) {
      setIsAuthenticated(true);
      setUserName(storedName);
      if (storedIsAdmin === 'true') {
        setIsAdmin(true);
      }
    }
    if (storedPaid === 'true') {
      setHasPaidState(true);
    }
    if (storedReportData) {
      try {
        setReportDataState(JSON.parse(storedReportData));
      } catch (e) {
        console.error("Failed to parse stored report data", e);
        localStorage.removeItem(REPORT_DATA_STORAGE_KEY);
      }
    }
  }, []);

  const setReportDataPersistence = (data: ReportData | null) => {
    setReportDataState(data);
    if (data) {
      localStorage.setItem(REPORT_DATA_STORAGE_KEY, JSON.stringify(data));
    } else {
      localStorage.removeItem(REPORT_DATA_STORAGE_KEY);
    }
  };

  const login = (name: string) => {
    setIsAuthenticated(true);
    setUserName(name);
    sessionStorage.setItem('palmverse_isAuthenticated', 'true');
    sessionStorage.setItem('palmverse_userName', name);

    if (name === 'admin_user') {
      setIsAdmin(true);
      sessionStorage.setItem('palmverse_isAdmin', 'true');
    } else {
      setIsAdmin(false);
      sessionStorage.setItem('palmverse_isAdmin', 'false');
    }
  };

  const logout = () => {
    const currentReportStatus = reportDataState?.status;

    setIsAuthenticated(false);
    setUserName(null);
    // Clear report from state
    setReportDataState(null); 
    setHasPaidState(false);
    setIsAdmin(false);
    
    sessionStorage.removeItem('palmverse_isAuthenticated');
    sessionStorage.removeItem('palmverse_userName');
    sessionStorage.removeItem('palmverse_hasPaid');
    sessionStorage.removeItem('palmverse_isAdmin');

    // Conditional removal from localStorage
    if (currentReportStatus === 'approved') {
      localStorage.removeItem(REPORT_DATA_STORAGE_KEY);
    }
    // If 'pending_review', it remains in localStorage for admin.
    // If reportDataState was null, removeItem does nothing.
    
    router.push('/');
  };
  
  const generateNewReport = (content: string) => {
    // When a new report is generated, it implies any previous one (even pending) is superseded for this flow.
    // The clearReport() in PalmInputForm should handle clearing localStorage before this.
    const newReport: ReportData = { content, status: 'pending_review' };
    setReportDataPersistence(newReport);
  };

  const approveCurrentReport = (newContent?: string) => {
    if (reportDataState) {
      const approvedReport: ReportData = {
        ...reportDataState,
        content: newContent || reportDataState.content,
        status: 'approved',
      };
      setReportDataPersistence(approvedReport);
    }
  };
  
  const clearReport = () => {
    // This will clear from state and localStorage
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
      reportData: reportDataState, 
      generateNewReport,
      approveCurrentReport, 
      userName, 
      isLoading, 
      startLoading, 
      stopLoading,
      hasPaid,
      setHasPaid,
      clearReport,
      isAdmin
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

