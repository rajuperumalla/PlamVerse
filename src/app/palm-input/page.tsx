
"use client";
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import PalmInputForm from '@/components/palm-reading/PalmInputForm';
import { useAppContext } from '@/context/AppContext';
import { Skeleton } from '@/components/ui/skeleton';

export default function PalmInputPage() {
  const { isAuthenticated, isLoading: contextIsLoading } = useAppContext(); // Renamed to avoid conflict
  const router = useRouter();
  const [isCheckingAuth, setIsCheckingAuth] = useState(true);

  useEffect(() => {
    // Give context a moment to load persisted auth state
    const timer = setTimeout(() => {
        if (!isAuthenticated) {
            router.push('/');
        }
        setIsCheckingAuth(false);
    }, 100); // Adjust delay if needed, or use a more robust auth check
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


  return (
    <PalmInputForm />
  );
}
