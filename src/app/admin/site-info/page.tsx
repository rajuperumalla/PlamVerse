
"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Info, Globe, Settings2, Building2, Share2 } from "lucide-react";

export default function AdminSiteInfoPage() {
  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <Info className="h-8 w-8 text-primary" />
        <h1 className="text-3xl font-bold font-headline">Site Information</h1>
      </div>
      <CardDescription>
        Manage general website information, SEO settings, and branding.
      </CardDescription>
      
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Globe className="h-5 w-5 text-muted-foreground" />
            General Site Settings
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">
            This section will allow configuration of site title, tagline, logo, favicon, default language, and timezone.
          </p>
          <p className="mt-4 text-sm text-primary">
            Further development for these settings is planned.
          </p>
        </CardContent>
      </Card>

       <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Settings2 className="h-5 w-5 text-muted-foreground" />
            SEO & Analytics
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">
            Configure global SEO settings (meta tags, sitemap generation) and integrate analytics tracking codes (e.g., Google Analytics).
          </p>
           <p className="mt-4 text-sm text-primary">
            Further development for SEO & Analytics settings is planned.
          </p>
        </CardContent>
      </Card>

       <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Building2 className="h-5 w-5 text-muted-foreground" />
            Company & Contact Details
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">
            Manage business name, address, contact email, phone number, and social media links. These details may be used across the site (e.g., footer, contact page).
          </p>
           <p className="mt-4 text-sm text-primary">
            Further development for company contact details is planned.
          </p>
        </CardContent>
      </Card>
       <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Share2 className="h-5 w-5 text-muted-foreground" />
            Social Sharing Settings
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">
            Configure default images and descriptions for social media sharing (Open Graph, Twitter Cards).
          </p>
           <p className="mt-4 text-sm text-primary">
            Further development for social sharing settings is planned.
          </p>
        </CardContent>
      </Card>
    </div>
  );
}

    