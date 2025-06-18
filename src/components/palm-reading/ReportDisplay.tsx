
"use client";
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { FileText, RefreshCw, ArrowLeft, MessageSquarePlus, Send, Loader2 } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useAppContext } from '@/context/AppContext';
import { useToast } from '@/hooks/use-toast';
import { processUserReportFeedback } from '@/ai/flows/process-user-report-feedback';

interface ReportDisplayProps {
  report: string;
}

const ReportDisplay = ({ report }: ReportDisplayProps) => {
  const router = useRouter();
  const { toast } = useToast();
  const { isLoading, startLoading, stopLoading } = useAppContext();
  const [showFeedbackForm, setShowFeedbackForm] = useState(false);
  const [feedbackText, setFeedbackText] = useState('');

  const reportParagraphs = report.split('\n').filter(p => p.trim() !== '');

  const handleFeedbackSubmit = async () => {
    if (!feedbackText.trim()) {
      toast({
        title: 'Feedback Empty',
        description: 'Please enter your feedback before submitting.',
        variant: 'destructive',
      });
      return;
    }
    startLoading();
    try {
      const result = await processUserReportFeedback({
        originalReport: report,
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
      stopLoading();
    }
  };

  return (
    <div className="flex justify-center items-center py-8">
      <Card className="w-full max-w-3xl shadow-xl animate-fade-in">
        <CardHeader className="text-center">
          <div className="mx-auto bg-accent/10 p-3 rounded-full w-fit mb-4">
            <FileText className="h-10 w-10 text-accent" />
          </div>
          <CardTitle className="font-headline text-3xl">Your Palm Reading Report</CardTitle>
          <CardDescription>Insights from the lines on your hands.</CardDescription>
        </CardHeader>
        <CardContent>
          <ScrollArea className="h-[400px] w-full rounded-md border p-6 bg-background shadow-inner">
            {reportParagraphs.length > 0 ? (
              reportParagraphs.map((paragraph, index) => (
                <p key={index} className="mb-4 text-base leading-relaxed font-body animate-slide-in-up" style={{animationDelay: `${index * 0.1}s`}}>
                  {paragraph}
                </p>
              ))
            ) : (
              <p className="text-muted-foreground">No report data available.</p>
            )}
          </ScrollArea>

          <div className="mt-6 border-t pt-6">
            {!showFeedbackForm ? (
              <Button variant="outline" onClick={() => setShowFeedbackForm(true)} className="w-full sm:w-auto">
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
                  />
                </div>
                <div className="flex gap-2">
                  <Button onClick={handleFeedbackSubmit} disabled={isLoading} className="w-full sm:w-auto">
                    {isLoading ? (
                      <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> Submitting...</>
                    ) : (
                      <><Send className="mr-2 h-4 w-4" /> Submit Feedback</>
                    )}
                  </Button>
                  <Button variant="ghost" onClick={() => setShowFeedbackForm(false)} disabled={isLoading}>
                    Cancel
                  </Button>
                </div>
              </div>
            )}
          </div>
        </CardContent>
        <CardFooter className="flex flex-col sm:flex-row justify-center gap-4 mt-6">
          <Button onClick={() => router.push('/palm-input')} variant="outline" className="w-full sm:w-auto">
            <ArrowLeft className="mr-2 h-4 w-4" /> Back to Input
          </Button>
          <Button onClick={() => router.push('/palm-input')} className="w-full sm:w-auto">
            <RefreshCw className="mr-2 h-4 w-4" /> Start New Reading
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
};

export default ReportDisplay;
