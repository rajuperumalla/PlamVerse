
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
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import { LayoutDashboard, PanelLeft, Package, Briefcase, Users, Settings, ShieldCheck, ShoppingCart, Tag, Upload, MessageSquareText, Info, ShoppingBag, Settings2, CreditCard, Truck, Percent, Globe, Search, Building2, Share2, ListOrdered, Activity, Undo2, FileText, Package2 } from 'lucide-react';
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

  const productSubmenuActive = pathname.startsWith('/admin/products');
  const siteInfoSubmenuActive = pathname.startsWith('/admin/site-info/');
  const settingsSubmenuActive = pathname.startsWith('/admin/settings/');
  const ordersSubmenuActive = pathname.startsWith('/admin/orders/');
  const ecommerceSubmenuActive = productSubmenuActive || siteInfoSubmenuActive || pathname === '/admin/subscribers' || pathname === '/admin/products/categories';


  return (
    <SidebarProvider defaultOpen>
      <div className="flex h-[calc(100vh-var(--header-height,0px)-var(--footer-height,0px))]">
        <Sidebar className="border-r hidden md:flex flex-shrink-0">
          <SidebarContent>
            <SidebarHeader className="p-4">
              <Link href="/admin" className="flex items-center gap-2 text-lg font-semibold text-primary">
                <ShieldCheck className="h-6 w-6" />
                <span className="group-data-[collapsible=icon]:hidden">PalmVerse Admin</span>
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
                    <span className="group-data-[collapsible=icon]:hidden">Dashboard</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
              
              <SidebarMenuItem>
                <Accordion type="single" collapsible className="w-full" defaultValue={ecommerceSubmenuActive ? "ecommerce-menu" : undefined}>
                  <AccordionItem value="ecommerce-menu" className="border-none">
                    <SidebarMenuButton 
                      asChild 
                      variant="ghost" 
                      className="p-0 w-full h-auto"
                      tooltip={{ children: 'Ecommerce', side: 'right', className: "md:block hidden" }}
                      isActive={ecommerceSubmenuActive}
                    >
                      <AccordionTrigger 
                        className="flex items-center justify-between w-full py-2 px-2 rounded-md text-sm hover:bg-sidebar-accent hover:text-sidebar-accent-foreground data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground"
                      >
                        <div className="flex items-center gap-2">
                          <ShoppingCart />
                          <span className="group-data-[collapsible=icon]:hidden">Ecommerce</span>
                        </div>
                      </AccordionTrigger>
                    </SidebarMenuButton>
                    <AccordionContent className="pt-1 pl-4 group-data-[collapsible=icon]:hidden">
                        <Accordion type="single" collapsible className="w-full" defaultValue={productSubmenuActive ? "products-submenu" : undefined}>
                          <AccordionItem value="products-submenu" className="border-none">
                            <SidebarMenuButton 
                              asChild 
                              variant="ghost" 
                              className="p-0 w-full h-auto"
                              tooltip={{ children: 'Products', side: 'right', className: "md:block hidden" }}
                              isActive={productSubmenuActive}
                            >
                              <AccordionTrigger 
                                className="flex items-center justify-between w-full py-2 px-2 rounded-md text-xs hover:bg-sidebar-accent hover:text-sidebar-accent-foreground data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground"
                              >
                                <div className="flex items-center gap-2">
                                  <Package />
                                  <span className="group-data-[collapsible=icon]:hidden">Products</span>
                                </div>
                              </AccordionTrigger>
                            </SidebarMenuButton>
                            <AccordionContent className="pt-1 pl-4 group-data-[collapsible=icon]:hidden">
                                <SidebarMenuButton asChild isActive={pathname === '/admin/products'} className="w-full justify-start h-8 mb-1 text-xs">
                                    <Link href="/admin/products"><ShoppingBag className="mr-2 h-3.5 w-3.5"/>All Products</Link>
                                </SidebarMenuButton>
                                <SidebarMenuButton asChild isActive={pathname === '/admin/products/bulk-upload'} className="w-full justify-start h-8 mb-1 text-xs">
                                    <Link href="/admin/products/bulk-upload"><Upload className="mr-2 h-3.5 w-3.5"/>Bulk Upload</Link>
                                </SidebarMenuButton>
                                <SidebarMenuButton asChild isActive={pathname === '/admin/products/reviews'} className="w-full justify-start h-8 text-xs">
                                    <Link href="/admin/products/reviews"><MessageSquareText className="mr-2 h-3.5 w-3.5"/>Reviews</Link>
                                </SidebarMenuButton>
                            </AccordionContent>
                          </AccordionItem>
                        </Accordion>
                        <SidebarMenuButton asChild isActive={pathname === '/admin/products/categories'} className="w-full justify-start h-9 my-0.5 text-xs">
                            <Link href="/admin/products/categories"><Tag className="mr-2 h-4 w-4"/>Categories</Link>
                        </SidebarMenuButton>
                        
                        <Accordion type="single" collapsible className="w-full" defaultValue={siteInfoSubmenuActive ? "site-info-submenu" : undefined}>
                          <AccordionItem value="site-info-submenu" className="border-none">
                            <SidebarMenuButton 
                              asChild 
                              variant="ghost" 
                              className="p-0 w-full h-auto"
                              tooltip={{ children: 'Site Information', side: 'right', className: "md:block hidden" }}
                              isActive={siteInfoSubmenuActive || pathname === '/admin/site-info'}
                            >
                              <AccordionTrigger 
                                className="flex items-center justify-between w-full py-2 px-2 rounded-md text-xs hover:bg-sidebar-accent hover:text-sidebar-accent-foreground data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground"
                              >
                                <div className="flex items-center gap-2">
                                  <Info />
                                  <span className="group-data-[collapsible=icon]:hidden">Site Information</span>
                                </div>
                              </AccordionTrigger>
                            </SidebarMenuButton>
                            <AccordionContent className="pt-1 pl-4 group-data-[collapsible=icon]:hidden">
                                <SidebarMenuButton asChild isActive={pathname === '/admin/site-info/general'} className="w-full justify-start h-8 mb-1 text-xs">
                                    <Link href="/admin/site-info/general"><Globe className="mr-2 h-3.5 w-3.5"/>General</Link>
                                </SidebarMenuButton>
                                <SidebarMenuButton asChild isActive={pathname === '/admin/site-info/seo'} className="w-full justify-start h-8 mb-1 text-xs">
                                    <Link href="/admin/site-info/seo"><Search className="mr-2 h-3.5 w-3.5"/>SEO & Analytics</Link>
                                </SidebarMenuButton>
                                <SidebarMenuButton asChild isActive={pathname === '/admin/site-info/company'} className="w-full justify-start h-8 mb-1 text-xs">
                                    <Link href="/admin/site-info/company"><Building2 className="mr-2 h-3.5 w-3.5"/>Company Details</Link>
                                </SidebarMenuButton>
                                <SidebarMenuButton asChild isActive={pathname === '/admin/site-info/social'} className="w-full justify-start h-8 text-xs">
                                    <Link href="/admin/site-info/social"><Share2 className="mr-2 h-3.5 w-3.5"/>Social Sharing</Link>
                                </SidebarMenuButton>
                            </AccordionContent>
                          </AccordionItem>
                        </Accordion>

                        <SidebarMenuButton asChild isActive={pathname === '/admin/subscribers'} className="w-full justify-start h-9 my-0.5 text-xs">
                            <Link href="/admin/subscribers"><Users className="mr-2 h-4 w-4"/>Subscribers</Link>
                        </SidebarMenuButton>
                    </AccordionContent>
                  </AccordionItem>
                </Accordion>
              </SidebarMenuItem>

              <SidebarMenuItem>
                <Accordion type="single" collapsible className="w-full" defaultValue={ordersSubmenuActive ? "orders-menu" : undefined}>
                  <AccordionItem value="orders-menu" className="border-none">
                    <SidebarMenuButton 
                      asChild 
                      variant="ghost" 
                      className="p-0 w-full h-auto"
                      tooltip={{ children: 'Orders', side: 'right', className: "md:block hidden" }}
                      isActive={ordersSubmenuActive}
                    >
                      <AccordionTrigger 
                        className="flex items-center justify-between w-full py-2 px-2 rounded-md text-sm hover:bg-sidebar-accent hover:text-sidebar-accent-foreground data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground"
                      >
                        <div className="flex items-center gap-2">
                          <Briefcase />
                          <span className="group-data-[collapsible=icon]:hidden">Orders</span>
                        </div>
                      </AccordionTrigger>
                    </SidebarMenuButton>
                    <AccordionContent className="pt-1 pl-4 group-data-[collapsible=icon]:hidden">
                        <SidebarMenuButton asChild isActive={pathname === '/admin/orders/all'} className="w-full justify-start h-9 my-0.5 text-xs">
                            <Link href="/admin/orders/all"><ListOrdered className="mr-2 h-4 w-4"/>All Orders</Link>
                        </SidebarMenuButton>
                        <SidebarMenuButton asChild isActive={pathname === '/admin/orders/status'} className="w-full justify-start h-9 my-0.5 text-xs">
                            <Link href="/admin/orders/status"><Activity className="mr-2 h-4 w-4"/>Order Status</Link>
                        </SidebarMenuButton>
                        <SidebarMenuButton asChild isActive={pathname === '/admin/orders/returns'} className="w-full justify-start h-9 my-0.5 text-xs">
                            <Link href="/admin/orders/returns"><Undo2 className="mr-2 h-4 w-4"/>Returns & Refunds</Link>
                        </SidebarMenuButton>
                        <SidebarMenuButton asChild isActive={pathname === '/admin/orders/invoices'} className="w-full justify-start h-9 my-0.5 text-xs">
                            <Link href="/admin/orders/invoices"><FileText className="mr-2 h-4 w-4"/>Invoice Generator</Link>
                        </SidebarMenuButton>
                        <SidebarMenuButton asChild isActive={pathname === '/admin/orders/shipping-providers'} className="w-full justify-start h-9 my-0.5 text-xs">
                            <Link href="/admin/orders/shipping-providers"><Package2 className="mr-2 h-4 w-4"/>Shipping Providers</Link>
                        </SidebarMenuButton>
                    </AccordionContent>
                  </AccordionItem>
                </Accordion>
              </SidebarMenuItem>
              <SidebarMenuItem>
                <SidebarMenuButton
                  asChild
                  isActive={pathname === '/admin/customers'}
                  tooltip={{ children: 'Customer Mgmt', side: 'right', className: "md:block hidden" }}
                >
                  <Link href="/admin/customers">
                    <Users />
                    <span className="group-data-[collapsible=icon]:hidden">Customers</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
              
              <SidebarMenuItem>
                <Accordion type="single" collapsible className="w-full" defaultValue={settingsSubmenuActive ? "settings-menu" : undefined}>
                  <AccordionItem value="settings-menu" className="border-none">
                    <SidebarMenuButton 
                      asChild 
                      variant="ghost" 
                      className="p-0 w-full h-auto"
                      tooltip={{ children: 'Store Settings', side: 'right', className: "md:block hidden" }}
                      isActive={settingsSubmenuActive || pathname === '/admin/settings'}
                    >
                      <AccordionTrigger 
                        className="flex items-center justify-between w-full py-2 px-2 rounded-md text-sm hover:bg-sidebar-accent hover:text-sidebar-accent-foreground data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground"
                      >
                        <div className="flex items-center gap-2">
                          <Settings />
                          <span className="group-data-[collapsible=icon]:hidden">Settings</span>
                        </div>
                      </AccordionTrigger>
                    </SidebarMenuButton>
                    <AccordionContent className="pt-1 pl-4 group-data-[collapsible=icon]:hidden">
                        <SidebarMenuButton asChild isActive={pathname === '/admin/settings/core'} className="w-full justify-start h-9 my-0.5 text-xs">
                            <Link href="/admin/settings/core"><Settings2 className="mr-2 h-4 w-4"/>Core Settings</Link>
                        </SidebarMenuButton>
                        <SidebarMenuButton asChild isActive={pathname === '/admin/settings/payment-gateways'} className="w-full justify-start h-9 my-0.5 text-xs">
                            <Link href="/admin/settings/payment-gateways"><CreditCard className="mr-2 h-4 w-4"/>Payment Gateways</Link>
                        </SidebarMenuButton>
                        <SidebarMenuButton asChild isActive={pathname === '/admin/settings/shipping'} className="w-full justify-start h-9 my-0.5 text-xs">
                            <Link href="/admin/settings/shipping"><Truck className="mr-2 h-4 w-4"/>Shipping</Link>
                        </SidebarMenuButton>
                        <SidebarMenuButton asChild isActive={pathname === '/admin/settings/taxes'} className="w-full justify-start h-9 my-0.5 text-xs">
                            <Link href="/admin/settings/taxes"><Percent className="mr-2 h-4 w-4"/>Taxes</Link>
                        </SidebarMenuButton>
                    </AccordionContent>
                  </AccordionItem>
                </Accordion>
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
            <div className="text-lg font-semibold text-primary md:hidden group-data-[collapsible=icon]:hidden">
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
        .group-data-\\[collapsible\\=icon\\]\\:hidden {
          display: none;
        }
        /* Ensure accordion content is hidden when sidebar is collapsed */
        .group[data-collapsible="icon"] .group-data-\\[collapsible\\=icon\\]\\:hidden {
           display: none !important;
        }
        .group[data-collapsible="icon"] .items-center span:not(.sr-only) {
            display: none;
        }
        .group[data-collapsible="icon"] .sidebar-header span {
            display: none;
        }
      `}</style>
    </SidebarProvider>
  );
}
