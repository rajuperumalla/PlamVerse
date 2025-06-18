
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
import { LayoutDashboard, PanelLeft, Package, Briefcase, Users, Settings, ShieldCheck } from 'lucide-react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { useAppContext } from '@/context/AppContext';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { useToast } from '@/hooks/use-toast';
import { Loader2, AlertTriangle, LogIn } from 'lucide-react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';


export default function AdminLayout({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  const { isAuthenticated, isAdmin, isInitializing } = useAppContext();
  const router = useRouter();
  const { toast } = useToast();
  const [authCheckComplete, setAuthCheckComplete] = useState(false);

  useEffect(() => {
    if (!isInitializing) {
      if (!isAuthenticated) {
        router.push('/');
      } else if (!isAdmin) {
        toast({ title: "Access Denied", description: "You do not have permission to view this page.", variant: "destructive" });
        router.push('/');
      }
      setAuthCheckComplete(true);
    }
  }, [isAuthenticated, isAdmin, router, toast, isInitializing]);

  if (isInitializing || !authCheckComplete) {
    return (
      <div className="flex flex-col justify-center items-center min-h-screen">
        <Loader2 className="h-12 w-12 animate-spin text-primary mb-4" />
        <p>Verifying admin access...</p>
      </div>
    );
  }

  if (!isAuthenticated || !isAdmin) {
    return (
      <div className="flex flex-col justify-center items-center min-h-screen p-4">
        <Card className="w-full max-w-md text-center">
          <CardHeader>
            <div className="mx-auto bg-destructive/10 p-3 rounded-full w-fit mb-4">
              <AlertTriangle className="h-10 w-10 text-destructive" />
            </div>
            <CardTitle>Access Denied</CardTitle>
            <CardDescription>You do not have permission to view the Admin Panel.</CardDescription>
          </CardHeader>
          <CardContent>
            <Button onClick={() => router.push('/')}><LogIn className="mr-2 h-4 w-4" /> Go to Login</Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <SidebarProvider defaultOpen>
      <div className="flex h-[calc(100vh-var(--header-height,0px)-var(--footer-height,0px))]">
        <Sidebar className="border-r hidden md:flex flex-shrink-0">
          <SidebarContent>
            <SidebarHeader className="p-4">
              <Link href="/admin" className="flex items-center gap-2 text-lg font-semibold text-primary">
                <ShieldCheck className="h-6 w-6" />
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
                  isActive={pathname === '/admin/products'}
                  tooltip={{ children: 'Product Mgmt', side: 'right', className: "md:block hidden" }}
                >
                  <Link href="/admin/products">
                    <Package />
                    <span>Products</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
              <SidebarMenuItem>
                <SidebarMenuButton
                  asChild
                  isActive={pathname === '/admin/orders'}
                  tooltip={{ children: 'Order Mgmt', side: 'right', className: "md:block hidden" }}
                >
                  <Link href="/admin/orders">
                    <Briefcase />
                    <span>Orders</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
              <SidebarMenuItem>
                <SidebarMenuButton
                  asChild
                  isActive={pathname === '/admin/customers'}
                  tooltip={{ children: 'Customer Mgmt', side: 'right', className: "md:block hidden" }}
                >
                  <Link href="/admin/customers">
                    <Users />
                    <span>Customers</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
              <SidebarMenuItem>
                <SidebarMenuButton
                  asChild
                  isActive={pathname === '/admin/settings'}
                  tooltip={{ children: 'Store Settings', side: 'right', className: "md:block hidden" }}
                >
                  <Link href="/admin/settings">
                    <Settings />
                    <span>Settings</span>
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
              PalmVerse Admin
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
    

    