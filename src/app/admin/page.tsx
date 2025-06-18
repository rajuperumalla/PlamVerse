
"use client";
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAppContext } from '@/context/AppContext';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { refinePalmReadingReport } from '@/ai/flows/refine-palm-reading-report';
import { Loader2, CheckCircle, AlertTriangle, Edit3, Send, ShieldQuestion, ThumbsUp } from 'lucide-react';

export default function AdminPage() {
  const { 
    isAuthenticated, 
    reportData, 
    isLoading, 
    startLoading, 
    stopLoading, 
    approveCurrentReport,
    userName 
  } = useAppContext();
  const router = useRouter();
  const { toast } = useToast();
  const [adminSuggestions, setAdminSuggestions] = useState('');

  useEffect(() => {
    if (!isAuthenticated) {
      router.push('/'); // Redirect to login if not authenticated
    }
    // Add role-based check in a real app, e.g. if (userName !== 'admin_user') router.push('/');
  }, [isAuthenticated, router, userName]);

  const handleRefineAndApprove = async () => {
    if (!reportData || reportData.status !== 'pending_review') {
      toast({ title: "Error", description: "No report pending review or report is already approved.", variant: "destructive" });
      return;
    }
    if (!adminSuggestions.trim()) {
      toast({ title: "Missing Input", description: "Please provide refinement suggestions.", variant: "destructive" });
      return;
    }
    startLoading();
    try {
      const refinedResult = await refinePalmReadingReport({
        originalReport: reportData.content,
        adminSuggestions: adminSuggestions,
      });
      approveCurrentReport(refinedResult.refinedReport);
      toast({ title: "Report Refined & Approved", description: "The report has been updated and approved successfully." });
      setAdminSuggestions(''); // Clear suggestions
    } catch (error) {
      console.error("Error refining report:", error);
      toast({ title: "Refinement Error", description: "Failed to refine the report. Please try again.", variant: "destructive" });
    } finally {
      stopLoading();
    }
  };

  const handleApproveAsIs = () => {
    if (!reportData || reportData.status !== 'pending_review') {
      toast({ title: "Error", description: "No report pending review or report is already approved.", variant: "destructive" });
      return;
    }
    startLoading();
    approveCurrentReport();
    toast({ title: "Report Approved", description: "The report has been approved as is." });
    stopLoading();
  };

  if (!isAuthenticated) {
    return <div className="flex justify-center items-center min-h-[calc(100vh-200px)]"><Loader2 className="h-12 w-12 animate-spin text-primary" /></div>;
  }

  return (
    <div className="container mx-auto py-8">
      <Card className="w-full max-w-4xl mx-auto shadow-xl">
        <CardHeader className="text-center">
           <div className="mx-auto bg-primary/10 p-3 rounded-full w-fit mb-4">
            <ShieldQuestion className="h-10 w-10 text-primary" />
          </div>
          <CardTitle className="font-headline text-3xl">Admin Review Panel</CardTitle>
          <CardDescription>Review and approve AI-generated palm readings.</CardDescription>
        </CardHeader>
        <CardContent>
          {isLoading && !reportData && ( // Initial loading state for reportData
             <div className="flex justify-center items-center py-12">
                <Loader2 className="h-12 w-12 animate-spin text-primary" />
                <p className="ml-4 text-muted-foreground">Loading report data...</p>
            </div>
          )}

          {reportData && reportData.status === 'pending_review' && (
            <div className="space-y-6">
              <div>
                <h3 className="text-xl font-semibold mb-2 font-headline">Original AI Report (Pending Review)</h3>
                <ScrollArea className="h-[300px] w-full rounded-md border p-4 bg-muted/30">
                  {reportData.content.split('\n').filter(p => p.trim() !== '').map((paragraph, index) => (
                    <p key={index} className="mb-3 text-sm leading-relaxed">{paragraph}</p>
                  ))}
                </ScrollArea>
              </div>
              <div>
                <Label htmlFor="adminSuggestions" className="text-base font-medium flex items-center gap-2"><Edit3 className="h-5 w-5 text-primary"/>Refinement Suggestions</Label>
                <Textarea
                  id="adminSuggestions"
                  value={adminSuggestions}
                  onChange={(e) => setAdminSuggestions(e.target.value)}
                  placeholder="Enter your suggestions to improve the report (e.g., missed points, tone adjustments, factual corrections)..."
                  rows={6}
                  className="mt-2"
                  disabled={isLoading}
                />
              </div>
              <div className="flex flex-col sm:flex-row gap-4 mt-4">
                <Button onClick={handleRefineAndApprove} disabled={isLoading || !adminSuggestions.trim()} className="w-full sm:flex-1 py-3">
                  {isLoading && adminSuggestions.trim() ? <Loader2 className="mr-2 h-5 w-5 animate-spin" /> : <Send className="mr-2 h-5 w-5" />}
                  Refine & Approve Report
                </Button>
                <Button onClick={handleApproveAsIs} variant="outline" disabled={isLoading} className="w-full sm:flex-1 py-3">
                   <ThumbsUp className="mr-2 h-5 w-5" />
                  Approve As-Is
                </Button>
              </div>
            </div>
          )}

          {reportData && reportData.status === 'approved' && (
            <div className="text-center py-10">
              <CheckCircle className="mx-auto h-16 w-16 text-green-600 mb-4" />
              <h3 className="text-2xl font-semibold mb-2 font-headline">Report Already Approved</h3>
              <p className="text-muted-foreground">This report has been reviewed and approved. The user can now view it.</p>
               <Button onClick={() => router.push('/report')} className="mt-6">View Approved Report</Button>
            </div>
          )}

          {!isLoading && !reportData && (
             <div className="text-center py-10">
              <AlertTriangle className="mx-auto h-16 w-16 text-amber-500 mb-4" />
              <h3 className="text-2xl font-semibold mb-2 font-headline">No Report Data</h3>
              <p className="text-muted-foreground">There is currently no report submitted or pending review.</p>
              <Button onClick={() => router.push('/palm-input')} className="mt-6">Go to Palm Input</Button>
            </div>
          )}
        </CardContent>
        <CardFooter>
          <p className="text-xs text-muted-foreground text-center w-full">
            Admin actions are logged (simulated). Ensure all reports meet quality standards before approval.
          </p>
        </CardFooter>
      </Card>
    </div>
  );
}
