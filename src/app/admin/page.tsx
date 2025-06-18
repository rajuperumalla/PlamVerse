
"use client";
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useAppContext } from '@/context/AppContext';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import { Loader2, AlertTriangle, LogIn, Layers, ListTodo, FileCheck2 } from 'lucide-react';

export default function AdminDashboardPage() {
  const { 
    isAuthenticated,
    isAdmin,
    reports, 
    isLoading: contextIsLoading,
  } = useAppContext();
  const router = useRouter();
  const { toast } = useToast();
  
  const [authCheckComplete, setAuthCheckComplete] = useState(false);

  useEffect(() => {
    if (!contextIsLoading) {
        if (!isAuthenticated) {
            router.push('/'); 
        } else if (!isAdmin) {
            toast({ title: "Access Denied", description: "You do not have permission to view this page.", variant: "destructive" });
            router.push('/'); 
        }
        setAuthCheckComplete(true);
    }
  }, [isAuthenticated, isAdmin, router, toast, contextIsLoading]);

  const pendingReviewReports = reports.filter(report => report.status === 'pending_review');
  const approvedReports = reports.filter(report => report.status === 'approved');
  const totalReports = reports.length;


  if (!authCheckComplete || (contextIsLoading && !reports.length)) {
    return (
        <div className="flex flex-col justify-center items-center min-h-[calc(100vh-var(--header-height)-var(--footer-height)-100px)]">
            <Loader2 className="h-12 w-12 animate-spin text-primary mb-4" />
            <p>Loading dashboard...</p>
        </div>
    );
  }
  
  if (authCheckComplete && (!isAuthenticated || !isAdmin)) {
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
        <h1 className="text-2xl font-semibold">Admin Dashboard</h1>
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Total Reports</CardTitle>
                    <Layers className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                    <div className="text-2xl font-bold">{totalReports}</div>
                </CardContent>
            </Card>
            <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Pending Review</CardTitle>
                    <ListTodo className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                    <div className="text-2xl font-bold">{pendingReviewReports.length}</div>
                     <Link href="/admin/workflow" className="text-xs text-primary hover:underline">
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
                     <Link href="/admin/approved" className="text-xs text-primary hover:underline">
                        View Approved
                    </Link>
                </CardContent>
            </Card>
        </div>
        {/* Tables for Approved and Completed reports have been moved to /admin/approved page */}
    </div>
  );
}
