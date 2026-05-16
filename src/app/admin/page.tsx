
"use client";

import Link from "next/link";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ShoppingCart, Users, Settings, ClipboardCheck, FileCheck2 } from "lucide-react";
import { useAppContext } from "@/context/AppContext";

export default function AdminDashboardPage() {
  const { reports } = useAppContext();
  const awaitingApproval = reports.filter(r => r.status === 'pending_admin_approval').length;
  const inEditorRevision = reports.filter(r => r.status === 'admin_revision').length;
  const publishedReports = reports.filter(r => r.status === 'approved').length;

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold font-headline">Admin Dashboard</h1>
      <CardDescription>Report approval pipeline and Ecommerce operations overview.</CardDescription>

      <div className="grid gap-6 md:grid-cols-3">
        <Card className="border-amber-300 dark:border-amber-800">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Awaiting Final Approval</CardTitle>
            <ClipboardCheck className="h-5 w-5 text-amber-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{awaitingApproval}</div>
            <Link href="/admin/workflow" className="text-xs text-primary hover:underline">Go to Approval Workflow</Link>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Returned to Editor</CardTitle>
            <Users className="h-5 w-5 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{inEditorRevision}</div>
            <p className="text-xs text-muted-foreground">Sent back for revision.</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Published Reports</CardTitle>
            <FileCheck2 className="h-5 w-5 text-green-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{publishedReports}</div>
            <Link href="/admin/approved" className="text-xs text-primary hover:underline">View Published</Link>
          </CardContent>
        </Card>
      </div>
      
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Product Management</CardTitle>
            <ShoppingCart className="h-5 w-5 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <p className="text-xs text-muted-foreground">Manage products, categories, inventory.</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Order Management</CardTitle>
             <ShoppingCart className="h-5 w-5 text-muted-foreground transform scale-x-[-1]" /> {/* Flipped for variety */}
          </CardHeader>
          <CardContent>
            <p className="text-xs text-muted-foreground">View orders, update statuses, handle returns.</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Customer Management</CardTitle>
            <Users className="h-5 w-5 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <p className="text-xs text-muted-foreground">View customer data, segments, support.</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Site Configuration</CardTitle>
            <Settings className="h-5 w-5 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <p className="text-xs text-muted-foreground">Store settings, payments, shipping.</p>
          </CardContent>
        </Card>
      </div>

      <div className="mt-8 p-6 border rounded-lg bg-card shadow">
        <h2 className="text-xl font-semibold mb-3">Ecommerce Modules Placeholder</h2>
        <p className="text-muted-foreground">
          This area will host comprehensive ecommerce management tools, including:
        </p>
        <ul className="list-disc list-inside text-muted-foreground mt-2 space-y-1 text-sm">
          <li>🛍️ Product Management (Products, Categories, Inventory, Pricing)</li>
          <li>📦 Order Management (Orders, Statuses, Shipping, Invoices)</li>
          <li>👥 Customer Management (Customer List, Groups, Activity)</li>
          <li>🎯 Marketing & Promotions (Coupons, Banners, Email Campaigns)</li>
          <li>📊 Analytics & Reports (Sales, Customer, Product Performance)</li>
          <li>⚙️ Settings & Configuration (Store, Payment, Shipping, Tax)</li>
          <li>📄 Content Management (CMS for Pages, Blog)</li>
          <li>🔐 Security & Access (Admin Users, Roles)</li>
          <li>🛠️ Tools & Utilities (Backup, Logs, Integrations)</li>
        </ul>
        <p className="mt-4 text-sm text-primary">
          Development for these features is planned.
        </p>
      </div>
    </div>
  );
}
