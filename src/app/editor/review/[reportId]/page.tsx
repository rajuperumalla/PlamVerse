"use client";
import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Image from 'next/image';
import { useAppContext, type ReportData, type ReportPalmInputDetails, type ReportNumerologyInputDetails_Business, type ReportNumerologyInputDetails_PersonalReport, type ReportNumerologyInputDetails_BabyName, type HandClassification } from '@/context/AppContext';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { Loader2, CheckCircle, AlertTriangle, Send, FileCheck2, ArrowLeft, Brain, User, CalendarDays, Clock, Camera, ExternalLink, ScanSearch, XCircle, ShieldCheck, Palette, Ruler, Shapes, RotateCcw } from 'lucide-react';
import { generatePalmReading } from '@/ai/flows/generate-palm-reading';
import { generateBusinessNumerologyReport } from '@/ai/flows/generate-business-numerology-report';
import { generatePersonalLifePathReport } from '@/ai/flows/generate-personal-life-path-report';
import { generateBabyNameNumerologyReport } from '@/ai/flows/generate-baby-name-numerology-report';
import { validatePalmImages } from '@/ai/flows/validate-palm-images';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

const COLOR_OPTIONS = ['Black', 'White', 'Red'] as const;
const SIZE_OPTIONS = ['Small', 'Medium', 'Large'] as const;
const SHAPE_OPTIONS = ['Round', 'Rectangle', 'Oval'] as const;

export default function EditorReviewReportPage() {
  const { reportId } = useParams() as { reportId: string };
  const router = useRouter();
  const {
    getReportById,
    startOperation,
    stopOperation,
    isOperationInProgress,
    isAuthenticated,
    isEditor,
    isInitializing,
    setImageValidation,
    rejectReportImages,
    submitReportToAdmin,
  } = useAppContext();
  const { toast } = useToast();

  const [report, setReport] = useState<ReportData | null | undefined>(null);
  const [authCheckComplete, setAuthCheckComplete] = useState(false);

  const [isValidatingImages, setIsValidatingImages] = useState(false);
  const [rejectReason, setRejectReason] = useState('');
  const [classification, setClassification] = useState<HandClassification>({ color: '', size: '', shape: '' });
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
        if (foundReport) {
          if (foundReport.editorNotes) setExpertAnalysisNotes(foundReport.editorNotes);
          if (foundReport.handClassification) setClassification(foundReport.handClassification);
        }
      }
      setAuthCheckComplete(true);
    }
  }, [isAuthenticated, isEditor, reportId, getReportById, router, toast, isInitializing]);

  const isNumerology = report?.reportType === 'numerology';
  const palmInputDetails = report && report.reportType === 'palmistry' ? report.inputDetails as ReportPalmInputDetails : null;
  const businessNumerologyDetails = report && report.reportType === 'numerology' && report.category === 'business-name-calculator' ? report.inputDetails as ReportNumerologyInputDetails_Business : null;
  const personalReportDetails = report && report.reportType === 'numerology' && report.category === 'life-path-report' ? report.inputDetails as ReportNumerologyInputDetails_PersonalReport : null;
  const babyNameDetails = report && report.reportType === 'numerology' && report.category === 'baby-name-numerology' ? report.inputDetails as ReportNumerologyInputDetails_BabyName : null;

  const handleOpenImage = (dataUri: string) => {
    const win = window.open();
    if (win) {
      win.document.write(`
        <html>
          <head><title>Palm Image View</title></head>
          <body style="margin:0; display:flex; justify-content:center; align-items:center; background:#000;">
            <img src="${dataUri}" style="max-width:100%; max-height:100vh; object-fit:contain;" />
          </body>
        </html>
      `);
      win.document.close();
    }
  };

  const handleValidateImages = async () => {
    if (!report || !palmInputDetails?.frontPalmDataUri || !palmInputDetails?.sidePalmDataUri) {
      toast({ title: "Missing Images", description: "This report has no palm images to validate.", variant: "destructive" });
      return;
    }
    setIsValidatingImages(true);
    try {
      const result = await validatePalmImages({
        frontPalmDataUri: palmInputDetails.frontPalmDataUri,
        sidePalmDataUri: palmInputDetails.sidePalmDataUri,
      });
      setImageValidation(report.id, { ...result, assessedAt: new Date().toISOString() });
      setReport(prev => prev ? { ...prev, imageValidation: { ...result, assessedAt: new Date().toISOString() } } : prev);
      toast({
        title: result.passed ? "Images Passed Validation" : "Images Flagged",
        description: result.summary,
        variant: result.passed ? "default" : "destructive",
      });
    } catch (error) {
      const msg = error instanceof Error ? error.message : 'Unknown error';
      toast({ title: "Validation Error", description: `Could not validate images: ${msg}`, variant: "destructive" });
    } finally {
      setIsValidatingImages(false);
    }
  };

  const handleRejectImages = () => {
    if (!report) return;
    if (!rejectReason.trim()) {
      toast({ title: "Reason Required", description: "Please tell the user why the images need re-uploading.", variant: "destructive" });
      return;
    }
    startOperation();
    try {
      rejectReportImages(report.id, rejectReason.trim());
      toast({ title: "Resubmission Requested", description: "The user has been notified to re-upload their images." });
      router.push('/editor/workflow');
    } finally {
      stopOperation();
    }
  };

  const handleGenerateReport = async () => {
    if (!report || !expertAnalysisNotes.trim()) {
      toast({ title: "Missing Input", description: "Please provide your expert analysis and directives.", variant: "destructive" });
      return;
    }
    startOperation();
    setGeneratedReportPreview(null);
    try {
      let result;
      if (report.reportType === 'palmistry') {
        const clsNote = classification.color && classification.size && classification.shape
          ? `\n\n[Editor Hand Classification] Color: ${classification.color}, Size: ${classification.size}, Shape: ${classification.shape}.`
          : '';
        const pd = report.inputDetails as ReportPalmInputDetails;
        result = await generatePalmReading({
          frontPalmDataUri: pd.frontPalmDataUri ?? '',
          sidePalmDataUri: pd.sidePalmDataUri ?? '',
          dateOfBirth: pd.dateOfBirth,
          placeOfBirth: pd.placeOfBirth,
          latitude: pd.latitude,
          longitude: pd.longitude,
          timeOfBirth: pd.timeOfBirth ?? 'Not specified',
          dominantHand: pd.dominantHand,
          category: pd.category,
          expertAnalysis: expertAnalysisNotes + clsNote,
        });
      } else {
        switch (report.category) {
          case 'business-name-calculator':
            result = await generateBusinessNumerologyReport({ ...(report.inputDetails as ReportNumerologyInputDetails_Business), expertAnalysis: expertAnalysisNotes });
            break;
          case 'life-path-report':
            result = await generatePersonalLifePathReport({ ...(report.inputDetails as ReportNumerologyInputDetails_PersonalReport), expertAnalysis: expertAnalysisNotes });
            break;
          case 'baby-name-numerology':
            result = await generateBabyNameNumerologyReport({ ...(report.inputDetails as ReportNumerologyInputDetails_BabyName), expertAnalysis: expertAnalysisNotes });
            break;
          default:
            throw new Error(`Unsupported numerology category: ${report.category}`);
        }
      }
      setGeneratedReportPreview(result.report);
      toast({ title: "AI Report Generated", description: "Review the AI-generated report below, then submit to Admin." });
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'An unknown error occurred';
      toast({ title: "Generation Error", description: `Failed to generate report: ${errorMessage}`, variant: "destructive" });
    } finally {
      stopOperation();
    }
  };

  const handleSubmitToAdmin = () => {
    if (!report || !generatedReportPreview) {
      toast({ title: "Missing Content", description: "Generate the AI report before submitting to Admin.", variant: "destructive" });
      return;
    }
    if (!isNumerology && (!classification.color || !classification.size || !classification.shape)) {
      toast({ title: "Classification Incomplete", description: "Please complete the hand classification (color, size, shape).", variant: "destructive" });
      return;
    }
    startOperation();
    try {
      submitReportToAdmin(report.id, generatedReportPreview, expertAnalysisNotes, classification);
      toast({ title: "Submitted to Admin", description: `Report ${report.id.substring(0, 10)}... is now awaiting final admin approval.` });
      router.push('/editor/workflow');
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

  const editableStatuses = ['pending_review', 'admin_revision'];
  if (report && !editableStatuses.includes(report.status)) {
    return (
      <div className="flex flex-col justify-center items-center min-h-[calc(100vh-200px)] text-center">
        <AlertTriangle className="h-12 w-12 text-destructive mb-4" />
        <h1 className="text-2xl font-bold">Report Not Available for Editing</h1>
        <p className="text-muted-foreground mb-4">This report (ID: {report.id.substring(0, 10)}...) is not editable. Its status is: <Badge variant="outline">{report.status}</Badge></p>
        <Button onClick={() => router.push('/editor/workflow')}><ArrowLeft className="mr-2 h-4 w-4" />Back to Workflow</Button>
      </div>
    );
  }

  if (!report) return null;

  const validation = report.imageValidation;
  const isRevision = report.status === 'admin_revision';
  // Images are considered cleared if AI passed them, OR for a revision (already past this stage), OR numerology.
  const imagesCleared = isNumerology || isRevision || (validation?.passed ?? false);

  const renderUserDetails = () => (
    <div className="space-y-3 text-sm">
      <div className="flex items-center gap-3"><User className="h-5 w-5 text-muted-foreground" /><p><strong>User:</strong> {report.userName || 'N/A'}</p></div>
      <div className="flex items-center gap-3"><CalendarDays className="h-5 w-5 text-muted-foreground" /><p><strong>Submitted:</strong> {new Date(report.submissionDate).toLocaleString()}</p></div>
      {palmInputDetails && (
        <>
          <div className="flex items-center gap-3"><User className="h-5 w-5 text-muted-foreground" /><p><strong>Dominant Hand:</strong> {palmInputDetails.dominantHand}</p></div>
          <div className="flex items-center gap-3"><CalendarDays className="h-5 w-5 text-muted-foreground" /><p><strong>DOB:</strong> {new Date(palmInputDetails.dateOfBirth).toLocaleDateString()}</p></div>
          <div className="flex items-center gap-3"><Clock className="h-5 w-5 text-muted-foreground" /><p><strong>TOB:</strong> {palmInputDetails.timeOfBirth || 'Not specified'}</p></div>
        </>
      )}
      {businessNumerologyDetails && (
        <>
          <p><strong>Business Name:</strong> {businessNumerologyDetails.businessName}</p>
          <p><strong>Founder:</strong> {businessNumerologyDetails.founderFullName}</p>
          <p><strong>Founder DOB:</strong> {new Date(businessNumerologyDetails.founderDOB).toLocaleDateString()}</p>
        </>
      )}
      {personalReportDetails && (
        <>
          <p><strong>Full Name:</strong> {personalReportDetails.fullName}</p>
          <p><strong>DOB:</strong> {new Date(personalReportDetails.dateOfBirth).toLocaleDateString()}</p>
        </>
      )}
      {babyNameDetails && (
        <>
          <div><strong>Proposed Names:</strong>
            <div className="flex flex-wrap gap-2 mt-1">{babyNameDetails.proposedNames.map((name, i) => <Badge key={i} variant="secondary">{name}</Badge>)}</div>
          </div>
          <p><strong>Child DOB:</strong> {new Date(babyNameDetails.childDOB).toLocaleDateString()}</p>
        </>
      )}
    </div>
  );

  return (
    <div className="container mx-auto py-8">
      <Button onClick={() => router.push('/editor/workflow')} variant="outline" className="mb-6">
        <ArrowLeft className="mr-2 h-4 w-4" /> Back to Workflow
      </Button>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
        {/* Left Column - Workflow Steps */}
        <div className="lg:col-span-2 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="text-xl font-headline">Review Report: {report.id.substring(0, 10)}...</CardTitle>
              <CardDescription>Category: {report.category} · Type: {report.reportType}</CardDescription>
            </CardHeader>
            <CardContent>{renderUserDetails()}</CardContent>
          </Card>

          {isRevision && report.adminNotes && (
            <Alert variant="destructive">
              <RotateCcw className="h-4 w-4" />
              <AlertTitle>Returned by Admin for Revision</AlertTitle>
              <AlertDescription>{report.adminNotes}</AlertDescription>
            </Alert>
          )}

          {/* STEP 1: Image Validation (palmistry only) */}
          {!isNumerology && (
            <Card className="border-amber-300 dark:border-amber-800">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-lg"><ScanSearch className="h-5 w-5 text-amber-500" />Step 1: AI Image Validation</CardTitle>
                <CardDescription>Run automated quality analysis on the submitted palm photos.</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <Button onClick={handleValidateImages} disabled={isValidatingImages || isOperationInProgress} className="w-full">
                  {isValidatingImages ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <ScanSearch className="mr-2 h-4 w-4" />}
                  {validation ? 'Re-run AI Image Validation' : 'Run AI Image Validation'}
                </Button>

                {validation && (
                  <Alert variant={validation.passed ? 'default' : 'destructive'}>
                    {validation.passed ? <ShieldCheck className="h-4 w-4" /> : <AlertTriangle className="h-4 w-4" />}
                    <AlertTitle className="flex items-center gap-2">
                      Quality Score: {validation.score}/100
                      <Badge variant={validation.passed ? 'default' : 'destructive'}>{validation.passed ? 'PASSED' : 'NEEDS RESUBMISSION'}</Badge>
                    </AlertTitle>
                    <AlertDescription>
                      <p className="mb-2">{validation.summary}</p>
                      {validation.issues.length > 0 && (
                        <ul className="list-disc list-inside text-xs space-y-1">
                          {validation.issues.map((issue, i) => <li key={i}>{issue}</li>)}
                        </ul>
                      )}
                    </AlertDescription>
                  </Alert>
                )}

                <div className="border-t pt-4 space-y-2">
                  <Label htmlFor="rejectReason" className="text-sm font-medium flex items-center gap-1.5 text-destructive"><XCircle className="h-4 w-4" />Request Image Resubmission</Label>
                  <Textarea
                    id="rejectReason"
                    value={rejectReason}
                    onChange={(e) => setRejectReason(e.target.value)}
                    placeholder="Explain to the user what's wrong with their images so they can re-upload..."
                    rows={2}
                    className="text-sm"
                    disabled={isOperationInProgress}
                  />
                  <Button onClick={handleRejectImages} variant="destructive" className="w-full" disabled={isOperationInProgress || !rejectReason.trim()}>
                    <XCircle className="mr-2 h-4 w-4" /> Reject Images & Notify User
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}

          {/* STEP 2: Hand Classification (palmistry only) */}
          {!isNumerology && (
            <Card className={imagesCleared ? '' : 'opacity-60 pointer-events-none'}>
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-lg"><Shapes className="h-5 w-5 text-primary" />Step 2: Hand Classification</CardTitle>
                <CardDescription>{imagesCleared ? 'Classify the hand based on the images.' : 'Complete & pass image validation in Step 1 first.'}</CardDescription>
              </CardHeader>
              <CardContent className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="space-y-1.5">
                  <Label className="text-sm flex items-center gap-1.5"><Palette className="h-4 w-4" />Hand Color</Label>
                  <Select value={classification.color} onValueChange={(v) => setClassification(c => ({ ...c, color: v as HandClassification['color'] }))}>
                    <SelectTrigger><SelectValue placeholder="Select" /></SelectTrigger>
                    <SelectContent>{COLOR_OPTIONS.map(o => <SelectItem key={o} value={o}>{o}</SelectItem>)}</SelectContent>
                  </Select>
                </div>
                <div className="space-y-1.5">
                  <Label className="text-sm flex items-center gap-1.5"><Ruler className="h-4 w-4" />Hand Size</Label>
                  <Select value={classification.size} onValueChange={(v) => setClassification(c => ({ ...c, size: v as HandClassification['size'] }))}>
                    <SelectTrigger><SelectValue placeholder="Select" /></SelectTrigger>
                    <SelectContent>{SIZE_OPTIONS.map(o => <SelectItem key={o} value={o}>{o}</SelectItem>)}</SelectContent>
                  </Select>
                </div>
                <div className="space-y-1.5">
                  <Label className="text-sm flex items-center gap-1.5"><Shapes className="h-4 w-4" />Hand Shape</Label>
                  <Select value={classification.shape} onValueChange={(v) => setClassification(c => ({ ...c, shape: v as HandClassification['shape'] }))}>
                    <SelectTrigger><SelectValue placeholder="Select" /></SelectTrigger>
                    <SelectContent>{SHAPE_OPTIONS.map(o => <SelectItem key={o} value={o}>{o}</SelectItem>)}</SelectContent>
                  </Select>
                </div>
              </CardContent>
            </Card>
          )}

          {/* STEP 3: Expert Analysis + AI Generation */}
          <Card className={imagesCleared ? '' : 'opacity-60 pointer-events-none'}>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-lg"><Brain className="h-5 w-5 text-primary" />Step {isNumerology ? '1' : '3'}: Expert Analysis & Report Generation</CardTitle>
              <CardDescription>Provide your expert directives. The AI uses your notes as the primary basis for the report.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <Textarea
                value={expertAnalysisNotes}
                onChange={(e) => setExpertAnalysisNotes(e.target.value)}
                placeholder="Enter your comprehensive analysis, interpretations, and directives here..."
                rows={12}
                className="text-sm"
                disabled={isOperationInProgress}
              />
              <Button onClick={handleGenerateReport} disabled={isOperationInProgress || !expertAnalysisNotes.trim() || !imagesCleared} className="w-full bg-blue-600 hover:bg-blue-700 text-white">
                {isOperationInProgress && !generatedReportPreview ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Send className="mr-2 h-4 w-4" />}
                Generate Report using My Analysis
              </Button>

              {generatedReportPreview && (
                <div className="space-y-2 border-t pt-4">
                  <Label className="font-semibold text-green-700 flex items-center gap-1.5 text-lg"><FileCheck2 className="h-5 w-5" />AI-Generated Report:</Label>
                  <ScrollArea className="h-[250px] w-full rounded-md border p-4 bg-green-50/50 text-sm shadow-inner">
                    {generatedReportPreview.split('\n').filter(p => p.trim() !== '').map((paragraph, index) => (
                      <p key={index} className="mb-2 leading-relaxed">{paragraph}</p>
                    ))}
                  </ScrollArea>
                  <Button onClick={handleSubmitToAdmin} disabled={isOperationInProgress} className="w-full bg-green-600 hover:bg-green-700 text-white">
                    {isOperationInProgress ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <CheckCircle className="mr-2 h-4 w-4" />}
                    Submit to Admin for Final Approval
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Right Column - Sticky Images */}
        <div className="lg:col-span-1 space-y-6 lg:sticky lg:top-24 h-fit">
          {palmInputDetails && (
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="flex items-center gap-2 text-lg"><Camera className="h-5 w-5" />Submitted Images</CardTitle>
                <CardDescription>Hover and click to view full size.</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                {palmInputDetails.frontPalmDataUri &&
                  <div className="text-center group relative">
                    <div className="relative overflow-hidden rounded-md border shadow">
                      <Image src={palmInputDetails.frontPalmDataUri} alt={`Front of ${palmInputDetails.dominantHand} Palm`} width={400} height={300} className="object-cover w-full h-auto" data-ai-hint="palm hand front" />
                      <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                        <Button variant="secondary" size="sm" onClick={() => handleOpenImage(palmInputDetails.frontPalmDataUri!)} className="gap-2"><ExternalLink className="h-4 w-4" /> View Full Image</Button>
                      </div>
                    </div>
                    <p className="text-sm font-medium mt-2">Front of {palmInputDetails.dominantHand} Palm</p>
                  </div>
                }
                {palmInputDetails.sidePalmDataUri &&
                  <div className="text-center group relative">
                    <div className="relative overflow-hidden rounded-md border shadow">
                      <Image src={palmInputDetails.sidePalmDataUri} alt={`Side of ${palmInputDetails.dominantHand} Palm`} width={400} height={300} className="object-cover w-full h-auto" data-ai-hint="palm hand side" />
                      <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                        <Button variant="secondary" size="sm" onClick={() => handleOpenImage(palmInputDetails.sidePalmDataUri!)} className="gap-2"><ExternalLink className="h-4 w-4" /> View Full Image</Button>
                      </div>
                    </div>
                    <p className="text-sm font-medium mt-2">Side of {palmInputDetails.dominantHand} Palm</p>
                  </div>
                }
              </CardContent>
            </Card>
          )}

          <Card className="bg-primary/5 border-primary/20">
            <CardHeader className="p-4"><CardTitle className="text-sm font-semibold">Editor Workflow</CardTitle></CardHeader>
            <CardContent className="p-4 pt-0 text-xs text-muted-foreground space-y-2">
              <p>1. Validate images with AI; reject &amp; notify user if poor quality.</p>
              <p>2. Classify the hand (color, size, shape).</p>
              <p>3. Write expert analysis &amp; generate the AI report.</p>
              <p>4. Submit to Admin for final approval.</p>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
