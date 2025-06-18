
"use client";
import type { ReactNode } from 'react';
import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';

// Define the structure for palm input details to be stored with the report
export interface ReportPalmInputDetails {
  leftPalmDataUri?: string;
  rightPalmDataUri?: string;
  dateOfBirth: string;
  placeOfBirth: string;
  timeOfBirth?: string;
  dominantHand: string;
  category: string;
}

export interface ReportData {
  id: string;
  content: string;
  status: 'pending_review' | 'approved';
  userName: string | null; // User who submitted
  submissionDate: string;
  category: string;
  inputDetails: ReportPalmInputDetails; // Store original input details for context
}

interface AppState {
  isAuthenticated: boolean;
  userName: string | null;
  reports: ReportData[]; 
  isLoading: boolean;
  hasPaid: boolean;
  isAdmin: boolean;
}

interface AppContextType extends AppState {
  login: (name: string) => void;
  logout: () => void;
  generateNewReport: (aiContent: string, inputData: ReportPalmInputDetails) => void;
  approveReport: (reportId: string, newContent?: string) => void;
  getReportById: (reportId: string) => ReportData | undefined;
  getCurrentUserReport: () => ReportData | undefined;
  startLoading: () => void;
  stopLoading: () => void;
  setHasPaid: (paid: boolean) => void;
  clearCurrentUserReportStorage: () => void; 
  loadSampleReports: () => void; 
  updateReportContent: (reportId: string, newContent: string) => void; 
}

const AppContext = createContext<AppContextType | null>(null);

const REPORTS_STORAGE_KEY = 'palmverse_reports_array';

// Sample reports generator
const createSampleReport = (id: number, category: string, userName: string, status: 'pending_review' | 'approved' = 'pending_review'): ReportData => {
  const date = new Date();
  date.setDate(date.getDate() - id); // Make submission dates vary
  let content = `This is a sample AI-generated report for ${category}. It discusses various aspects related to the user's potential future, personality traits derived from palm lines, and general well-being. Report includes analysis of heart line, head line, and life line. Specific focus on ${category.toLowerCase()}. Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.`;
  if (status === 'pending_review') {
    content += " This report is currently pending expert review.";
  } else {
    content += " This report has been reviewed and approved by an expert.";
  }

  return {
    id: `sample-${id}-${Date.now()}`,
    content: content,
    status: status,
    userName: userName,
    submissionDate: date.toISOString(),
    category: category,
    inputDetails: {
      leftPalmDataUri: `https://placehold.co/300x200.png?text=L+Palm+${id}`,
      rightPalmDataUri: `https://placehold.co/300x200.png?text=R+Palm+${id}`,
      dateOfBirth: '1990-01-01',
      placeOfBirth: `City ${id}, Country ${id}`,
      timeOfBirth: '12:00',
      dominantHand: id % 2 === 0 ? 'Right' : 'Left',
      category: category,
    }
  };
};


export const AppProvider = ({ children }: { children: ReactNode }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [userName, setUserName] = useState<string | null>(null);
  const [reports, setReports] = useState<ReportData[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [hasPaid, setHasPaidState] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);
  const router = useRouter();

  const persistReports = (updatedReports: ReportData[]) => {
    setReports(updatedReports);
    localStorage.setItem(REPORTS_STORAGE_KEY, JSON.stringify(updatedReports));
  };
  
  const loadSampleReports = useCallback(() => {
    const samples = [
      createSampleReport(1, 'Career and Finances', 'user_alpha@example.com', 'pending_review'),
      createSampleReport(2, 'Love and Relationships', 'user_beta@example.com', 'pending_review'),
      createSampleReport(3, 'Health and Wellness', 'user_gamma@example.com', 'approved'),
      createSampleReport(4, 'General Personality', 'user_delta@example.com', 'pending_review'),
      createSampleReport(5, 'Career and Finances', 'user_epsilon@example.com', 'approved'),
    ];
    persistReports(samples);
  }, []); // Empty dependency array means this function's identity is stable

  useEffect(() => {
    const storedAuth = sessionStorage.getItem('palmverse_isAuthenticated');
    const storedName = sessionStorage.getItem('palmverse_userName');
    const storedPaid = sessionStorage.getItem('palmverse_hasPaid');
    const storedIsAdmin = sessionStorage.getItem('palmverse_isAdmin');
    const storedReports = localStorage.getItem(REPORTS_STORAGE_KEY);

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
    if (storedReports) {
      try {
        const parsedReports = JSON.parse(storedReports);
        if (Array.isArray(parsedReports) && parsedReports.length > 0) {
            setReports(parsedReports);
        } else {
            loadSampleReports(); // Load samples if stored reports are empty or invalid
        }
      } catch (e) {
        console.error("Failed to parse stored reports array", e);
        localStorage.removeItem(REPORTS_STORAGE_KEY);
        loadSampleReports(); // Load samples if parsing fails
      }
    } else {
       loadSampleReports(); // Load samples if no reports in localStorage
    }
  }, [loadSampleReports]);


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
    setIsAuthenticated(false);
    setUserName(null);
    setHasPaidState(false);
    setIsAdmin(false);
    
    sessionStorage.removeItem('palmverse_isAuthenticated');
    sessionStorage.removeItem('palmverse_userName');
    sessionStorage.removeItem('palmverse_hasPaid');
    sessionStorage.removeItem('palmverse_isAdmin');
    
    // Keep all reports on logout, as admin might need to see them.
    // If a user logs out, their specific report access is handled by getCurrentUserReport.
    // Sample reports will persist for admin.
    
    router.push('/');
  };
  
  const generateNewReport = (aiContent: string, inputData: ReportPalmInputDetails) => {
    const newReport: ReportData = {
      id: `${Date.now()}-${Math.random().toString(36).substring(2, 9)}`,
      content: aiContent,
      status: 'pending_review',
      userName: userName, 
      submissionDate: new Date().toISOString(),
      category: inputData.category,
      inputDetails: inputData,
    };
    const updatedReports = [...reports, newReport];
    persistReports(updatedReports);
  };

  const approveReport = (reportId: string, newContent?: string) => {
    const updatedReports = reports.map(report => {
      if (report.id === reportId) {
        return {
          ...report,
          content: newContent || report.content,
          status: 'approved' as 'approved',
        };
      }
      return report;
    });
    persistReports(updatedReports);
  };

  const updateReportContent = (reportId: string, newContent: string) => {
    const updatedReports = reports.map(report => {
      if (report.id === reportId) {
        return { ...report, content: newContent };
      }
      return report;
    });
    persistReports(updatedReports);
  };
  
  const getReportById = (reportId: string): ReportData | undefined => {
    return reports.find(report => report.id === reportId);
  };

  const getCurrentUserReport = useCallback((): ReportData | undefined => {
    if (!userName) return undefined;
    return [...reports] 
      .filter(report => report.userName === userName)
      .sort((a, b) => new Date(b.submissionDate).getTime() - new Date(a.submissionDate).getTime())[0];
  }, [reports, userName]);


  const clearCurrentUserReportStorage = () => {
    const userReport = getCurrentUserReport();
    if (userReport) {
        const updatedReports = reports.filter(r => r.id !== userReport.id);
        persistReports(updatedReports);
    }
  };

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
      reports, 
      generateNewReport,
      approveReport, 
      getReportById,
      getCurrentUserReport,
      userName, 
      isLoading, 
      startLoading, 
      stopLoading,
      hasPaid,
      setHasPaid,
      clearCurrentUserReportStorage,
      isAdmin,
      loadSampleReports,
      updateReportContent,
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

