
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

interface Product {
  id: string;
  imageUrl: string;
  imageHint: string;
  name: string;
  category: string;
  stock: number;
  price: number;
  size: string;
  refNo: string;
  published: boolean;
  favourite: boolean;
}

const sampleProducts: Product[] = [
  { id: "2", imageUrl: "https://placehold.co/50x50.png", imageHint: "pain relief oil", name: "Adiguru's Pain Relief Oil", category: "Pain Relief", stock: 0, price: 250.00, size: "60ml", refNo: "ADG-PRO-001", published: true, favourite: false },
  { id: "3", imageUrl: "https://placehold.co/50x50.png", imageHint: "red balm", name: "Adiguru's All Purpose Red Balm", category: "Skin Care", stock: 0, price: 108.00, size: "12gm", refNo: "ADG-RBM-001", published: true, favourite: true },
  { id: "4", imageUrl: "https://placehold.co/50x50.png", imageHint: "universal oil", name: "Adiguru's Universal Oil", category: "Cold, Cough, Migraine & Sinus", stock: 0, price: 108.00, size: "10ml", refNo: "ADG-UNI-001", published: true, favourite: false },
  { id: "5", imageUrl: "https://placehold.co/50x50.png", imageHint: "cold oil", name: "Adiguru's Cold Oil", category: "Cold, Cough, Migraine & Sinus", stock: 0, price: 108.00, size: "10ml", refNo: "ADG-CLD-001", published: true, favourite: false },
  { id: "1002", imageUrl: "https://placehold.co/50x50.png", imageHint: "herbal inhaler", name: "Adiguru's Herbal Inhaler", category: "Health & Wellness", stock: 0, price: 135.00, size: "45ml", refNo: "ADG-HBI-001", published: true, favourite: false },
  { id: "1005", imageUrl: "https://placehold.co/50x50.png", imageHint: "deodorant stick", name: "Adiguru's Natural Deodorant Stick", category: "Skin Care", stock: 500, price: 0, size: "4 ML", refNo: "ADG-NDO-001", published: true, favourite: false },
];

export default function AdminAllProductsPage() {
  return (
    <div className="space-y-6">
      <header className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold font-headline">PRODUCTS</h1>
          <div className="text-sm text-muted-foreground flex items-center mt-1">
            <Link href="/admin" className="hover:text-primary">Ecommerce</Link>
            <ChevronRight className="h-4 w-4 mx-1" />
            <span>Products</span>
          </div>
        </div>
        <Button className="bg-primary hover:bg-primary/90 text-primary-foreground">
          <PlusCircle className="mr-2 h-5 w-5" /> Add Product
        </Button>
      </header>

      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
        <Input 
          placeholder="Search products, price etc..." 
          className="pl-10 pr-4 py-2 text-base w-full sm:max-w-md" 
        />
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-xl font-semibold">
            Products <Badge variant="secondary">{sampleProducts.length}</Badge>
          </CardTitle>
          <CardDescription>Manage your product catalog. Edit, publish, and organize your items.</CardDescription>
        </CardHeader>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-[50px]">Id</TableHead>
                  <TableHead className="min-w-[250px]">Product</TableHead>
                  <TableHead className="min-w-[150px]">Category</TableHead>
                  <TableHead className="text-center">Stock</TableHead>
                  <TableHead className="text-right min-w-[100px]">Price</TableHead>
                  <TableHead className="min-w-[70px]">Size</TableHead>
                  <TableHead className="min-w-[120px]">Ref No</TableHead>
                  <TableHead className="text-center">Published</TableHead>
                  <TableHead className="text-center">Favourite</TableHead>
                  <TableHead className="text-right">Action</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {sampleProducts.map((product) => (
                  <TableRow key={product.id}>
                    <TableCell className="font-medium text-xs">{product.id}</TableCell>
                    <TableCell>
                      <div className="flex items-center gap-3">
                        <Image 
                          src={product.imageUrl} 
                          alt={product.name} 
                          width={40} 
                          height={40} 
                          className="rounded-md aspect-square object-cover"
                          data-ai-hint={product.imageHint}
                        />
                        <span className="font-medium text-sm">{product.name}</span>
                      </div>
                    </TableCell>
                    <TableCell className="text-xs">{product.category}</TableCell>
                    <TableCell className="text-center text-xs">{product.stock}</TableCell>
                    <TableCell className="text-right text-xs">
                      {product.price > 0 ? `₹${product.price.toFixed(2)}` : '-'}
                    </TableCell>
                    <TableCell className="text-xs">{product.size}</TableCell>
                    <TableCell className="text-xs">{product.refNo}</TableCell>
                    <TableCell className="text-center">
                      <Switch defaultChecked={product.published} aria-label="Published status" />
                    </TableCell>
                    <TableCell className="text-center">
                      <Switch defaultChecked={product.favourite} aria-label="Favourite status" />
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
