
"use client";
import { useEffect, useState, Suspense } from 'react';
import { useRouter } from 'next/navigation';
import PalmInputForm from '@/components/palm-reading/PalmInputForm';
import { useAppContext } from '@/context/AppContext';
import { Skeleton } from '@/components/ui/skeleton';

// It's good practice to wrap components that use useSearchParams in Suspense
function PalmInputPageComponent() {
  const { isAuthenticated, isLoading: contextIsLoading, hasPaid } = useAppContext();
  const router = useRouter();
  const [isCheckingAuth, setIsCheckingAuth] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
        if (!isAuthenticated) {
            router.push('/');
        }
        setIsCheckingAuth(false);
    }, 100); 
    return () => clearTimeout(timer);
  }, [isAuthenticated, router]);

  if (isCheckingAuth || contextIsLoading) {
    return (
      <div className="space-y-6 p-8">
        <Skeleton className="h-12 w-1/2 mx-auto" />
        <Skeleton className="h-8 w-3/4 mx-auto" />
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-8">
          <Skeleton className="h-64 w-full" />
          <Skeleton className="h-64 w-full" />
        </div>
        <Skeleton className="h-10 w-full mt-4" />
        <Skeleton className="h-10 w-full mt-4" />
        <Skeleton className="h-12 w-full mt-8" />
      </div>
    );
  }

  return <PalmInputForm />;
}

export default function PalmInputPage() {
  return (
    <Suspense fallback={<div>Loading payment status...</div>}> {/* Suspense for useSearchParams */}
      <PalmInputPageComponent />
    </Suspense>
  );
}
