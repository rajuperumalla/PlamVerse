
"use client";
// This page is effectively replaced by the sub-menu items under "Site Information".
// It will redirect to the first sub-item, /admin/site-info/general.

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Loader2 } from 'lucide-react';

export default function AdminSiteInfoRedirectPage() {
  const router = useRouter();

  useEffect(() => {
    router.replace('/admin/site-info/general');
  }, [router]);

  return (
    <div className="flex flex-col items-center justify-center min-h-[calc(100vh-200px)]">
      <Loader2 className="h-12 w-12 animate-spin text-primary mb-4" />
      <p className="text-muted-foreground">Redirecting to General Site Settings...</p>
    </div>
  );
}
