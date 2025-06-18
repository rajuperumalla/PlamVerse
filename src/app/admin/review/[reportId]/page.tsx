
"use client";
import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
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
import { Loader2, CheckCircle, AlertTriangle, Edit3, Send, Sparkles, FileCheck2, MessageCircleQuestion, ArrowLeft, ThumbsUp } from 'lucide-react';
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

export default function AdminReviewReportPage() {
  const { reportId } = useParams() as { reportId: string };
  const router = useRouter();
  const { 
    getReportById, 
    approveReport, 
    startLoading, 
    stopLoading, 
    isLoading: contextIsLoading,
    isAuthenticated,
    isAdmin 
  } = useAppContext();
  const { toast } = useToast();

  const [report, setReport] = useState<ReportData | null | undefined>(null); // null for loading, undefined for not found
  const [authCheckComplete, setAuthCheckComplete] = useState(false);

  const [adminSuggestion, setAdminSuggestion] = useState('');
  const [adminGuidanceForSuggestions, setAdminGuidanceForSuggestions] = useState('');
  const [aiSuggestion, setAiSuggestion] = useState<string | null>(null);
  const [isAiSuggestionLoading, setIsAiSuggestionLoading] = useState(false);
  const [provisionallyRefinedContent, setProvisionallyRefinedContent] = useState<string | null>(null);

  useEffect(() => {
     if (!isAuthenticated) {
      router.push('/');
    } else if (!isAdmin) {
      toast({ title: "Access Denied", description: "You do not have permission to view this page.", variant: "destructive" });
      router.push('/');
    } else {
      const foundReport = getReportById(reportId);
      setReport(foundReport);
    }
    setAuthCheckComplete(true);
  }, [isAuthenticated, isAdmin, reportId, getReportById, router, toast]);

  const handleGetAiSuggestions = async () => {
    if (!report) return;
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

  const handlePreviewAiRefinement = async () => {
    if (!report || !adminSuggestion.trim()) {
      toast({ title: "Missing Input", description: "Please provide refinement suggestions for the AI to process.", variant: "destructive" });
      return;
    }
    startLoading();
    setProvisionallyRefinedContent(null);
    try {
      const refinedResult = await refinePalmReadingReport({
        originalReport: report.content,
        adminSuggestions: adminSuggestion,
      });
      setProvisionallyRefinedContent(refinedResult.refinedReport);
      toast({ title: "AI Refinement Preview Ready", description: "Review the AI-refined content below before final approval." });
    } catch (error) {
      console.error("Error previewing AI refinement:", error);
      toast({ title: "Refinement Preview Error", description: `Failed to get AI refinement preview. Please try again.`, variant: "destructive" });
    } finally {
      stopLoading();
    }
  };

  const handleFinalApproveForCustomer = async () => {
    if (!report || !provisionallyRefinedContent) {
      toast({ title: "Missing Content", description: "No refined content to approve.", variant: "destructive" });
      return;
    }
    startLoading();
    try {
      approveReport(report.id, provisionallyRefinedContent); 
      toast({ title: "Report Approved & Live", description: `Report ID ${report.id.substring(0,10)}... has been approved.` });
      router.push('/admin'); 
    } catch (error) {
      console.error("Error during final approval:", error);
      toast({ title: "Final Approval Error", description: `Failed to approve report. Please try again.`, variant: "destructive" });
    } finally {
      stopLoading();
    }
  };

  const handleApproveAsIs = () => {
    if (!report) return;
    startLoading();
    approveReport(report.id); 
    toast({ title: "Report Approved As-Is", description: `Report ID ${report.id.substring(0,10)}... has been approved.` });
    router.push('/admin');
    stopLoading(); 
  };

  if (!authCheckComplete || contextIsLoading) {
    return (
      <div className="flex flex-col justify-center items-center min-h-[calc(100vh-200px)]">
        <Loader2 className="h-12 w-12 animate-spin text-primary mb-4" />
        <p>Loading report details...</p>
      </div>
    );
  }

  if (!report) {
    return (
      <div className="flex flex-col justify-center items-center min-h-[calc(100vh-200px)] text-center">
        <AlertTriangle className="h-12 w-12 text-destructive mb-4" />
        <h1 className="text-2xl font-bold">Report Not Found</h1>
        <p className="text-muted-foreground mb-4">The report you are looking for does not exist or could not be loaded.</p>
        <Button onClick={() => router.push('/admin')}><ArrowLeft className="mr-2 h-4 w-4" />Back to Admin Panel</Button>
      </div>
    );
  }
  
  if (report.status !== 'pending_review') {
     return (
      <div className="flex flex-col justify-center items-center min-h-[calc(100vh-200px)] text-center">
        <AlertTriangle className="h-12 w-12 text-destructive mb-4" />
        <h1 className="text-2xl font-bold">Report Not Pending Review</h1>
        <p className="text-muted-foreground mb-4">This report (ID: {report.id.substring(0,10)}...) is not currently pending review. Its status is: {report.status}.</p>
        <Button onClick={() => router.push('/admin')}><ArrowLeft className="mr-2 h-4 w-4" />Back to Admin Panel</Button>
      </div>
    );
  }


  return (
    <div className="container mx-auto py-8 max-w-4xl">
      <Button onClick={() => router.push('/admin')} variant="outline" className="mb-6">
        <ArrowLeft className="mr-2 h-4 w-4" /> Back to Admin Panel
      </Button>

      <Card>
        <CardHeader>
          <CardTitle className="text-2xl font-headline">Review Report: {report.id.substring(0,10)}...</CardTitle>
          <CardDescription>
            Category: {report.category} | Submitted by: {report.userName || 'N/A'} on {new Date(report.submissionDate).toLocaleDateString()}
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 my-4">
            {report.inputDetails.leftPalmDataUri && 
              <div className="text-center">
                <Image src={report.inputDetails.leftPalmDataUri} alt="Left Palm" width={300} height={225} className="rounded-md border mx-auto shadow" data-ai-hint="palm hand" />
                <p className="text-xs text-muted-foreground mt-1">Left Palm</p>
              </div>
            }
            {report.inputDetails.rightPalmDataUri && 
               <div className="text-center">
                <Image src={report.inputDetails.rightPalmDataUri} alt="Right Palm" width={300} height={225} className="rounded-md border mx-auto shadow" data-ai-hint="palm hand" />
                <p className="text-xs text-muted-foreground mt-1">Right Palm</p>
              </div>
            }
          </div>

          <div>
            <Label className="font-semibold text-lg">Original AI Generated Content:</Label>
            <ScrollArea className="h-[200px] w-full rounded-md border p-4 mt-1 bg-muted/20 text-sm shadow-inner">
              {report.content.split('\n').filter(p => p.trim() !== '').map((paragraph, index) => (
                <p key={index} className="mb-2 leading-relaxed">{paragraph}</p>
              ))}
            </ScrollArea>
          </div>

          <div className="space-y-3 border-t pt-6">
              <Label htmlFor="adminGuidanceForSuggestions" className="text-md font-medium flex items-center gap-1.5"><MessageCircleQuestion className="h-5 w-5 text-primary"/>Your Guidance for AI Suggestions (Optional)</Label>
              <Textarea
                  id="adminGuidanceForSuggestions"
                  value={adminGuidanceForSuggestions}
                  onChange={(e) => setAdminGuidanceForSuggestions(e.target.value)}
                  placeholder="e.g., 'Focus on career aspects', 'Check clarity on relationships', 'Is the tone appropriate?'"
                  rows={2}
                  className="text-sm"
                  disabled={contextIsLoading || isAiSuggestionLoading}
              />
              <Button 
                  onClick={handleGetAiSuggestions} 
                  variant="outline" 
                  size="sm"
                  className="w-full"
                  disabled={contextIsLoading || isAiSuggestionLoading}
              >
                  {isAiSuggestionLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Sparkles className="mr-2 h-4 w-4" />}
                  Get AI Suggestions for Refinement
              </Button>
              <p className="text-xs text-muted-foreground mt-1 text-center">
                You can revise your guidance above and click again to get new suggestions.
              </p>

              {aiSuggestion && (
              <Alert variant={aiSuggestion.startsWith("Error:") ? "destructive" : "default"} className="text-sm">
                  <Sparkles className="h-4 w-4" />
                  <AlertTitle className="text-md">AI Generated Suggestions</AlertTitle>
                  <AlertDescription>
                  <ScrollArea className="h-[100px]">
                      {aiSuggestion.split('\n').map((line, i) => <p key={i} className="mb-1">{line}</p>)}
                  </ScrollArea>
                  </AlertDescription>
                   {aiSuggestion && !aiSuggestion.startsWith("Error:") && (
                      <Button 
                          onClick={() => {
                              setAdminSuggestion((prev) => prev + (prev ? '\n\n--- AI Suggestions ---\n' : '--- AI Suggestions ---\n') + aiSuggestion);
                              toast({title: "AI Suggestions Appended", description: "Suggestions appended to your refinement notes."})
                          }}
                          variant="link" size="sm" className="p-0 h-auto text-xs mt-2">
                          Append to Final Refinement Notes
                      </Button>
                  )}
              </Alert>
              )}
          </div>
          
          <div className="space-y-2 border-t pt-6">
            <Label htmlFor="adminSuggestions" className="text-md font-medium flex items-center gap-1.5"><Edit3 className="h-5 w-5 text-primary"/>Your Final Refinement Notes & Edits</Label>
            <Textarea
              id="adminSuggestions"
              value={adminSuggestion}
              onChange={(e) => setAdminSuggestion(e.target.value)}
              placeholder="Enter your comprehensive suggestions and edits here. This will be used by AI to generate the final report."
              rows={5}
              className="text-sm"
              disabled={contextIsLoading}
            />
             <Button 
                  onClick={handlePreviewAiRefinement} 
                  disabled={contextIsLoading || !adminSuggestion.trim()} 
                  className="w-full bg-blue-600 hover:bg-blue-700 text-white mt-2 py-3 text-base"
                  title="AI will process your notes above to generate a refined report preview."
              >
                  {contextIsLoading && adminSuggestion.trim() && !provisionallyRefinedContent ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Send className="mr-2 h-4 w-4" />}
                  Preview AI Refinement
              </Button>
          </div>

          {provisionallyRefinedContent && (
            <div className="space-y-2 border-t pt-6">
              <Label className="font-semibold text-green-700 flex items-center gap-1.5 text-lg"><FileCheck2 className="h-5 w-5"/>Preview of AI-Refined Report for Customer:</Label>
              <ScrollArea className="h-[200px] w-full rounded-md border p-4 bg-green-50/50 text-sm shadow-inner">
                {provisionallyRefinedContent.split('\n').filter(p => p.trim() !== '').map((paragraph, index) => (
                  <p key={index} className="mb-2 leading-relaxed">{paragraph}</p>
                ))}
              </ScrollArea>
              <Button 
                onClick={handleFinalApproveForCustomer} 
                disabled={contextIsLoading}
                className="w-full bg-green-600 hover:bg-green-700 text-white mt-2 py-3 text-base"
              >
                {contextIsLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <CheckCircle className="mr-2 h-4 w-4" />}
                Confirm & Approve for Customer
              </Button>
            </div>
          )}
        </CardContent>
        <CardFooter className="border-t pt-6 flex flex-col sm:flex-row justify-end gap-3">
            <Button 
                onClick={handleApproveAsIs} 
                variant="secondary" 
                disabled={contextIsLoading || !!provisionallyRefinedContent} 
                title={provisionallyRefinedContent ? "A refined preview exists. Clear it or approve it first." : "Approve the original AI report without admin refinements."}
                className="w-full sm:w-auto py-3 text-base"
            >
                <ThumbsUp className="mr-2 h-4 w-4" /> Approve Original As-Is
            </Button>
        </CardFooter>
      </Card>
    </div>
  );
}


    