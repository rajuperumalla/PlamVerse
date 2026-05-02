
"use client";
// This page is effectively replaced by /admin/settings/core/page.tsx
// and the accordion structure in the layout.
// It can be kept as a redirect or a very minimal placeholder if direct access to /admin/settings is possible.
// For now, let's make it redirect to the first sub-item, core settings.

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Loader2 } from 'lucide-react';

export default function AdminSettingsRedirectPage() {
  const router = useRouter();

  useEffect(() => {
    router.replace('/admin/settings/core');
  }, [router]);

  return (
    <div className="flex flex-col items-center justify-center min-h-[calc(100vh-200px)]">
      <Loader2 className="h-12 w-12 animate-spin text-primary mb-4" />
      <p className="text-muted-foreground">Redirecting to Core Settings...</p>
    </div>
  );
}
