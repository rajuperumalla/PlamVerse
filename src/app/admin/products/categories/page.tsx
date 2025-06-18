
"use client";

import Image from 'next/image';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Search, PlusCircle, Edit, Trash2, ChevronRight } from "lucide-react";
import Link from 'next/link';

interface Category {
  id: string;
  imageUrl: string;
  imageHint: string;
  name: string;
  status: boolean;
  favourite: boolean;
}

const sampleCategories: Category[] = [
  { id: "CAT01", imageUrl: "https://placehold.co/40x40.png", imageHint: "crystal bracelet", name: "Crystal Bracelets", status: true, favourite: true },
  { id: "CAT02", imageUrl: "https://placehold.co/40x40.png", imageHint: "gemstone collection", name: "Gemstones", status: true, favourite: false },
  { id: "CAT03", imageUrl: "https://placehold.co/40x40.png", imageHint: "rudraksha mala", name: "Rudrakshas", status: true, favourite: true },
  { id: "CAT04", imageUrl: "https://placehold.co/40x40.png", imageHint: "sacred yantra", name: "Yantras", status: true, favourite: false },
  { id: "CAT05", imageUrl: "https://placehold.co/40x40.png", imageHint: "meditation tools", name: "Meditation Aids", status: false, favourite: false },
  { id: "CAT06", imageUrl: "https://placehold.co/40x40.png", imageHint: "pooja thali", name: "Pooja Items", status: true, favourite: false },
];

export default function AdminProductCategoriesPage() {
  return (
    <div className="space-y-6">
      <header className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold font-headline">Categories</h1>
          <div className="text-sm text-muted-foreground flex items-center mt-1">
            <Link href="/admin" className="hover:text-primary">Ecommerce</Link>
            <ChevronRight className="h-4 w-4 mx-1" />
            <Link href="/admin/products" className="hover:text-primary">Products</Link>
            <ChevronRight className="h-4 w-4 mx-1" />
            <span>Categories</span>
          </div>
        </div>
        <Button className="bg-primary hover:bg-primary/90 text-primary-foreground">
          <PlusCircle className="mr-2 h-5 w-5" /> Add Category
        </Button>
      </header>

      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
        <Input 
          placeholder="Search categories price etc..." 
          className="pl-10 pr-4 py-2 text-base w-full sm:max-w-md" 
        />
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-xl font-semibold">
            Categories <Badge variant="secondary">{sampleCategories.length}</Badge>
          </CardTitle>
          <CardDescription>Manage your product categories. Edit, publish, and organize your items.</CardDescription>
        </CardHeader>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-[50px]">Id</TableHead>
                  <TableHead className="min-w-[200px]">Category</TableHead>
                  <TableHead className="text-center">Status</TableHead>
                  <TableHead className="text-center">Favourite</TableHead>
                  <TableHead className="text-right">Action</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {sampleCategories.map((category) => (
                  <TableRow key={category.id}>
                    <TableCell className="font-medium text-xs">{category.id}</TableCell>
                    <TableCell>
                      <div className="flex items-center gap-3">
                        <Image 
                          src={category.imageUrl} 
                          alt={category.name} 
                          width={32} 
                          height={32} 
                          className="rounded-md aspect-square object-cover"
                          data-ai-hint={category.imageHint}
                        />
                        <span className="font-medium text-sm">{category.name}</span>
                      </div>
                    </TableCell>
                    <TableCell className="text-center">
                      <Switch defaultChecked={category.status} aria-label="Category status" />
                    </TableCell>
                    <TableCell className="text-center">
                      <Switch defaultChecked={category.favourite} aria-label="Category favourite status" />
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end items-center gap-2">
                        <Button variant="ghost" size="icon" className="h-8 w-8">
                          <Edit className="h-4 w-4 text-blue-500" />
                        </Button>
                        <Button variant="ghost" size="icon" className="h-8 w-8">
                          <Trash2 className="h-4 w-4 text-destructive" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
