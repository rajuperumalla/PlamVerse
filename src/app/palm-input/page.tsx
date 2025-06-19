
"use client";
import { useEffect, useState, Suspense, useCallback } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import PalmInputForm from '@/components/palm-reading/PalmInputForm';
import { useAppContext } from '@/context/AppContext';
import { Loader2 } from 'lucide-react';
import Image from 'next/image'; 
import { Button } from '@/components/ui/button'; 
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card'; 
import { Sparkles, ArrowRight, Handshake, BookOpen } from 'lucide-react'; 

// Sample product categories for display after login
const productCategories = [
  { name: "Crystal Bracelets", description: "Harness the energy of natural crystals for balance and healing.", imageUrl: "https://placehold.co/400x300.png", imageHint: "crystal bracelet", link: "#shop/bracelets" },
  { name: "Sacred Gemstones", description: "Discover the power of authentic gemstones for well-being.", imageUrl: "https://placehold.co/400x300.png", imageHint: "gemstone collection", link: "#shop/gemstones" },
  { name: "Energized Yantras", description: "Invite prosperity and protection with sacred geometric yantras.", imageUrl: "https://placehold.co/400x300.png", imageHint: "sacred yantra", link: "#shop/yantras" },
];


function PalmInputPageComponent() {
  const { isAuthenticated, isInitializing } = useAppContext();
  const router = useRouter();
  const searchParams = useSearchParams(); 
  const [currentPathname, setCurrentPathname] = useState("/palm-input"); // Default value
  const [authCheckComplete, setAuthCheckComplete] = useState(false);

  useEffect(() => {
    // Update currentPathname whenever searchParams changes
    if (searchParams) {
      const path = searchParams.toString() ? `/palm-input?${searchParams.toString()}` : "/palm-input";
      setCurrentPathname(path);
    }
  }, [searchParams]);

  useEffect(() => {
    if (!isInitializing) {
        const timer = setTimeout(() => {
            if (!isAuthenticated) {
                router.push('/');
            }
            setAuthCheckComplete(true);
        }, 100);
        return () => clearTimeout(timer);
    }
  }, [isAuthenticated, router, isInitializing]);

  if (isInitializing || !authCheckComplete) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[calc(100vh-200px)]">
        <Loader2 className="h-12 w-12 animate-spin text-primary mb-4" />
        <p className="text-muted-foreground">Loading form data...</p>
      </div>
    );
  }

  return (
    <div className="relative space-y-8 md:space-y-10">
      <div className="absolute inset-0 z-0 opacity-[0.03] pointer-events-none">
        <Image
          src="https://placehold.co/1920x1080.png" 
          alt="Sacred Geometry Page Background"
          layout="fill"
          objectFit="cover"
          data-ai-hint="sacred geometry background"
        />
      </div>
      <div className="relative z-10"> {/* Content wrapper */}
        <nav aria-label="Main navigation after login">
          <ul className="flex justify-center items-center space-x-1 sm:space-x-2 md:space-x-4 py-3 bg-primary/10 backdrop-blur-sm rounded-lg shadow-md border border-primary/30 text-xs sm:text-sm">
            <li>
              <Link href="/" className="text-primary hover:text-primary/80 transition-colors px-2 py-1 rounded-md">
                Home
              </Link>
            </li>
            <li>
              <Link href="/palm-input" className={`transition-colors px-2 py-1 rounded-md ${currentPathname === '/palm-input' || currentPathname.startsWith('/palm-input?') ? 'font-semibold text-transparent bg-clip-text bg-gradient-to-r from-accent via-primary to-accent animate-shimmer bg-[length:200%_100%] ring-1 ring-primary/50 bg-primary/10' : 'text-primary hover:text-primary/80'}`}>
                <Handshake className="inline-block mr-1 h-4 w-4 align-middle" /> Palmistry
              </Link>
            </li>
             <li>
              <Link href="/report" className={`transition-colors px-2 py-1 rounded-md ${currentPathname === '/report' ? 'font-semibold text-transparent bg-clip-text bg-gradient-to-r from-accent via-primary to-accent animate-shimmer bg-[length:200%_100%] ring-1 ring-primary/50 bg-primary/10' : 'text-primary hover:text-primary/80'}`}>
                 <BookOpen className="inline-block mr-1 h-4 w-4 align-middle" /> My Reading
              </Link>
            </li>
            <li>
              <Link href="#products" className="text-primary hover:text-primary/80 transition-colors px-2 py-1 rounded-md">
                Products
              </Link>
            </li>
            <li>
              <Link href="#remedies" className="text-primary hover:text-primary/80 transition-colors px-2 py-1 rounded-md">
                Remedies
              </Link>
            </li>
          </ul>
        </nav>
        <PalmInputForm />

        {/* Spiritual Products Showcase Block - Moved here from landing page */}
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
