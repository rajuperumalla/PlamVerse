
'use client';

import type { ReactNode } from 'react';
import {
  Sidebar,
  SidebarProvider,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarContent,
  SidebarHeader,
  SidebarTrigger, 
  SidebarInset, 
} from '@/components/ui/sidebar';
import { LayoutDashboard, ListChecks, Hand, PanelLeft } from 'lucide-react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Button } from '@/components/ui/button';

export default function AdminLayout({ children }: { children: ReactNode }) {
  const pathname = usePathname();

  return (
    <SidebarProvider defaultOpen>
      <div className="flex h-[calc(100vh-var(--header-height,0px)-var(--footer-height,0px))]"> {/* Adjust height to fit within RootLayout */}
        <Sidebar className="border-r hidden md:flex flex-shrink-0"> 
          <SidebarContent>
            <SidebarHeader className="p-4">
              <Link href="/admin" className="flex items-center gap-2 text-lg font-semibold text-primary">
                <Hand className="h-6 w-6" />
                <span>PalmVerse Admin</span>
              </Link>
            </SidebarHeader>
            <SidebarMenu>
              <SidebarMenuItem>
                <SidebarMenuButton
                  asChild
                  isActive={pathname === '/admin' || pathname === '/admin/'}
                  tooltip={{ children: 'Dashboard', side: 'right', className: "md:block hidden" }}
                >
                  <Link href="/admin">
                    <LayoutDashboard />
                    <span>Dashboard</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
              <SidebarMenuItem>
                <SidebarMenuButton
                  asChild
                  isActive={pathname === '/admin/workflow'}
                  tooltip={{ children: 'Pending Reviews', side: 'right', className: "md:block hidden" }}
                >
                  <Link href="/admin/workflow">
                    <ListChecks />
                    <span>Pending Reviews</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarContent>
        </Sidebar>
        
        {/* Mobile Sidebar Trigger (using Sidebar's built-in Sheet functionality) */}
        {/* The <Sidebar> component above becomes a Sheet on mobile when triggered by SidebarTrigger */}

        <SidebarInset className="flex-1 flex flex-col overflow-hidden">
          <header className="sticky top-0 z-10 flex h-14 items-center gap-4 border-b bg-background px-4 sm:static sm:h-auto sm:border-0 sm:bg-transparent sm:px-6 md:hidden">
            <SidebarTrigger asChild>
              <Button size="icon" variant="outline" className="md:hidden"> {/* Changed sm:hidden to md:hidden */}
                <PanelLeft className="h-5 w-5" />
                <span className="sr-only">Toggle Menu</span>
              </Button>
            </SidebarTrigger>
            <div className="text-lg font-semibold text-primary md:hidden">
              PalmVerse Admin
            </div>
          </header>
          
          <main className="flex-1 overflow-y-auto p-4 md:p-6"> {/* Adjusted padding for consistency */}
            {children}
          </main>
        </SidebarInset>
      </div>
      {/* Define CSS variables for header/footer height if they are fixed and consuming viewport space */}
      <style jsx global>{`
        :root {
          --header-height: 68px; /* Adjust to your actual header height */
          --footer-height: 77px; /* Adjust to your actual footer height */
        }
      `}</style>
    </SidebarProvider>
  );
}
