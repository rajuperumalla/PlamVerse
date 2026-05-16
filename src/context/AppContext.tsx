
"use client";
import type { ReactNode } from 'react';
import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';

// Define the structure for palm input details to be stored with the report
export interface ReportPalmInputDetails {
  frontPalmDataUri?: string;
  sidePalmDataUri?: string;
  dateOfBirth: string;
  placeOfBirth: string;
  latitude?: string;
  longitude?: string;
  timeOfBirth?: string;
  isTimeOfBirthUnknown?: boolean;
  dominantHand: string;
  category: string; // e.g., "General Personality"
}

export interface ReportNumerologyInputDetails_Business {
    serviceQuery: 'business-name-calculator';
    businessName: string;
    additionalBusinessNames?: string;
    founderFullName: string;
    founderDOB: string;
    founderTOB?: string;
}

export interface ReportNumerologyInputDetails_PersonalReport {
    serviceQuery: 'life-path-report';
    fullName: string;
    dateOfBirth: string;
    timeOfBirth?: string;
}

export interface ReportNumerologyInputDetails_BabyName {
    serviceQuery: 'baby-name-numerology';
    proposedNames: string[];
    childDOB: string;
    childTOB?: string;
    parent1FullName?: string;
    parent1DOB?: string;
    parent2FullName?: string;
    parent2DOB?: string;
}

export type ReportInputDetails = ReportPalmInputDetails | ReportNumerologyInputDetails_Business | ReportNumerologyInputDetails_PersonalReport | ReportNumerologyInputDetails_BabyName;

/**
 * Report lifecycle (Customer -> Editor -> Admin -> Customer):
 *
 *  pending_review          : user submitted; awaiting editor image validation
 *  needs_resubmission      : editor/AI rejected images; user must re-upload
 *  pending_admin_approval  : editor classified + generated report; sent to admin
 *  admin_revision          : admin rejected; sent back to editor with notes
 *  approved                : admin approved; report published to customer
 *  generation_failed       : AI generation failed
 *  submitted_for_generation: legacy/transient generation state
 */
export type ReportStatus =
  | 'submitted_for_generation'
  | 'generation_failed'
  | 'pending_review'
  | 'needs_resubmission'
  | 'pending_admin_approval'
  | 'admin_revision'
  | 'approved';

export interface ImageValidationResult {
  score: number; // 0-100 quality score
  passed: boolean;
  issues: string[];
  summary: string;
  assessedAt: string;
}

export interface HandClassification {
  color: 'Black' | 'White' | 'Red' | '';
  size: 'Small' | 'Medium' | 'Large' | '';
  shape: 'Round' | 'Rectangle' | 'Oval' | '';
}

export interface UserNotification {
  id: string;
  message: string;
  date: string;
  read: boolean;
  type: 'info' | 'warning' | 'success' | 'error';
}

export interface ReportData {
  id: string;
  content: string;
  status: ReportStatus;
  userName: string | null;
  submissionDate: string;
  lastUpdateDate: string;
  reportType: 'palmistry' | 'numerology';
  category: string;
  inputDetails: ReportInputDetails;
  // Pipeline metadata
  imageValidation?: ImageValidationResult;
  handClassification?: HandClassification;
  editorNotes?: string;
  adminNotes?: string;
  rejectionReason?: string;
  notifications?: UserNotification[];
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
  createInitialNumerologyReportPlaceholder: (inputData: Omit<ReportInputDetails, 'serviceQuery'>, category: string) => string;
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
  // --- Pipeline actions ---
  setImageValidation: (reportId: string, validation: ImageValidationResult) => void;
  rejectReportImages: (reportId: string, reason: string) => void;
  resubmitReportImages: (reportId: string, frontPalmDataUri: string, sidePalmDataUri: string) => void;
  submitReportToAdmin: (reportId: string, generatedContent: string, editorNotes: string, classification: HandClassification) => void;
  adminApproveReport: (reportId: string, finalContent?: string) => void;
  adminRejectToEditor: (reportId: string, adminNotes: string) => void;
  markUserNotificationsRead: (reportId: string) => void;
}

const AppContext = createContext<AppContextType | null>(null);

const REPORTS_STORAGE_KEY = 'palmverse_reports_array';
const HAS_PAID_STORAGE_KEY = 'palmverse_hasPaid_session';

const makeNotification = (
  message: string,
  type: UserNotification['type'] = 'info'
): UserNotification => ({
  id: `${Date.now()}-${Math.random().toString(36).substring(2, 8)}`,
  message,
  date: new Date().toISOString(),
  read: false,
  type,
});

const createSampleReport = (idSuffix: number, category: string, userName: string, status: ReportStatus): ReportData => {
  const baseDate = new Date();
  baseDate.setDate(baseDate.getDate() - (idSuffix * 5 + 10));

  const submissionDate = new Date(baseDate);
  submissionDate.setHours(10 + idSuffix, 30 + idSuffix, 0, 0);

  let lastUpdateDate = new Date(submissionDate);
  if (status !== 'pending_review') {
    lastUpdateDate.setDate(lastUpdateDate.getDate() + 1 + idSuffix);
    lastUpdateDate.setHours(submissionDate.getHours() + (2 % 24), submissionDate.getMinutes() + 10);
  }

  let content = `Sample content for ${category} (Report ${idSuffix}). This is a simulated AI generated reading.`;
  content += ` It covers various aspects of your life including career, relationships, and health based on palmistry.`;

  const specificInputDetails: ReportPalmInputDetails = {
    frontPalmDataUri: `https://placehold.co/300x200.png?text=Front+Palm+S${idSuffix}`,
    sidePalmDataUri: `https://placehold.co/300x200.png?text=Side+Palm+S${idSuffix}`,
    dateOfBirth: `19${80 + idSuffix}-0${(idSuffix % 9) + 1}-0${(idSuffix % 2) + 1}${idSuffix % 9 + 1}`,
    placeOfBirth: `City ${idSuffix}, Sample Land`,
    timeOfBirth: `${(10 + idSuffix) % 24}:0${idSuffix % 6}`,
    isTimeOfBirthUnknown: false,
    latitude: "28.6139",
    longitude: "77.2090",
    dominantHand: idSuffix % 2 === 0 ? 'Right' : 'Left',
    category: category,
  };

  const report: ReportData = {
    id: `sample-palmistry-${idSuffix}-${submissionDate.getTime()}`,
    content: content,
    status: status,
    userName: userName,
    submissionDate: submissionDate.toISOString(),
    lastUpdateDate: lastUpdateDate.toISOString(),
    category: category,
    reportType: 'palmistry',
    inputDetails: specificInputDetails,
    notifications: [],
  };

  if (status === 'pending_admin_approval') {
    report.editorNotes = `Editor analysis for ${category}: Strong head line indicating analytical mind. Heart line suggests emotional depth. Recommend focusing on the specified category with an empathetic tone.`;
    report.handClassification = { color: 'White', size: 'Medium', shape: 'Rectangle' };
  }
  if (status === 'admin_revision') {
    report.editorNotes = `Editor analysis for ${category}.`;
    report.handClassification = { color: 'Black', size: 'Large', shape: 'Oval' };
    report.adminNotes = 'Please expand the career section and add specific dasha period correlations before resubmitting.';
  }
  if (status === 'needs_resubmission') {
    report.rejectionReason = 'The submitted palm images are blurry and poorly lit. Please re-upload clear, well-lit photos of your dominant palm.';
    report.notifications = [makeNotification('Your palm images need to be re-uploaded. Please check the resubmission instructions.', 'warning')];
  }
  if (status === 'approved') {
    report.notifications = [makeNotification('Your report has been approved and is ready to view!', 'success')];
  }

  return report;
};

export const AppProvider = ({ children }: { children: ReactNode }) => {
  const [isInitializing, setIsInitializing] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [userName, setUserName] = useState<string | null>(null);
  const [reports, setReports] = useState<ReportData[]>([]);
  const [isOperationInProgress, setIsOperationInProgress] = useState(false);
  const [hasPaid, _setHasPaid] = useState(false);
  const [isEditor, setIsEditor] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);
  const router = useRouter();

  const setHasPaid = (paid: boolean) => {
    _setHasPaid(paid);
    if (typeof window !== 'undefined') {
        if (paid) {
            sessionStorage.setItem(HAS_PAID_STORAGE_KEY, 'true');
        } else {
            sessionStorage.removeItem(HAS_PAID_STORAGE_KEY);
        }
    }
  };

  const persistReports = (updatedReports: ReportData[]) => {
    setReports(updatedReports);
    if (typeof window !== 'undefined') {
        localStorage.setItem(REPORTS_STORAGE_KEY, JSON.stringify(updatedReports));
    }
  };

  const loadSampleReports = useCallback(() => {
    const samples = [
      createSampleReport(1, 'Career & Finance', 'user_alpha@example.com', 'pending_review'),
      createSampleReport(2, 'Marriage & Relationships', 'user_beta@example.com', 'pending_admin_approval'),
      createSampleReport(3, 'Health & Wellness', 'user_gamma@example.com', 'approved'),
      createSampleReport(4, 'Comprehensive Analysis', 'user_delta@example.com', 'admin_revision'),
      createSampleReport(5, 'General Personality', 'user_epsilon@example.com', 'needs_resubmission'),
    ];
    persistReports(samples);
  }, []);

  useEffect(() => {
    if (typeof window !== 'undefined') {
        setIsInitializing(true);
        const storedAuth = sessionStorage.getItem('palmverse_isAuthenticated');
        const storedName = sessionStorage.getItem('palmverse_userName');
        const storedIsEditor = sessionStorage.getItem('palmverse_isEditor');
        const storedIsAdmin = sessionStorage.getItem('palmverse_isAdmin');
        const storedReports = localStorage.getItem(REPORTS_STORAGE_KEY);
        const storedHasPaid = sessionStorage.getItem(HAS_PAID_STORAGE_KEY);

        if (storedHasPaid === 'true') {
            _setHasPaid(true);
        }

        if (storedAuth === 'true' && storedName) {
            setIsAuthenticated(true);
            setUserName(storedName);
            if (storedIsEditor === 'true') setIsEditor(true);
            if (storedIsAdmin === 'true') setIsAdmin(true);
        }

        if (storedReports) {
        try {
            const parsedReports = JSON.parse(storedReports) as ReportData[];
            if (Array.isArray(parsedReports) && parsedReports.length > 0 && parsedReports.every(r => typeof r.id === 'string' && typeof r.status === 'string' && r.inputDetails && typeof r.submissionDate === 'string' && typeof r.lastUpdateDate === 'string' && (r.reportType === 'palmistry' || r.reportType === 'numerology'))) {
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

    const isEditorLogin = name === 'editor_user';
    const isAdminLogin = name === 'admin_user';

    setIsEditor(isEditorLogin);
    setIsAdmin(isAdminLogin);

    sessionStorage.setItem('palmverse_isEditor', isEditorLogin ? 'true' : 'false');
    sessionStorage.setItem('palmverse_isAdmin', isAdminLogin ? 'true' : 'false');
  };

  const logout = () => {
    setIsAuthenticated(false);
    setUserName(null);
    setIsEditor(false);
    setIsAdmin(false);

    sessionStorage.removeItem('palmverse_isAuthenticated');
    sessionStorage.removeItem('palmverse_userName');
    sessionStorage.removeItem('palmverse_isEditor');
    sessionStorage.removeItem('palmverse_isAdmin');
    sessionStorage.removeItem(HAS_PAID_STORAGE_KEY);

    router.push('/');
  };

  const createInitialReportPlaceholder = (inputData: ReportPalmInputDetails): string => {
    const newReportId = `${Date.now()}-${Math.random().toString(36).substring(2, 9)}`;
    const currentDate = new Date().toISOString();

    const reportsToKeep = reports.filter(r => {
        return r.userName !== userName || r.status === 'approved';
    });

    const newReport: ReportData = {
      id: newReportId,
      content: "Palm-Astro Correlation report submitted for expert review...",
      status: 'pending_review',
      userName: userName,
      submissionDate: currentDate,
      lastUpdateDate: currentDate,
      category: inputData.category,
      reportType: 'palmistry',
      inputDetails: inputData,
      notifications: [makeNotification('Your submission was received and is awaiting editor review.', 'info')],
    };

    const updatedReports = [...reportsToKeep, newReport];
    persistReports(updatedReports);
    return newReportId;
  };

  const createInitialNumerologyReportPlaceholder = (inputData: Omit<ReportInputDetails, 'serviceQuery'>, category: string): string => {
    const newReportId = `${Date.now()}-${Math.random().toString(36).substring(2, 9)}`;
    const currentDate = new Date().toISOString();

    const reportsToKeep = reports.filter(r => {
        return r.userName !== userName || r.status === 'approved';
    });

    const newReport: ReportData = {
      id: newReportId,
      content: `Numerology report (${category}) submitted for expert review...`,
      status: 'pending_review',
      userName: userName,
      submissionDate: currentDate,
      lastUpdateDate: currentDate,
      category: category,
      reportType: 'numerology',
      inputDetails: inputData as ReportInputDetails,
      notifications: [makeNotification('Your submission was received and is awaiting editor review.', 'info')],
    };

    const updatedReports = [...reportsToKeep, newReport];
    persistReports(updatedReports);
    return newReportId;
  }

  const patchReport = (reportId: string, patch: (r: ReportData) => ReportData) => {
    const updatedReports = reports.map(report =>
      report.id === reportId ? patch(report) : report
    );
    persistReports(updatedReports);
  };

  const appendNotification = (report: ReportData, message: string, type: UserNotification['type']): UserNotification[] => {
    return [...(report.notifications || []), makeNotification(message, type)];
  };

  const updateReportWithGeneratedContent = (reportId: string, aiContent: string) => {
    patchReport(reportId, (report) => ({
      ...report,
      content: aiContent,
      status: 'pending_review',
      lastUpdateDate: new Date().toISOString(),
    }));
  };

  const markReportAsGenerationFailed = (reportId: string, errorMessage: string = "Report generation failed. Please try again.") => {
    patchReport(reportId, (report) => ({
      ...report,
      content: errorMessage,
      status: 'generation_failed',
      lastUpdateDate: new Date().toISOString(),
    }));
  };

  // Generic approve helper (kept for backward compatibility — publishes to customer)
  const approveReport = (reportId: string, newContent?: string) => {
    patchReport(reportId, (report) => ({
      ...report,
      content: newContent || report.content,
      status: 'approved',
      lastUpdateDate: new Date().toISOString(),
      notifications: appendNotification(report, 'Your report has been approved and is ready to view!', 'success'),
    }));
  };

  const updateReportContent = (reportId: string, newContent: string) => {
    patchReport(reportId, (report) => ({
      ...report,
      content: newContent,
      lastUpdateDate: new Date().toISOString(),
    }));
  };

  // --- Pipeline actions ---

  const setImageValidation = (reportId: string, validation: ImageValidationResult) => {
    patchReport(reportId, (report) => ({
      ...report,
      imageValidation: validation,
      lastUpdateDate: new Date().toISOString(),
    }));
  };

  const rejectReportImages = (reportId: string, reason: string) => {
    patchReport(reportId, (report) => ({
      ...report,
      status: 'needs_resubmission',
      rejectionReason: reason,
      lastUpdateDate: new Date().toISOString(),
      notifications: appendNotification(report, `Action needed: ${reason}`, 'warning'),
    }));
  };

  const resubmitReportImages = (reportId: string, frontPalmDataUri: string, sidePalmDataUri: string) => {
    patchReport(reportId, (report) => ({
      ...report,
      status: 'pending_review',
      rejectionReason: undefined,
      imageValidation: undefined,
      lastUpdateDate: new Date().toISOString(),
      inputDetails: {
        ...(report.inputDetails as ReportPalmInputDetails),
        frontPalmDataUri,
        sidePalmDataUri,
      },
      notifications: appendNotification(report, 'Thanks! Your new images were received and are awaiting editor review.', 'info'),
    }));
  };

  const submitReportToAdmin = (reportId: string, generatedContent: string, editorNotes: string, classification: HandClassification) => {
    patchReport(reportId, (report) => ({
      ...report,
      content: generatedContent,
      editorNotes,
      handClassification: classification,
      status: 'pending_admin_approval',
      adminNotes: undefined,
      lastUpdateDate: new Date().toISOString(),
      notifications: appendNotification(report, 'Your report passed editor review and is awaiting final approval.', 'info'),
    }));
  };

  const adminApproveReport = (reportId: string, finalContent?: string) => {
    patchReport(reportId, (report) => ({
      ...report,
      content: finalContent || report.content,
      status: 'approved',
      lastUpdateDate: new Date().toISOString(),
      notifications: appendNotification(report, 'Your report has been approved and is ready to view!', 'success'),
    }));
  };

  const adminRejectToEditor = (reportId: string, adminNotes: string) => {
    patchReport(reportId, (report) => ({
      ...report,
      status: 'admin_revision',
      adminNotes,
      lastUpdateDate: new Date().toISOString(),
    }));
  };

  const markUserNotificationsRead = (reportId: string) => {
    patchReport(reportId, (report) => ({
      ...report,
      notifications: (report.notifications || []).map(n => ({ ...n, read: true })),
    }));
  };

  const getReportById = (reportId: string): ReportData | undefined => {
    return reports.find(report => report.id === reportId);
  };

  const getCurrentUserReport = useCallback((): ReportData | undefined => {
    if (!userName) return undefined;
    const userReports = reports.filter(report => report.userName === userName);
    if (userReports.length === 0) return undefined;

    const priorityStatus: ReportStatus[] = [
      'needs_resubmission',
      'submitted_for_generation',
      'generation_failed',
      'pending_review',
      'pending_admin_approval',
      'admin_revision',
      'approved',
    ];

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
    if (userReport && (userReport.status === 'generation_failed' || userReport.status === 'submitted_for_generation' || userReport.status === 'approved')) {
        const updatedReports = reports.filter(r => r.id !== userReport.id);
        persistReports(updatedReports);
    }
  };

  const startOperation = () => setIsOperationInProgress(true);
  const stopOperation = () => setIsOperationInProgress(false);


  return (
    <AppContext.Provider value={{
      isAuthenticated,
      login,
      logout,
      reports,
      createInitialReportPlaceholder,
      createInitialNumerologyReportPlaceholder,
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
      setImageValidation,
      rejectReportImages,
      resubmitReportImages,
      submitReportToAdmin,
      adminApproveReport,
      adminRejectToEditor,
      markUserNotificationsRead,
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
