
"use client";

import Image from 'next/image';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { Search, ChevronRight, Star, Eye, CheckCircle2, XCircle, MessageSquareText } from "lucide-react";
import Link from 'next/link';
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { MoreHorizontal } from "lucide-react"

interface Review {
  id: string;
  productName: string;
  productImageUrl: string;
  productImageHint: string;
  customerName: string;
  rating: number;
  reviewText: string;
  dateSubmitted: string;
  status: "Pending" | "Approved" | "Rejected";
}

const sampleReviews: Review[] = [
  { id: "rev001", productName: "Adiguru's Pain Relief Oil", productImageUrl: "https://placehold.co/40x40.png", productImageHint: "pain relief oil", customerName: "Rohan S.", rating: 5, reviewText: "Amazing product! Really helped with my knee pain. Highly recommend.", dateSubmitted: "2024-07-15", status: "Pending" },
  { id: "rev002", productName: "Adiguru's All Purpose Red Balm", productImageUrl: "https://placehold.co/40x40.png", productImageHint: "red balm", customerName: "Priya K.", rating: 4, reviewText: "Good for headaches and minor burns. The smell is a bit strong though.", dateSubmitted: "2024-07-14", status: "Approved" },
  { id: "rev003", productName: "Adiguru's Universal Oil", productImageUrl: "https://placehold.co/40x40.png", productImageHint: "universal oil", customerName: "Amit V.", rating: 2, reviewText: "Didn't work for my sinus issues as expected. Not satisfied.", dateSubmitted: "2024-07-13", status: "Rejected" },
  { id: "rev004", productName: "Adiguru's Cold Oil", productImageUrl: "https://placehold.co/40x40.png", productImageHint: "cold oil", customerName: "Sunita M.", rating: 5, reviewText: "Very effective for cold and cough. My go-to product now.", dateSubmitted: "2024-07-12", status: "Pending" },
  { id: "rev005", productName: "Adiguru's Herbal Inhaler", productImageUrl: "https://placehold.co/40x40.png", productImageHint: "herbal inhaler", customerName: "Vijay P.", rating: 3, reviewText: "It's okay, provides temporary relief. Expected more.", dateSubmitted: "2024-07-11", status: "Approved" },
];

const renderStars = (rating: number) => {
  const stars = [];
  for (let i = 0; i < 5; i++) {
    stars.push(
      <Star
        key={i}
        className={`h-4 w-4 ${i < rating ? 'text-yellow-400 fill-yellow-400' : 'text-gray-300'}`}
      />
    );
  }
  return <div className="flex items-center">{stars}</div>;
};

export default function AdminProductReviewsPage() {
  return (
    <div className="space-y-6">
      <header className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold font-headline flex items-center gap-2">
            <MessageSquareText className="h-8 w-8 text-primary" />
            PRODUCT REVIEWS
          </h1>
          <div className="text-sm text-muted-foreground flex items-center mt-1">
            <Link href="/admin" className="hover:text-primary">Ecommerce</Link>
            <ChevronRight className="h-4 w-4 mx-1" />
            <Link href="/admin/products" className="hover:text-primary">Products</Link>
            <ChevronRight className="h-4 w-4 mx-1" />
            <span>Reviews</span>
          </div>
        </div>
      </header>

      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
        <Input
          placeholder="Search reviews by product, customer, keyword..."
          className="pl-10 pr-4 py-2 text-base w-full sm:max-w-md"
        />
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-xl font-semibold">
            Product Reviews <Badge variant="secondary">{sampleReviews.length}</Badge>
          </CardTitle>
          <CardDescription>Moderate customer feedback for your products. Approve, reject, or view review details.</CardDescription>
        </CardHeader>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="min-w-[200px]">Product</TableHead>
                  <TableHead className="min-w-[120px]">Customer</TableHead>
                  <TableHead className="min-w-[100px]">Rating</TableHead>
                  <TableHead className="min-w-[250px]">Review</TableHead>
                  <TableHead className="min-w-[120px]">Date</TableHead>
                  <TableHead className="min-w-[100px] text-center">Status</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {sampleReviews.map((review) => (
                  <TableRow key={review.id}>
                    <TableCell>
                      <div className="flex items-center gap-3">
                        <Image
                          src={review.productImageUrl}
                          alt={review.productName}
                          width={32}
                          height={32}
                          className="rounded-md aspect-square object-cover"
                          data-ai-hint={review.productImageHint}
                        />
                        <span className="font-medium text-xs hover:underline cursor-pointer">{review.productName}</span>
                      </div>
                    </TableCell>
                    <TableCell className="text-xs">{review.customerName}</TableCell>
                    <TableCell>{renderStars(review.rating)}</TableCell>
                    <TableCell className="text-xs">
                      <p className="truncate max-w-xs">{review.reviewText}</p>
                    </TableCell>
                    <TableCell className="text-xs">{review.dateSubmitted}</TableCell>
                    <TableCell className="text-center">
                      <Badge
                        variant={
                          review.status === "Approved" ? "default" :
                          review.status === "Rejected" ? "destructive" :
                          "secondary"
                        }
                        className={
                          review.status === "Approved" ? "bg-green-500 hover:bg-green-600" : ""
                        }
                      >
                        {review.status}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right">
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" className="h-8 w-8 p-0">
                              <span className="sr-only">Open menu</span>
                              <MoreHorizontal className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuLabel>Actions</DropdownMenuLabel>
                            <DropdownMenuItem>
                              <Eye className="mr-2 h-4 w-4" /> View Details
                            </DropdownMenuItem>
                            <DropdownMenuSeparator />
                            {review.status !== "Approved" && (
                              <DropdownMenuItem className="text-green-600 focus:bg-green-50 focus:text-green-700">
                                <CheckCircle2 className="mr-2 h-4 w-4" /> Approve
                              </DropdownMenuItem>
                            )}
                            {review.status !== "Rejected" && (
                              <DropdownMenuItem className="text-red-600 focus:bg-red-50 focus:text-red-700">
                                <XCircle className="mr-2 h-4 w-4" /> Reject
                              </DropdownMenuItem>
                            )}
                          </DropdownMenuContent>
                        </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </CardContent>
        <CardFooter className="py-4 border-t">
          <Pagination>
            <PaginationContent>
              <PaginationItem>
                <PaginationPrevious href="#" />
              </PaginationItem>
              <PaginationItem>
                <PaginationLink href="#" isActive>1</PaginationLink>
              </PaginationItem>
              <PaginationItem>
                <PaginationLink href="#">2</PaginationLink>
              </PaginationItem>
              <PaginationItem>
                <PaginationEllipsis />
              </PaginationItem>
              <PaginationItem>
                <PaginationNext href="#" />
              </PaginationItem>
            </PaginationContent>
          </Pagination>
        </CardFooter>
      </Card>
    </div>
  );
}

    