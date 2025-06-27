
"use client";
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useAppContext } from '@/context/AppContext';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { useToast } from '@/hooks/use-toast';
import { Loader2, AlertTriangle, LogIn, ListTodo, FileCheck2, Edit, ServerCrash, Briefcase } from 'lucide-react';
import { Badge } from '@/components/ui/badge';

export default function ManagerDashboardPage() {
  const {
    isAuthenticated,
    isManager,
    reports,
    isInitializing,
  } = useAppContext();
  const router = useRouter();
  const { toast } = useToast();

  const [authCheckComplete, setAuthCheckComplete] = useState(false);

  useEffect(() => {
    if (!isInitializing) {
        if (!isAuthenticated) {
            router.push('/');
        } else if (!isManager) {
            toast({ title: "Access Denied", description: "You do not have permission to view this page.", variant: "destructive" });
            router.push('/');
        }
        setAuthCheckComplete(true);
    }
  }, [isAuthenticated, isManager, router, toast, isInitializing]);

  const pendingReviewReports = reports.filter(report => report.status === 'pending_review');
  const approvedReports = reports.filter(report => report.status === 'approved');
  const generationFailedReports = reports.filter(report => report.status === 'generation_failed');

  const recentReports = [...reports]
    .sort((a, b) => new Date(b.submissionDate).getTime() - new Date(a.submissionDate).getTime())
    .slice(0, 10);

  if (isInitializing || !authCheckComplete) {
    return (
        <div className="flex flex-col justify-center items-center min-h-[calc(100vh-var(--header-height)-var(--footer-height)-100px)]">
            <Loader2 className="h-12 w-12 animate-spin text-primary mb-4" />
            <p>Loading manager dashboard...</p>
        </div>
    );
  }

  if (!isAuthenticated || !isManager) {
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

  const getStatusBadgeVariant = (status: string) => {
    switch (status) {
      case 'approved': return 'default';
      case 'pending_review': return 'secondary';
      case 'generation_failed': return 'destructive';
      default: return 'outline';
    }
  };

  const getStatusBadgeClass = (status: string) => {
    switch (status) {
        case 'approved': return 'bg-green-500 hover:bg-green-600';
        case 'pending_review': return 'bg-amber-500 hover:bg-amber-600';
        default: return '';
    }
  }

  return (
    <div className="space-y-6">
        <div className="flex justify-between items-center">
          <h1 className="text-2xl font-semibold">Manager Dashboard</h1>
        </div>
        
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
             <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Pending Review</CardTitle>
                    <ListTodo className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                    <div className="text-2xl font-bold">{pendingReviewReports.length}</div>
                     <Link href="/manager/workflow" className="text-xs text-primary hover:underline">
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
                     <Link href="/manager/approved" className="text-xs text-primary hover:underline">
                        View Approved
                    </Link>
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
        
        <Card>
          <CardHeader>
            <CardTitle>Recent Reports Overview</CardTitle>
            <CardDescription>
              The 10 most recent reports across all statuses.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>User</TableHead>
                  <TableHead>Source Type</TableHead>
                  <TableHead>Category</TableHead>
                  <TableHead>Submitted On</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Action</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {recentReports.length > 0 ? (
                  recentReports.map((report) => (
                    <TableRow key={report.id}>
                      <TableCell>{report.userName}</TableCell>
                      <TableCell className="capitalize">{report.reportType}</TableCell>
                      <TableCell>
                        {report.reportType === 'numerology'
                          ? report.category.split('-').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ')
                          : report.category
                        }
                      </TableCell>
                      <TableCell>
                        {new Date(report.submissionDate).toLocaleDateString()}
                      </TableCell>
                      <TableCell>
                        <Badge variant={getStatusBadgeVariant(report.status)} className={getStatusBadgeClass(report.status)}>
                            {report.status.split('_').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ')}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-right">
                        {report.status === 'pending_review' && (
                          <Button asChild variant="outline" size="sm">
                            <Link href={`/manager/review/${report.id}`}>
                              <Edit className="mr-2 h-4 w-4" />
                              Review
                            </Link>
                          </Button>
                        )}
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={6} className="h-24 text-center">
                      No reports found.
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
    </div>
  );
}

    