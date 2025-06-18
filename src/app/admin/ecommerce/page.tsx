
"use client";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Briefcase, Package, Settings, Tag, Users, DollarSign, LineChart, FileText, Shield, Mail, Bell } from "lucide-react";
import Link from "next/link";

// A more detailed placeholder for the Ecommerce section
export default function EcommerceAdminPage() {

  const sections = [
    { title: "Product Management", icon: Package, description: "Manage products, categories, variants, inventory, pricing.", link: "#products" },
    { title: "Order Management", icon: Briefcase, description: "View orders, update statuses, handle returns, generate invoices.", link: "#orders" },
    { title: "Customer Management", icon: Users, description: "View customer data, segments, activity logs, support tickets.", link: "#customers" },
    { title: "Marketing & Promotions", icon: Tag, description: "Create coupons, banners, email campaigns, SEO settings.", link: "#marketing" },
    { title: "Analytics & Reports", icon: LineChart, description: "Sales, customer, product performance, revenue reports.", link: "#analytics" },
    { title: "Store Configuration", icon: Settings, description: "Store settings, payment gateways, shipping, taxes.", link: "#settings" },
    { title: "Content Management (CMS)", icon: FileText, description: "Manage homepage, informational pages, blog, testimonials.", link: "#cms" },
    { title: "Notifications & Emails", icon: Mail, description: "Configure email templates, manage notification settings.", link: "#notifications" },
  ];

  return (
    <div className="space-y-8">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold font-headline">Ecommerce Management</h1>
        <Button variant="outline">View Storefront</Button>
      </div>
      <CardDescription>
        Oversee all aspects of your online store, from products and orders to customers and marketing.
      </CardDescription>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {sections.map((section) => (
          <Card key={section.title} className="hover:shadow-lg transition-shadow duration-200 flex flex-col">
            <CardHeader className="flex flex-row items-start gap-4 space-y-0">
              <div className="p-3 bg-primary/10 rounded-md">
                <section.icon className="h-6 w-6 text-primary" />
              </div>
              <div>
                <CardTitle className="text-lg">{section.title}</CardTitle>
                <CardDescription className="text-xs mt-1">{section.description}</CardDescription>
              </div>
            </CardHeader>
            <CardContent className="mt-auto pt-2"> {/* Push button to bottom */}
              <Button variant="secondary" className="w-full" asChild>
                <Link href={section.link}>Manage {section.title.split(" ")[0]}</Link>
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>

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

    