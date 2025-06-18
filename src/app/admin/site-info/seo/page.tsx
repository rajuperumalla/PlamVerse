
"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Search } from "lucide-react"; // Or TrendingUp

export default function AdminSeoAnalyticsPage() {
  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <Search className="h-8 w-8 text-primary" />
        <h1 className="text-3xl font-bold font-headline">SEO & Analytics</h1>
      </div>
      <CardDescription>
        Optimize your site for search engines and integrate analytics services.
      </CardDescription>
      
      <Card>
        <CardHeader>
          <CardTitle>Search Engine Optimization</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">
            Manage global meta tags, sitemap generation, robots.txt, and other SEO-related settings.
          </p>
          <p className="mt-4 text-sm text-primary">
            Further development for SEO settings is planned.
          </p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Analytics Integration</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">
            Add tracking codes for services like Google Analytics, and other analytics platforms.
          </p>
          <p className="mt-4 text-sm text-primary">
            Further development for analytics integration is planned.
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
