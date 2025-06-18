
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
import { LayoutDashboard, ListChecks, Hand, PanelLeft, FileCheck2, Edit2 } from 'lucide-react'; // Added Edit2 for Editor
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Button } from '@/components/ui/button';

export default function EditorLayout({ children }: { children: ReactNode }) { // Renamed AdminLayout to EditorLayout
  const pathname = usePathname();

  return (
    <SidebarProvider defaultOpen>
      <div className="flex h-[calc(100vh-var(--header-height,0px)-var(--footer-height,0px))]">
        <Sidebar className="border-r hidden md:flex flex-shrink-0">
          <SidebarContent>
            <SidebarHeader className="p-4">
              <Link href="/editor" className="flex items-center gap-2 text-lg font-semibold text-primary"> {/* Changed /admin to /editor */}
                <Edit2 className="h-6 w-6" /> {/* Changed Hand to Edit2 */}
                <span>PalmVerse Editor</span> {/* Changed Admin to Editor */}
              </Link>
            </SidebarHeader>
            <SidebarMenu>
              <SidebarMenuItem>
                <SidebarMenuButton
                  asChild
                  isActive={pathname === '/editor' || pathname === '/editor/'} /* Changed /admin to /editor */
                  tooltip={{ children: 'Dashboard', side: 'right', className: "md:block hidden" }}
                >
                  <Link href="/editor"> {/* Changed /admin to /editor */}
                    <LayoutDashboard />
                    <span>Dashboard</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
              <SidebarMenuItem>
                <SidebarMenuButton
                  asChild
                  isActive={pathname === '/editor/workflow'} /* Changed /admin/workflow to /editor/workflow */
                  tooltip={{ children: 'Pending Reviews', side: 'right', className: "md:block hidden" }}
                >
                  <Link href="/editor/workflow"> {/* Changed /admin/workflow to /editor/workflow */}
                    <ListChecks />
                    <span>Pending Reviews</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
              <SidebarMenuItem>
                <SidebarMenuButton
                  asChild
                  isActive={pathname === '/editor/approved'} /* Changed /admin/approved to /editor/approved */
                  tooltip={{ children: 'Approved Reports', side: 'right', className: "md:block hidden" }}
                >
                  <Link href="/editor/approved"> {/* Changed /admin/approved to /editor/approved */}
                    <FileCheck2 />
                    <span>Approved Reports</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarContent>
        </Sidebar>

        <SidebarInset className="flex-1 flex flex-col overflow-hidden">
          <header className="sticky top-0 z-10 flex h-14 items-center gap-4 border-b bg-background px-4 sm:static sm:h-auto sm:border-0 sm:bg-transparent sm:px-6 md:hidden">
            <SidebarTrigger asChild>
              <Button size="icon" variant="outline" className="md:hidden">
                <PanelLeft className="h-5 w-5" />
                <span className="sr-only">Toggle Menu</span>
              </Button>
            </SidebarTrigger>
            <div className="text-lg font-semibold text-primary md:hidden">
              PalmVerse Editor {/* Changed Admin to Editor */}
            </div>
          </header>

          <main className="flex-1 overflow-y-auto p-4 md:p-6">
            {children}
          </main>
        </SidebarInset>
      </div>
      <style jsx global>{`
        :root {
          --header-height: 68px;
          --footer-height: 77px;
        }
      `}</style>
    </SidebarProvider>
  );
}
