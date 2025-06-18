
"use client";
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import ReportDisplay from '@/components/palm-reading/ReportDisplay';
import { useAppContext } from '@/context/AppContext';
import { Skeleton } from '@/components/ui/skeleton';
import { Button } from '@/components/ui/button';
import { AlertTriangle, Info } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

export default function ReportPage() {
  const { isAuthenticated, reportData, isLoading: contextIsLoading, approveReport } = useAppContext();
  const router = useRouter();
  const [isCheckingAuth, setIsCheckingAuth] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
        if (!isAuthenticated) {
            router.push('/');
        } else if (!reportData && !contextIsLoading) {
            router.push('/palm-input');
        }
        setIsCheckingAuth(false);
    }, 100);
    return () => clearTimeout(timer);
  }, [isAuthenticated, reportData, router, contextIsLoading]);

  if (isCheckingAuth || contextIsLoading && !reportData) { // Show skeleton if context is loading AND no report data yet
    return (
      <div className="space-y-6 p-8 max-w-3xl mx-auto">
        <Skeleton className="h-12 w-3/4 mx-auto" />
        <Skeleton className="h-8 w-1/2 mx-auto" />
        <Skeleton className="h-[400px] w-full mt-8" />
        <div className="flex justify-center gap-4 mt-6">
          <Skeleton className="h-10 w-36" />
          <Skeleton className="h-10 w-36" />
        </div>
      </div>
    );
  }

  if (!reportData) {
    return (
      <div className="flex flex-col items-center justify-center text-center py-12 min-h-[calc(100vh-200px)]">
        <AlertTriangle className="h-16 w-16 text-destructive mb-4" />
        <h2 className="text-2xl font-headline mb-2">No Report Available</h2>
        <p className="text-muted-foreground mb-6">It seems there was an issue or you haven't submitted your details yet.</p>
        <Button onClick={() => router.push('/palm-input')}>
          Go to Palm Input
        </Button>
      </div>
    );
  }

  if (reportData.status === 'pending_review') {
    return (
      <div className="flex flex-col items-center justify-center text-center py-12 min-h-[calc(100vh-200px)]">
        <Card className="w-full max-w-lg shadow-lg p-8">
          <CardHeader className="items-center">
            <div className="p-3 bg-blue-100 rounded-full mb-4">
              <Info className="h-12 w-12 text-blue-600" />
            </div>
            <CardTitle className="font-headline text-2xl">Report Pending Review</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-muted-foreground">
              Your personalized palm reading report has been generated and is currently undergoing an expert review.
              This ensures the highest quality and accuracy.
            </p>
            <p className="text-muted-foreground">
              Please check back soon. You will be notified once it's ready.
            </p>
            {/* Simulated Admin Action Section */}
            <div className="mt-6 pt-6 border-t">
              <h3 className="text-lg font-semibold mb-2 text-gray-700">Admin Actions (Simulated)</h3>
              <p className="text-sm text-muted-foreground mb-3">This section would typically be in a secure admin panel.</p>
              <Button onClick={approveReport} disabled={contextIsLoading}>
                {contextIsLoading ? "Approving..." : "Approve Report"}
              </Button>
            </div>
             <Button onClick={() => router.push('/palm-input')} variant="outline" className="mt-6 w-full">
              Back to Input / Start New
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }
  
  // Only render ReportDisplay if reportData.status is 'approved'
  return (
    <ReportDisplay reportContent={reportData.content} />
  );
}
