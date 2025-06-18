
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
import { Loader2, AlertTriangle, LogIn, Eye, ShieldQuestion, Columns, Archive, FileCheck2, Edit, FileSearch, MessageCircleQuestion, Send, Brain, CheckCircle, ThumbsUp } from 'lucide-react';
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
    approveReport,
    updateReportContent, // Added for refine flow
  } = useAppContext();
  const router = useRouter();
  const { toast } = useToast();
  
  const [authCheckComplete, setAuthCheckComplete] = useState(false);
  const [selectedReportForView, setSelectedReportForView] = useState<ReportData | null>(null);
  const [isViewApprovedDialogOpen, setIsViewApprovedDialogOpen] = useState(false);


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

  const openViewApprovedDialog = (report: ReportData) => {
    setSelectedReportForView(report);
    setIsViewApprovedDialogOpen(true);
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
  
  return (
    <div className="container mx-auto py-8">
      <div className="text-center mb-12">
         <div className="mx-auto bg-primary/10 p-4 rounded-full w-fit mb-4 inline-block">
          <ShieldQuestion className="h-12 w-12 text-primary" />
        </div>
        <h1 className="font-headline text-4xl font-bold">Admin Workflow Panel</h1>
        <p className="text-muted-foreground text-lg mt-2">Manage and review AI-generated palm readings.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Pending Review Section */}
        <section>
          <Card className="flex flex-col h-full"> {/* Card as flex column and full height of grid cell */}
            <CardHeader className="px-4 py-4 border-b">
              <CardTitle className="text-2xl flex items-center gap-2 font-headline">
                <Columns className="h-7 w-7 text-amber-500" />
                Pending Review ({pendingReviewReports.length})
              </CardTitle>
              <CardDescription>Reports awaiting expert review and approval.</CardDescription>
            </CardHeader>
            <CardContent className="p-0 flex-1 flex flex-col"> {/* CardContent expands and is flex column */}
              {contextIsLoading && pendingReviewReports.length === 0 ? ( 
                <div className="flex-1 flex justify-center items-center py-12">
                    <Loader2 className="h-10 w-10 animate-spin text-primary" />
                    <p className="ml-3 text-muted-foreground">Loading pending reports...</p>
                </div>
              ) : !contextIsLoading && pendingReviewReports.length === 0 ? (
                <div className="flex-1 flex flex-col justify-center items-center text-center py-10 px-4 text-muted-foreground">
                  <Archive className="mx-auto h-12 w-12 mb-3 text-gray-400"/>
                  <p>No reports currently pending review.</p>
                  <Button onClick={loadSampleReports} className="mt-4" variant="outline" size="sm" disabled={contextIsLoading}>
                    {contextIsLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
                    Load Sample Reports
                  </Button>
                </div>
              ) : (
                <ScrollArea className="h-full"> {/* ScrollArea takes full height of CardContent */}
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead className="w-[120px]">Report ID</TableHead>
                        <TableHead>User</TableHead>
                        <TableHead>Category</TableHead>
                        <TableHead>Submitted</TableHead>
                        <TableHead className="text-right">Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {pendingReviewReports.map((report) => (
                        <TableRow key={report.id}>
                          <TableCell className="font-medium text-xs">{report.id.substring(0,10)}...</TableCell>
                          <TableCell className="text-xs">{report.userName || 'N/A'}</TableCell>
                          <TableCell className="text-xs">{report.category}</TableCell>
                          <TableCell className="text-xs">
                            {report.submissionDate && !isNaN(new Date(report.submissionDate).getTime()) ? 
                              new Date(report.submissionDate).toLocaleDateString() : 
                              'N/A'
                            }
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
        </section>

        {/* Approved Reports Section */}
        <section>
           <Card className="flex flex-col h-full"> {/* Card as flex column and full height of grid cell */}
            <CardHeader className="px-4 py-4 border-b">
              <CardTitle className="text-2xl flex items-center gap-2 font-headline">
                <FileCheck2 className="h-7 w-7 text-green-500" />
                Approved Reports ({approvedReports.length})
              </CardTitle>
              <CardDescription>Reports that have been reviewed and approved for customers.</CardDescription>
            </CardHeader>
            <CardContent className="p-0 flex-1 flex flex-col"> {/* CardContent expands and is flex column */}
              {contextIsLoading && approvedReports.length === 0 ? ( 
                <div className="flex-1 flex justify-center items-center py-12">
                    <Loader2 className="h-10 w-10 animate-spin text-primary" />
                    <p className="ml-3 text-muted-foreground">Loading approved reports...</p>
                </div>
              ) : !contextIsLoading && approvedReports.length === 0 ? (
                <div className="flex-1 flex flex-col justify-center items-center text-center py-10 px-4 text-muted-foreground">
                  <Archive className="mx-auto h-12 w-12 mb-3 text-gray-400"/>
                  <p>No reports have been approved yet.</p>
                </div>
              ) : (
                <ScrollArea className="h-full"> {/* ScrollArea takes full height of CardContent */}
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead className="w-[120px]">Report ID</TableHead>
                        <TableHead>User</TableHead>
                        <TableHead>Category</TableHead>
                        <TableHead>Approved</TableHead>
                        <TableHead className="text-right">Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {approvedReports.map((report) => (
                        <TableRow key={report.id}>
                          <TableCell className="font-medium text-xs text-green-700">{report.id.substring(0,10)}...</TableCell>
                          <TableCell className="text-xs">{report.userName || 'N/A'}</TableCell>
                          <TableCell className="text-xs">{report.category}</TableCell>
                          <TableCell className="text-xs">
                            {report.lastUpdateDate && !isNaN(new Date(report.lastUpdateDate).getTime()) ? 
                              new Date(report.lastUpdateDate).toLocaleDateString() : 
                              'N/A'
                            }
                          </TableCell>
                          <TableCell className="text-right">
                            <Button variant="ghost" size="sm" onClick={() => openViewApprovedDialog(report)} className="text-green-600 hover:bg-green-500/10">
                              <FileSearch className="mr-2 h-4 w-4"/> View
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
        </section>
      </div>
      
      <CardFooter className="mt-12 border-t pt-6">
        <p className="text-xs text-muted-foreground text-center w-full">
          Admin actions are logged (simulated). Ensure all reports meet quality standards before approval.
        </p>
      </CardFooter>

      {/* Dialog for Viewing Approved Report */}
      {selectedReportForView && isViewApprovedDialogOpen && (
         <Dialog open={isViewApprovedDialogOpen} onOpenChange={(open) => { setIsViewApprovedDialogOpen(open); if (!open) setSelectedReportForView(null); }}>
          <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Approved Report: {selectedReportForView.id.substring(0,10)}...</DialogTitle>
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
            <Label className="font-semibold">Approved Report Content:</Label>
            <ScrollArea className="h-[250px] w-full rounded-md border p-4 mt-1 bg-muted/10 text-sm">
              {selectedReportForView.content.split('\n').filter(p => p.trim() !== '').map((paragraph, index) => (
                <p key={index} className="mb-2 leading-relaxed">{paragraph}</p>
              ))}
            </ScrollArea>
             <DialogFooter className="mt-4">
                <Button onClick={() => setIsViewApprovedDialogOpen(false)}>Close</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
}
    
