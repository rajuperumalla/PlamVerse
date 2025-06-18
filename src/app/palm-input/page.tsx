
"use client";
import { useEffect, useState, Suspense } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
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
    <div className="space-y-8 md:space-y-10">
      <nav aria-label="Main navigation after login">
        <ul className="flex justify-center items-center space-x-4 sm:space-x-6 md:space-x-8 py-3 bg-card/50 backdrop-blur-sm rounded-lg shadow-md border border-border">
          <li>
            <Link href="/" className="text-sm sm:text-base text-muted-foreground hover:text-primary transition-colors px-2 py-1 rounded-md">
              Home
            </Link>
          </li>
          <li>
            <Link href="/palm-input" className="text-sm sm:text-base font-semibold text-primary hover:text-primary/80 transition-colors px-2 py-1 rounded-md ring-1 ring-primary/50 bg-primary/10">
              Palmistry
            </Link>
          </li>
          <li>
            <Link href="#products" className="text-sm sm:text-base text-muted-foreground hover:text-primary transition-colors px-2 py-1 rounded-md">
              Products
            </Link>
          </li>
          <li>
            <Link href="#remedies" className="text-sm sm:text-base text-muted-foreground hover:text-primary transition-colors px-2 py-1 rounded-md">
              Remedies
            </Link>
          </li>
        </ul>
      </nav>
      <PalmInputForm />
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
