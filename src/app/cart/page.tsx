
"use client";

import { ShoppingCart, Wrench } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import Image from 'next/image';
import Link from 'next/link';
import { Button } from '@/components/ui/button';

export default function CartPage() {
  return (
    <div className="container mx-auto px-4 py-12">
      <div className="flex flex-col items-center text-center">
        <div className="p-4 bg-primary/10 rounded-full mb-6">
          <ShoppingCart className="h-16 w-16 text-primary" />
        </div>
        <h1 className="text-4xl font-bold font-headline text-primary mb-4">
          Your Shopping Cart
        </h1>
        <p className="text-xl text-muted-foreground mb-8 max-w-2xl">
          Review the items in your cart before proceeding to checkout.
        </p>
      </div>

      <Card className="w-full max-w-3xl mx-auto shadow-xl my-10">
        <CardHeader className="items-center text-center">
          <Wrench className="h-12 w-12 text-amber-500 mb-3" />
          <CardTitle className="font-headline text-2xl">Shopping Cart is Under Construction</CardTitle>
          <CardDescription>
            We are currently building our shopping cart and checkout experience.
          </CardDescription>
        </CardHeader>
        <CardContent className="text-center">
          <Image
            src="https://placehold.co/600x400.png"
            alt="Cart under construction"
            width={600}
            height={400}
            className="rounded-lg shadow-md mx-auto mb-6 border border-border"
            data-ai-hint="shopping cart items"
          />
          <p className="text-muted-foreground mb-4">
            Thank you for your patience. For now, please enjoy our reading services!
          </p>
          <Button asChild variant="outline">
            <Link href="/">Return to Home</Link>
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}

    