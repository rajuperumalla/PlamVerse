
"use client";
import { useEffect, useState, Suspense } from 'react';
import { useRouter } from 'next/navigation';
import PalmInputForm from '@/components/palm-reading/PalmInputForm';
import { useAppContext } from '@/context/AppContext';
import { Skeleton } from '@/components/ui/skeleton';
import { Loader2 } from 'lucide-react';

function PalmInputPageComponent() {
  const { isAuthenticated, isInitializing, hasPaid } = useAppContext(); // Use isInitializing
  const router = useRouter();
  const [authCheckComplete, setAuthCheckComplete] = useState(false);

  useEffect(() => {
    if (!isInitializing) { // Wait for context to initialize
        const timer = setTimeout(() => { // Keep delay for auth check post-init
            if (!isAuthenticated) {
                router.push('/');
            }
            setAuthCheckComplete(true);
        }, 100); 
        return () => clearTimeout(timer);
    }
  }, [isAuthenticated, router, isInitializing]);

  if (isInitializing || !authCheckComplete) { // Primary loader based on isInitializing
    return (
      <div className="flex flex-col items-center justify-center min-h-[calc(100vh-200px)]">
        <Loader2 className="h-12 w-12 animate-spin text-primary mb-4" />
        <p className="text-muted-foreground">Loading form data...</p>
      </div>
    );
  }

  return <PalmInputForm />;
}

export default function PalmInputPage() {
  return (
    <Suspense fallback={
      <div className="flex flex-col items-center justify-center min-h-[calc(100vh-200px)]">
        <Loader2 className="h-12 w-12 animate-spin text-primary mb-4" />
        <p className="text-muted-foreground">Loading...</p>
      </div>
    }>
      <PalmInputPageComponent />
    </Suspense>
  );
}
