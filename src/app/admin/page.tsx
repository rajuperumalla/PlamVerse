
"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ShoppingCart, Users, BarChart3, Settings } from "lucide-react";

export default function AdminDashboardPage() {
  // This page is now for the new "Admin" role (Ecommerce focus)
  // It's a placeholder for now.

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold font-headline">Admin Dashboard</h1>
      <CardDescription>Overview of your Ecommerce operations and application settings.</CardDescription>
      
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
