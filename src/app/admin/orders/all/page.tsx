
"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ListOrdered } from "lucide-react";

export default function AdminAllOrdersPage() {
  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <ListOrdered className="h-8 w-8 text-primary" />
        <h1 className="text-3xl font-bold font-headline">All Orders</h1>
      </div>
      <CardDescription>
        View, search, filter, and export all customer orders.
      </CardDescription>
      
      <Card>
        <CardHeader>
          <CardTitle>Order Listing</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">
            This section will display a comprehensive list of all orders.
            Features will include advanced search, filtering by status/date/customer,
            and options to export order data.
          </p>
          <p className="mt-4 text-sm text-primary">
            Further development for viewing all orders is planned.
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
