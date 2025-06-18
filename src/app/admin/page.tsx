
"use client";
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { useAppContext, type ReportData } from '@/context/AppContext';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { Loader2, AlertTriangle, LogIn, Eye, ShieldQuestion, Columns, Archive, FileCheck2, Edit, FileSearch, MessageCircleQuestion, Send, Brain, CheckCircle, ThumbsUp, CheckSquare } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Textarea } from '@/components/ui/textarea';
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { suggestReportImprovements } from '@/ai/flows/suggest-report-improvements';
import { refinePalmReadingReport } from '@/ai/flows/refine-palm-reading-report';

export default function AdminPage() {
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
  const [selectedReportForView, setSelectedReportForView] = useState<ReportData | null>(null);
  const [isViewReportDialogOpen, setIsViewReportDialogOpen] = useState(false);


  useEffect(() => {
    if (!isAuthenticated) {
      router.push('/'); 
    } else if (!isAdmin) {
      toast({ title: "Access Denied", description: "You do not have permission to view this page.", variant: "destructive" });
      router.push('/'); 
    }
    setAuthCheckComplete(true);
  }, [isAuthenticated, isAdmin, router, toast]);

  const pendingReviewReports = reports.filter(report => report.status === 'pending_review');
  const approvedReports = reports.filter(report => report.status === 'approved');
  const completedReports = reports.filter(report => report.status === 'completed');


  const openViewReportDialog = (report: ReportData) => {
    setSelectedReportForView(report);
    setIsViewReportDialogOpen(true);
  };

  if (!authCheckComplete || !isAuthenticated || !isAdmin) {
    return (
        <div className="flex flex-col justify-center items-center min-h-[calc(100vh-200px)]">
            <Loader2 className="h-12 w-12 animate-spin text-primary mb-4" />
            {!authCheckComplete && <p>Verifying access...</p>}
            {authCheckComplete && (!isAuthenticated || !isAdmin) && (
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
            )}
        </div>
    );
  }

  const renderReportTable = (reportList: ReportData[], title: string, titleIcon: React.ReactNode, emptyMessage: string, actionButtonLabel: string, actionHandler: (report: ReportData) => void, actionIcon: React.ReactNode, rowLink?: (reportId: string) => string) => (
    <Card className="flex flex-col h-full">
      <CardHeader className="px-4 py-4 border-b">
        <CardTitle className="text-2xl flex items-center gap-2 font-headline">
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
            {title === "Pending Review" && (
                <Button onClick={loadSampleReports} className="mt-4" variant="outline" size="sm" disabled={contextIsLoading}>
                {contextIsLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
                Load Sample Reports
                </Button>
            )}
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
  
  return (
    <div className="container mx-auto py-8">
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8">
        {renderReportTable(
          pendingReviewReports,
          "Pending Review",
          <Columns className="h-7 w-7 text-amber-500" />,
          "No reports currently pending review.",
          "Review",
          () => {}, 
          <Edit className="mr-2 h-4 w-4"/>,
          (reportId) => `/admin/review/${reportId}`
        )}

        {renderReportTable(
          approvedReports,
          "Approved Reports",
          <FileCheck2 className="h-7 w-7 text-green-500" />,
          "No reports have been approved yet.",
          "View",
          openViewReportDialog,
          <FileSearch className="mr-2 h-4 w-4"/>
        )}

        {renderReportTable(
          completedReports,
          "Completed Reports",
          <CheckSquare className="h-7 w-7 text-blue-500" />,
          "No reports are marked as completed.",
          "View",
          openViewReportDialog,
          <FileSearch className="mr-2 h-4 w-4"/>
        )}
      </div>
      
      <CardFooter className="mt-12 border-t pt-6">
        <p className="text-xs text-muted-foreground text-center w-full">
          Admin actions are logged (simulated). Ensure all reports meet quality standards before approval.
        </p>
      </CardFooter>

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
    
