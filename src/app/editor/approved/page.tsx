
"use client";
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { useAppContext, type ReportData, type ReportPalmInputDetails } from '@/context/AppContext';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { useToast } from '@/hooks/use-toast';
import { Loader2, AlertTriangle, LogIn, Eye, Archive, FileCheck2 } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription as DialogDesc, DialogFooter } from "@/components/ui/dialog";
import { Label } from '@/components/ui/label';

export default function EditorApprovedReportsPage() {
  const {
    isAuthenticated,
    isEditor,
    reports,
    isInitializing,
    isOperationInProgress,
    loadSampleReports,
  } = useAppContext();
  const router = useRouter();
  const { toast } = useToast();

  const [authCheckComplete, setAuthCheckComplete] = useState(false);
  const [selectedReportForView, setSelectedReportForView] = useState<ReportData | null>(null);
  const [isViewReportDialogOpen, setIsViewReportDialogOpen] = useState(false);

  useEffect(() => {
    if (!isInitializing) {
        if (!isAuthenticated) {
            router.push('/editor-login');
        } else if (!isEditor) {
            toast({ title: "Access Denied", description: "You do not have permission to view this page.", variant: "destructive" });
            router.push('/editor-login');
        }
        setAuthCheckComplete(true);
    }
  }, [isAuthenticated, isEditor, router, toast, isInitializing]);

  const approvedReports = reports.filter(report => report.status === 'approved');

  const openViewReportDialog = (report: ReportData) => {
    setSelectedReportForView(report);
    setIsViewReportDialogOpen(true);
  };
  
  const palmInputDetails = selectedReportForView?.inputDetails as ReportPalmInputDetails | null;

  if (isInitializing || !authCheckComplete) {
    return (
        <div className="flex flex-col justify-center items-center min-h-[calc(100vh-var(--header-height)-var(--footer-height)-100px)]">
            <Loader2 className="h-12 w-12 animate-spin text-primary mb-4" />
            <p>Loading approved reports data...</p>
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
                    <DialogDesc>You do not have permission to view this page.</DialogDesc>
                </CardHeader>
                <CardContent>
                    <Button onClick={() => router.push('/editor-login')}><LogIn className="mr-2"/> Go to Login</Button>
                </CardContent>
            </Card>
        </div>
    );
  }

  return (
    <div className="space-y-6">
        <h1 className="text-2xl font-semibold">Approved Reports</h1>
        <Card className="flex flex-col h-full">
            <CardHeader className="px-4 py-4 border-b">
                <CardTitle className="text-xl flex items-center gap-2 font-headline">
                <FileCheck2 className="h-6 w-6 text-green-500" />
                Approved Reports ({approvedReports.length})
                </CardTitle>
                <CardDescription>These reports have been approved and are visible to users.</CardDescription>
            </CardHeader>
            <CardContent className="p-0 flex-1 flex flex-col">
                {approvedReports.length === 0 ? (
                <div className="flex-1 flex flex-col justify-center items-center text-center py-10 px-4 text-muted-foreground">
                    <Archive className="mx-auto h-12 w-12 mb-3 text-gray-400" />
                    <p>No reports have been approved yet.</p>
                     <Button onClick={loadSampleReports} className="mt-4" variant="outline" size="sm" disabled={isOperationInProgress}>
                        {isOperationInProgress ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
                        Load Sample Reports
                    </Button>
                </div>
                ) : (
                <ScrollArea className="h-full">
                    <Table>
                    <TableHeader>
                        <TableRow>
                        <TableHead className="w-[100px]">Report ID</TableHead>
                        <TableHead>User</TableHead>
                        <TableHead>Category</TableHead>
                        <TableHead>Approved On</TableHead>
                        <TableHead className="text-right">Actions</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {approvedReports.map((report) => (
                        <TableRow key={report.id}>
                            <TableCell className="font-medium text-xs">{report.id.substring(0, 8)}...</TableCell>
                            <TableCell className="text-xs">{report.userName || 'N/A'}</TableCell>
                            <TableCell className="text-xs">{report.category}</TableCell>
                            <TableCell className="text-xs">
                            {report.lastUpdateDate && !isNaN(new Date(report.lastUpdateDate).getTime()) ? new Date(report.lastUpdateDate).toLocaleDateString() : 'N/A'}
                            </TableCell>
                            <TableCell className="text-right">
                                <Button variant="outline" size="sm" onClick={() => openViewReportDialog(report)} disabled={isOperationInProgress}>
                                    <Eye className="mr-2 h-4 w-4"/> View
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

        {selectedReportForView && isViewReportDialogOpen && (
         <Dialog open={isViewReportDialogOpen} onOpenChange={(open) => { setIsViewReportDialogOpen(open); if (!open) setSelectedReportForView(null); }}>
          <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Approved Report: {selectedReportForView.id.substring(0,10)}...</DialogTitle>
              <DialogDesc>Category: {selectedReportForView.category} | Submitted by: {selectedReportForView.userName || 'N/A'}</DialogDesc>
            </DialogHeader>
            {palmInputDetails && (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 my-4">
                {palmInputDetails.frontPalmDataUri && 
                  <div className="text-center">
                    <Image src={palmInputDetails.frontPalmDataUri} alt={`Front of ${palmInputDetails.dominantHand} Palm`} width={250} height={180} className="rounded-md border mx-auto" data-ai-hint="palm hand front"/>
                    <p className="text-xs text-muted-foreground mt-1">Front of {palmInputDetails.dominantHand} Palm</p>
                  </div>
                }
                {palmInputDetails.sidePalmDataUri && 
                  <div className="text-center">
                    <Image src={palmInputDetails.sidePalmDataUri} alt={`Side of ${palmInputDetails.dominantHand} Palm`} width={250} height={180} className="rounded-md border mx-auto" data-ai-hint="palm hand side"/>
                    <p className="text-xs text-muted-foreground mt-1">Side of {palmInputDetails.dominantHand} Palm</p>
                  </div>
                }
              </div>
            )}
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
