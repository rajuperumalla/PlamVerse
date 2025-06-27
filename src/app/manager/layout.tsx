
'use client';

import type { ReactNode } from 'react';
import { useAppContext } from '@/context/AppContext';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { useToast } from '@/hooks/use-toast';
import { Loader2, AlertTriangle, LogIn } from 'lucide-react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

export default function ManagerLayout({ children }: { children: ReactNode }) {
  const { isAuthenticated, isManager, isInitializing } = useAppContext();
  const router = useRouter();
  const { toast } = useToast();
  const [authCheckComplete, setAuthCheckComplete] = useState(false);

  useEffect(() => {
    if (!isInitializing) {
      if (!isAuthenticated) {
        router.push('/');
      } else if (!isManager) {
        toast({ title: "Access Denied", description: "You do not have permission to view this page.", variant: "destructive" });
        router.push('/');
      }
      setAuthCheckComplete(true);
    }
  }, [isAuthenticated, isManager, router, toast, isInitializing]);

  if (isInitializing || !authCheckComplete) {
    return (
      <div className="flex flex-col justify-center items-center min-h-[calc(100vh-var(--header-height,0px)-var(--footer-height,0px))]">
        <Loader2 className="h-12 w-12 animate-spin text-primary mb-4" />
        <p>Verifying manager access...</p>
      </div>
    );
  }

  if (!isAuthenticated || !isManager) {
    return (
      <div className="flex flex-col justify-center items-center min-h-[calc(100vh-var(--header-height,0px)-var(--footer-height,0px))] p-4">
        <Card className="w-full max-w-md text-center">
          <CardHeader>
            <div className="mx-auto bg-destructive/10 p-3 rounded-full w-fit mb-4">
              <AlertTriangle className="h-10 w-10 text-destructive" />
            </div>
            <CardTitle>Access Denied</CardTitle>
            <CardDescription>You do not have permission to view the Manager Panel.</CardDescription>
          </CardHeader>
          <CardContent>
            <Button onClick={() => router.push('/')}><LogIn className="mr-2 h-4 w-4" /> Go to Login</Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-[calc(100vh-var(--header-height,0px)-var(--footer-height,0px))]">
       <main className="flex-1 overflow-y-auto p-4 md:p-6">
            {children}
       </main>
       <style jsx global>{`
        :root {
          --header-height: 68px; 
          --footer-height: 77px; 
        }
      `}</style>
    </div>
  );
}
