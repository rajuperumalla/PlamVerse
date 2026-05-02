
"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { Search, Users, ChevronLeft, ChevronRight } from "lucide-react";

interface Subscriber {
  id: string;
  email: string;
  subscribed: boolean;
  cityRegionCountry: string;
  ipLocation: string;
}

const sampleSubscribers: Subscriber[] = [
  { id: "1", email: "saichandmin@gmail.com", subscribed: true, cityRegionCountry: "string, string, string", ipLocation: "Lat: string, Long: string" },
  { id: "2", email: "saichandmjhjkin@gmail.com", subscribed: true, cityRegionCountry: "Hyderabad, TS, India", ipLocation: "Lat: , Long:" },
  { id: "3", email: "qwertyin@gmail.com", subscribed: true, cityRegionCountry: "Hyderabad, TS, India", ipLocation: "Lat: , Long:" },
  { id: "4", email: "ee@er.com", subscribed: true, cityRegionCountry: "Hyderabad, TS, India", ipLocation: "Lat: , Long:" },
  { id: "5", email: "ee@r.com", subscribed: true, cityRegionCountry: "Hyderabad, TS, India", ipLocation: "Lat: , Long:" },
];

export default function AdminSubscribersPage() {
  return (
    <div className="space-y-6">
      <header className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold font-headline flex items-center gap-2">
            <Users className="h-8 w-8 text-primary" />
            Subscribers
          </h1>
          <CardDescription className="mt-1">Manage your newsletter subscribers.</CardDescription>
        </div>
      </header>

      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
        <Input 
          placeholder="Search by email..." 
          className="pl-10 pr-4 py-2 text-base w-full sm:max-w-md" 
        />
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-xl font-semibold">
            Subscribers <Badge variant="secondary">{sampleSubscribers.length}</Badge>
          </CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="min-w-[200px]">Email Address</TableHead>
                  <TableHead className="text-center">Subscribed</TableHead>
                  <TableHead className="min-w-[180px]">City, Region, Country</TableHead>
                  <TableHead className="min-w-[180px]">IP Address & Location</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {sampleSubscribers.map((subscriber) => (
                  <TableRow key={subscriber.id}>
                    <TableCell className="font-medium text-sm">{subscriber.email}</TableCell>
                    <TableCell className="text-center text-sm">
                      {subscriber.subscribed ? 
                        <Badge variant="default" className="bg-green-500 hover:bg-green-600 text-white">Yes</Badge> : 
                        <Badge variant="secondary">No</Badge>
                      }
                    </TableCell>
                    <TableCell className="text-xs">{subscriber.cityRegionCountry}</TableCell>
                    <TableCell className="text-xs">{subscriber.ipLocation}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </CardContent>
        <CardFooter className="flex flex-col sm:flex-row justify-between items-center gap-4 pt-4 border-t">
            <p className="text-xs text-muted-foreground">
                Showing {sampleSubscribers.length} of {sampleSubscribers.length} Results
            </p>
            <div className="flex items-center gap-2">
                <Button variant="outline" size="sm" disabled>
                    <ChevronLeft className="h-4 w-4 mr-1" /> Previous
                </Button>
                <Button variant="outline" size="sm" className="w-8 h-8 p-0 bg-primary text-primary-foreground">1</Button>
                <Button variant="outline" size="sm" disabled>
                    Next <ChevronRight className="h-4 w-4 ml-1" />
                </Button>
            </div>
        </CardFooter>
      </Card>
    </div>
  );
}
