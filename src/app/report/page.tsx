
"use client";
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import ReportDisplay from '@/components/palm-reading/ReportDisplay';
import { useAppContext, type ReportData } from '@/context/AppContext'; // Import ReportData
import { Skeleton } from '@/components/ui/skeleton';
import { Button } from '@/components/ui/button';
import { AlertTriangle, Info, Hourglass } from 'lucide-react'; // Added Hourglass
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';

export default function ReportPage() {
  const { isAuthenticated, isLoading: contextIsLoading, getCurrentUserReport } = useAppContext();
  const router = useRouter();
  const [isCheckingAuth, setIsCheckingAuth] = useState(true);
  const [currentUserReport, setCurrentUserReport] = useState<ReportData | undefined>(undefined);

  useEffect(() => {
    const report = getCurrentUserReport();
    setCurrentUserReport(report);

    const timer = setTimeout(() => {
        if (!isAuthenticated) {
            router.push('/');
        } else if (!report && !contextIsLoading) {
            // If no report for current user and not loading, redirect to input.
            router.push('/palm-input');
        }
        setIsCheckingAuth(false);
    }, 100); // Increased delay slightly for context to settle
    return () => clearTimeout(timer);
  }, [isAuthenticated, getCurrentUserReport, router, contextIsLoading]);


  if (isCheckingAuth || (contextIsLoading && !currentUserReport)) { 
    return (
      <div className="space-y-6 p-8 max-w-3xl mx-auto">
        <Skeleton className="h-12 w-3/4 mx-auto" />
        <Skeleton className="h-8 w-1/2 mx-auto" />
        <Skeleton className="h-[400px] w-full mt-8" />
        <div className="flex justify-center gap-4 mt-6">
          <Skeleton className="h-10 w-36" />
          <Skeleton className="h-10 w-36" />
        </div>
      </div>
    );
  }

  if (!currentUserReport) {
    return (
      <div className="flex flex-col items-center justify-center text-center py-12 min-h-[calc(100vh-200px)]">
        <AlertTriangle className="h-16 w-16 text-destructive mb-4" />
        <h2 className="text-2xl font-headline mb-2">No Report Available For You</h2>
        <p className="text-muted-foreground mb-6">It seems there's no report associated with your account, or you haven't submitted details yet.</p>
        <Button onClick={() => router.push('/palm-input')}>
          Go to Palm Input
        </Button>
      </div>
    );
  }

  if (currentUserReport.status === 'pending_review') {
    return (
      <div className="flex flex-col items-center justify-center text-center py-12 min-h-[calc(100vh-200px)]">
        <Card className="w-full max-w-lg shadow-lg">
          <CardHeader className="items-center">
            <div className="p-3 bg-blue-100/70 dark:bg-blue-900/30 rounded-full mb-4">
              <Hourglass className="h-12 w-12 text-blue-600 dark:text-blue-400" />
            </div>
            <CardTitle className="font-headline text-2xl">Report Pending Expert Review</CardTitle>
            <CardDescription>Your personalized palm reading is being carefully reviewed.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-muted-foreground">
              Report ID: <span className="font-mono text-xs">{currentUserReport.id.substring(0,10)}...</span>
            </p>
            <p className="text-muted-foreground">
              Your report has been generated and is currently undergoing an expert review to ensure the highest quality and accuracy.
            </p>
            <p className="text-muted-foreground">
              Please check back soon. This usually takes a short while.
            </p>
            <Button onClick={() => router.push('/palm-input')} variant="outline" className="mt-6 w-full">
              Back to Input / Start New
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }
  
  // Only render ReportDisplay if reportData.status is 'approved'
  return (
    <ReportDisplay report={currentUserReport} /> 
  );
}
