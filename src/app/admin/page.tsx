
"use client";
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { useAppContext, type ReportData } from '@/context/AppContext';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input'; 
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { refinePalmReadingReport } from '@/ai/flows/refine-palm-reading-report';
import { suggestReportImprovements } from '@/ai/flows/suggest-report-improvements';
import { Loader2, CheckCircle, AlertTriangle, Edit3, Send, ShieldQuestion, ThumbsUp, LogIn, Eye, Sparkles, FileSearch, MessageCircleQuestion, Columns, Archive, FileCheck2, Edit } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogTrigger, DialogFooter } from "@/components/ui/dialog";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";

export default function AdminPage() {
  const { 
    isAuthenticated,
    isAdmin,
    reports, 
    isLoading: contextIsLoading, 
    startLoading, 
    stopLoading, 
    approveReport,
    loadSampleReports,
  } = useAppContext();
  const router = useRouter();
  const { toast } = useToast();
  
  const [authCheckComplete, setAuthCheckComplete] = useState(false);

  const [selectedReport, setSelectedReport] = useState<ReportData | null>(null);
  const [isReviewDialogOpen, setIsReviewDialogOpen] = useState(false);
  const [isViewApprovedDialogOpen, setIsViewApprovedDialogOpen] = useState(false);
  
  const [adminSuggestionForDialog, setAdminSuggestionForDialog] = useState('');
  const [adminGuidanceForSuggestions, setAdminGuidanceForSuggestions] = useState('');
  const [aiSuggestionForDialog, setAiSuggestionForDialog] = useState<string | null>(null);
  const [isAiSuggestionLoadingInDialog, setIsAiSuggestionLoadingInDialog] = useState(false);
  const [provisionallyRefinedContent, setProvisionallyRefinedContent] = useState<string | null>(null);


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

  const openReviewDialog = (report: ReportData) => {
    setSelectedReport(report);
    setAdminSuggestionForDialog(''); 
    setAiSuggestionForDialog(null);
    setAdminGuidanceForSuggestions('');
    setProvisionallyRefinedContent(null); // Reset provisionally refined content
    setIsReviewDialogOpen(true);
  };

  const openViewApprovedDialog = (report: ReportData) => {
    setSelectedReport(report);
    setIsViewApprovedDialogOpen(true);
  };

  const handleGetAiSuggestionsInDialog = async () => {
    if (!selectedReport) return;
    setIsAiSuggestionLoadingInDialog(true);
    setAiSuggestionForDialog(null); 
    try {
      const result = await suggestReportImprovements({ 
        report: selectedReport.content,
        adminGuidance: adminGuidanceForSuggestions 
      });
      setAiSuggestionForDialog(result.suggestions);
      toast({ title: "AI Suggestions Ready", description: `AI-powered suggestions generated for Report ID ${selectedReport.id.substring(0,10)}...`});
    } catch (error) {
      console.error("Error getting AI suggestions:", error);
      setAiSuggestionForDialog("Error: Could not fetch suggestions.");
      toast({ title: "Suggestion Error", description: `Failed to get AI suggestions for Report ID ${selectedReport.id.substring(0,10)}...`, variant: "destructive" });
    } finally {
      setIsAiSuggestionLoadingInDialog(false);
    }
  };

  const handlePreviewAiRefinement = async () => {
    if (!selectedReport || !adminSuggestionForDialog.trim()) {
      toast({ title: "Missing Input", description: "Please provide refinement suggestions for the AI to process.", variant: "destructive" });
      return;
    }
    startLoading();
    setProvisionallyRefinedContent(null);
    try {
      const refinedResult = await refinePalmReadingReport({
        originalReport: selectedReport.content,
        adminSuggestions: adminSuggestionForDialog,
      });
      setProvisionallyRefinedContent(refinedResult.refinedReport);
      toast({ title: "AI Refinement Preview Ready", description: "Review the AI-refined content below before final approval for the customer." });
    } catch (error) {
      console.error("Error previewing AI refinement:", error);
      toast({ title: "Refinement Preview Error", description: `Failed to get AI refinement preview for Report ID ${selectedReport.id.substring(0,10)}... Please try again.`, variant: "destructive" });
    } finally {
      stopLoading();
    }
  };

  const handleFinalApproveForCustomer = async () => {
    if (!selectedReport || !provisionallyRefinedContent) {
      toast({ title: "Missing Content", description: "No refined content to approve.", variant: "destructive" });
      return;
    }
    startLoading();
    try {
      approveReport(selectedReport.id, provisionallyRefinedContent); 
      toast({ title: "Report Approved & Live", description: `Report ID ${selectedReport.id.substring(0,10)}... has been approved and is now available to the customer.` });
      setIsReviewDialogOpen(false);
      setSelectedReport(null);
      setProvisionallyRefinedContent(null);
    } catch (error) {
      console.error("Error during final approval:", error);
      toast({ title: "Final Approval Error", description: `Failed to approve report ID ${selectedReport.id.substring(0,10)}... Please try again.`, variant: "destructive" });
    } finally {
      stopLoading();
    }
  };

  const handleApproveAsIsInDialog = () => {
    if (!selectedReport) return;
    startLoading();
    approveReport(selectedReport.id); 
    toast({ title: "Report Approved As-Is", description: `Report ID ${selectedReport.id.substring(0,10)}... has been approved and is now available to the customer.` });
    setIsReviewDialogOpen(false);
    setSelectedReport(null);
    setProvisionallyRefinedContent(null);
    stopLoading();
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
        <section>
          <Card>
            <CardHeader className="px-4 py-4 border-b">
              <CardTitle className="text-2xl flex items-center gap-2 font-headline">
                <Columns className="h-7 w-7 text-amber-500" />
                Pending Review ({pendingReviewReports.length})
              </CardTitle>
              <CardDescription>Reports awaiting expert review and approval.</CardDescription>
            </CardHeader>
            <CardContent className="p-0">
              {contextIsLoading && pendingReviewReports.length === 0 && ( 
                <div className="flex justify-center items-center py-12">
                    <Loader2 className="h-10 w-10 animate-spin text-primary" />
                    <p className="ml-3 text-muted-foreground">Loading pending reports...</p>
                </div>
              )}
              {!contextIsLoading && pendingReviewReports.length === 0 && (
                <div className="text-center py-10 px-4 text-muted-foreground">
                  <Archive className="mx-auto h-12 w-12 mb-3 text-gray-400"/>
                  <p>No reports currently pending review.</p>
                  <Button onClick={loadSampleReports} className="mt-4" variant="outline" size="sm" disabled={contextIsLoading}>
                    {contextIsLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
                    Load Sample Reports
                  </Button>
                </div>
              )}
              {pendingReviewReports.length > 0 && (
                <ScrollArea className="h-auto max-h-[calc(100vh-420px)]">
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
                          <TableCell className="text-xs">{new Date(report.submissionDate).toLocaleDateString()}</TableCell>
                          <TableCell className="text-right">
                            <Button variant="outline" size="sm" onClick={() => openReviewDialog(report)}>
                              <Edit className="mr-2 h-4 w-4"/> Review
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

        <section>
           <Card>
            <CardHeader className="px-4 py-4 border-b">
              <CardTitle className="text-2xl flex items-center gap-2 font-headline">
                <FileCheck2 className="h-7 w-7 text-green-500" />
                Approved Reports ({approvedReports.length})
              </CardTitle>
              <CardDescription>Reports that have been reviewed and approved for customers.</CardDescription>
            </CardHeader>
            <CardContent className="p-0">
              {contextIsLoading && approvedReports.length === 0 && ( 
                <div className="flex justify-center items-center py-12">
                    <Loader2 className="h-10 w-10 animate-spin text-primary" />
                    <p className="ml-3 text-muted-foreground">Loading approved reports...</p>
                </div>
              )}
              {!contextIsLoading && approvedReports.length === 0 && (
                <div className="text-center py-10 px-4 text-muted-foreground">
                  <Archive className="mx-auto h-12 w-12 mb-3 text-gray-400"/>
                  <p>No reports have been approved yet.</p>
                </div>
              )}
              {approvedReports.length > 0 && (
                <ScrollArea className="h-auto max-h-[calc(100vh-420px)]">
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
                          <TableCell className="text-xs">{new Date(report.submissionDate).toLocaleDateString()}</TableCell>
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

      {selectedReport && isReviewDialogOpen && (
        <Dialog open={isReviewDialogOpen} onOpenChange={(open) => { setIsReviewDialogOpen(open); if (!open) setSelectedReport(null); }}>
          <DialogContent className="max-w-3xl">
            <DialogHeader>
              <DialogTitle>Review Report: {selectedReport.id.substring(0,10)}...</DialogTitle>
              <DialogDescription>Category: {selectedReport.category} | Submitted by: {selectedReport.userName || 'N/A'} on {new Date(selectedReport.submissionDate).toLocaleDateString()}</DialogDescription>
            </DialogHeader>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 my-4">
              {selectedReport.inputDetails.leftPalmDataUri && 
                <div className="text-center">
                  <Image src={selectedReport.inputDetails.leftPalmDataUri} alt="Left Palm" width={250} height={180} className="rounded-md border mx-auto" data-ai-hint="palm hand" />
                  <p className="text-xs text-muted-foreground mt-1">Left Palm</p>
                </div>
              }
              {selectedReport.inputDetails.rightPalmDataUri && 
                 <div className="text-center">
                  <Image src={selectedReport.inputDetails.rightPalmDataUri} alt="Right Palm" width={250} height={180} className="rounded-md border mx-auto" data-ai-hint="palm hand" />
                  <p className="text-xs text-muted-foreground mt-1">Right Palm</p>
                </div>
              }
            </div>

            <Label className="font-semibold">Original AI Generated Content:</Label>
            <ScrollArea className="h-[150px] w-full rounded-md border p-4 mt-1 bg-muted/10 text-sm">
              {selectedReport.content.split('\n').filter(p => p.trim() !== '').map((paragraph, index) => (
                <p key={index} className="mb-2 leading-relaxed">{paragraph}</p>
              ))}
            </ScrollArea>

            <div className="mt-4 space-y-3 border-t pt-4">
                <Label htmlFor="adminGuidanceForSuggestions" className="text-sm font-medium flex items-center gap-1.5"><MessageCircleQuestion className="h-4 w-4 text-primary"/>Your Guidance for AI Suggestions (Optional)</Label>
                <Textarea
                    id="adminGuidanceForSuggestions"
                    value={adminGuidanceForSuggestions}
                    onChange={(e) => setAdminGuidanceForSuggestions(e.target.value)}
                    placeholder="e.g., 'Focus on career aspects', 'Check clarity on relationships', 'Is the tone appropriate?'"
                    rows={2}
                    className="text-sm"
                    disabled={contextIsLoading || isAiSuggestionLoadingInDialog}
                />
                <Button 
                    onClick={handleGetAiSuggestionsInDialog} 
                    variant="outline" 
                    size="sm"
                    className="w-full"
                    disabled={contextIsLoading || isAiSuggestionLoadingInDialog}
                >
                    {isAiSuggestionLoadingInDialog ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Sparkles className="mr-2 h-4 w-4" />}
                    Get AI Suggestions for Refinement
                </Button>
                <p className="text-xs text-muted-foreground mt-1 text-center">
                  You can revise your guidance above and click again to get new suggestions.
                </p>

                {aiSuggestionForDialog && (
                <Alert variant={aiSuggestionForDialog.startsWith("Error:") ? "destructive" : "default"} className="text-xs">
                    <Sparkles className="h-4 w-4" />
                    <AlertTitle className="text-sm">AI Generated Suggestions</AlertTitle>
                    <AlertDescription>
                    <ScrollArea className="h-[80px]">
                        {aiSuggestionForDialog.split('\n').map((line, i) => <p key={i} className="mb-1">{line}</p>)}
                    </ScrollArea>
                    </AlertDescription>
                     {aiSuggestionForDialog && !aiSuggestionForDialog.startsWith("Error:") && (
                        <Button 
                            onClick={() => {
                                setAdminSuggestionForDialog((prev) => prev + (prev ? '\n\n--- AI Suggestions ---\n' : '--- AI Suggestions ---\n') + aiSuggestionForDialog);
                                toast({title: "AI Suggestions Appended", description: "Suggestions appended to your refinement notes."})
                            }}
                            variant="link" size="sm" className="p-0 h-auto text-xs mt-1">
                            Append to Final Refinement Notes
                        </Button>
                    )}
                </Alert>
                )}
            </div>
            
            <div className="mt-4 space-y-2 border-t pt-4">
              <Label htmlFor="adminDialogSuggestions" className="text-sm font-medium flex items-center gap-1.5"><Edit3 className="h-4 w-4 text-primary"/>Your Final Refinement Notes & Edits</Label>
              <Textarea
                id="adminDialogSuggestions"
                value={adminSuggestionForDialog}
                onChange={(e) => setAdminSuggestionForDialog(e.target.value)}
                placeholder="Enter your comprehensive suggestions and edits here. This will be used by AI to generate the final report."
                rows={4}
                className="text-sm"
                disabled={contextIsLoading}
              />
               <Button 
                    onClick={handlePreviewAiRefinement} 
                    disabled={contextIsLoading || !adminSuggestionForDialog.trim()} 
                    className="w-full bg-blue-600 hover:bg-blue-700 text-white mt-2"
                    title="AI will process your notes above to generate a refined report preview."
                >
                    {contextIsLoading && adminSuggestionForDialog.trim() && !provisionallyRefinedContent ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Send className="mr-2 h-4 w-4" />}
                    Preview AI Refinement
                </Button>
            </div>

            {provisionallyRefinedContent && (
              <div className="mt-4 space-y-2 border-t pt-4">
                <Label className="font-semibold text-green-700 flex items-center gap-1.5"><FileCheck2 className="h-4 w-4"/>Preview of AI-Refined Report for Customer:</Label>
                <ScrollArea className="h-[150px] w-full rounded-md border p-4 bg-green-50/50 text-sm">
                  {provisionallyRefinedContent.split('\n').filter(p => p.trim() !== '').map((paragraph, index) => (
                    <p key={index} className="mb-2 leading-relaxed">{paragraph}</p>
                  ))}
                </ScrollArea>
                <Button 
                  onClick={handleFinalApproveForCustomer} 
                  disabled={contextIsLoading}
                  className="w-full bg-green-600 hover:bg-green-700 text-white mt-2"
                >
                  {contextIsLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <CheckCircle className="mr-2 h-4 w-4" />}
                  Confirm & Approve for Customer
                </Button>
              </div>
            )}

            <DialogFooter className="mt-6 gap-2 sm:gap-0">
                <Button 
                    onClick={handleApproveAsIsInDialog} 
                    variant="secondary" 
                    disabled={contextIsLoading || !!provisionallyRefinedContent} 
                    title={provisionallyRefinedContent ? "A refined preview exists. Clear it or approve it first." : "Approve the original AI report without admin refinements."}
                >
                    <ThumbsUp className="mr-2 h-4 w-4" /> Approve Original As-Is
                </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      )}

      {selectedReport && isViewApprovedDialogOpen && (
         <Dialog open={isViewApprovedDialogOpen} onOpenChange={(open) => { setIsViewApprovedDialogOpen(open); if (!open) setSelectedReport(null); }}>
          <DialogContent className="max-w-3xl">
            <DialogHeader>
              <DialogTitle>Approved Report: {selectedReport.id.substring(0,10)}...</DialogTitle>
              <DialogDescription>Category: {selectedReport.category} | Submitted by: {selectedReport.userName || 'N/A'}</DialogDescription>
            </DialogHeader>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 my-4">
              {selectedReport.inputDetails.leftPalmDataUri && 
                  <div className="text-center">
                  <Image src={selectedReport.inputDetails.leftPalmDataUri} alt="Left Palm" width={250} height={180} className="rounded-md border mx-auto" data-ai-hint="palm hand" />
                  <p className="text-xs text-muted-foreground mt-1">Left Palm</p>
                </div>
              }
              {selectedReport.inputDetails.rightPalmDataUri && 
                <div className="text-center">
                  <Image src={selectedReport.inputDetails.rightPalmDataUri} alt="Right Palm" width={250} height={180} className="rounded-md border mx-auto" data-ai-hint="palm hand" />
                  <p className="text-xs text-muted-foreground mt-1">Right Palm</p>
                </div>
              }
            </div>
            <Label className="font-semibold">Approved Report Content:</Label>
            <ScrollArea className="h-[250px] w-full rounded-md border p-4 mt-1 bg-muted/10 text-sm">
              {selectedReport.content.split('\n').filter(p => p.trim() !== '').map((paragraph, index) => (
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
    
