
"use client";
import { useEffect, useState, Suspense, useCallback } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import PalmInputForm from '@/components/palm-reading/PalmInputForm';
import { useAppContext } from '@/context/AppContext';
import { Loader2, Handshake, BookOpen, Sparkles, ArrowRight, ChevronDown, Search, ShoppingBag } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

const productCategories = [
  { name: "Crystal Bracelets", description: "Harness the energy of natural crystals for balance and healing.", imageUrl: "https://placehold.co/400x300.png", imageHint: "crystal bracelet", link: "#products/crystal-bracelets" },
  { name: "Gemstones", description: "Discover the power of authentic gemstones for well-being.", imageUrl: "https://placehold.co/400x300.png", imageHint: "gemstone collection", link: "#products/gemstones" },
  { name: "Pooja Essentials", description: "All you need for your sacred rituals and pooja.", imageUrl: "https://placehold.co/400x300.png", imageHint: "pooja items", link: "#products/pooja-essentials" },
  { name: "Rudrakshas", description: "Authentic Rudraksha beads for spiritual well-being.", imageUrl: "https://placehold.co/400x300.png", imageHint: "rudraksha beads", link: "#products/rudrakshas" },
  { name: "Yantras", description: "Invite prosperity and protection with sacred geometric yantras.", imageUrl: "https://placehold.co/400x300.png", imageHint: "sacred yantra", link: "#products/yantras" },
];

const readingTypes = [
  { name: "General Personality", query: "General Personality" },
  { name: "Career & Finance", query: "Career & Finance" },
  { name: "Health & Wellness", query: "Health & Wellness" },
  { name: "Marriage & Relationships", query: "Marriage & Relationships" },
  { name: "Comprehensive Analysis", query: "Comprehensive Analysis" },
];

const productMenuItems = [
  { name: "Crystal Bracelets", link: "#products/crystal-bracelets" },
  { name: "Gemstones", link: "#products/gemstones" },
  { name: "Pooja Essentials", link: "#products/pooja-essentials" },
  { name: "Rudrakshas", link: "#products/rudrakshas" },
  { name: "Yantras", link: "#products/yantras" },
];


function PalmInputPageComponent() {
  const { isAuthenticated, isInitializing } = useAppContext();
  const router = useRouter();
  const searchParams = useSearchParams();
  const [currentPathname, setCurrentPathname] = useState("/palm-input"); // Default to base path
  const [authCheckComplete, setAuthCheckComplete] = useState(false);

  const categoryFromQuery = searchParams ? searchParams.get('category') : null;
  const isValidCategorySelected = categoryFromQuery && readingTypes.some(rc => rc.query === categoryFromQuery);

  useEffect(() => {
    // Update currentPathname based on searchParams on mount and when they change
    if (searchParams) {
      const category = searchParams.get('category');
      const path = category ? `/palm-input?category=${encodeURIComponent(category)}` : "/palm-input";
      setCurrentPathname(path); // This reflects the logical page, not window.location.pathname
    }
  }, [searchParams]);

  useEffect(() => {
    if (!isInitializing) { // Ensure context is initialized
      const timer = setTimeout(() => { // Delay to ensure context values are stable
        if (!isAuthenticated) {
          router.push('/'); // Redirect if not authenticated
        }
        setAuthCheckComplete(true);
      }, 100); // Small delay for stability
      return () => clearTimeout(timer);
    }
  }, [isAuthenticated, router, isInitializing]);


  if (isInitializing || !authCheckComplete) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[calc(100vh-200px)]">
        <Loader2 className="h-12 w-12 animate-spin text-primary mb-4" />
        <p className="text-muted-foreground">Loading page data...</p>
      </div>
    );
  }
  
  const isPalmistryActive = currentPathname.startsWith('/palm-input') && isValidCategorySelected;
  const isMyReadingActive = currentPathname === '/report';


  return (
    <div className="relative space-y-8 md:space-y-10">
      {/* Background Image */}
      <div className="absolute inset-0 z-0 opacity-[0.03] pointer-events-none">
        <Image
          src="https://placehold.co/1920x1080.png"
          alt="Sacred Geometry Page Background"
          layout="fill"
          objectFit="cover"
          data-ai-hint="sacred geometry background"
        />
      </div>
      <div className="relative z-10">
        {/* Navigation Menu */}
        <nav aria-label="Main navigation after login">
          <ul className="flex justify-center items-center space-x-1 sm:space-x-2 md:space-x-4 py-3 bg-primary/10 backdrop-blur-sm rounded-lg shadow-md border border-primary/30 text-xs sm:text-sm">
            <li>
              <Link href="/" className="text-foreground hover:text-primary transition-colors px-2 py-1 rounded-md">
                Home
              </Link>
            </li>
            <li>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button
                    variant="ghost"
                    className={`transition-colors px-2 py-1 rounded-md flex items-center hover:bg-primary/5 focus:bg-primary/10 ${isPalmistryActive ? 'font-semibold text-transparent bg-clip-text bg-gradient-to-r from-accent via-primary to-accent animate-shimmer bg-[length:200%_100%] ring-1 ring-primary/50 bg-primary/10' : 'text-foreground hover:text-primary'}`}
                  >
                    <Handshake className="inline-block mr-1 h-4 w-4 align-middle" /> Palmistry <ChevronDown className="ml-1 h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="center" className="bg-background border-primary/30 shadow-xl">
                  {readingTypes.map((type) => (
                    <DropdownMenuItem key={type.query} asChild className="cursor-pointer hover:bg-primary/10 w-full">
                      <Link href={`/palm-input?category=${encodeURIComponent(type.query)}`} className="w-full">
                        {type.name}
                      </Link>
                    </DropdownMenuItem>
                  ))}
                </DropdownMenuContent>
              </DropdownMenu>
            </li>
            <li>
              <Link href="/report" className={`transition-colors px-2 py-1 rounded-md ${isMyReadingActive ? 'font-semibold text-transparent bg-clip-text bg-gradient-to-r from-accent via-primary to-accent animate-shimmer bg-[length:200%_100%] ring-1 ring-primary/50 bg-primary/10' : 'text-foreground hover:text-primary'}`}>
                <BookOpen className="inline-block mr-1 h-4 w-4 align-middle" /> My Reading
              </Link>
            </li>
            <li>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button
                    variant="ghost"
                    className="text-foreground hover:text-primary transition-colors px-2 py-1 rounded-md flex items-center hover:bg-primary/5 focus:bg-primary/10"
                  >
                    <ShoppingBag className="inline-block mr-1 h-4 w-4 align-middle" /> Products <ChevronDown className="ml-1 h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="center" className="bg-background border-primary/30 shadow-xl">
                  {productMenuItems.map((item) => (
                    <DropdownMenuItem key={item.name} asChild className="cursor-pointer hover:bg-primary/10 w-full">
                      <Link href={item.link} className="w-full">
                        {item.name}
                      </Link>
                    </DropdownMenuItem>
                  ))}
                </DropdownMenuContent>
              </DropdownMenu>
            </li>
            <li>
              <Link href="#remedies" className="text-foreground hover:text-primary transition-colors px-2 py-1 rounded-md">
                Remedies
              </Link>
            </li>
          </ul>
        </nav>

        {/* Conditional Content: Form or Palmistry Intro */}
        {isValidCategorySelected ? (
          <>
            <PalmInputForm />
            {/* Product Showcase (shown when a palmistry category is selected) */}
            <div className="w-full space-y-8 mt-12">
              <Card className="shadow-lg bg-card/90 backdrop-blur-sm border border-border">
                <CardHeader>
                  <div className="flex items-center gap-2">
                    <Sparkles className="h-7 w-7 text-primary" />
                    <CardTitle className="font-headline text-2xl md:text-3xl text-foreground">Enhance Your Journey</CardTitle>
                  </div>
                  <CardDescription className="text-base md:text-lg">Explore our curated collection of spiritual products.</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                    {productCategories.map((category) => (
                      <Card key={category.name} className="overflow-hidden shadow-md hover:shadow-lg transition-shadow duration-300 flex flex-col group bg-background">
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
                          <CardTitle className="font-headline text-xl text-card-foreground">{category.name}</CardTitle>
                        </CardHeader>
                        <CardContent className="p-4 pt-0 flex-grow">
                          <p className="text-muted-foreground text-sm line-clamp-3">{category.description}</p>
                        </CardContent>
                        <CardFooter className="p-4 border-t border-border">
                          <Button variant="outline" className="w-full group text-primary border-primary/50 hover:bg-primary/10 text-sm py-2.5" disabled>
                            Explore
                            <ArrowRight className="ml-2 h-4 w-4 text-primary transition-transform group-hover:translate-x-1" />
                          </Button>
                        </CardFooter>
                      </Card>
                    ))}
                  </div>
                </CardContent>
                <CardFooter className="p-4 text-center border-t border-border">
                  <Button size="lg" className="w-full sm:w-auto bg-primary hover:bg-primary/90 text-primary-foreground text-md py-3 px-6" disabled>
                    Visit Our Full Shop <ArrowRight className="ml-2 h-5 w-5" />
                  </Button>
                </CardFooter>
                <p className="text-sm text-center pb-4 text-accent font-semibold">More products coming soon!</p>
              </Card>
            </div>
          </>
        ) : (
          // Palmistry Intro (shown when no palmistry category is selected)
          <div className="text-center py-10 md:py-16 mt-8">
            <Card className="max-w-2xl mx-auto shadow-xl bg-card/80 backdrop-blur-sm border-border">
              <CardHeader className="items-center">
                <div className="p-3 bg-primary/10 rounded-full mb-3">
                    <Search className="h-12 w-12 text-primary" />
                </div>
                <CardTitle className="font-headline text-3xl md:text-4xl text-primary">Explore the World of Palmistry</CardTitle>
                <CardDescription className="text-lg text-muted-foreground mt-2">
                    Begin your journey of self-discovery.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <p className="text-muted-foreground text-md md:text-lg">
                  Select a specific reading type from the "Palmistry" menu above to provide your details and receive your personalized insights.
                </p>
                <div className="w-full max-w-lg mx-auto">
                  <Image 
                    src="https://placehold.co/600x400.png" 
                    alt="Palmistry Overview" 
                    width={600} 
                    height={400} 
                    className="rounded-lg shadow-lg border border-border object-cover"
                    data-ai-hint="palmistry hand lines" 
                  />
                </div>
                <p className="text-sm text-muted-foreground">
                  Each line on your palm tells a unique story. Our AI, guided by ancient wisdom, helps you understand yours.
                </p>
              </CardContent>
              <CardFooter>
                <p className="text-xs text-muted-foreground text-center w-full">
                    Choose a category from the menu to proceed.
                </p>
              </CardFooter>
            </Card>
          </div>
        )}
      </div>
    </div>
  );
}

export default function PalmInputPage() {
  return (
    <Suspense fallback={
      <div className="flex flex-col items-center justify-center min-h-[calc(100vh-200px)]">
        <Loader2 className="h-12 w-12 animate-spin text-primary mb-4" />
        <p className="text-muted-foreground">Loading...</p>
      </div>
    }>
      <PalmInputPageComponent />
    </Suspense>
  );
}

    