
"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Upload } from "lucide-react";

export default function AdminProductBulkUploadPage() {
  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <Upload className="h-8 w-8 text-primary" />
        <h1 className="text-3xl font-bold font-headline">Bulk Product Upload</h1>
      </div>
      <CardDescription>
        Add or update multiple products at once using CSV or Excel files.
      </CardDescription>
      
      <Card>
        <CardHeader>
          <CardTitle>Bulk Upload Tool</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">
            This feature will allow you to download a template, fill it with your product data 
            (including details, variants, pricing, inventory), and upload it to efficiently manage large product catalogs.
            Error reporting for failed uploads will also be included.
          </p>
          <p className="mt-4 text-sm text-primary">
            Further development for bulk product upload is planned.
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
