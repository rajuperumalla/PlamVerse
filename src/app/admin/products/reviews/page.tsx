
"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { MessageSquareText } from "lucide-react";

export default function AdminProductReviewsPage() {
  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <MessageSquareText className="h-8 w-8 text-primary" />
        <h1 className="text-3xl font-bold font-headline">Product Reviews & Ratings Moderation</h1>
      </div>
      <CardDescription>
        Manage and moderate customer reviews and ratings for your products.
      </CardDescription>
      
      <Card>
        <CardHeader>
          <CardTitle>Review Moderation</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">
            This section will list all submitted product reviews. You'll be able to approve, reject, or reply to reviews.
            This helps maintain the quality of user-generated content on your product pages.
          </p>
          <p className="mt-4 text-sm text-primary">
            Further development for review moderation features is planned.
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
