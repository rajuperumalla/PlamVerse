
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
  { id: "SP001", imageUrl: "https://placehold.co/50x50.png", imageHint: "amethyst bracelet", name: "Enchanted Amethyst Bracelet", category: "Crystal Bracelets", stock: 50, price: 1200.00, size: "Medium", refNo: "CB-AMY-001", published: true, favourite: true },
  { id: "SP002", imageUrl: "https://placehold.co/50x50.png", imageHint: "rose quartz", name: "Polished Rose Quartz Gemstone", category: "Gemstones", stock: 100, price: 800.00, size: "Large", refNo: "GS-ROQ-001", published: true, favourite: false },
  { id: "SP003", imageUrl: "https://placehold.co/50x50.png", imageHint: "rudraksha beads", name: "Authentic 5 Mukhi Rudraksha", category: "Rudrakshas", stock: 200, price: 550.00, size: "Standard", refNo: "RD-5MK-001", published: true, favourite: true },
  { id: "SP004", imageUrl: "https://placehold.co/50x50.png", imageHint: "shree yantra", name: "Copper Plated Shree Yantra", category: "Yantras", stock: 75, price: 2500.00, size: "3x3 inch", refNo: "YT-SHR-001", published: true, favourite: false },
  { id: "SP005", imageUrl: "https://placehold.co/50x50.png", imageHint: "meditation cushion", name: "Zen Meditation Cushion", category: "Meditation Aids", stock: 30, price: 1500.00, size: "Large", refNo: "MA-CUS-001", published: true, favourite: false },
  { id: "SP006", imageUrl: "https://placehold.co/50x50.png", imageHint: "incense sticks", name: "Sandalwood Incense Sticks (100g)", category: "Pooja Items", stock: 150, price: 300.00, size: "100g", refNo: "PI-INC-001", published: false, favourite: false },
];

export default function AdminAllProductsPage() {
  return (
    <div className="space-y-6">
      <header className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold font-headline">Products</h1>
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
