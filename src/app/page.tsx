
"use client";

import { useAppContext } from '@/context/AppContext';
import AuthOptions from '@/components/auth/AuthOptions';
import Image from 'next/image';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Sparkles, ArrowRight, Handshake, BookOpen, RefreshCw, LifeBuoy, Brain, Heart, Star } from 'lucide-react';
import Link from 'next/link';


const productCategories = [
  { name: "Crystal Bracelets", description: "Harness the energy of natural crystals for balance and healing.", imageUrl: "https://placehold.co/400x300.png", imageHint: "crystal bracelet", link: "#shop/bracelets" },
  { name: "Sacred Gemstones", description: "Discover the power of authentic gemstones for well-being.", imageUrl: "https://placehold.co/400x300.png", imageHint: "gemstone collection", link: "#shop/gemstones" },
  { name: "Energized Yantras", description: "Invite prosperity and protection with sacred geometric yantras.", imageUrl: "https://placehold.co/400x300.png", imageHint: "sacred yantra", link: "#shop/yantras" },
];

const palmLines = [
  { name: "Life Line", icon: LifeBuoy, description: "Represents vitality, physical health, and major life changes. Its length is not an indicator of lifespan." , colorClass: "text-red-500"},
  { name: "Head Line", icon: Brain, description: "Indicates your intellectual curiosity, learning style, communication, and thirst for knowledge." , colorClass: "text-blue-500"},
  { name: "Heart Line", icon: Heart, description: "Reveals your emotional stability, romantic perspectives, psychological state, and interpersonal relationships." , colorClass: "text-pink-500"},
  { name: "Fate Line (Destiny Line)", icon: Star, description: "Shows the impact of external factors on your life path, including career, choices, and life's purpose." , colorClass: "text-purple-500"},
];

export default function LandingPage() {
  const { isAuthenticated, userName } = useAppContext();
  return (
    <div className="relative flex flex-col items-center py-8 md:py-12 space-y-10 min-h-full">
      <div className="absolute inset-0 z-0 opacity-[0.03] pointer-events-none">
        <Image
          src="https://placehold.co/1200x800.png"
          alt="Sacred Geometry Background"
          layout="fill"
          objectFit="cover"
          data-ai-hint="sacred geometry pattern"
          priority
        />
      </div>

      {/* New Informational Palm Line Section */}
      <div className="relative z-10 w-full max-w-5xl px-4 text-center space-y-8">
        <h2 className="font-headline text-3xl md:text-4xl lg:text-5xl font-bold text-primary">
          Unlock the Secrets in Your Palm
        </h2>
        <p className="text-muted-foreground text-lg md:text-xl">
          Discover what the major lines on your palm reveal about your life, personality, and destiny.
        </p>
        <Card className="shadow-xl bg-card/80 backdrop-blur-sm border-border overflow-hidden">
          <CardContent className="p-6">
            <div className="w-full max-w-md mx-auto mb-6">
              <Image
                src="https://placehold.co/600x400.png"
                alt="Annotated Palm Lines"
                width={600}
                height={400}
                className="rounded-lg shadow-lg border border-border object-cover"
                data-ai-hint="palmistry chart"
              />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-left">
              {palmLines.map((line) => (
                <div key={line.name} className="p-4 bg-background/70 rounded-lg border border-border shadow-sm">
                  <div className="flex items-center mb-2">
                    <line.icon className={`mr-2 h-6 w-6 ${line.colorClass}`} />
                    <h3 className="font-headline text-xl font-semibold text-foreground">{line.name}</h3>
                  </div>
                  <p className="text-sm text-muted-foreground">{line.description}</p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
        <Button size="lg" asChild className="bg-primary hover:bg-primary/90 text-primary-foreground text-lg py-3 px-8 shadow-lg">
          <Link href="/palm-input">
            <Handshake className="mr-2 h-6 w-6" /> Get Your AI Palm Reading
          </Link>
        </Button>
      </div>


      {/* Main Content Area: Auth Options/Welcome and Product Showcase */}
      <div className="relative z-10 flex flex-col lg:flex-row items-start justify-center gap-8 md:gap-10 w-full max-w-6xl px-4 mt-8">
        
        {!isAuthenticated ? (
          <div className="w-full lg:w-2/5 flex-shrink-0">
            <AuthOptions />
          </div>
        ) : (
          <div className="w-full lg:w-2/5 flex-shrink-0">
            <Card className="shadow-xl animate-fade-in flex-shrink-0 bg-card/95 backdrop-blur-sm">
              <CardHeader>
                <CardTitle className="font-headline text-2xl md:text-3xl">Welcome Back, {userName}!</CardTitle>
                <CardDescription>Ready to explore further?</CardDescription>
              </CardHeader>
              <CardContent className="space-y-3">
                <Button asChild className="w-full text-base sm:text-lg py-3 sm:py-4">
                  <Link href="/report"><BookOpen className="mr-2 h-5 w-5" /> View My Reading</Link>
                </Button>
                <Button asChild variant="secondary" className="w-full text-base sm:text-lg py-3 sm:py-4">
                 <Link href="/palm-input"><RefreshCw className="mr-2 h-5 w-5" /> Start New Reading</Link>
                </Button>
              </CardContent>
              <CardFooter className="mt-2">
                <p className="text-xs text-muted-foreground text-center w-full">
                    Your destiny awaits.
                </p>
              </CardFooter>
            </Card>
          </div>
        )}

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
                {productCategories.slice(0,2).map((category) => ( 
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
                       <p className="text-xs text-center mt-1.5 text-accent font-semibold">Coming Soon!</p>
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
                    <p className="text-sm text-center mt-2 text-accent font-semibold">More products coming soon!</p>
                 </CardFooter>
            )}
          </Card>
        </div>
      </div>
    </div>
  );
}
