
"use client";
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { useAppContext, type ReportData } from '@/context/AppContext';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { refinePalmReadingReport } from '@/ai/flows/refine-palm-reading-report';
import { suggestReportImprovements } from '@/ai/flows/suggest-report-improvements';
import { Loader2, CheckCircle, AlertTriangle, Edit3, Send, ShieldQuestion, ThumbsUp, LogIn, Info, Eye, Sparkles, User, CalendarDays, ListChecksIcon } from 'lucide-react';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogTrigger, DialogFooter } from "@/components/ui/dialog";

export default function AdminPage() {
  const { 
    isAuthenticated,
    isAdmin,
    reports, 
    isLoading, 
    startLoading, 
    stopLoading, 
    approveReport,
    updateReportContent, // Renamed from approveCurrentReport's optional param logic
    loadSampleReports,
  } = useAppContext();
  const router = useRouter();
  const { toast } = useToast();
  
  const [adminSuggestions, setAdminSuggestions] = useState<{[reportId: string]: string}>({});
  const [authCheckComplete, setAuthCheckComplete] = useState(false);
  const [aiSuggestions, setAiSuggestions] = useState<{[reportId: string]: string | null}>({});
  const [isSuggestionsLoading, setIsSuggestionsLoading] = useState<{[reportId: string]: boolean}>({});

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

  const handleAdminSuggestionChange = (reportId: string, value: string) => {
    setAdminSuggestions(prev => ({ ...prev, [reportId]: value }));
  };

  const handleRefineAndApprove = async (report: ReportData) => {
    const suggestions = adminSuggestions[report.id];
    if (!suggestions || !suggestions.trim()) {
      toast({ title: "Missing Input", description: "Please provide refinement suggestions.", variant: "destructive" });
      return;
    }
    startLoading();
    try {
      const refinedResult = await refinePalmReadingReport({
        originalReport: report.content,
        adminSuggestions: suggestions,
      });
      approveReport(report.id, refinedResult.refinedReport); // approveReport now takes id and optional new content
      toast({ title: "Report Refined & Approved", description: `Report ID ${report.id} has been updated and approved.` });
      setAdminSuggestions(prev => ({ ...prev, [report.id]: '' })); 
    } catch (error) {
      console.error("Error refining report:", error);
      toast({ title: "Refinement Error", description: `Failed to refine report ID ${report.id}. Please try again.`, variant: "destructive" });
    } finally {
      stopLoading();
    }
  };

  const handleApproveAsIs = (reportId: string) => {
    startLoading();
    approveReport(reportId); 
    toast({ title: "Report Approved", description: `Report ID ${reportId} has been approved as is.` });
    stopLoading();
  };

  const handleGetAiSuggestions = async (report: ReportData) => {
    setIsSuggestionsLoading(prev => ({ ...prev, [report.id]: true }));
    setAiSuggestions(prev => ({ ...prev, [report.id]: null })); // Clear previous
    try {
      const result = await suggestReportImprovements({ report: report.content });
      setAiSuggestions(prev => ({ ...prev, [report.id]: result.suggestions }));
      toast({ title: "AI Suggestions Ready", description: `Suggestions generated for Report ID ${report.id}.`});
    } catch (error) {
      console.error("Error getting AI suggestions:", error);
      setAiSuggestions(prev => ({ ...prev, [report.id]: "Error: Could not fetch suggestions." }));
      toast({ title: "Suggestion Error", description: `Failed to get AI suggestions for Report ID ${report.id}.`, variant: "destructive" });
    } finally {
      setIsSuggestionsLoading(prev => ({ ...prev, [report.id]: false }));
    }
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
      <Card className="w-full max-w-5xl mx-auto shadow-xl">
        <CardHeader className="text-center">
           <div className="mx-auto bg-primary/10 p-3 rounded-full w-fit mb-4">
            <ShieldQuestion className="h-10 w-10 text-primary" />
          </div>
          <CardTitle className="font-headline text-3xl">Admin Review Panel</CardTitle>
          <CardDescription>Review and approve AI-generated palm readings. {pendingReviewReports.length} report(s) pending review.</CardDescription>
        </CardHeader>
        <CardContent>
          {isLoading && pendingReviewReports.length === 0 && ( 
             <div className="flex justify-center items-center py-12">
                <Loader2 className="h-12 w-12 animate-spin text-primary" />
                <p className="ml-4 text-muted-foreground">Loading reports...</p>
            </div>
          )}

          {pendingReviewReports.length > 0 && (
            <Accordion type="single" collapsible className="w-full space-y-4">
              {pendingReviewReports.map((report) => (
                <AccordionItem value={report.id} key={report.id} className="border rounded-lg overflow-hidden shadow-md hover:shadow-lg transition-shadow">
                  <AccordionTrigger className="bg-muted/30 hover:bg-muted/50 px-6 py-4 text-left">
                    <div className="flex flex-col sm:flex-row justify-between sm:items-center w-full">
                        <div>
                            <span className="font-semibold text-primary">Report ID: {report.id.substring(0,10)}...</span>
                            <div className="text-xs text-muted-foreground mt-1 space-x-3">
                               <span><User className="inline h-3 w-3 mr-1"/> {report.userName || 'N/A'}</span>
                               <span><CalendarDays className="inline h-3 w-3 mr-1"/> {new Date(report.submissionDate).toLocaleDateString()}</span>
                               <span><ListChecksIcon className="inline h-3 w-3 mr-1"/> {report.category}</span>
                            </div>
                        </div>
                        <Dialog>
                          <DialogTrigger asChild>
                            <Button variant="ghost" size="sm" className="mt-2 sm:mt-0 text-primary hover:bg-primary/10" onClick={(e) => e.stopPropagation()}>
                              <Eye className="mr-2 h-4 w-4"/> View Full Report
                            </Button>
                          </DialogTrigger>
                          <DialogContent className="max-w-2xl">
                            <DialogHeader>
                              <DialogTitle>Full Report: {report.id.substring(0,10)}...</DialogTitle>
                              <DialogDescription>Category: {report.category} | Submitted by: {report.userName || 'N/A'}</DialogDescription>
                            </DialogHeader>
                            <div className="grid grid-cols-2 gap-4 my-4">
                              {report.inputDetails.leftPalmDataUri && 
                                <Image src={report.inputDetails.leftPalmDataUri} alt="Left Palm" width={200} height={150} className="rounded-md border" data-ai-hint="palm hand" />}
                              {report.inputDetails.rightPalmDataUri && 
                                <Image src={report.inputDetails.rightPalmDataUri} alt="Right Palm" width={200} height={150} className="rounded-md border" data-ai-hint="palm hand" />}
                            </div>
                            <ScrollArea className="h-[300px] w-full rounded-md border p-4 bg-muted/10">
                              {report.content.split('\n').filter(p => p.trim() !== '').map((paragraph, index) => (
                                <p key={index} className="mb-3 text-sm leading-relaxed">{paragraph}</p>
                              ))}
                            </ScrollArea>
                            <DialogFooter>
                              <Button onClick={() => {
                                  const suggestionsFromAI = aiSuggestions[report.id];
                                  if (suggestionsFromAI) {
                                    handleAdminSuggestionChange(report.id, (adminSuggestions[report.id] || '') + '\n\n--- AI Suggestions ---\n' + suggestionsFromAI);
                                    toast({title: "AI Suggestions Added", description: "Suggestions appended to your refinement notes."})
                                  } else {
                                    toast({title: "No AI Suggestions", description: "Generate AI suggestions first if you want to append them.", variant: "destructive"})
                                  }
                                }}>Use AI Suggestions</Button>
                            </DialogFooter>
                          </DialogContent>
                        </Dialog>
                    </div>
                  </AccordionTrigger>
                  <AccordionContent className="px-6 py-4 space-y-6 bg-background">
                    <div>
                      <Label htmlFor={`adminSuggestions-${report.id}`} className="text-base font-medium flex items-center gap-2"><Edit3 className="h-5 w-5 text-primary"/>Refinement Suggestions for Report ID: {report.id.substring(0,10)}...</Label>
                      <Textarea
                        id={`adminSuggestions-${report.id}`}
                        value={adminSuggestions[report.id] || ''}
                        onChange={(e) => handleAdminSuggestionChange(report.id, e.target.value)}
                        placeholder="Enter your suggestions to improve this report..."
                        rows={5}
                        className="mt-2"
                        disabled={isLoading}
                      />
                    </div>

                    {aiSuggestions[report.id] && (
                      <Alert variant={aiSuggestions[report.id]?.startsWith("Error:") ? "destructive" : "default"} className="animate-slide-in-down">
                        <Sparkles className="h-4 w-4" />
                        <AlertTitle>AI Generated Suggestions</AlertTitle>
                        <AlertDescription>
                          <ScrollArea className="h-[100px] text-xs">
                            {aiSuggestions[report.id]?.split('\n').map((line, i) => <p key={i}>{line}</p>)}
                          </ScrollArea>
                        </AlertDescription>
                      </Alert>
                    )}

                    <div className="flex flex-col sm:flex-row gap-3 mt-4">
                      <Button 
                        onClick={() => handleGetAiSuggestions(report)} 
                        variant="outline" 
                        className="flex-1 py-2.5"
                        disabled={isLoading || isSuggestionsLoading[report.id]}
                      >
                        {isSuggestionsLoading[report.id] ? <Loader2 className="mr-2 h-5 w-5 animate-spin" /> : <Sparkles className="mr-2 h-5 w-5" />}
                        Get AI Suggestions
                      </Button>
                      <Button onClick={() => handleRefineAndApprove(report)} disabled={isLoading || !adminSuggestions[report.id]?.trim()} className="flex-1 py-2.5">
                        {isLoading && adminSuggestions[report.id]?.trim() ? <Loader2 className="mr-2 h-5 w-5 animate-spin" /> : <Send className="mr-2 h-5 w-5" />}
                        Refine & Approve
                      </Button>
                      <Button onClick={() => handleApproveAsIs(report.id)} variant="secondary" disabled={isLoading} className="flex-1 py-2.5">
                         <ThumbsUp className="mr-2 h-5 w-5" />
                        Approve As-Is
                      </Button>
                    </div>
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          )}

          {!isLoading && pendingReviewReports.length === 0 && ( 
             <div className="text-center py-10">
              <CheckCircle className="mx-auto h-16 w-16 text-green-600 mb-4" />
              <h3 className="text-2xl font-semibold mb-2 font-headline">All Clear!</h3>
              <p className="text-muted-foreground">There are no reports currently pending review.</p>
              <Button onClick={loadSampleReports} className="mt-4" variant="outline">Load Sample Pending Reports</Button>
            </div>
          )}
        </CardContent>
        <CardFooter>
          <p className="text-xs text-muted-foreground text-center w-full">
            Admin actions are logged (simulated). Ensure all reports meet quality standards.
          </p>
        </CardFooter>
      </Card>
    </div>
  );
}
