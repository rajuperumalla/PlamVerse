
"use client";
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import ReportDisplay from '@/components/palm-reading/ReportDisplay';
import { useAppContext } from '@/context/AppContext';
import { Skeleton } from '@/components/ui/skeleton';
import { Button } from '@/components/ui/button';
import { AlertTriangle } from 'lucide-react';

export default function ReportPage() {
  const { isAuthenticated, report, isLoading: contextIsLoading } = useAppContext();
  const router = useRouter();
  const [isCheckingAuth, setIsCheckingAuth] = useState(true);

  useEffect(() => {
     // Give context a moment to load persisted auth state
    const timer = setTimeout(() => {
        if (!isAuthenticated) {
            router.push('/');
        } else if (!report && !contextIsLoading) { // if authenticated but no report and not loading a new one
            router.push('/palm-input');
        }
        setIsCheckingAuth(false);
    }, 100);
    return () => clearTimeout(timer);
  }, [isAuthenticated, report, router, contextIsLoading]);

  if (isCheckingAuth || contextIsLoading) {
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

  if (!report) {
    return (
      <div className="flex flex-col items-center justify-center text-center py-12 min-h-[calc(100vh-200px)]">
        <AlertTriangle className="h-16 w-16 text-destructive mb-4" />
        <h2 className="text-2xl font-headline mb-2">No Report Found</h2>
        <p className="text-muted-foreground mb-6">It seems there was an issue generating your report or you haven't submitted your details yet.</p>
        <Button onClick={() => router.push('/palm-input')}>
          Go to Palm Input
        </Button>
      </div>
    );
  }

  return (
    <ReportDisplay report={report} />
  );
}
