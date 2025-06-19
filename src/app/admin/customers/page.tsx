
"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Users } from "lucide-react";

export default function AdminCustomersPage() {
  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <Users className="h-8 w-8 text-primary" />
        <h1 className="text-3xl font-bold font-headline">Customer Management</h1>
      </div>
      <CardDescription>
        Access customer data, manage segments, and view activity logs.
      </CardDescription>
      
      <Card>
        <CardHeader>
          <CardTitle>Customers Overview</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">
            This area will allow you to view a list of all customers, create customer groups or segments,
            review customer activity logs, manage support tickets, and oversee loyalty programs.
          </p>
          <p className="mt-4 text-sm text-primary">
            Further development for customer management features is planned.
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
