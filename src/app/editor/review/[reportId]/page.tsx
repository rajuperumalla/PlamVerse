"use client";
import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Image from 'next/image';
import { useAppContext, type ReportData, type ReportPalmInputDetails, type ReportNumerologyInputDetails_Business, type ReportNumerologyInputDetails_PersonalReport, type ReportNumerologyInputDetails_BabyName } from '@/context/AppContext';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { Loader2, CheckCircle, AlertTriangle, Send, FileCheck2, ArrowLeft, Brain, User, CalendarDays, Clock, Camera } from 'lucide-react';
import { generatePalmReading } from '@/ai/flows/generate-palm-reading';
import { generateBusinessNumerologyReport } from '@/ai/flows/generate-business-numerology-report';
import { generatePersonalLifePathReport } from '@/ai/flows/generate-personal-life-path-report';
import { generateBabyNameNumerologyReport } from '@/ai/flows/generate-baby-name-numerology-report';
import { Checkbox } from '@/components/ui/checkbox';
import { cn } from '@/lib/utils';
import { Badge } from '@/components/ui/badge';

export default function EditorReviewReportPage() {
  const { reportId } = useParams() as { reportId: string };
  const router = useRouter();
  const {
    getReportById,
    approveReport,
    startOperation,
    stopOperation,
    isOperationInProgress,
    isAuthenticated,
    isEditor,
    isInitializing
  } = useAppContext();
  const { toast } = useToast();

  const [report, setReport] = useState<ReportData | null | undefined>(null);
  const [authCheckComplete, setAuthCheckComplete] = useState(false);
  const [imageQualityConfirmed, setImageQualityConfirmed] = useState(false);

  const [expertAnalysisNotes, setExpertAnalysisNotes] = useState('');
  const [generatedReportPreview, setGeneratedReportPreview] = useState<string | null>(null);

  useEffect(() => {
    if (!isInitializing) {
      if (!isAuthenticated) {
        router.push('/');
      } else if (!isEditor) {
        toast({ title: "Access Denied", description: "You do not have permission to view this page.", variant: "destructive" });
        router.push('/');
      } else {
        const foundReport = getReportById(reportId);
        setReport(foundReport);
        if (foundReport?.reportType === 'numerology') {
            setImageQualityConfirmed(true);
        }
      }
      setAuthCheckComplete(true);
    }
  }, [isAuthenticated, isEditor, reportId, getReportById, router, toast, isInitializing]);

  const handleGenerateWithExpertAnalysis = async () => {
    if (!report || !expertAnalysisNotes.trim()) {
      toast({ title: "Missing Input", description: "Please provide your expert analysis and directives.", variant: "destructive" });
      return;
    }
    startOperation();
    setGeneratedReportPreview(null);
    try {
      let result;
      if (report.reportType === 'palmistry') {
        result = await generatePalmReading({
          ...(report.inputDetails as ReportPalmInputDetails),
          expertAnalysis: expertAnalysisNotes,
        });
      } else if (report.reportType === 'numerology') {
          switch(report.category) {
              case 'business-name-calculator':
                  result = await generateBusinessNumerologyReport({
                      ...(report.inputDetails as ReportNumerologyInputDetails_Business),
                      expertAnalysis: expertAnalysisNotes,
                  });
                  break;
              case 'life-path-report':
                  result = await generatePersonalLifePathReport({
                      ...(report.inputDetails as ReportNumerologyInputDetails_PersonalReport),
                      expertAnalysis: expertAnalysisNotes,
                  });
                  break;
              case 'baby-name-numerology':
                 result = await generateBabyNameNumerologyReport({
                    ...(report.inputDetails as ReportNumerologyInputDetails_BabyName),
                    expertAnalysis: expertAnalysisNotes,
                 });
                 break;
              default:
                  throw new Error(`Unsupported numerology category: ${report.category}`);
          }
      } else {
          throw new Error(`Unsupported report type: ${report.reportType}`);
      }

      setGeneratedReportPreview(result.report);
      toast({ title: "AI Report Generated", description: "Review the AI-generated report based on your analysis below." });
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'An unknown error occurred';
      console.error("Error generating report with expert analysis:", error);
      toast({ title: "Generation Error", description: `Failed to generate report: ${errorMessage}`, variant: "destructive" });
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
      router.push('/editor/approved');
    } catch (error) {
      console.error("Error during final approval:", error);
      toast({ title: "Final Approval Error", description: `Failed to approve report. Please try again.`, variant: "destructive" });
    } finally {
      stopOperation();
    }
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
        <Button onClick={() => router.push('/editor/workflow')}><ArrowLeft className="mr-2 h-4 w-4" />Back to Workflow</Button>
      </div>
    );
  }

  if (report && report.status !== 'pending_review') {
     return (
      <div className="flex flex-col justify-center items-center min-h-[calc(100vh-200px)] text-center">
        <AlertTriangle className="h-12 w-12 text-destructive mb-4" />
        <h1 className="text-2xl font-bold">Report Not Pending Review</h1>
        <p className="text-muted-foreground mb-4">This report (ID: {report.id.substring(0,10)}...) is not currently pending review. Its status is: {report.status}.</p>
        <Button onClick={() => router.push('/editor/workflow')}><ArrowLeft className="mr-2 h-4 w-4" />Back to Workflow</Button>
      </div>
    );
  }

  const palmInputDetails = report.reportType === 'palmistry' ? report.inputDetails as ReportPalmInputDetails : null;
  const businessNumerologyDetails = report.reportType === 'numerology' && report.category === 'business-name-calculator' ? report.inputDetails as ReportNumerologyInputDetails_Business : null;
  const personalReportDetails = report.reportType === 'numerology' && report.category === 'life-path-report' ? report.inputDetails as ReportNumerologyInputDetails_PersonalReport : null;
  const babyNameDetails = report.reportType === 'numerology' && report.category === 'baby-name-numerology' ? report.inputDetails as ReportNumerologyInputDetails_BabyName : null;

  // Generation is disabled if images aren't verified for palmistry or if operation is in progress
  const isGenerationDisabled = (report.reportType === 'palmistry' && !imageQualityConfirmed) || isOperationInProgress;

  const renderUserDetails = () => (
     <div className="space-y-4 text-sm">
        <div className="flex items-center gap-3">
          <User className="h-5 w-5 text-muted-foreground" />
          <p><strong>User:</strong> {report.userName || 'N/A'}</p>
        </div>
         <div className="flex items-center gap-3">
          <CalendarDays className="h-5 w-5 text-muted-foreground" />
          <p><strong>Submitted:</strong> {new Date(report.submissionDate).toLocaleString()}</p>
        </div>
        
        {palmInputDetails && (
          <>
            <div className="flex items-center gap-3">
              <User className="h-5 w-5 text-muted-foreground" />
              <p><strong>Dominant Hand:</strong> {palmInputDetails.dominantHand}</p>
            </div>
            <div className="flex items-center gap-3">
              <CalendarDays className="h-5 w-5 text-muted-foreground" />
              <p><strong>DOB:</strong> {new Date(palmInputDetails.dateOfBirth).toLocaleDateString()}</p>
            </div>
            <div className="flex items-center gap-3">
              <Clock className="h-5 w-5 text-muted-foreground" />
              <p><strong>TOB:</strong> {palmInputDetails.timeOfBirth}</p>
            </div>
          </>
        )}
        {businessNumerologyDetails && (
          <>
              <p><strong>Business Name:</strong> {businessNumerologyDetails.businessName}</p>
              {businessNumerologyDetails.additionalBusinessNames && <p><strong>Other Names:</strong> {businessNumerologyDetails.additionalBusinessNames}</p>}
              <p><strong>Founder Name:</strong> {businessNumerologyDetails.founderFullName}</p>
              <p><strong>Founder DOB:</strong> {new Date(businessNumerologyDetails.founderDOB).toLocaleDateString()}</p>
              {businessNumerologyDetails.founderTOB && <p><strong>Founder TOB:</strong> {businessNumerologyDetails.founderTOB}</p>}
          </>
        )}
        {personalReportDetails && (
          <>
            <p><strong>Full Name:</strong> {personalReportDetails.fullName}</p>
            <p><strong>Date of Birth:</strong> {new Date(personalReportDetails.dateOfBirth).toLocaleDateString()}</p>
            {personalReportDetails.timeOfBirth && <p><strong>Time of Birth:</strong> {personalReportDetails.timeOfBirth}</p>}
          </>
        )}
        {babyNameDetails && (
            <>
              <div><strong>Proposed Names:</strong>
                  <div className="flex flex-wrap gap-2 mt-1">
                      {babyNameDetails.proposedNames.map((name, i) => <Badge key={i} variant="secondary">{name}</Badge>)}
                  </div>
              </div>
              <p><strong>Child's DOB:</strong> {new Date(babyNameDetails.childDOB).toLocaleDateString()}</p>
              {babyNameDetails.childTOB && <p><strong>Child's TOB:</strong> {babyNameDetails.childTOB}</p>}
              {babyNameDetails.parent1FullName && <p><strong>Parent 1:</strong> {babyNameDetails.parent1FullName} (DOB: {babyNameDetails.parent1DOB ? new Date(babyNameDetails.parent1DOB).toLocaleDateString() : 'N/A'})</p>}
              {babyNameDetails.parent2FullName && <p><strong>Parent 2:</strong> {babyNameDetails.parent2FullName} (DOB: {babyNameDetails.parent2DOB ? new Date(babyNameDetails.parent2DOB).toLocaleDateString() : 'N/A'})</p>}
            </>
        )}
     </div>
  )

  return (
    <div className="container mx-auto py-8">
      <Button onClick={() => router.push('/editor/workflow')} variant="outline" className="mb-6">
        <ArrowLeft className="mr-2 h-4 w-4" /> Back to Workflow
      </Button>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
        {/* Left Column */}
        <div className="lg:col-span-2 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="text-xl font-headline">Review Report: {report.id.substring(0,10)}...</CardTitle>
              <CardDescription>
                Category: {report.category}
              </CardDescription>
            </CardHeader>
            <CardContent>
                {renderUserDetails()}
            </CardContent>
          </Card>
          
          {report.reportType === 'palmistry' && (
            <Card className="bg-amber-50 dark:bg-amber-900/20 border-amber-300 dark:border-amber-800">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-amber-800 dark:text-amber-300 text-lg"><Camera className="h-5 w-5"/>Step 1: Image Quality Verification</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center space-x-3 rounded-md border border-amber-400/50 bg-amber-100/50 dark:bg-amber-900/30 p-4">
                    <Checkbox id="image-quality-confirm" 
                      onCheckedChange={(checked) => setImageQualityConfirmed(checked as boolean)}
                      checked={imageQualityConfirmed}
                    />
                    <label
                      htmlFor="image-quality-confirm"
                      className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 text-amber-900 dark:text-amber-200"
                    >
                      I confirm the submitted images are clear, well-lit, and suitable for analysis.
                    </label>
                  </div>
                </CardContent>
            </Card>
          )}

          <Card className="transition-opacity">
            <CardHeader>
                <CardTitle className="flex items-center gap-2 text-lg"><Brain className="h-5 w-5"/>Step 2: Expert Analysis & Report Generation</CardTitle>
                <CardDescription>Provide your expert directives below. The AI will generate the report based on your notes.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
                <div className="space-y-2 pt-6 border-t">
                  <Label htmlFor="expertAnalysisNotes" className="text-md font-medium flex items-center gap-1.5"><Brain className="h-5 w-5 text-primary"/>Editor's Expert Analysis & Directives for AI</Label>
                  <Textarea
                    id="expertAnalysisNotes"
                    value={expertAnalysisNotes}
                    onChange={(e) => setExpertAnalysisNotes(e.target.value)}
                    placeholder="Enter your comprehensive analysis, interpretations, and directives here. The AI will use this as the primary basis for generating the report."
                    rows={12}
                    className="text-sm"
                    disabled={isOperationInProgress}
                  />
                   <Button 
                        onClick={handleGenerateWithExpertAnalysis} 
                        disabled={isGenerationDisabled || !expertAnalysisNotes.trim()} 
                        className="w-full bg-blue-600 hover:bg-blue-700 text-white mt-2"
                        title={report.reportType === 'palmistry' && !imageQualityConfirmed ? "Please confirm image quality in Step 1 first." : "AI will use your analysis above to generate a new report version."}
                    >
                        {isOperationInProgress && expertAnalysisNotes.trim() && !generatedReportPreview ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Send className="mr-2 h-4 w-4" />}
                        Generate Report using My Analysis
                    </Button>
                    {report.reportType === 'palmistry' && !imageQualityConfirmed && (
                      <p className="text-xs text-amber-600 flex items-center gap-1 mt-1 justify-center">
                        <AlertTriangle className="h-3 w-3" /> Please verify images in Step 1 to enable report generation.
                      </p>
                    )}
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
                      className="w-full bg-green-600 hover:bg-green-700 text-white mt-2"
                    >
                      {isOperationInProgress ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <CheckCircle className="mr-2 h-4 w-4" />}
                      Confirm & Approve This Version
                    </Button>
                  </div>
                )}
            </CardContent>
          </Card>
        </div>

        {/* Right Column */}
        <div className="lg:col-span-1 space-y-6 lg:sticky lg:top-24 h-fit">
          {palmInputDetails && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2"><Camera className="h-5 w-5"/>Submitted Images</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                 {palmInputDetails.frontPalmDataUri && 
                  <div className="text-center">
                    <Image src={palmInputDetails.frontPalmDataUri} alt={`Front of ${palmInputDetails.dominantHand} Palm`} width={300} height={225} className="rounded-md border mx-auto shadow" data-ai-hint="palm hand front"/>
                    <p className="text-sm text-muted-foreground mt-2">Front of {palmInputDetails.dominantHand} Palm</p>
                  </div>
                }
                {palmInputDetails.sidePalmDataUri && 
                  <div className="text-center">
                    <Image src={palmInputDetails.sidePalmDataUri} alt={`Side of ${palmInputDetails.dominantHand} Palm`} width={300} height={225} className="rounded-md border mx-auto shadow" data-ai-hint="palm hand side"/>
                    <p className="text-sm text-muted-foreground mt-2">Side of {palmInputDetails.dominantHand} Palm</p>
                  </div>
                }
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
}
