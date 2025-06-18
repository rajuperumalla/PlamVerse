
"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Percent } from "lucide-react";

export default function AdminTaxesPage() {
  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <Percent className="h-8 w-8 text-primary" />
        <h1 className="text-3xl font-bold font-headline">Tax Configuration</h1>
      </div>
      <CardDescription>
        Set up tax rates and rules for your products and services.
      </CardDescription>
      
      <Card>
        <CardHeader>
          <CardTitle>Tax Rules & Rates</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">
            Configure tax rates based on location (country, state, city), product type, or customer group.
            Manage tax classes and ensure compliance with local tax regulations.
          </p>
          <p className="mt-4 text-sm text-primary">
            Further development for tax configuration is planned.
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
