
"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Settings2 } from "lucide-react";

export default function AdminCoreSettingsPage() {
  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <Settings2 className="h-8 w-8 text-primary" />
        <h1 className="text-3xl font-bold font-headline">Core Settings</h1>
      </div>
      <CardDescription>
        Manage fundamental store settings like name, currency, timezone, and operational parameters.
      </CardDescription>
      
      <Card>
        <CardHeader>
          <CardTitle>Store Details</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">
            Configure your store's name, default currency, primary language, timezone, and contact information.
          </p>
          <p className="mt-4 text-sm text-primary">
            Further development for these core settings is planned.
          </p>
        </CardContent>
      </Card>
       <Card>
        <CardHeader>
          <CardTitle>Localization</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">
            Manage units of measurement, date/time formats, and country-specific settings.
          </p>
        </CardContent>
      </Card>
       <Card>
        <CardHeader>
          <CardTitle>Admin Preferences</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">
            Set preferences for the admin panel, such as default list sizes, notifications, and dashboard widgets.
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
