
"use client";
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { FileText, RefreshCw, ArrowLeft, MessageSquarePlus, Send, Loader2, ShieldCheck, Download } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useAppContext, type ReportData } from '@/context/AppContext'; 
import { useToast } from '@/hooks/use-toast';
import { processUserReportFeedback } from '@/ai/flows/process-user-report-feedback';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';
import Image from 'next/image';

interface ReportDisplayProps {
  report: ReportData;
}

const ReportDisplay = ({ report }: ReportDisplayProps) => {
  const router = useRouter();
  const { toast } = useToast();
  const { isOperationInProgress, startOperation, stopOperation, clearCurrentUserReportStorage, setHasPaid } = useAppContext();
  const [showFeedbackForm, setShowFeedbackForm] = useState(false);
  const [feedbackText, setFeedbackText] = useState('');

  const reportParagraphs = report.content.split('\n').filter(p => p.trim() !== '');

  const handleFeedbackSubmit = async () => {
    if (!feedbackText.trim()) {
      toast({
        title: 'Feedback Empty',
        description: 'Please enter your feedback before submitting.',
        variant: 'destructive',
      });
      return;
    }
    startOperation();
    try {
      const result = await processUserReportFeedback({
        originalReport: report.content,
        userFeedback: feedbackText,
      });
      toast({
        title: 'Feedback Submitted',
        description: result.acknowledgment,
      });
      setFeedbackText('');
      setShowFeedbackForm(false);
    } catch (error) {
      console.error("Error submitting feedback:", error);
      toast({
        title: 'Error Submitting Feedback',
        description: 'Something went wrong. Please try again.',
        variant: 'destructive',
      });
    } finally {
      stopOperation();
    }
  };

  const handleStartNewReading = () => {
    clearCurrentUserReportStorage(); 
    setHasPaid(false); 
    router.push('/palm-input');
  }

  const handleDownloadPdf = () => {
    const reportElement = document.getElementById('report-content-area-for-pdf');
    if (reportElement) {
      startOperation();
      toast({ title: 'Preparing PDF...', description: 'Please wait while your report is being generated.' });
      html2canvas(reportElement, { 
        scale: 2, 
        useCORS: true, 
        scrollY: -window.scrollY 
      }).then(canvas => {
        const imgData = canvas.toDataURL('image/png');
        const pdf = new jsPDF('p', 'pt', 'a4');
        
        const imgProps = pdf.getImageProperties(imgData);
        const pdfPageWidth = pdf.internal.pageSize.getWidth();
        const pdfPageHeight = pdf.internal.pageSize.getHeight();
        const margin = 40;

        const usableWidth = pdfPageWidth - 2 * margin;
        const usableHeight = pdfPageHeight - 2 * margin;
        
        let finalPdfWidth = imgProps.width;
        let finalPdfHeight = imgProps.height;

        if (finalPdfWidth > usableWidth) {
          finalPdfHeight = (usableWidth / finalPdfWidth) * finalPdfHeight;
          finalPdfWidth = usableWidth;
        }

        if (finalPdfHeight > usableHeight) {
          finalPdfWidth = (usableHeight / finalPdfHeight) * finalPdfWidth;
          finalPdfHeight = usableHeight;
        }
        
        const xOffset = (pdfPageWidth - finalPdfWidth) / 2; 
        const yOffset = margin;

        pdf.addImage(imgData, 'PNG', xOffset, yOffset, finalPdfWidth, finalPdfHeight);
        pdf.save(`palmverse-report-${report.id.substring(0,8)}.pdf`);
        toast({ title: 'PDF Downloaded', description: 'Your report has been saved.' });
      }).catch(err => {
        console.error("Error generating PDF:", err);
        toast({ title: 'PDF Generation Failed', description: 'Could not generate PDF. Please try again.', variant: 'destructive' });
      }).finally(() => {
        stopOperation();
      });
    } else {
      toast({ title: 'Error', description: 'Report content not found for PDF generation.', variant: 'destructive' });
    }
  };


  return (
    <div className="flex justify-center items-center py-8">
      <Card className="w-full max-w-3xl shadow-xl animate-fade-in relative overflow-hidden">
        <div className="absolute inset-0 z-0 opacity-[0.03] pointer-events-none">
            <Image
            src="https://placehold.co/1000x1200.png"
            alt="Subtle Spiritual Background"
            layout="fill"
            objectFit="cover"
            data-ai-hint="spiritual symbol"
            />
        </div>
        <div className="relative z-10">
            <CardHeader className="text-center">
            <div className="mx-auto bg-green-100/80 dark:bg-green-900/30 p-3 rounded-full w-fit mb-4">
                <ShieldCheck className="h-10 w-10 text-green-600 dark:text-green-400" />
            </div>
            <CardTitle className="font-headline text-3xl">Your Approved Palm Reading</CardTitle>
            <CardDescription>Insights from your hands, reviewed by our experts. Report ID: <span className="font-mono text-xs">{report.id.substring(0,10)}...</span></CardDescription>
            </CardHeader>
            <CardContent>
            <ScrollArea className="h-[400px] w-full rounded-md border p-0 bg-background shadow-inner">
                <div id="report-content-area-for-pdf" className="p-6 bg-white dark:bg-gray-900 text-black dark:text-white">
                <h2 className="text-xl font-bold font-headline mb-2">Palm Reading Report</h2>
                <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">For: {report.userName || "Valued User"}</p>
                <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">Category: {report.category}</p>
                <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">Date: {report.submissionDate && !isNaN(new Date(report.submissionDate).getTime()) ? new Date(report.submissionDate).toLocaleDateString() : 'N/A'}</p>
                <hr className="my-4 border-gray-300 dark:border-gray-700"/>
                {reportParagraphs.length > 0 ? (
                    reportParagraphs.map((paragraph, index) => (
                    <p key={index} className="mb-4 text-base leading-relaxed font-body animate-slide-in-up" style={{animationDelay: `${index * 0.1}s`}}>
                        {paragraph}
                    </p>
                    ))
                ) : (
                    <p className="text-muted-foreground">No report data available.</p>
                )}
                </div>
            </ScrollArea>

            <div className="mt-6 border-t pt-6">
                {!showFeedbackForm ? (
                <Button variant="outline" onClick={() => setShowFeedbackForm(true)} className="w-full sm:w-auto" disabled={isOperationInProgress}>
                    <MessageSquarePlus className="mr-2 h-4 w-4" /> Provide Feedback / Suggest Improvements
                </Button>
                ) : (
                <div className="space-y-4">
                    <div>
                    <Label htmlFor="feedbackText" className="text-base font-medium">Your Feedback on the Report</Label>
                    <Textarea
                        id="feedbackText"
                        value={feedbackText}
                        onChange={(e) => setFeedbackText(e.target.value)}
                        placeholder="What did we miss? How can we improve this report?"
                        rows={4}
                        className="mt-2"
                        disabled={isOperationInProgress}
                    />
                    </div>
                    <div className="flex gap-2">
                    <Button onClick={handleFeedbackSubmit} disabled={isOperationInProgress || !feedbackText.trim()} className="w-full sm:w-auto">
                        {isOperationInProgress && feedbackText.trim() ? (
                        <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> Submitting...</>
                        ) : (
                        <><Send className="mr-2 h-4 w-4" /> Submit Feedback</>
                        )}
                    </Button>
                    <Button variant="ghost" onClick={() => setShowFeedbackForm(false)} disabled={isOperationInProgress}>
                        Cancel
                    </Button>
                    </div>
                </div>
                )}
            </div>
            </CardContent>
            <CardFooter className="flex flex-col sm:flex-row justify-center items-center gap-4 mt-6">
            <Button onClick={handleDownloadPdf} variant="secondary" className="w-full sm:w-auto" disabled={isOperationInProgress}>
                <Download className="mr-2 h-4 w-4" /> Download as PDF
            </Button>
            <Button onClick={handleStartNewReading} className="w-full sm:w-auto" disabled={isOperationInProgress}>
                <RefreshCw className="mr-2 h-4 w-4" /> Start New Reading
            </Button>
            <Button onClick={() => router.push('/palm-input')} variant="outline" className="w-full sm:w-auto" disabled={isOperationInProgress}>
                <ArrowLeft className="mr-2 h-4 w-4" /> Back to Input Page
            </Button>
            </CardFooter>
        </div>
      </Card>
    </div>
  );
};

export default ReportDisplay;
