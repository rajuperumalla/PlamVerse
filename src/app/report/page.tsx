
"use client";
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import ReportDisplay from '@/components/palm-reading/ReportDisplay';
import { useAppContext, type ReportData } from '@/context/AppContext';
import { Skeleton } from '@/components/ui/skeleton';
import { Button } from '@/components/ui/button';
import { AlertTriangle, Info, Hourglass, FileText, Loader2, ServerCrash, Sparkles } from 'lucide-react'; 
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';

export default function ReportPage() {
  const { isAuthenticated, isLoading: contextIsLoading, getCurrentUserReport, userName } = useAppContext();
  const router = useRouter();
  const [isCheckingAuth, setIsCheckingAuth] = useState(true);
  const [currentUserReport, setCurrentUserReport] = useState<ReportData | undefined | null>(null); // null means checking, undefined means no report found

  useEffect(() => {
    if (!userName) { // If no userName, means not logged in or context not ready
        setIsCheckingAuth(true); // Keep checking
        const timer = setTimeout(() => { // Add a small delay before redirecting
             if (!isAuthenticated && !contextIsLoading) { // check isAuthenticated after delay
                router.push('/');
             }
        }, 500);
        return () => clearTimeout(timer);
    }

    const report = getCurrentUserReport();
    setCurrentUserReport(report);
    setIsCheckingAuth(false); // Auth check is complete (or user identified)

    if (!report && !contextIsLoading && userName) {
        // If definitively no report for this user and not loading, redirect to input.
        const timer = setTimeout(() => router.push('/palm-input'), 100);
        return () => clearTimeout(timer);
    }

  }, [isAuthenticated, getCurrentUserReport, router, contextIsLoading, userName]);


  if (isCheckingAuth || currentUserReport === null || (contextIsLoading && !currentUserReport)) { 
    return (
      <div className="flex flex-col items-center justify-center min-h-[calc(100vh-200px)]">
        <Loader2 className="h-12 w-12 animate-spin text-primary mb-4" />
        <p className="text-muted-foreground">Loading your report status...</p>
      </div>
    );
  }

  if (!currentUserReport) { // User is authenticated, but no report object found for them
    return (
      <div className="flex flex-col items-center justify-center text-center py-12 min-h-[calc(100vh-200px)]">
        <Info className="h-16 w-16 text-blue-500 mb-4" />
        <h2 className="text-2xl font-headline mb-2">No Report Journey Started Yet</h2>
        <p className="text-muted-foreground mb-6">It looks like you haven't submitted details for a palm reading.</p>
        <Button onClick={() => router.push('/palm-input')}>
          Start Your Palm Reading
        </Button>
      </div>
    );
  }

  // Display content based on report status
  switch (currentUserReport.status) {
    case 'submitted_for_generation':
      return (
        <div className="flex flex-col items-center justify-center text-center py-12 min-h-[calc(100vh-200px)]">
          <Card className="w-full max-w-lg shadow-lg">
            <CardHeader className="items-center">
              <div className="p-3 bg-primary/10 rounded-full mb-4 animate-pulse-subtle">
                <Sparkles className="h-12 w-12 text-primary" />
              </div>
              <CardTitle className="font-headline text-2xl">Report Generation Initiated</CardTitle>
              <CardDescription>Your request is being processed by our AI.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-muted-foreground">
                Report ID: <span className="font-mono text-xs">{currentUserReport.id.substring(0,10)}...</span>
              </p>
              <p className="text-muted-foreground">
                Your personalized palm reading is currently being generated. This usually takes a few moments.
              </p>
              <p className="text-muted-foreground">
                Please check back soon. You can refresh this page.
              </p>
            </CardContent>
            <CardFooter>
                <Button onClick={() => router.refresh()} variant="outline" className="w-full">Refresh Status</Button>
            </CardFooter>
          </Card>
        </div>
      );
    case 'generation_failed':
      return (
        <div className="flex flex-col items-center justify-center text-center py-12 min-h-[calc(100vh-200px)]">
          <Card className="w-full max-w-lg shadow-lg border-destructive">
            <CardHeader className="items-center">
              <div className="p-3 bg-destructive/10 rounded-full mb-4">
                <ServerCrash className="h-12 w-12 text-destructive" />
              </div>
              <CardTitle className="font-headline text-2xl text-destructive">Report Generation Failed</CardTitle>
              <CardDescription>We encountered an issue processing your request.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
               <p className="text-muted-foreground">
                Report ID: <span className="font-mono text-xs">{currentUserReport.id.substring(0,10)}...</span>
              </p>
              <p className="text-destructive/90">
                {currentUserReport.content || "An unexpected error occurred during report generation."}
              </p>
              <p className="text-muted-foreground">
                Please try submitting your details again. If the problem persists, contact support.
              </p>
              <Button onClick={() => router.push('/palm-input')} className="mt-6 w-full">
                Try Again
              </Button>
            </CardContent>
          </Card>
        </div>
      );
    case 'pending_review':
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
            </CardContent>
             <CardFooter>
                <Button onClick={() => router.refresh()} variant="outline" className="w-full">Refresh Status</Button>
            </CardFooter>
          </Card>
        </div>
      );
    case 'approved':
      return <ReportDisplay report={currentUserReport} />;
    default: // Should not happen with defined statuses
      return (
        <div className="flex flex-col items-center justify-center text-center py-12 min-h-[calc(100vh-200px)]">
          <AlertTriangle className="h-16 w-16 text-destructive mb-4" />
          <h2 className="text-2xl font-headline mb-2">Unknown Report Status</h2>
          <p className="text-muted-foreground mb-6">We're unsure about the status of your report. Please contact support.</p>
          <Button onClick={() => router.push('/palm-input')}>
            Back to Palm Input
          </Button>
        </div>
      );
  }
}
