
"use client";

import AuthOptions from '@/components/auth/AuthOptions';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ArrowRight } from 'lucide-react';

const productCategories = [
  { name: "Crystal Bracelets", description: "Harness the energy of natural crystals for balance and healing.", imageUrl: "https://placehold.co/400x300.png", imageHint: "crystal bracelet", link: "#shop/bracelets" },
  { name: "Sacred Gemstones", description: "Discover the power of authentic gemstones for well-being.", imageUrl: "https://placehold.co/400x300.png", imageHint: "gemstone collection", link: "#shop/gemstones" },
  { name: "Energized Yantras", description: "Invite prosperity and protection with sacred geometric yantras.", imageUrl: "https://placehold.co/400x300.png", imageHint: "sacred yantra", link: "#shop/yantras" },
];

export default function LandingPage() {
  return (
    <div className="relative flex flex-col items-center py-8 md:py-12 space-y-12 md:space-y-20 min-h-full">
      <div className="absolute inset-0 z-0 opacity-5">
        <Image
          src="https://placehold.co/1200x800.png"
          alt="Sacred Geometry Background"
          layout="fill"
          objectFit="cover"
          data-ai-hint="sacred geometry"
          priority
        />
      </div>

      {/* Section 1: Palm Reading - Primary Focus */}
      <section id="palm-reading-auth" className="w-full flex flex-col items-center max-w-md px-4 relative z-10">
        <AuthOptions />
      </section>

      {/* Section 2: Spiritual Products Showcase - Secondary Focus */}
      <section id="spiritual-products" className="w-full max-w-5xl px-4 relative z-10">
        <div className="text-center mb-10 md:mb-12">
          <h2 className="text-3xl md:text-4xl font-headline font-semibold text-foreground">Enhance Your Spiritual Journey</h2>
          <p className="text-muted-foreground mt-2 md:mt-3 text-base md:text-lg">Explore our curated collection of spiritual products.</p>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
          {productCategories.map((category) => (
            <Card key={category.name} className="overflow-hidden shadow-lg hover:shadow-xl transition-shadow duration-300 flex flex-col bg-card">
              <div className="relative h-56 w-full">
                <Image
                  src={category.imageUrl}
                  alt={category.name}
                  layout="fill"
                  objectFit="cover"
                  data-ai-hint={category.imageHint}
                  className="transition-transform duration-300 group-hover:scale-105"
                />
              </div>
              <CardHeader className="p-5">
                <CardTitle className="font-headline text-xl md:text-2xl text-card-foreground">{category.name}</CardTitle>
              </CardHeader>
              <CardContent className="p-5 pt-0 flex-grow">
                <p className="text-muted-foreground text-sm md:text-base">{category.description}</p>
              </CardContent>
              <div className="p-5 border-t border-border">
                 <Button variant="outline" className="w-full group text-base py-3" disabled>
                  Explore <span className="ml-1"> {category.name}</span>
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
                <p className="text-xs text-center mt-2 text-amber-700 dark:text-amber-500 font-semibold">Coming Soon!</p>
              </div>
            </Card>
          ))}
        </div>
        <div className="text-center mt-12 md:mt-16">
            <Button size="lg" className="bg-primary hover:bg-primary/90 text-primary-foreground text-lg py-4 px-8" disabled>
                Visit Our Full Shop <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
             <p className="text-sm text-center mt-3 text-amber-700 dark:text-amber-500 font-semibold">Our full e-commerce store is under development.</p>
        </div>
      </section>
    </div>
  );
}
