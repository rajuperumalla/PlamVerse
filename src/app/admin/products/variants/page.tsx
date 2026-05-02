
"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Palette } from "lucide-react";

export default function AdminProductVariantsPage() {
  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <Palette className="h-8 w-8 text-primary" />
        <h1 className="text-3xl font-bold font-headline">Product Variants</h1>
      </div>
      <CardDescription>
        Manage product attributes like size, color, material, and create variants for your products.
      </CardDescription>
      
      <Card>
        <CardHeader>
          <CardTitle>Variant & Attribute Management</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">
            Define product attributes (e.g., Size, Color) and their possible values (e.g., Small, Medium, Large; Red, Blue, Green).
            Then, create product variants based on these attributes, each potentially having its own SKU, price, and inventory.
          </p>
          <p className="mt-4 text-sm text-primary">
            Further development for variant and attribute management is planned.
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
