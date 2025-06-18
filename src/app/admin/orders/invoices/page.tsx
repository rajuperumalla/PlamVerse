
"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { FileText } from "lucide-react";

export default function AdminInvoiceGeneratorPage() {
  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <FileText className="h-8 w-8 text-primary" />
        <h1 className="text-3xl font-bold font-headline">Invoice / Packing Slip Generator</h1>
      </div>
      <CardDescription>
        Generate and manage invoices and packing slips for orders.
      </CardDescription>
      
      <Card>
        <CardHeader>
          <CardTitle>Document Generation</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">
            This feature will allow you to generate PDF invoices and packing slips for individual orders or in bulk.
            Customization options for templates may also be available.
          </p>
          <p className="mt-4 text-sm text-primary">
            Further development for invoice and packing slip generation is planned.
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
