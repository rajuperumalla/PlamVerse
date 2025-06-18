
"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Truck } from "lucide-react";

export default function AdminShippingPage() {
  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <Truck className="h-8 w-8 text-primary" />
        <h1 className="text-3xl font-bold font-headline">Shipping Configuration</h1>
      </div>
      <CardDescription>
        Define shipping zones, rates, methods, and packaging options.
      </CardDescription>
      
      <Card>
        <CardHeader>
          <CardTitle>Shipping Zones & Rates</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">
            Create shipping zones based on countries, states, or pincodes. Set up different shipping rates 
            (flat rate, free shipping, weight-based, price-based) for each zone.
          </p>
           <p className="mt-4 text-sm text-primary">
            Further development for shipping configuration is planned.
          </p>
        </CardContent>
      </Card>
       <Card>
        <CardHeader>
          <CardTitle>Shipping Methods</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">
            Manage shipping carriers (e.g., FedEx, UPS, Local Delivery) and their specific services.
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
