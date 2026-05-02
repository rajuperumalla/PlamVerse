
"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Package2 } from "lucide-react";

export default function AdminShippingProvidersPage() {
  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <Package2 className="h-8 w-8 text-primary" />
        <h1 className="text-3xl font-bold font-headline">Shipping Providers Integration</h1>
      </div>
      <CardDescription>
        Manage integrations with shipping carriers and services.
      </CardDescription>
      
      <Card>
        <CardHeader>
          <CardTitle>Carrier Integration</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">
            Configure integrations with shipping providers (e.g., FedEx, UPS, local couriers)
            to fetch real-time rates, generate shipping labels, and track shipments.
          </p>
          <p className="mt-4 text-sm text-primary">
            Further development for shipping provider integration is planned.
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
