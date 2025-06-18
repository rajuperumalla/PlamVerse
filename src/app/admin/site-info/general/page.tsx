
"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Globe } from "lucide-react";

export default function AdminGeneralSiteSettingsPage() {
  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <Globe className="h-8 w-8 text-primary" />
        <h1 className="text-3xl font-bold font-headline">General Site Settings</h1>
      </div>
      <CardDescription>
        Manage core website details like site title, logo, favicon, and default language.
      </CardDescription>
      
      <Card>
        <CardHeader>
          <CardTitle>Site Identity</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">
            Configure your site's title, tagline, upload your logo and favicon.
            Set the primary language and timezone for your website.
          </p>
          <p className="mt-4 text-sm text-primary">
            Further development for these settings is planned.
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
