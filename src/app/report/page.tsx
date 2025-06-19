
"use client";
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import ReportDisplay from '@/components/palm-reading/ReportDisplay';
import { useAppContext, type ReportData } from '@/context/AppContext';
import { Button } from '@/components/ui/button';
import { AlertTriangle, Info, Hourglass, Loader2, ServerCrash, Sparkles } from 'lucide-react'; 
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';

export default function ReportPage() {
  const { isAuthenticated, isInitializing, getCurrentUserReport, userName, isOperationInProgress } = useAppContext(); // Use isInitializing
  const router = useRouter();
  const [currentUserReport, setCurrentUserReport] = useState<ReportData | undefined | null>(null);

  useEffect(() => {
    if (isInitializing) { // If context is still initializing, wait.
      setCurrentUserReport(null); // Explicitly set to loading state
      return;
    }

    // Context is initialized, proceed with auth and report fetching logic
    if (!userName) {
        if (!isAuthenticated) { // Check isAuthenticated only after isInitializing is false
            router.push('/');
            return; 
        }
        // If authenticated but userName is somehow null (shouldn't happen with proper login)
        // or if context is ready but no userName, treat as error or redirect.
        // For now, let's assume this means we can't fetch a user-specific report.
        setCurrentUserReport(undefined); // No report can be fetched
        return;
    }

    const report = getCurrentUserReport();
    setCurrentUserReport(report);

    if (!report && userName) { // userName exists, context initialized, but no report found
        // Redirect to palm-input if no report exists for the user, to encourage creation
        const timer = setTimeout(() => router.push('/palm-input'), 100);
        return () => clearTimeout(timer);
    }

  }, [isAuthenticated, getCurrentUserReport, router, isInitializing, userName]);


  if (isInitializing || currentUserReport === null) { 
    return (
      <div className="flex flex-col items-center justify-center min-h-[calc(100vh-200px)]">
        <Loader2 className="h-12 w-12 animate-spin text-primary mb-4" />
        <p className="text-muted-foreground">Loading your report status...</p>
      </div>
    );
  }

  if (!currentUserReport) { // userName exists, context initialized, but no report object found
    return (
      <div className="flex flex-col items-center justify-center text-center py-12 min-h-[calc(100vh-200px)]">
        <Info className="h-16 w-16 text-primary mb-4" />
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
                <Button onClick={() => router.refresh()} variant="outline" className="w-full" disabled={isOperationInProgress}>Refresh Status</Button>
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
              <div className="p-3 bg-accent/10 dark:bg-accent/20 rounded-full mb-4">
                <Hourglass className="h-12 w-12 text-accent dark:text-accent" />
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
                <Button onClick={() => router.refresh()} variant="outline" className="w-full" disabled={isOperationInProgress}>Refresh Status</Button>
            </CardFooter>
          </Card>
        </div>
      );
    case 'approved':
      return <ReportDisplay report={currentUserReport} />;
    default: 
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
