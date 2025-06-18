
"use client";
import { useEffect, useState, Suspense } from 'react';
import { useRouter } from 'next/navigation';
import PalmInputForm from '@/components/palm-reading/PalmInputForm';
import { useAppContext } from '@/context/AppContext';
import { Loader2 } from 'lucide-react';

function PalmInputPageComponent() {
  const { isAuthenticated, isInitializing } = useAppContext();
  const router = useRouter();
  const [authCheckComplete, setAuthCheckComplete] = useState(false);

  useEffect(() => {
    if (!isInitializing) {
        const timer = setTimeout(() => {
            if (!isAuthenticated) {
                router.push('/');
            }
            setAuthCheckComplete(true);
        }, 100); 
        return () => clearTimeout(timer);
    }
  }, [isAuthenticated, router, isInitializing]);

  if (isInitializing || !authCheckComplete) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[calc(100vh-200px)]">
        <Loader2 className="h-12 w-12 animate-spin text-primary mb-4" />
        <p className="text-muted-foreground">Loading form data...</p>
      </div>
    );
  }

  return (
    <div className="space-y-12 md:space-y-16">
      <PalmInputForm />
      {/* Product showcase removed from here, it's now on src/app/page.tsx */}
    </div>
  );
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
