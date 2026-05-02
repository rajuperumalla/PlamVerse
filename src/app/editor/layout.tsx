
'use client';

import type { ReactNode } from 'react';

// Sidebar UI components have been removed from this layout.
// Navigation is now handled by the main Header component in the root layout.

export default function EditorLayout({ children }: { children: ReactNode }) {
  return (
    // The main container now provides a simple structure without a sidebar.
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
