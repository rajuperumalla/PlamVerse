
"use client";
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useAppContext, type ReportData } from '@/context/AppContext';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { useToast } from '@/hooks/use-toast';
import { Loader2, AlertTriangle, LogIn, Edit, Archive, Columns } from 'lucide-react';

export default function AdminWorkflowPage() {
  const { 
    isAuthenticated,
    isAdmin,
    reports, 
    isLoading: contextIsLoading,
    loadSampleReports,
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

  if (!authCheckComplete || (contextIsLoading && !reports.length)) {
    return (
        <div className="flex flex-col justify-center items-center min-h-[calc(100vh-var(--header-height)-var(--footer-height)-100px)]">
            <Loader2 className="h-12 w-12 animate-spin text-primary mb-4" />
            <p>Loading workflow items...</p>
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
        <h1 className="text-2xl font-semibold">Pending Reviews Workflow</h1>
        <Card className="flex flex-col h-full"> {/* Ensure Card can grow */}
            <CardHeader className="px-4 py-4 border-b">
                <CardTitle className="text-xl flex items-center gap-2 font-headline">
                <Columns className="h-6 w-6 text-amber-500" />
                Reports Pending Review ({pendingReviewReports.length})
                </CardTitle>
                <CardDescription>Select a report to review and process.</CardDescription>
            </CardHeader>
            <CardContent className="p-0 flex-1 flex flex-col"> {/* Allow CardContent to manage flex children */}
                {contextIsLoading && pendingReviewReports.length === 0 ? (
                <div className="flex-1 flex justify-center items-center py-12">
                    <Loader2 className="h-10 w-10 animate-spin text-primary" />
                    <p className="ml-3 text-muted-foreground">Loading reports...</p>
                </div>
                ) : !contextIsLoading && pendingReviewReports.length === 0 ? (
                <div className="flex-1 flex flex-col justify-center items-center text-center py-10 px-4 text-muted-foreground">
                    <Archive className="mx-auto h-12 w-12 mb-3 text-gray-400" />
                    <p>No reports currently pending review.</p>
                    <Button onClick={loadSampleReports} className="mt-4" variant="outline" size="sm" disabled={contextIsLoading}>
                        {contextIsLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
                        Load Sample Reports
                    </Button>
                </div>
                ) : (
                <ScrollArea className="h-full"> {/* ScrollArea takes height from parent */}
                    <Table>
                    <TableHeader>
                        <TableRow>
                        <TableHead className="w-[100px]">Report ID</TableHead>
                        <TableHead>User</TableHead>
                        <TableHead>Category</TableHead>
                        <TableHead>Submitted</TableHead>
                        <TableHead className="text-right">Actions</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {pendingReviewReports.map((report) => (
                        <TableRow key={report.id}>
                            <TableCell className="font-medium text-xs">{report.id.substring(0, 8)}...</TableCell>
                            <TableCell className="text-xs">{report.userName || 'N/A'}</TableCell>
                            <TableCell className="text-xs">{report.category}</TableCell>
                            <TableCell className="text-xs">
                            {report.submissionDate && !isNaN(new Date(report.submissionDate).getTime()) ? new Date(report.submissionDate).toLocaleDateString() : 'N/A'}
                            </TableCell>
                            <TableCell className="text-right">
                                <Button asChild variant="outline" size="sm">
                                <Link href={`/admin/review/${report.id}`}>
                                    <Edit className="mr-2 h-4 w-4"/> Review
                                </Link>
                                </Button>
                            </TableCell>
                        </TableRow>
                        ))}
                    </TableBody>
                    </Table>
                </ScrollArea>
                )}
            </CardContent>
        </Card>
    </div>
  );
}
