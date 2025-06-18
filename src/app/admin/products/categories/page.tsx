
"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tag } from "lucide-react";

export default function AdminProductCategoriesPage() {
  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <Tag className="h-8 w-8 text-primary" />
        <h1 className="text-3xl font-bold font-headline">Product Categories & Subcategories</h1>
      </div>
      <CardDescription>
        Organize your products by creating and managing categories and subcategories.
      </CardDescription>
      
      <Card>
        <CardHeader>
          <CardTitle>Category Management</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">
            This area will allow you to create, edit, delete, and reorder product categories and subcategories. 
            Proper categorization helps customers find products easily and improves store navigation.
          </p>
          <p className="mt-4 text-sm text-primary">
            Further development for category management features is planned.
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
