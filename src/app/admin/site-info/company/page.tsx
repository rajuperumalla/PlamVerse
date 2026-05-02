
"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Building2 } from "lucide-react";

export default function AdminCompanyDetailsPage() {
  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <Building2 className="h-8 w-8 text-primary" />
        <h1 className="text-3xl font-bold font-headline">Company & Contact Details</h1>
      </div>
      <CardDescription>
        Manage your business information, address, and contact methods.
      </CardDescription>
      
      <Card>
        <CardHeader>
          <CardTitle>Business Information</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">
            Set your company's legal name, registration details, and primary business address.
          </p>
          <p className="mt-4 text-sm text-primary">
            Further development for these settings is planned.
          </p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Contact Information</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">
            Provide public contact email addresses, phone numbers, and customer support channels.
            These details may be used in the website footer or contact pages.
          </p>
          <p className="mt-4 text-sm text-primary">
            Further development for contact information settings is planned.
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
