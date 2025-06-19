
"use client";
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useAppContext } from '@/context/AppContext';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import { Loader2, AlertTriangle, LogIn, Layers, ListTodo, FileCheck2, RefreshCw, Sparkles, ServerCrash } from 'lucide-react';

export default function EditorDashboardPage() {
  const {
    isAuthenticated,
    isEditor,
    reports,
    isInitializing,
    loadSampleReports,
    isOperationInProgress,
  } = useAppContext();
  const router = useRouter();
  const { toast } = useToast();

  const [authCheckComplete, setAuthCheckComplete] = useState(false);

  useEffect(() => {
    if (!isInitializing) {
        if (!isAuthenticated) {
            router.push('/');
        } else if (!isEditor) {
            toast({ title: "Access Denied", description: "You do not have permission to view this page.", variant: "destructive" });
            router.push('/');
        }
        setAuthCheckComplete(true);
    }
  }, [isAuthenticated, isEditor, router, toast, isInitializing]);

  const pendingReviewReports = reports.filter(report => report.status === 'pending_review');
  const approvedReports = reports.filter(report => report.status === 'approved');
  const submittedForGenerationReports = reports.filter(report => report.status === 'submitted_for_generation');
  const generationFailedReports = reports.filter(report => report.status === 'generation_failed');
  const totalReports = reports.length;

  if (isInitializing || !authCheckComplete) {
    return (
        <div className="flex flex-col justify-center items-center min-h-[calc(100vh-var(--header-height)-var(--footer-height)-100px)]">
            <Loader2 className="h-12 w-12 animate-spin text-primary mb-4" />
            <p>Loading dashboard data...</p>
        </div>
    );
  }

  if (!isAuthenticated || !isEditor) {
    return (
        <div className="flex flex-col justify-center items-center min-h-[calc(100vh-var(--header-height)-var(--footer-height)-100px)]">
             <Card className="w-full max-w-md text-center p-6">
                <CardHeader>
                    <div className="mx-auto bg-destructive/10 p-3 rounded-full w-fit mb-4">
                        <AlertTriangle className="h-10 w-10 text-destructive" />
                    </div>
                    <CardTitle>Access Denied</CardTitle>
                    <CardDescription>You do not have permission to view this page.</CardDescription>
                </CardHeader>
                <CardContent>
                    <Button onClick={() => router.push('/')}><LogIn className="mr-2"/> Go to Login</Button>
                </CardContent>
            </Card>
        </div>
    );
  }

  return (
    <div className="space-y-6">
        <div className="flex justify-between items-center">
          <h1 className="text-2xl font-semibold">Editor Dashboard</h1>
          <Button onClick={loadSampleReports} variant="outline" size="sm" disabled={isOperationInProgress}>
            <RefreshCw className="mr-2 h-4 w-4" />
            Reload Sample Data
          </Button>
        </div>
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3"> {/* Adjusted grid to fit cards */}
            <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Total Reports</CardTitle>
                    <Layers className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                    <div className="text-2xl font-bold">{totalReports}</div>
                     <p className="text-xs text-muted-foreground">
                        All reports in the system.
                    </p>
                </CardContent>
            </Card>
            <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Pending Review</CardTitle>
                    <ListTodo className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                    <div className="text-2xl font-bold">{pendingReviewReports.length}</div>
                     <Link href="/editor/workflow" className="text-xs text-primary hover:underline">
                        Go to Workflow
                    </Link>
                </CardContent>
            </Card>
            <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Approved Reports</CardTitle>
                    <FileCheck2 className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                    <div className="text-2xl font-bold">{approvedReports.length}</div>
                     <Link href="/editor/approved" className="text-xs text-primary hover:underline">
                        View Approved
                    </Link>
                </CardContent>
            </Card>
            <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Generating Reports</CardTitle>
                    <Sparkles className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                    <div className="text-2xl font-bold">{submittedForGenerationReports.length}</div>
                    <p className="text-xs text-muted-foreground">
                        Currently being generated by AI.
                    </p>
                </CardContent>
            </Card>
            <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Generation Failed</CardTitle>
                    <ServerCrash className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                    <div className="text-2xl font-bold">{generationFailedReports.length}</div>
                     <p className="text-xs text-muted-foreground">
                        AI failed to generate these.
                    </p>
                </CardContent>
            </Card>
        </div>
    </div>
  );
}
