
"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ShoppingBag } from "lucide-react";

export default function AdminAllProductsPage() {
  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <ShoppingBag className="h-8 w-8 text-primary" />
        <h1 className="text-3xl font-bold font-headline">All Products</h1>
      </div>
      <CardDescription>
        View, add, edit, and manage all products in your store.
      </CardDescription>
      
      <Card>
        <CardHeader>
          <CardTitle>Product Listing</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">
            This section will display a comprehensive list of all products. 
            You will be able to filter, sort, search for products, and perform actions like adding new products,
            editing existing ones, or deleting them. Detailed inventory, pricing, and variant information
            will also be accessible from here.
          </p>
          <p className="mt-4 text-sm text-primary">
            Further development for product listing and management features is planned.
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
