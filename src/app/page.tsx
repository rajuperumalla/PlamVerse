
"use client";

import AuthOptions from '@/components/auth/AuthOptions';
import Image from 'next/image';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Sparkles, ArrowRight, Handshake } from 'lucide-react';

const productCategories = [
  { name: "Crystal Bracelets", description: "Harness the energy of natural crystals for balance and healing.", imageUrl: "https://placehold.co/400x300.png", imageHint: "crystal bracelet", link: "#shop/bracelets" },
  { name: "Sacred Gemstones", description: "Discover the power of authentic gemstones for well-being.", imageUrl: "https://placehold.co/400x300.png", imageHint: "gemstone collection", link: "#shop/gemstones" },
  { name: "Energized Yantras", description: "Invite prosperity and protection with sacred geometric yantras.", imageUrl: "https://placehold.co/400x300.png", imageHint: "sacred yantra", link: "#shop/yantras" },
];

export default function LandingPage() {
  return (
    <div className="relative flex flex-col items-center py-8 md:py-12 space-y-10 min-h-full">
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

      {/* Hero Banner Section */}
      <div className="relative z-10 w-full max-w-5xl px-4 text-center">
        <Card className="shadow-xl bg-gradient-to-br from-primary/20 via-background to-background border-primary/30 overflow-hidden">
          <div className="flex flex-col md:flex-row items-center justify-between p-6 md:p-8 gap-6">
            <div className="md:w-2/3 text-center md:text-left">
              <h2 className="font-headline text-3xl md:text-4xl lg:text-5xl font-bold text-primary mb-3">
                Your First AI Palm Reading FREE!
              </h2>
              <p className="text-muted-foreground text-lg md:text-xl mb-6">
                Unlock the secrets of your destiny. Get your personalized AI-powered palm reading today.
              </p>
              <Button size="lg" className="bg-primary hover:bg-primary/90 text-primary-foreground text-lg py-3 px-8 shadow-lg animate-pulse">
                <Handshake className="mr-2 h-6 w-6" /> Get Your Reading Now
              </Button>
            </div>
            <div className="md:w-1/3 flex justify-center">
              <Image
                src="https://placehold.co/300x300.png"
                alt="AI Palm Reading"
                width={250}
                height={250}
                className="rounded-full shadow-2xl border-4 border-secondary object-cover"
                data-ai-hint="mystical hands spiritual"
              />
            </div>
          </div>
        </Card>
      </div>

      {/* Main Content Area: Auth Options and Product Showcase */}
      <div className="relative z-10 flex flex-col lg:flex-row items-start justify-center gap-8 md:gap-10 w-full max-w-6xl px-4 mt-8">
        
        {/* Authentication Block (Palm Reading Service Entry) */}
        <div className="w-full lg:w-2/5 flex-shrink-0">
          <AuthOptions />
        </div>

        {/* Spiritual Products Showcase Block */}
        <div className="w-full lg:w-3/5 space-y-8">
          <Card className="shadow-lg bg-card/90 backdrop-blur-sm">
            <CardHeader>
                <div className="flex items-center gap-2">
                    <Sparkles className="h-7 w-7 text-primary" />
                    <CardTitle className="font-headline text-2xl md:text-3xl text-foreground">Enhance Your Journey</CardTitle>
                </div>
              <CardDescription className="text-base md:text-lg">Explore our curated collection of spiritual products.</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                {productCategories.slice(0,2).map((category) => ( // Show 2 for better fit in this layout
                  <Card key={category.name} className="overflow-hidden shadow-md hover:shadow-lg transition-shadow duration-300 flex flex-col">
                    <div className="relative h-40 w-full">
                      <Image
                        src={category.imageUrl}
                        alt={category.name}
                        layout="fill"
                        objectFit="cover"
                        data-ai-hint={category.imageHint}
                        className="transition-transform duration-300 group-hover:scale-105"
                      />
                    </div>
                    <CardHeader className="p-3">
                      <CardTitle className="font-headline text-lg text-card-foreground">{category.name}</CardTitle>
                    </CardHeader>
                    <CardContent className="p-3 pt-0 flex-grow">
                      <p className="text-muted-foreground text-sm line-clamp-2">{category.description}</p>
                    </CardContent>
                    <CardFooter className="p-3 border-t border-border">
                      <Button variant="outline" className="w-full group text-sm py-2" disabled>
                        Explore
                        <ArrowRight className="ml-2 h-4 w-4" />
                      </Button>
                       <p className="text-xs text-center mt-1.5 text-amber-700 dark:text-amber-500 font-semibold">Coming Soon!</p>
                    </CardFooter>
                  </Card>
                ))}
              </div>
            </CardContent>
            {productCategories.length > 2 && (
                 <CardFooter className="p-4 text-center border-t">
                     <Button size="lg" className="w-full sm:w-auto bg-primary hover:bg-primary/90 text-primary-foreground text-md py-3 px-6" disabled>
                        Visit Our Full Shop <ArrowRight className="ml-2 h-5 w-5" />
                    </Button>
                    <p className="text-sm text-center mt-2 text-amber-700 dark:text-amber-500 font-semibold">More products coming soon!</p>
                 </CardFooter>
            )}
          </Card>
        </div>
      </div>
    </div>
  );
}
