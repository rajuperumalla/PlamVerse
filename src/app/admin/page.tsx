
"use client";
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { useAppContext, type ReportData } from '@/context/AppContext';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { useToast } from '@/hooks/use-toast';
import { Loader2, AlertTriangle, LogIn, Eye, FileCheck2, CheckSquare, Archive, Layers, ListTodo, Edit } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { Label } from '@/components/ui/label';

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
  const [selectedReportForView, setSelectedReportForView] = useState<ReportData | null>(null);
  const [isViewReportDialogOpen, setIsViewReportDialogOpen] = useState(false);

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
  const completedReports = reports.filter(report => report.status === 'completed');
  const totalReports = reports.length;

  const openViewReportDialog = (report: ReportData) => {
    setSelectedReportForView(report);
    setIsViewReportDialogOpen(true);
  };

  const renderReportTable = (reportList: ReportData[], title: string, titleIcon: React.ReactNode, emptyMessage: string, actionButtonLabel: string, actionHandler: (report: ReportData) => void, actionIcon: React.ReactNode, rowLink?: (reportId: string) => string) => (
    <Card className="flex flex-col h-full">
      <CardHeader className="px-4 py-4 border-b">
        <CardTitle className="text-xl flex items-center gap-2 font-headline">
          {titleIcon}
          {title} ({reportList.length})
        </CardTitle>
      </CardHeader>
      <CardContent className="p-0 flex-1 flex flex-col">
        {contextIsLoading && reportList.length === 0 ? (
          <div className="flex-1 flex justify-center items-center py-12">
            <Loader2 className="h-10 w-10 animate-spin text-primary" />
            <p className="ml-3 text-muted-foreground">Loading reports...</p>
          </div>
        ) : !contextIsLoading && reportList.length === 0 ? (
          <div className="flex-1 flex flex-col justify-center items-center text-center py-10 px-4 text-muted-foreground">
            <Archive className="mx-auto h-12 w-12 mb-3 text-gray-400" />
            <p>{emptyMessage}</p>
          </div>
        ) : (
          <ScrollArea className="h-full">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-[100px]">Report ID</TableHead>
                  <TableHead>User</TableHead>
                  <TableHead>Category</TableHead>
                  <TableHead>Date</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {reportList.map((report) => (
                  <TableRow key={report.id}>
                    <TableCell className="font-medium text-xs">{report.id.substring(0, 8)}...</TableCell>
                    <TableCell className="text-xs">{report.userName || 'N/A'}</TableCell>
                    <TableCell className="text-xs">{report.category}</TableCell>
                    <TableCell className="text-xs">
                      {report.status === 'pending_review' ? 
                        (report.submissionDate && !isNaN(new Date(report.submissionDate).getTime()) ? new Date(report.submissionDate).toLocaleDateString() : 'N/A')
                        : (report.lastUpdateDate && !isNaN(new Date(report.lastUpdateDate).getTime()) ? new Date(report.lastUpdateDate).toLocaleDateString() : 'N/A')
                      }
                    </TableCell>
                    <TableCell className="text-right">
                      {rowLink ? (
                        <Button asChild variant="outline" size="sm">
                          <Link href={rowLink(report.id)}>
                            {actionIcon} {actionButtonLabel}
                          </Link>
                        </Button>
                      ) : (
                        <Button variant="outline" size="sm" onClick={() => actionHandler(report)}>
                          {actionIcon} {actionButtonLabel}
                        </Button>
                      )}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </ScrollArea>
        )}
      </CardContent>
    </Card>
  );

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
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
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
                </CardContent>
            </Card>
            <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Completed Reports</CardTitle>
                    <CheckSquare className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                    <div className="text-2xl font-bold">{completedReports.length}</div>
                </CardContent>
            </Card>
        </div>

      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
        {renderReportTable(
          approvedReports,
          "Approved Reports",
          <FileCheck2 className="h-6 w-6 text-green-500" />,
          "No reports have been approved yet.",
          "View",
          openViewReportDialog,
          <Eye className="mr-2 h-4 w-4"/>
        )}

        {renderReportTable(
          completedReports,
          "Completed Reports",
          <CheckSquare className="h-6 w-6 text-blue-500" />,
          "No reports are marked as completed.",
          "View",
          openViewReportDialog,
          <Eye className="mr-2 h-4 w-4"/>
        )}
      </div>
      
      {selectedReportForView && isViewReportDialogOpen && (
         <Dialog open={isViewReportDialogOpen} onOpenChange={(open) => { setIsViewReportDialogOpen(open); if (!open) setSelectedReportForView(null); }}>
          <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>{selectedReportForView.status.charAt(0).toUpperCase() + selectedReportForView.status.slice(1)} Report: {selectedReportForView.id.substring(0,10)}...</DialogTitle>
              <DialogDescription>Category: {selectedReportForView.category} | Submitted by: {selectedReportForView.userName || 'N/A'}</DialogDescription>
            </DialogHeader>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 my-4">
              {selectedReportForView.inputDetails.leftPalmDataUri && 
                  <div className="text-center">
                  <Image src={selectedReportForView.inputDetails.leftPalmDataUri} alt="Left Palm" width={250} height={180} className="rounded-md border mx-auto" data-ai-hint="palm hand" />
                  <p className="text-xs text-muted-foreground mt-1">Left Palm</p>
                </div>
              }
              {selectedReportForView.inputDetails.rightPalmDataUri && 
                <div className="text-center">
                  <Image src={selectedReportForView.inputDetails.rightPalmDataUri} alt="Right Palm" width={250} height={180} className="rounded-md border mx-auto" data-ai-hint="palm hand" />
                  <p className="text-xs text-muted-foreground mt-1">Right Palm</p>
                </div>
              }
            </div>
            <Label className="font-semibold">Report Content:</Label>
            <ScrollArea className="h-[250px] w-full rounded-md border p-4 mt-1 bg-muted/10 text-sm">
              {selectedReportForView.content.split('\n').filter(p => p.trim() !== '').map((paragraph, index) => (
                <p key={index} className="mb-2 leading-relaxed">{paragraph}</p>
              ))}
            </ScrollArea>
             <DialogFooter className="mt-4">
                <Button onClick={() => setIsViewReportDialogOpen(false)}>Close</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
}
