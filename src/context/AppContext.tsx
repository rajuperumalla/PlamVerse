
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
  submissionDate: string; // Date of initial submission, ISO string
  lastUpdateDate: string; // Tracks last status change, ISO string
  category: string;
  inputDetails: ReportPalmInputDetails; // Store original input details for context
}

interface AppState {
  isAuthenticated: boolean;
  userName: string | null;
  reports: ReportData[];
  isOperationInProgress: boolean;
  hasPaid: boolean;
  isEditor: boolean;
  isAdmin: boolean;
  isInitializing: boolean;
}

interface AppContextType extends AppState {
  login: (name: string) => void;
  logout: () => void;
  createInitialReportPlaceholder: (inputData: ReportPalmInputDetails) => string;
  updateReportWithGeneratedContent: (reportId: string, aiContent: string) => void;
  markReportAsGenerationFailed: (reportId: string, errorMessage?: string) => void;
  approveReport: (reportId: string, newContent?: string) => void;
  getReportById: (reportId: string) => ReportData | undefined;
  getCurrentUserReport: () => ReportData | undefined;
  startOperation: () => void;
  stopOperation: () => void;
  setHasPaid: (paid: boolean) => void;
  clearCurrentUserReportStorage: () => void;
  loadSampleReports: () => void;
  updateReportContent: (reportId: string, newContent: string) => void;
}

const AppContext = createContext<AppContextType | null>(null);

const REPORTS_STORAGE_KEY = 'palmverse_reports_array';

const createSampleReport = (idSuffix: number, category: string, userName: string, status: ReportData['status']): ReportData => {
  const baseDate = new Date();
  baseDate.setDate(baseDate.getDate() - (idSuffix * 5 + 10)); 

  const submissionDate = new Date(baseDate);
  submissionDate.setHours(10 + idSuffix, 30 + idSuffix, 0, 0);

  let lastUpdateDate = new Date(submissionDate);
  if (status === 'pending_review') {
    lastUpdateDate.setDate(lastUpdateDate.getDate() + 1);
    lastUpdateDate.setHours(submissionDate.getHours() + (1 % 24), submissionDate.getMinutes() + 5);
  } else if (status === 'approved') {
    lastUpdateDate.setDate(lastUpdateDate.getDate() + 2 + idSuffix);
    lastUpdateDate.setHours(submissionDate.getHours() + (2 % 24), submissionDate.getMinutes() + 10);
  }


  let content = `Sample content for ${category} (Report ${idSuffix}). This is a simulated AI generated palm reading. It covers various aspects of your life including career, relationships, and health. The lines on your palm suggest a dynamic and eventful path ahead.`;
  switch(status) {
    case 'submitted_for_generation': content = `Report ID ${idSuffix}: Generation currently in progress for this sample. Please wait a few moments.`; break;
    case 'generation_failed': content = `Sample report (ID ${idSuffix}) generation encountered an issue. This could be due to image quality or a temporary system glitch. Please try again.`; break;
    case 'pending_review': content = `This is sample AI report ${idSuffix} for ${category}, awaiting expert review. It includes initial insights into your life line, heart line, and head line. Further details are being verified.`; break;
    case 'approved': content = `This is final approved report ${idSuffix} for ${category}. Your life line indicates strong vitality. Your heart line shows deep connections. Your career path may involve creative pursuits. This detailed reading provides guidance and foretells potential opportunities.`; break;
  }

  return {
    id: `sample-${idSuffix}-${submissionDate.getTime()}`,
    content: content,
    status: status,
    userName: userName,
    submissionDate: submissionDate.toISOString(),
    lastUpdateDate: lastUpdateDate.toISOString(),
    category: category,
    inputDetails: {
      leftPalmDataUri: `https://placehold.co/300x200.png?text=L+Palm+S${idSuffix}`,
      rightPalmDataUri: `https://placehold.co/300x200.png?text=R+Palm+S${idSuffix}`,
      dateOfBirth: `19${80 + idSuffix}-0${(idSuffix % 9) + 1}-0${(idSuffix % 2) + 1}${idSuffix % 9 +1}`,
      placeOfBirth: `City ${idSuffix}, Sample Land`,
      timeOfBirth: `${(10 + idSuffix) % 24}:0${idSuffix % 6}`,
      dominantHand: idSuffix % 2 === 0 ? 'Right' : 'Left',
      category: category,
    }
  };
};


export const AppProvider = ({ children }: { children: ReactNode }) => {
  const [isInitializing, setIsInitializing] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [userName, setUserName] = useState<string | null>(null);
  const [reports, setReports] = useState<ReportData[]>([]);
  const [isOperationInProgress, setIsOperationInProgress] = useState(false);
  const [hasPaid, setHasPaidState] = useState(false);
  const [isEditor, setIsEditor] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);
  const router = useRouter();

  const persistReports = (updatedReports: ReportData[]) => {
    setReports(updatedReports);
    if (typeof window !== 'undefined') {
        localStorage.setItem(REPORTS_STORAGE_KEY, JSON.stringify(updatedReports));
    }
  };

  const loadSampleReports = useCallback(() => {
    const samples = [
      createSampleReport(1, 'Career and Finances', 'user_alpha@example.com', 'pending_review'),
      createSampleReport(2, 'Love and Relationships', 'user_beta@example.com', 'pending_review'),
      createSampleReport(3, 'Health and Wellness', 'user_gamma@example.com', 'approved'),
      createSampleReport(4, 'General Personality', 'user_delta@example.com', 'submitted_for_generation'),
      createSampleReport(5, 'Career and Finances', 'user_epsilon@example.com', 'generation_failed'),
      createSampleReport(6, 'Love and Relationships', 'user_zeta@example.com', 'approved'),
      createSampleReport(7, 'General Personality', 'user_eta@example.com', 'approved'),
      createSampleReport(8, 'Health and Wellness', 'user_theta@example.com', 'approved'),
    ];
    persistReports(samples);
  }, []);

  useEffect(() => {
    if (typeof window !== 'undefined') {
        setIsInitializing(true);
        const storedAuth = sessionStorage.getItem('palmverse_isAuthenticated');
        const storedName = sessionStorage.getItem('palmverse_userName');
        const storedPaid = sessionStorage.getItem('palmverse_hasPaid');
        const storedIsEditor = sessionStorage.getItem('palmverse_isEditor');
        const storedIsAdmin = sessionStorage.getItem('palmverse_isAdmin');
        const storedReports = localStorage.getItem(REPORTS_STORAGE_KEY);

        if (storedAuth === 'true' && storedName) {
        setIsAuthenticated(true);
        setUserName(storedName);
        if (storedIsEditor === 'true') {
            setIsEditor(true);
        }
        if (storedIsAdmin === 'true') {
            setIsAdmin(true);
        }
        }
        if (storedPaid === 'true') {
        setHasPaidState(true);
        }

        if (storedReports) {
        try {
            const parsedReports = JSON.parse(storedReports) as ReportData[];
            if (Array.isArray(parsedReports) && parsedReports.length > 0 && parsedReports.every(r => typeof r.id === 'string' && typeof r.status === 'string' && r.inputDetails && typeof r.submissionDate === 'string' && typeof r.lastUpdateDate === 'string')) {
                setReports(parsedReports);
            } else {
                loadSampleReports();
            }
        } catch (e) {
            localStorage.removeItem(REPORTS_STORAGE_KEY);
            loadSampleReports();
        }
        } else {
        loadSampleReports();
        }
        setIsInitializing(false);
    }
  }, [loadSampleReports]);


  const login = (name: string) => {
    setIsAuthenticated(true);
    setUserName(name);
    sessionStorage.setItem('palmverse_isAuthenticated', 'true');
    sessionStorage.setItem('palmverse_userName', name);

    if (name === 'editor_user') {
      setIsEditor(true);
      setIsAdmin(false);
      sessionStorage.setItem('palmverse_isEditor', 'true');
      sessionStorage.setItem('palmverse_isAdmin', 'false');
    } else if (name === 'admin_user') {
      setIsAdmin(true);
      setIsEditor(false);
      sessionStorage.setItem('palmverse_isAdmin', 'true');
      sessionStorage.setItem('palmverse_isEditor', 'false');
    } else {
      setIsEditor(false);
      setIsAdmin(false);
      sessionStorage.setItem('palmverse_isEditor', 'false');
      sessionStorage.setItem('palmverse_isAdmin', 'false');
    }
  };

  const logout = () => {
    setIsAuthenticated(false);
    setUserName(null);
    setHasPaidState(false);
    setIsEditor(false);
    setIsAdmin(false);

    sessionStorage.removeItem('palmverse_isAuthenticated');
    sessionStorage.removeItem('palmverse_userName');
    sessionStorage.removeItem('palmverse_hasPaid');
    sessionStorage.removeItem('palmverse_isEditor');
    sessionStorage.removeItem('palmverse_isAdmin');

    router.push('/');
  };

  const createInitialReportPlaceholder = (inputData: ReportPalmInputDetails): string => {
    const newReportId = `${Date.now()}-${Math.random().toString(36).substring(2, 9)}`;
    const currentDate = new Date().toISOString();

    const reportsToKeep = reports.filter(r => {
        return !(r.userName === userName && (r.status === 'submitted_for_generation' || r.status === 'generation_failed'));
    });

    const newReport: ReportData = {
      id: newReportId,
      content: "Report generation initiated...",
      status: 'submitted_for_generation',
      userName: userName,
      submissionDate: currentDate,
      lastUpdateDate: currentDate,
      category: inputData.category,
      inputDetails: inputData,
    };

    const updatedReports = [...reportsToKeep, newReport];
    persistReports(updatedReports);
    return newReportId;
  };

  const updateReportWithGeneratedContent = (reportId: string, aiContent: string) => {
    const updatedReports = reports.map(report => {
      if (report.id === reportId) {
        return {
          ...report,
          content: aiContent,
          status: 'approved' as 'approved', 
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
          content: errorMessage,
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

    return userReports.sort((a,b) => new Date(b.lastUpdateDate).getTime() - new Date(a.lastUpdateDate).getTime())[0];
  }, [reports, userName]);


  const clearCurrentUserReportStorage = () => {
    const userReport = getCurrentUserReport();
    if (userReport && (userReport.status === 'generation_failed' || userReport.status === 'submitted_for_generation' || userReport.status === 'approved')) { // Include approved to clear after viewing if desired by Start New
        const updatedReports = reports.filter(r => r.id !== userReport.id);
        persistReports(updatedReports);
    }
  };

  const startOperation = () => setIsOperationInProgress(true);
  const stopOperation = () => setIsOperationInProgress(false);

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
      isOperationInProgress,
      startOperation,
      stopOperation,
      hasPaid,
      setHasPaid,
      clearCurrentUserReportStorage,
      isEditor,
      isAdmin,
      loadSampleReports,
      updateReportContent,
      isInitializing,
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
