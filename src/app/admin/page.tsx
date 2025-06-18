
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
import { Loader2, CheckCircle, AlertTriangle, Edit3, Send, ShieldQuestion, ThumbsUp, LogIn, Eye, Sparkles, User, CalendarDays, ListChecksIcon, Columns, Archive, FileCheck2 } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogTrigger, DialogFooter } from "@/components/ui/dialog";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

export default function AdminPage() {
  const { 
    isAuthenticated,
    isAdmin,
    reports, 
    isLoading: contextIsLoading, 
    startLoading, 
    stopLoading, 
    approveReport,
    updateReportContent, 
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
  const approvedReports = reports.filter(report => report.status === 'approved');

  const handleAdminSuggestionChange = (reportId: string, value: string) => {
    setAdminSuggestions(prev => ({ ...prev, [reportId]: value }));
  };

  const handleRefineAndApprove = async (report: ReportData) => {
    const suggestions = adminSuggestions[report.id];
    if (!suggestions || !suggestions.trim()) {
      toast({ title: "Missing Input", description: "Please provide refinement suggestions for the AI.", variant: "destructive" });
      return;
    }
    startLoading();
    try {
      const refinedResult = await refinePalmReadingReport({
        originalReport: report.content,
        adminSuggestions: suggestions,
      });
      approveReport(report.id, refinedResult.refinedReport); 
      toast({ title: "Report Refined & Approved", description: `Report ID ${report.id.substring(0,10)}... has been updated by AI and approved.` });
      setAdminSuggestions(prev => ({ ...prev, [report.id]: '' })); 
      setAiSuggestions(prev => ({...prev, [report.id]: null}));
    } catch (error) {
      console.error("Error refining report:", error);
      toast({ title: "Refinement Error", description: `Failed to refine report ID ${report.id.substring(0,10)}... Please try again.`, variant: "destructive" });
    } finally {
      stopLoading();
    }
  };

  const handleApproveAsIs = (reportId: string) => {
    startLoading();
    approveReport(reportId); 
    toast({ title: "Report Approved", description: `Report ID ${reportId.substring(0,10)}... has been approved as is.` });
    setAiSuggestions(prev => { 
        const newAiSuggestions = {...prev};
        delete newAiSuggestions[reportId];
        return newAiSuggestions;
    });
    stopLoading();
  };

  const handleGetAiSuggestions = async (report: ReportData) => {
    setIsSuggestionsLoading(prev => ({ ...prev, [report.id]: true }));
    setAiSuggestions(prev => ({ ...prev, [report.id]: null })); 
    try {
      const result = await suggestReportImprovements({ report: report.content });
      setAiSuggestions(prev => ({ ...prev, [report.id]: result.suggestions }));
      toast({ title: "AI Suggestions Ready", description: `AI-powered suggestions generated for Report ID ${report.id.substring(0,10)}...`});
    } catch (error) {
      console.error("Error getting AI suggestions:", error);
      setAiSuggestions(prev => ({ ...prev, [report.id]: "Error: Could not fetch suggestions." }));
      toast({ title: "Suggestion Error", description: `Failed to get AI suggestions for Report ID ${report.id.substring(0,10)}...`, variant: "destructive" });
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
      <div className="text-center mb-12">
         <div className="mx-auto bg-primary/10 p-4 rounded-full w-fit mb-4 inline-block">
          <ShieldQuestion className="h-12 w-12 text-primary" />
        </div>
        <h1 className="font-headline text-4xl font-bold">Admin Workflow Panel</h1>
        <p className="text-muted-foreground text-lg mt-2">Manage and review AI-generated palm readings.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Pending Review Column */}
        <div className="space-y-6">
          <CardHeader className="px-2 py-4 border-b">
            <CardTitle className="text-2xl flex items-center gap-2 font-headline">
              <Columns className="h-7 w-7 text-amber-500" />
              Pending Review ({pendingReviewReports.length})
            </CardTitle>
            <CardDescription>Reports awaiting expert review and approval.</CardDescription>
          </CardHeader>
          <ScrollArea className="h-[calc(100vh-380px)] p-1">
            {contextIsLoading && pendingReviewReports.length === 0 && ( 
              <div className="flex justify-center items-center py-12">
                  <Loader2 className="h-10 w-10 animate-spin text-primary" />
                  <p className="ml-3 text-muted-foreground">Loading pending reports...</p>
              </div>
            )}
            {!contextIsLoading && pendingReviewReports.length === 0 && (
              <div className="text-center py-10 text-muted-foreground">
                <Archive className="mx-auto h-12 w-12 mb-3 text-gray-400"/>
                <p>No reports currently pending review.</p>
                <Button onClick={loadSampleReports} className="mt-4" variant="outline" size="sm">Load Sample Reports</Button>
              </div>
            )}
            {pendingReviewReports.map((report) => (
              <Card key={report.id} className="mb-6 shadow-md hover:shadow-lg transition-shadow">
                <CardHeader className="bg-muted/20">
                  <div className="flex flex-col sm:flex-row justify-between sm:items-start">
                      <div>
                          <CardTitle className="text-lg font-semibold text-primary flex items-center">Report ID: {report.id.substring(0,10)}...</CardTitle>
                          <div className="text-xs text-muted-foreground mt-1 space-x-3">
                             <span><User className="inline h-3 w-3 mr-1"/> {report.userName || 'N/A'}</span>
                             <span><CalendarDays className="inline h-3 w-3 mr-1"/> {new Date(report.submissionDate).toLocaleDateString()}</span>
                             <span><ListChecksIcon className="inline h-3 w-3 mr-1"/> {report.category}</span>
                          </div>
                      </div>
                      <Dialog>
                        <DialogTrigger asChild>
                          <Button variant="ghost" size="sm" className="mt-2 sm:mt-0 text-primary hover:bg-primary/10">
                            <Eye className="mr-2 h-4 w-4"/> View Full Report
                          </Button>
                        </DialogTrigger>
                        <DialogContent className="max-w-3xl">
                          <DialogHeader>
                            <DialogTitle>Full Report Details: {report.id.substring(0,10)}...</DialogTitle>
                            <DialogDescription>Category: {report.category} | Submitted by: {report.userName || 'N/A'} on {new Date(report.submissionDate).toLocaleDateString()}</DialogDescription>
                          </DialogHeader>
                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 my-4">
                            {report.inputDetails.leftPalmDataUri && 
                              <div className="text-center">
                                <Image src={report.inputDetails.leftPalmDataUri} alt="Left Palm" width={250} height={180} className="rounded-md border mx-auto" data-ai-hint="palm hand" />
                                <p className="text-xs text-muted-foreground mt-1">Left Palm</p>
                              </div>
                            }
                            {report.inputDetails.rightPalmDataUri && 
                               <div className="text-center">
                                <Image src={report.inputDetails.rightPalmDataUri} alt="Right Palm" width={250} height={180} className="rounded-md border mx-auto" data-ai-hint="palm hand" />
                                <p className="text-xs text-muted-foreground mt-1">Right Palm</p>
                              </div>
                            }
                          </div>
                          <Label className="font-semibold">Original AI Generated Content:</Label>
                          <ScrollArea className="h-[250px] w-full rounded-md border p-4 mt-1 bg-muted/10 text-sm">
                            {report.content.split('\n').filter(p => p.trim() !== '').map((paragraph, index) => (
                              <p key={index} className="mb-2 leading-relaxed">{paragraph}</p>
                            ))}
                          </ScrollArea>
                           <DialogFooter className="mt-4">
                              <Button 
                                onClick={() => {
                                  const suggestionsFromAI = aiSuggestions[report.id];
                                  if (suggestionsFromAI && !suggestionsFromAI.startsWith("Error:")) {
                                    handleAdminSuggestionChange(report.id, (adminSuggestions[report.id] || '') + '\n\n--- AI Suggestions ---\n' + suggestionsFromAI);
                                    toast({title: "AI Suggestions Appended", description: "Suggestions appended to your refinement notes."})
                                  } else if (suggestionsFromAI?.startsWith("Error:")){
                                     toast({title: "Error in AI Suggestions", description: "Cannot append: Error fetching suggestions.", variant:"destructive"})
                                  } else {
                                    toast({title: "No AI Suggestions Available", description: "Generate AI suggestions first if you want to append them.", variant:"outline"})
                                  }
                                }}
                                disabled={!aiSuggestions[report.id] || !!aiSuggestions[report.id]?.startsWith("Error:") || contextIsLoading }
                                variant="outline"
                                size="sm"
                                >
                                  <Sparkles className="mr-2 h-4 w-4"/> Append AI Suggestions to Notes
                                </Button>
                            </DialogFooter>
                        </DialogContent>
                      </Dialog>
                  </div>
                </CardHeader>
                <CardContent className="pt-4 space-y-4">
                  <div>
                    <Label htmlFor={`adminSuggestions-${report.id}`} className="text-sm font-medium flex items-center gap-1.5"><Edit3 className="h-4 w-4 text-primary"/>Your Refinement Notes & Suggestions</Label>
                    <Textarea
                      id={`adminSuggestions-${report.id}`}
                      value={adminSuggestions[report.id] || ''}
                      onChange={(e) => handleAdminSuggestionChange(report.id, e.target.value)}
                      placeholder="Enter your suggestions to improve this report..."
                      rows={4}
                      className="mt-1.5 text-sm"
                      disabled={contextIsLoading}
                    />
                  </div>

                  {aiSuggestions[report.id] && (
                    <Alert variant={aiSuggestions[report.id]?.startsWith("Error:") ? "destructive" : "default"} className="animate-slide-in-down text-xs">
                      <Sparkles className="h-4 w-4" />
                      <AlertTitle className="text-sm">AI Generated Suggestions for Admin</AlertTitle>
                      <AlertDescription>
                        <ScrollArea className="h-[80px]">
                          {aiSuggestions[report.id]?.split('\n').map((line, i) => <p key={i} className="mb-1">{line}</p>)}
                        </ScrollArea>
                      </AlertDescription>
                    </Alert>
                  )}

                  <div className="flex flex-col sm:flex-row gap-2 mt-3">
                    <Button 
                      onClick={() => handleGetAiSuggestions(report)} 
                      variant="outline" 
                      size="sm"
                      className="flex-1"
                      disabled={contextIsLoading || isSuggestionsLoading[report.id]}
                    >
                      {isSuggestionsLoading[report.id] ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Sparkles className="mr-2 h-4 w-4" />}
                      Get AI Suggestions
                    </Button>
                    <Button 
                      onClick={() => handleRefineAndApprove(report)} 
                      disabled={contextIsLoading || !adminSuggestions[report.id]?.trim()} 
                      size="sm"
                      className="flex-1 bg-primary hover:bg-primary/90 text-primary-foreground"
                      title="AI will incorporate your suggestions to enhance the report."
                    >
                      {contextIsLoading && adminSuggestions[report.id]?.trim() ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Send className="mr-2 h-4 w-4" />}
                      Refine with AI & Approve
                    </Button>
                    <Button 
                      onClick={() => handleApproveAsIs(report.id)} 
                      variant="secondary" 
                      size="sm"
                      disabled={contextIsLoading} 
                      className="flex-1"
                    >
                       <ThumbsUp className="mr-2 h-4 w-4" />
                      Approve As-Is
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </ScrollArea>
        </div>

        {/* Approved Reports Column */}
        <div className="space-y-6">
          <CardHeader className="px-2 py-4 border-b">
            <CardTitle className="text-2xl flex items-center gap-2 font-headline">
              <FileCheck2 className="h-7 w-7 text-green-500" />
              Approved Reports ({approvedReports.length})
            </CardTitle>
            <CardDescription>Reports that have been reviewed and approved.</CardDescription>
          </CardHeader>
          <ScrollArea className="h-[calc(100vh-380px)] p-1">
            {contextIsLoading && approvedReports.length === 0 && ( 
              <div className="flex justify-center items-center py-12">
                  <Loader2 className="h-10 w-10 animate-spin text-primary" />
                  <p className="ml-3 text-muted-foreground">Loading approved reports...</p>
              </div>
            )}
            {!contextIsLoading && approvedReports.length === 0 && (
              <div className="text-center py-10 text-muted-foreground">
                <Archive className="mx-auto h-12 w-12 mb-3 text-gray-400"/>
                <p>No reports have been approved yet.</p>
              </div>
            )}
            {approvedReports.map((report) => (
              <Card key={report.id} className="mb-6 shadow-sm bg-green-500/5 border-green-500/20">
                <CardHeader>
                    <div className="flex flex-col sm:flex-row justify-between sm:items-start">
                        <div>
                            <CardTitle className="text-lg font-semibold text-green-700">Approved: {report.id.substring(0,10)}...</CardTitle>
                             <div className="text-xs text-muted-foreground mt-1 space-x-3">
                               <span><User className="inline h-3 w-3 mr-1"/> {report.userName || 'N/A'}</span>
                               <span><CalendarDays className="inline h-3 w-3 mr-1"/> {new Date(report.submissionDate).toLocaleDateString()}</span>
                               <span><ListChecksIcon className="inline h-3 w-3 mr-1"/> {report.category}</span>
                            </div>
                        </div>
                        <Dialog>
                          <DialogTrigger asChild>
                            <Button variant="ghost" size="sm" className="mt-2 sm:mt-0 text-green-600 hover:bg-green-500/10">
                              <Eye className="mr-2 h-4 w-4"/> View Approved Report
                            </Button>
                          </DialogTrigger>
                          <DialogContent className="max-w-3xl">
                            <DialogHeader>
                              <DialogTitle>Approved Report: {report.id.substring(0,10)}...</DialogTitle>
                              <DialogDescription>Category: {report.category} | Submitted by: {report.userName || 'N/A'}</DialogDescription>
                            </DialogHeader>
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 my-4">
                              {report.inputDetails.leftPalmDataUri && 
                                 <div className="text-center">
                                  <Image src={report.inputDetails.leftPalmDataUri} alt="Left Palm" width={250} height={180} className="rounded-md border mx-auto" data-ai-hint="palm hand" />
                                  <p className="text-xs text-muted-foreground mt-1">Left Palm</p>
                                </div>
                              }
                              {report.inputDetails.rightPalmDataUri && 
                                <div className="text-center">
                                  <Image src={report.inputDetails.rightPalmDataUri} alt="Right Palm" width={250} height={180} className="rounded-md border mx-auto" data-ai-hint="palm hand" />
                                  <p className="text-xs text-muted-foreground mt-1">Right Palm</p>
                                </div>
                              }
                            </div>
                            <Label className="font-semibold">Approved Report Content:</Label>
                            <ScrollArea className="h-[250px] w-full rounded-md border p-4 mt-1 bg-muted/10 text-sm">
                              {report.content.split('\n').filter(p => p.trim() !== '').map((paragraph, index) => (
                                <p key={index} className="mb-2 leading-relaxed">{paragraph}</p>
                              ))}
                            </ScrollArea>
                          </DialogContent>
                        </Dialog>
                    </div>
                </CardHeader>
                <CardContent className="pt-2">
                    <p className="text-xs text-green-600 flex items-center"><CheckCircle className="h-4 w-4 mr-1.5"/>This report has been reviewed and approved.</p>
                </CardContent>
              </Card>
            ))}
          </ScrollArea>
        </div>
      </div>
      
      <CardFooter className="mt-12 border-t pt-6">
        <p className="text-xs text-muted-foreground text-center w-full">
          Admin actions are logged (simulated). Ensure all reports meet quality standards before approval.
        </p>
      </CardFooter>
    </div>
  );
}

    