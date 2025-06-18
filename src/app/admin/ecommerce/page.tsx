
"use client";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Briefcase, Package, Settings, Tag, Users, DollarSign, LineChart, FileText, Shield, Mail, Bell, ChevronRight } from "lucide-react";
import Link from "next/link";

export default function EcommerceAdminPage() {

  const sections = [
    { title: "Product Management", icon: Package, description: "Manage products, categories, inventory, pricing.", link: "#products" },
    { title: "Order Management", icon: Briefcase, description: "View orders, update statuses, handle returns.", link: "#orders" },
    { title: "Customer Management", icon: Users, description: "View customer data, segments, activity logs.", link: "#customers" },
    { title: "Marketing & Promotions", icon: Tag, description: "Create coupons, banners, email campaigns.", link: "#marketing" },
    { title: "Analytics & Reports", icon: LineChart, description: "Sales, customer, product performance reports.", link: "#analytics" },
    { title: "Store Configuration", icon: Settings, description: "Store settings, payment, shipping, taxes.", link: "#settings" },
    { title: "Content Management (CMS)", icon: FileText, description: "Manage homepage, informational pages, blog.", link: "#cms" },
    { title: "Notifications & Emails", icon: Mail, description: "Configure email templates, notifications.", link: "#notifications" },
  ];

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold font-headline">Ecommerce Management</h1>
        <Button variant="outline">View Storefront</Button>
      </div>
      <CardDescription>
        Select a module below to manage different aspects of your online store.
      </CardDescription>

      <Card>
        <CardHeader>
          <CardTitle>Ecommerce Modules</CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          <div className="divide-y divide-border">
            {sections.map((section) => (
              <Button
                key={section.title}
                variant="ghost"
                className="w-full h-auto justify-start px-6 py-4 rounded-none first:rounded-t-md last:rounded-b-md"
                asChild
              >
                <Link href={section.link} className="flex items-center w-full">
                  <div className="p-2 bg-primary/10 rounded-md mr-4">
                    <section.icon className="h-5 w-5 text-primary" />
                  </div>
                  <div className="flex-grow">
                    <h3 className="font-semibold text-base">{section.title}</h3>
                    <p className="text-xs text-muted-foreground">{section.description}</p>
                  </div>
                  <ChevronRight className="h-5 w-5 text-muted-foreground ml-auto" />
                </Link>
              </Button>
            ))}
          </div>
        </CardContent>
      </Card>

       <Card className="mt-8">
        <CardHeader>
          <CardTitle>Quick Actions</CardTitle>
        </CardHeader>
        <CardContent className="flex flex-wrap gap-3">
            <Button><Package className="mr-2 h-4 w-4"/> Add New Product</Button>
            <Button variant="outline"><Briefcase className="mr-2 h-4 w-4"/> View Recent Orders</Button>
            <Button variant="outline"><Users className="mr-2 h-4 w-4"/> Add New Customer</Button>
            <Button variant="outline"><Tag className="mr-2 h-4 w-4"/> Create Discount</Button>
        </CardContent>
      </Card>
    </div>
  );
}
