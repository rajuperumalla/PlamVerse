
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
  reports: ReportData[]; // Changed from single reportData to array
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
  clearCurrentUserReportStorage: () => void; // To clear for new submission
  loadSampleReports: () => void; // For admin simulation
  updateReportContent: (reportId: string, newContent: string) => void; // For admin refinement
}

const AppContext = createContext<AppContextType | null>(null);

const REPORTS_STORAGE_KEY = 'palmverse_reports_array'; // For the array of reports

// Sample reports generator
const createSampleReport = (id: number, category: string, userName: string): ReportData => {
  const date = new Date();
  date.setDate(date.getDate() - id);
  return {
    id: `sample-${id}-${Date.now()}`,
    content: `This is a sample AI-generated report for ${category}. It discusses various aspects related to the user's potential future, personality traits derived from palm lines, and general well-being. Report includes analysis of heart line, head line, and life line. Specific focus on ${category.toLowerCase()}. Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. This report is currently pending expert review.`,
    status: 'pending_review',
    userName: userName,
    submissionDate: date.toISOString(),
    category: category,
    inputDetails: {
      leftPalmDataUri: `https://placehold.co/300x200.png?text=Left+Palm+${id}`,
      rightPalmDataUri: `https://placehold.co/300x200.png?text=Right+Palm+${id}`,
      dateOfBirth: '1990-01-01',
      placeOfBirth: `City ${id}, Country ${id}`,
      timeOfBirth: '12:00',
      dominantHand: 'Right',
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
        setReports(JSON.parse(storedReports));
      } catch (e) {
        console.error("Failed to parse stored reports array", e);
        localStorage.removeItem(REPORTS_STORAGE_KEY);
      }
    } else {
      // If no reports in localStorage, load sample ones for admin demo
       loadSampleReports();
    }
  }, []);

  const persistReports = (updatedReports: ReportData[]) => {
    setReports(updatedReports);
    localStorage.setItem(REPORTS_STORAGE_KEY, JSON.stringify(updatedReports));
  };
  
  const loadSampleReports = () => {
    const samples = [
      createSampleReport(1, 'Career and Finances', 'user_alpha@example.com'),
      createSampleReport(2, 'Love and Relationships', 'user_beta@example.com'),
      createSampleReport(3, 'Health and Wellness', 'user_gamma@example.com'),
      createSampleReport(4, 'General Personality', 'user_delta@example.com'),
    ];
    persistReports(samples);
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
    setIsAuthenticated(false);
    setUserName(null);
    setHasPaidState(false);
    setIsAdmin(false);
    
    sessionStorage.removeItem('palmverse_isAuthenticated');
    sessionStorage.removeItem('palmverse_userName');
    sessionStorage.removeItem('palmverse_hasPaid');
    sessionStorage.removeItem('palmverse_isAdmin');

    // For reports, let's keep pending_review ones for admin, clear approved ones not belonging to admin.
    // This is a simplified logic for demo; real app would be more robust.
    const updatedReports = reports.filter(report => 
      report.status === 'pending_review' || (report.status === 'approved' && report.userName === 'admin_user')
    );
    persistReports(updatedReports);
    
    router.push('/');
  };
  
  const generateNewReport = (aiContent: string, inputData: ReportPalmInputDetails) => {
    const newReport: ReportData = {
      id: `${Date.now()}-${Math.random().toString(36).substring(2, 9)}`,
      content: aiContent,
      status: 'pending_review',
      userName: userName, // Current logged-in user
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
    // Find the latest report for the current user (can be pending or approved)
    return [...reports] // Create a new array before sorting
      .filter(report => report.userName === userName)
      .sort((a, b) => new Date(b.submissionDate).getTime() - new Date(a.submissionDate).getTime())[0];
  }, [reports, userName]);


  const clearCurrentUserReportStorage = () => {
    // This function might be used if a user wants to discard their pending report
    // For now, we'll rely on generating a new report to supersede.
    // Or, if we want to clear the current user's *latest* report:
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
      reports, // Provide the whole array
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
