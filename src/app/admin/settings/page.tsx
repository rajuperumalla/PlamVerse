
"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Settings } from "lucide-react";

export default function AdminSettingsPage() {
  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <Settings className="h-8 w-8 text-primary" />
        <h1 className="text-3xl font-bold font-headline">Store Settings</h1>
      </div>
      <CardDescription>
        Configure core store settings, payment gateways, shipping, and taxes.
      </CardDescription>
      
      <Card>
        <CardHeader>
          <CardTitle>Settings Overview</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">
            Here you will be able to configure general store settings (name, currency, timezone),
            set up payment gateways, define shipping zones and rates, manage tax configurations,
            and customize email templates.
          </p>
          <p className="mt-4 text-sm text-primary">
            Further development for store settings features is planned.
          </p>
        </CardContent>
      </Card>
    </div>
  );
}

    