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
import { Loader2, CheckCircle, AlertTriangle, ArrowLeft, Brain, FileCheck2, Shapes, RotateCcw, User, CalendarDays, ThumbsUp } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';

export default function AdminReviewReportPage() {
  const { reportId } = useParams() as { reportId: string };
  const router = useRouter();
  const {
    getReportById,
    adminApproveReport,
    adminRejectToEditor,
    startOperation,
    stopOperation,
    isOperationInProgress,
    isAuthenticated,
    isAdmin,
    isInitializing,
  } = useAppContext();
  const { toast } = useToast();

  const [report, setReport] = useState<ReportData | null | undefined>(null);
  const [authCheckComplete, setAuthCheckComplete] = useState(false);
  const [adminRejectionNotes, setAdminRejectionNotes] = useState('');

  useEffect(() => {
    if (!isInitializing) {
      if (!isAuthenticated) {
        router.push('/');
      } else if (!isAdmin) {
        toast({ title: "Access Denied", description: "You do not have permission to view this page.", variant: "destructive" });
        router.push('/');
      } else {
        setReport(getReportById(reportId));
      }
      setAuthCheckComplete(true);
    }
  }, [isAuthenticated, isAdmin, reportId, getReportById, router, toast, isInitializing]);

  const handleApprove = () => {
    if (!report) return;
    startOperation();
    try {
      adminApproveReport(report.id);
      toast({ title: "Report Approved & Published", description: `Report ${report.id.substring(0, 10)}... is now live for the customer.` });
      router.push('/admin/approved');
    } finally {
      stopOperation();
    }
  };

  const handleRejectToEditor = () => {
    if (!report) return;
    if (!adminRejectionNotes.trim()) {
      toast({ title: "Notes Required", description: "Provide revision notes so the editor knows what to fix.", variant: "destructive" });
      return;
    }
    startOperation();
    try {
      adminRejectToEditor(report.id, adminRejectionNotes.trim());
      toast({ title: "Returned to Editor", description: `Report ${report.id.substring(0, 10)}... sent back for revision.` });
      router.push('/admin/workflow');
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
        <Button onClick={() => router.push('/admin/workflow')}><ArrowLeft className="mr-2 h-4 w-4" />Back to Workflow</Button>
      </div>
    );
  }

  if (report && report.status !== 'pending_admin_approval') {
    return (
      <div className="flex flex-col justify-center items-center min-h-[calc(100vh-200px)] text-center">
        <AlertTriangle className="h-12 w-12 text-destructive mb-4" />
        <h1 className="text-2xl font-bold">Report Not Awaiting Approval</h1>
        <p className="text-muted-foreground mb-4">This report (ID: {report.id.substring(0, 10)}...) is not awaiting admin approval. Status: <Badge variant="outline">{report.status}</Badge></p>
        <Button onClick={() => router.push('/admin/workflow')}><ArrowLeft className="mr-2 h-4 w-4" />Back to Workflow</Button>
      </div>
    );
  }

  if (!report) return null;

  const palmInputDetails = report.reportType === 'palmistry' ? report.inputDetails as ReportPalmInputDetails : null;
  const cls = report.handClassification;

  return (
    <div className="container mx-auto py-8 max-w-4xl">
      <Button onClick={() => router.push('/admin/workflow')} variant="outline" className="mb-6">
        <ArrowLeft className="mr-2 h-4 w-4" /> Back to Workflow
      </Button>

      <Card>
        <CardHeader>
          <CardTitle className="text-2xl font-headline">Final Approval: {report.id.substring(0, 10)}...</CardTitle>
          <CardDescription className="flex flex-wrap gap-x-4 gap-y-1 mt-1">
            <span className="flex items-center gap-1"><User className="h-3.5 w-3.5" />{report.userName || 'N/A'}</span>
            <span>Category: {report.category}</span>
            <span className="flex items-center gap-1"><CalendarDays className="h-3.5 w-3.5" />{new Date(report.submissionDate).toLocaleDateString()}</span>
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {palmInputDetails && (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {palmInputDetails.frontPalmDataUri &&
                <div className="text-center">
                  <Image src={palmInputDetails.frontPalmDataUri} alt="Front Palm" width={300} height={225} className="rounded-md border mx-auto shadow" data-ai-hint="palm hand front" />
                  <p className="text-xs text-muted-foreground mt-1">Front of {palmInputDetails.dominantHand} Palm</p>
                </div>}
              {palmInputDetails.sidePalmDataUri &&
                <div className="text-center">
                  <Image src={palmInputDetails.sidePalmDataUri} alt="Side Palm" width={300} height={225} className="rounded-md border mx-auto shadow" data-ai-hint="palm hand side" />
                  <p className="text-xs text-muted-foreground mt-1">Side of {palmInputDetails.dominantHand} Palm</p>
                </div>}
            </div>
          )}

          {report.imageValidation && (
            <Alert variant={report.imageValidation.passed ? 'default' : 'destructive'}>
              <FileCheck2 className="h-4 w-4" />
              <AlertTitle>AI Image Validation: {report.imageValidation.score}/100 · {report.imageValidation.passed ? 'Passed' : 'Flagged'}</AlertTitle>
              <AlertDescription>{report.imageValidation.summary}</AlertDescription>
            </Alert>
          )}

          {cls && (cls.color || cls.size || cls.shape) && (
            <div>
              <Label className="font-semibold flex items-center gap-1.5 mb-2"><Shapes className="h-4 w-4 text-primary" />Editor Hand Classification</Label>
              <div className="flex flex-wrap gap-2">
                {cls.color && <Badge variant="secondary">Color: {cls.color}</Badge>}
                {cls.size && <Badge variant="secondary">Size: {cls.size}</Badge>}
                {cls.shape && <Badge variant="secondary">Shape: {cls.shape}</Badge>}
              </div>
            </div>
          )}

          {report.editorNotes && (
            <div>
              <Label className="font-semibold flex items-center gap-1.5 mb-1"><Brain className="h-4 w-4 text-primary" />Editor's Expert Analysis</Label>
              <ScrollArea className="h-[120px] w-full rounded-md border p-3 bg-muted/20 text-sm">
                {report.editorNotes.split('\n').filter(p => p.trim() !== '').map((p, i) => <p key={i} className="mb-1.5">{p}</p>)}
              </ScrollArea>
            </div>
          )}

          <div>
            <Label className="font-semibold flex items-center gap-1.5 mb-1 text-green-700"><FileCheck2 className="h-4 w-4" />Generated Report (for customer)</Label>
            <ScrollArea className="h-[260px] w-full rounded-md border p-4 bg-green-50/50 text-sm shadow-inner">
              {report.content.split('\n').filter(p => p.trim() !== '').map((paragraph, index) => (
                <p key={index} className="mb-2 leading-relaxed">{paragraph}</p>
              ))}
            </ScrollArea>
          </div>

          <div className="space-y-2 border-t pt-6">
            <Label htmlFor="adminRejectionNotes" className="text-md font-medium flex items-center gap-1.5 text-destructive"><RotateCcw className="h-5 w-5" />Revision Notes (if returning to editor)</Label>
            <Textarea
              id="adminRejectionNotes"
              value={adminRejectionNotes}
              onChange={(e) => setAdminRejectionNotes(e.target.value)}
              placeholder="Explain what the editor needs to change before this can be published..."
              rows={3}
              className="text-sm"
              disabled={isOperationInProgress}
            />
          </div>
        </CardContent>
        <CardFooter className="border-t pt-6 flex flex-col sm:flex-row justify-end gap-3">
          <Button onClick={handleRejectToEditor} variant="destructive" disabled={isOperationInProgress || !adminRejectionNotes.trim()} className="w-full sm:w-auto">
            {isOperationInProgress ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <RotateCcw className="mr-2 h-4 w-4" />}
            Return to Editor
          </Button>
          <Button onClick={handleApprove} disabled={isOperationInProgress} className="w-full sm:w-auto bg-green-600 hover:bg-green-700 text-white">
            {isOperationInProgress ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <CheckCircle className="mr-2 h-4 w-4" />}
            Approve &amp; Publish to Customer
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
}
