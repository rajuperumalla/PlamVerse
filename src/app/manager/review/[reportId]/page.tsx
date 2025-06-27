
"use client";
import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Image from 'next/image';
import { useAppContext, type ReportData, type ReportPalmInputDetails } from '@/context/AppContext';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { generatePalmReading } from '@/ai/flows/generate-palm-reading';
import { suggestReportImprovements } from '@/ai/flows/suggest-report-improvements';
import { Loader2, CheckCircle, AlertTriangle, Send, Sparkles, FileCheck2, MessageCircleQuestion, ArrowLeft, ThumbsUp, Brain } from 'lucide-react';
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

export default function ManagerReviewReportPage() {
  const { reportId } = useParams() as { reportId: string };
  const router = useRouter();
  const {
    getReportById,
    approveReport,
    startOperation,
    stopOperation,
    isOperationInProgress,
    isAuthenticated,
    isManager,
    isInitializing
  } = useAppContext();
  const { toast } = useToast();

  const [report, setReport] = useState<ReportData | null | undefined>(null);
  const [authCheckComplete, setAuthCheckComplete] = useState(false);

  const [expertAnalysisNotes, setExpertAnalysisNotes] = useState('');
  const [adminGuidanceForSuggestions, setAdminGuidanceForSuggestions] = useState('');
  const [aiSuggestion, setAiSuggestion] = useState<string | null>(null);
  const [isAiSuggestionLoading, setIsAiSuggestionLoading] = useState(false);
  const [generatedReportPreview, setGeneratedReportPreview] = useState<string | null>(null);

  useEffect(() => {
    if (!isInitializing) {
      if (!isAuthenticated) {
        router.push('/');
      } else if (!isManager) {
        toast({ title: "Access Denied", description: "You do not have permission to view this page.", variant: "destructive" });
        router.push('/');
      } else {
        const foundReport = getReportById(reportId);
        setReport(foundReport);
      }
      setAuthCheckComplete(true);
    }
  }, [isAuthenticated, isManager, reportId, getReportById, router, toast, isInitializing]);

  const handleGetAiSuggestions = async () => {
    if (!report || !report.content) {
        toast({ title: "Missing Content", description: "Initial AI report content is missing to get suggestions.", variant: "destructive"});
        return;
    }
    setIsAiSuggestionLoading(true);
    setAiSuggestion(null);
    try {
      const result = await suggestReportImprovements({
        report: report.content,
        adminGuidance: adminGuidanceForSuggestions
      });
      setAiSuggestion(result.suggestions);
      toast({ title: "AI Suggestions Ready", description: `AI-powered suggestions generated.`});
    } catch (error) {
      console.error("Error getting AI suggestions:", error);
      setAiSuggestion("Error: Could not fetch suggestions.");
      toast({ title: "Suggestion Error", description: `Failed to get AI suggestions.`, variant: "destructive" });
    } finally {
      setIsAiSuggestionLoading(false);
    }
  };

  const handleGenerateWithExpertAnalysis = async () => {
    if (!report || !expertAnalysisNotes.trim()) {
      toast({ title: "Missing Input", description: "Please provide your expert analysis and directives.", variant: "destructive" });
      return;
    }
    startOperation();
    setGeneratedReportPreview(null);
    try {
      const result = await generatePalmReading({
        ...(report.inputDetails as ReportPalmInputDetails), // Assuming palmistry for now
        category: report.category,
        expertAnalysis: expertAnalysisNotes,
      });
      setGeneratedReportPreview(result.report);
      toast({ title: "AI Report Generated", description: "Review the AI-generated report based on your analysis below." });
    } catch (error) {
      console.error("Error generating report with expert analysis:", error);
      toast({ title: "Generation Error", description: `Failed to generate report with your analysis. Please try again.`, variant: "destructive" });
    } finally {
      stopOperation();
    }
  };

  const handleFinalApproveForCustomer = async () => {
    if (!report || !generatedReportPreview) {
      toast({ title: "Missing Content", description: "No AI-generated report (from your analysis) to approve.", variant: "destructive" });
      return;
    }
    startOperation();
    try {
      approveReport(report.id, generatedReportPreview);
      toast({ title: "Report Approved & Live", description: `Report ID ${report.id.substring(0,10)}... has been approved with your guided content.` });
      router.push('/manager/approved');
    } catch (error) {
      console.error("Error during final approval:", error);
      toast({ title: "Final Approval Error", description: `Failed to approve report. Please try again.`, variant: "destructive" });
    } finally {
      stopOperation();
    }
  };

  const handleApproveOriginalAsIs = () => {
    if (!report) return;
    startOperation();
    approveReport(report.id, report.content);
    toast({ title: "Original Report Approved As-Is", description: `Report ID ${report.id.substring(0,10)}... (initial AI version) has been approved.` });
    router.push('/manager/approved');
    stopOperation();
  };

  if (isInitializing || !authCheckComplete || (report === null && !isInitializing)) {
    return (
      <div className="flex flex-col justify-center items-center min-h-[calc(100vh-200px)]">
        <Loader2 className="h-12 w-12 animate-spin text-primary mb-4" />
        <p>Loading report details...</p>
      </div>
    );
  }

  if (report === undefined) {
    return (
      <div className="flex flex-col justify-center items-center min-h-[calc(100vh-200px)] text-center">
        <AlertTriangle className="h-12 w-12 text-destructive mb-4" />
        <h1 className="text-2xl font-bold">Report Not Found</h1>
        <p className="text-muted-foreground mb-4">The report you are looking for does not exist or could not be loaded.</p>
        <Button onClick={() => router.push('/manager/workflow')}><ArrowLeft className="mr-2 h-4 w-4" />Back to Workflow</Button>
      </div>
    );
  }

  if (report && report.status !== 'pending_review') {
     return (
      <div className="flex flex-col justify-center items-center min-h-[calc(100vh-200px)] text-center">
        <AlertTriangle className="h-12 w-12 text-destructive mb-4" />
        <h1 className="text-2xl font-bold">Report Not Pending Review</h1>
        <p className="text-muted-foreground mb-4">This report (ID: {report.id.substring(0,10)}...) is not currently pending review. Its status is: {report.status}.</p>
        <Button onClick={() => router.push('/manager/workflow')}><ArrowLeft className="mr-2 h-4 w-4" />Back to Workflow</Button>
      </div>
    );
  }

  const palmInputDetails = report.reportType === 'palmistry' ? report.inputDetails as ReportPalmInputDetails : null;

  return (
    <div className="container mx-auto py-8 max-w-4xl">
      <Button onClick={() => router.push('/manager/workflow')} variant="outline" className="mb-6">
        <ArrowLeft className="mr-2 h-4 w-4" /> Back to Workflow
      </Button>

      <Card>
        <CardHeader>
          <CardTitle className="text-2xl font-headline">Review Report: {report.id.substring(0,10)}...</CardTitle>
          <CardDescription>
            Category: {report.category} | Submitted by: {report.userName || 'N/A'} on {report.submissionDate && !isNaN(new Date(report.submissionDate).getTime()) ? new Date(report.submissionDate).toLocaleDateString() : 'N/A'}
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {palmInputDetails && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 my-4">
                {palmInputDetails.frontPalmDataUri && 
                  <div className="text-center">
                    <Image src={palmInputDetails.frontPalmDataUri} alt={`Front of ${palmInputDetails.dominantHand} Palm`} width={300} height={225} className="rounded-md border mx-auto shadow" data-ai-hint="palm hand front"/>
                    <p className="text-xs text-muted-foreground mt-1">Front of {palmInputDetails.dominantHand} Palm</p>
                  </div>
                }
                {palmInputDetails.sidePalmDataUri && 
                  <div className="text-center">
                    <Image src={palmInputDetails.sidePalmDataUri} alt={`Side of ${palmInputDetails.dominantHand} Palm`} width={300} height={225} className="rounded-md border mx-auto shadow" data-ai-hint="palm hand side"/>
                    <p className="text-xs text-muted-foreground mt-1">Side of {palmInputDetails.dominantHand} Palm</p>
                  </div>
                }
              </div>
           )}

          <div>
            <Label className="font-semibold text-lg">Initial AI Generated Content (From User Submission):</Label>
            <ScrollArea className="h-[150px] w-full rounded-md border p-4 mt-1 bg-muted/20 text-sm shadow-inner">
              {report.content && report.content.split('\n').filter(p => p.trim() !== '').map((paragraph, index) => (
                <p key={index} className="mb-2 leading-relaxed">{paragraph}</p>
              ))}
            </ScrollArea>
          </div>

          <div className="space-y-3 border-t pt-6">
              <Label htmlFor="adminGuidanceForSuggestions" className="text-md font-medium flex items-center gap-1.5"><MessageCircleQuestion className="h-5 w-5 text-primary"/>Your Guidance for AI Suggestions (Optional Helper)</Label>
              <Textarea
                  id="adminGuidanceForSuggestions"
                  value={adminGuidanceForSuggestions}
                  onChange={(e) => setAdminGuidanceForSuggestions(e.target.value)}
                  placeholder="e.g., 'Focus on career aspects for initial suggestions', 'Check clarity on relationships'"
                  rows={2}
                  className="text-sm"
                  disabled={isOperationInProgress || isAiSuggestionLoading}
              />
              <Button
                  onClick={handleGetAiSuggestions}
                  variant="outline"
                  size="sm"
                  className="w-full"
                  disabled={isOperationInProgress || isAiSuggestionLoading}
              >
                  {isAiSuggestionLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Sparkles className="mr-2 h-4 w-4" />}
                  Get AI Suggestions (to help formulate your analysis)
              </Button>
              <p className="text-xs text-muted-foreground mt-1 text-center">
                You can revise your guidance above and click again to get new suggestions. These suggestions are for your reference.
              </p>

              {aiSuggestion && (
              <Alert variant={aiSuggestion.startsWith("Error:") ? "destructive" : "default"} className="text-sm">
                  <Sparkles className="h-4 w-4" />
                  <AlertTitle className="text-md">AI Generated Suggestions (for your reference)</AlertTitle>
                  <AlertDescription>
                  <ScrollArea className="h-[100px]">
                      {aiSuggestion.split('\n').map((line, i) => <p key={i} className="mb-1">{line}</p>)}
                  </ScrollArea>
                  </AlertDescription>
                   {aiSuggestion && !aiSuggestion.startsWith("Error:") && (
                      <Button
                          onClick={() => {
                              setExpertAnalysisNotes((prev) => prev + (prev ? '\n\n--- Suggestions for consideration ---\n' : '--- Suggestions for consideration ---\n') + aiSuggestion);
                              toast({title: "AI Suggestions Appended", description: "Suggestions appended to your main analysis notes."})
                          }}
                          variant="link" size="sm" className="p-0 h-auto text-xs mt-2">
                          Append to My Expert Analysis Notes
                      </Button>
                  )}
              </Alert>
              )}
          </div>

          <div className="space-y-2 border-t pt-6">
            <Label htmlFor="expertAnalysisNotes" className="text-md font-medium flex items-center gap-1.5"><Brain className="h-5 w-5 text-primary"/>Expert Analysis & Directives for AI</Label>
            <Textarea
              id="expertAnalysisNotes"
              value={expertAnalysisNotes}
              onChange={(e) => setExpertAnalysisNotes(e.target.value)}
              placeholder="Enter your comprehensive analysis, interpretations, and directives here. The AI will use this as the primary basis for generating the report."
              rows={8}
              className="text-sm"
              disabled={isOperationInProgress}
            />
             <Button
                  onClick={handleGenerateWithExpertAnalysis}
                  disabled={isOperationInProgress || !expertAnalysisNotes.trim()}
                  className="w-full bg-blue-600 hover:bg-blue-700 text-white mt-2 py-3 text-base"
                  title="AI will use your analysis above to generate a new report version."
              >
                  {isOperationInProgress && expertAnalysisNotes.trim() && !generatedReportPreview ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Send className="mr-2 h-4 w-4" />}
                  Generate Report using My Analysis
              </Button>
          </div>

          {generatedReportPreview && (
            <div className="space-y-2 border-t pt-6">
              <Label className="font-semibold text-green-700 flex items-center gap-1.5 text-lg"><FileCheck2 className="h-5 w-5"/>AI-Generated Report (Based on Your Analysis):</Label>
              <ScrollArea className="h-[200px] w-full rounded-md border p-4 bg-green-50/50 text-sm shadow-inner">
                {generatedReportPreview.split('\n').filter(p => p.trim() !== '').map((paragraph, index) => (
                  <p key={index} className="mb-2 leading-relaxed">{paragraph}</p>
                ))}
              </ScrollArea>
              <Button
                onClick={handleFinalApproveForCustomer}
                disabled={isOperationInProgress}
                className="w-full bg-green-600 hover:bg-green-700 text-white mt-2 py-3 text-base"
              >
                {isOperationInProgress ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <CheckCircle className="mr-2 h-4 w-4" />}
                Confirm & Approve This Version
              </Button>
            </div>
          )}
        </CardContent>
        <CardFooter className="border-t pt-6 flex flex-col sm:flex-row justify-end gap-3">
            <Button
                onClick={handleApproveOriginalAsIs}
                variant="secondary"
                disabled={isOperationInProgress || !!generatedReportPreview}
                title={generatedReportPreview ? "A new version based on your analysis exists. Approve that or clear it first." : "Approve the initial AI report (from user submission) without your direct analysis."}
                className="w-full sm:w-auto py-3 text-base"
            >
                <ThumbsUp className="mr-2 h-4 w-4" /> Approve Original As-Is
            </Button>
        </CardFooter>
      </Card>
    </div>
  );
}

    