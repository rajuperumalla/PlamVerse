
"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Share2 } from "lucide-react";

export default function AdminSocialSharingPage() {
  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <Share2 className="h-8 w-8 text-primary" />
        <h1 className="text-3xl font-bold font-headline">Social Sharing Settings</h1>
      </div>
      <CardDescription>
        Configure how your content appears when shared on social media platforms.
      </CardDescription>
      
      <Card>
        <CardHeader>
          <CardTitle>Open Graph & Twitter Cards</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">
            Set default images, titles, and descriptions for social sharing (e.g., Facebook Open Graph, Twitter Cards).
            Manage links to your official social media profiles.
          </p>
          <p className="mt-4 text-sm text-primary">
            Further development for social sharing settings is planned.
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
