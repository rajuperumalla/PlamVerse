
"use client";

import AuthOptions from '@/components/auth/AuthOptions';
import Image from 'next/image';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Sparkles, ArrowRight } from 'lucide-react';

const productCategories = [
  { name: "Crystal Bracelets", description: "Harness the energy of natural crystals for balance and healing.", imageUrl: "https://placehold.co/400x300.png", imageHint: "crystal bracelet", link: "#shop/bracelets" },
  { name: "Sacred Gemstones", description: "Discover the power of authentic gemstones for well-being.", imageUrl: "https://placehold.co/400x300.png", imageHint: "gemstone collection", link: "#shop/gemstones" },
  { name: "Energized Yantras", description: "Invite prosperity and protection with sacred geometric yantras.", imageUrl: "https://placehold.co/400x300.png", imageHint: "sacred yantra", link: "#shop/yantras" },
];

export default function LandingPage() {
  return (
    <div className="relative flex flex-col items-center justify-center py-8 md:py-12 space-y-12 md:space-y-16 min-h-full">
      <div className="absolute inset-0 z-0 opacity-5">
        <Image
          src="https://placehold.co/1200x800.png"
          alt="Sacred Geometry Background"
          layout="fill"
          objectFit="cover"
          data-ai-hint="sacred geometry pattern"
          priority
        />
      </div>

      {/* Main content area */}
      <div className="relative z-10 flex flex-col lg:flex-row items-start justify-center gap-8 md:gap-12 w-full max-w-6xl px-4">
        
        {/* Authentication Block */}
        <div className="w-full lg:w-2/5 flex-shrink-0">
          <AuthOptions />
        </div>

        {/* Spiritual Products Showcase Block */}
        <div className="w-full lg:w-3/5 space-y-8">
          <Card className="shadow-lg bg-card/90 backdrop-blur-sm">
            <CardHeader>
                <div className="flex items-center gap-2">
                    <Sparkles className="h-8 w-8 text-primary" />
                    <CardTitle className="font-headline text-2xl md:text-3xl text-foreground">Enhance Your Spiritual Journey</CardTitle>
                </div>
              <CardDescription className="text-base md:text-lg">Explore our curated collection of spiritual products designed to complement your path.</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {productCategories.map((category) => (
                  <Card key={category.name} className="overflow-hidden shadow-md hover:shadow-lg transition-shadow duration-300 flex flex-col">
                    <div className="relative h-48 w-full">
                      <Image
                        src={category.imageUrl}
                        alt={category.name}
                        layout="fill"
                        objectFit="cover"
                        data-ai-hint={category.imageHint}
                        className="transition-transform duration-300 group-hover:scale-105"
                      />
                    </div>
                    <CardHeader className="p-4">
                      <CardTitle className="font-headline text-lg md:text-xl text-card-foreground">{category.name}</CardTitle>
                    </CardHeader>
                    <CardContent className="p-4 pt-0 flex-grow">
                      <p className="text-muted-foreground text-sm">{category.description}</p>
                    </CardContent>
                    <div className="p-4 border-t border-border">
                      <Button variant="outline" className="w-full group text-sm py-2.5" disabled>
                        Explore <span className="ml-1"> {category.name}</span>
                        <ArrowRight className="ml-2 h-4 w-4" />
                      </Button>
                      <p className="text-xs text-center mt-1.5 text-amber-700 dark:text-amber-500 font-semibold">Coming Soon!</p>
                    </div>
                  </Card>
                ))}
              </div>
            </CardContent>
            <CardFooter>
                <Button size="lg" className="w-full sm:w-auto bg-primary hover:bg-primary/90 text-primary-foreground text-md py-3 px-6" disabled>
                    Visit Our Full Shop <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
            </CardFooter>
             <p className="text-sm text-center pb-4 text-amber-700 dark:text-amber-500 font-semibold">Our full e-commerce store is under development.</p>
          </Card>
        </div>
      </div>
    </div>
  );
}
