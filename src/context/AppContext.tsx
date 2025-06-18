
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
  content: string; // Holds AI content or error messages for generation_failed
  status: 'submitted_for_generation' | 'generation_failed' | 'pending_review' | 'approved';
  userName: string | null; // User who submitted
  submissionDate: string; // Date of initial submission
  lastUpdateDate: string; // Tracks last status change
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
  createInitialReportPlaceholder: (inputData: ReportPalmInputDetails) => string; // Returns the new report ID
  updateReportWithGeneratedContent: (reportId: string, aiContent: string) => void;
  markReportAsGenerationFailed: (reportId: string, errorMessage?: string) => void;
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
const createSampleReport = (idSuffix: number, category: string, userName: string, status: ReportData['status']): ReportData => {
  const date = new Date();
  date.setDate(date.getDate() - idSuffix); 
  let content = `Sample content for ${category}.`;
  switch(status) {
    case 'submitted_for_generation': content = "Report generation in progress for this sample."; break;
    case 'generation_failed': content = "Sample report generation failed."; break;
    case 'pending_review': content = `This is a sample AI-generated report for ${category}, pending expert review. Lorem ipsum dolor sit amet.`; break;
    case 'approved': content = `This is a sample APPROVED AI-generated report for ${category}. Lorem ipsum dolor sit amet, consectetur adipiscing elit.`; break;
  }

  return {
    id: `sample-${idSuffix}-${Date.now()}`,
    content: content,
    status: status,
    userName: userName,
    submissionDate: date.toISOString(),
    lastUpdateDate: new Date().toISOString(),
    category: category,
    inputDetails: {
      leftPalmDataUri: `https://placehold.co/300x200.png?text=L+Palm+${idSuffix}`,
      rightPalmDataUri: `https://placehold.co/300x200.png?text=R+Palm+${idSuffix}`,
      dateOfBirth: '1990-01-01',
      placeOfBirth: `City ${idSuffix}, Country ${idSuffix}`,
      timeOfBirth: '12:00',
      dominantHand: idSuffix % 2 === 0 ? 'Right' : 'Left',
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
      createSampleReport(4, 'General Personality', 'user_delta@example.com', 'submitted_for_generation'),
      createSampleReport(5, 'Career and Finances', 'user_epsilon@example.com', 'generation_failed'),
      createSampleReport(6, 'Love and Relationships', 'user_zeta@example.com', 'approved'),
    ];
    persistReports(samples);
  }, []); 

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
            loadSampleReports(); 
        }
      } catch (e) {
        console.error("Failed to parse stored reports array", e);
        localStorage.removeItem(REPORTS_STORAGE_KEY);
        loadSampleReports(); 
      }
    } else {
       loadSampleReports(); 
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
        
    router.push('/');
  };
  
  const createInitialReportPlaceholder = (inputData: ReportPalmInputDetails): string => {
    const newReportId = `${Date.now()}-${Math.random().toString(36).substring(2, 9)}`;
    const newReport: ReportData = {
      id: newReportId,
      content: "Report generation initiated...", // Placeholder content
      status: 'submitted_for_generation',
      userName: userName, 
      submissionDate: new Date().toISOString(),
      lastUpdateDate: new Date().toISOString(),
      category: inputData.category,
      inputDetails: inputData,
    };
    // Remove any previous 'submitted_for_generation' or 'generation_failed' report for this user.
    const filteredReports = reports.filter(r => !(r.userName === userName && (r.status === 'submitted_for_generation' || r.status === 'generation_failed')));
    const updatedReports = [...filteredReports, newReport];
    persistReports(updatedReports);
    return newReportId;
  };

  const updateReportWithGeneratedContent = (reportId: string, aiContent: string) => {
    const updatedReports = reports.map(report => {
      if (report.id === reportId) {
        return {
          ...report,
          content: aiContent,
          status: 'pending_review' as 'pending_review',
          lastUpdateDate: new Date().toISOString(),
        };
      }
      return report;
    });
    persistReports(updatedReports);
  };
  
  const markReportAsGenerationFailed = (reportId: string, errorMessage: string = "Report generation failed. Please try again.") => {
    const updatedReports = reports.map(report => {
      if (report.id === reportId) {
        return {
          ...report,
          content: errorMessage, // Store error message in content
          status: 'generation_failed' as 'generation_failed',
          lastUpdateDate: new Date().toISOString(),
        };
      }
      return report;
    });
    persistReports(updatedReports);
  };

  const approveReport = (reportId: string, newContent?: string) => {
    const updatedReports = reports.map(report => {
      if (report.id === reportId) {
        return {
          ...report,
          content: newContent || report.content,
          status: 'approved' as 'approved',
          lastUpdateDate: new Date().toISOString(),
        };
      }
      return report;
    });
    persistReports(updatedReports);
  };

  const updateReportContent = (reportId: string, newContent: string) => {
    const updatedReports = reports.map(report => {
      if (report.id === reportId) {
        return { ...report, content: newContent, lastUpdateDate: new Date().toISOString() };
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
    // Prioritize active states, then approved, then older ones.
    const userReports = reports.filter(report => report.userName === userName);
    if (userReports.length === 0) return undefined;

    const priorityStatus: ReportData['status'][] = ['submitted_for_generation', 'generation_failed', 'pending_review', 'approved'];
    
    for (const status of priorityStatus) {
        const reportsWithStatus = userReports
            .filter(r => r.status === status)
            .sort((a, b) => new Date(b.lastUpdateDate).getTime() - new Date(a.lastUpdateDate).getTime());
        if (reportsWithStatus.length > 0) {
            return reportsWithStatus[0];
        }
    }
    // Fallback to most recently updated if no priority status found (should not happen with current statuses)
    return userReports.sort((a,b) => new Date(b.lastUpdateDate).getTime() - new Date(a.lastUpdateDate).getTime())[0];
  }, [reports, userName]);


  const clearCurrentUserReportStorage = () => {
    // This function might need adjustment if we want to clear only specific statuses or keep history.
    // For now, it's geared towards clearing a specific 'current' actionable report before a new submission.
    const userReport = getCurrentUserReport();
    if (userReport && (userReport.status === 'generation_failed' || userReport.status === 'submitted_for_generation')) {
        const updatedReports = reports.filter(r => r.id !== userReport.id);
        persistReports(updatedReports);
    }
    // Retain 'pending_review' and 'approved' reports unless explicitly handled elsewhere.
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
      createInitialReportPlaceholder,
      updateReportWithGeneratedContent,
      markReportAsGenerationFailed,
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

