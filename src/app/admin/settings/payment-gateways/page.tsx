
"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { CreditCard } from "lucide-react";

export default function AdminPaymentGatewaysPage() {
  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <CreditCard className="h-8 w-8 text-primary" />
        <h1 className="text-3xl font-bold font-headline">Payment Gateways</h1>
      </div>
      <CardDescription>
        Configure and manage payment methods accepted by your store.
      </CardDescription>
      
      <Card>
        <CardHeader>
          <CardTitle>Payment Gateway Setup</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">
            Integrate with various payment providers (e.g., Stripe, PayPal), manage their settings,
            and set up payment options like credit/debit cards, net banking, and digital wallets.
          </p>
          <p className="mt-4 text-sm text-primary">
            Further development for payment gateway integration is planned.
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
