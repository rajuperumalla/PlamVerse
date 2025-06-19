
"use client";

import { useAppContext } from '@/context/AppContext';
import AuthOptions from '@/components/auth/AuthOptions';
import Image from 'next/image';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Sparkles, ArrowRight, Handshake, BookOpen, RefreshCw, LifeBuoy, Brain, Heart, Star, Calculator, WandSparkles } from 'lucide-react';
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

const coreServices = [
  { name: "Palmistry", icon: Handshake, description: "Delve into the mysteries of your hands. Explore palm lines and understand their meanings.", link: "/palm-input", cta: "Get Palm Reading" },
  { name: "Numerology", icon: Calculator, description: "Discover the power of numbers. Calculate your life path, business name compatibility, and more.", link: "/numerology-input", cta: "Explore Numerology" },
  { name: "Astrology", icon: WandSparkles, description: "Uncover celestial influences on your journey. Personalized horoscope and transit analysis.", link: "#astrology", cta: "Coming Soon", disabled: true },
];

export default function HomePage() {
  const { isAuthenticated, userName } = useAppContext();

  const renderUnauthenticatedView = () => (
    <>
      <div className="relative z-10 w-full max-w-3xl text-center mb-10">
        <h1 className="font-headline text-4xl md:text-5xl lg:text-6xl font-bold text-primary mb-4">
          Your First AI Palm Reading FREE!
        </h1>
        <p className="text-muted-foreground text-lg md:text-xl mb-8">
          Discover your destiny, understand your personality, and unlock insights into your future.
        </p>
      </div>
      <div className="w-full lg:w-2/5 flex-shrink-0 mb-10 lg:mb-0">
        <AuthOptions />
      </div>
    </>
  );

  const renderAuthenticatedView = () => (
    <div className="w-full max-w-5xl space-y-10">
      <Card className="shadow-xl animate-fade-in bg-card/95 backdrop-blur-sm border border-primary/20">
        <CardHeader>
          <CardTitle className="font-headline text-3xl md:text-4xl text-primary">Welcome Back, {userName}!</CardTitle>
          <CardDescription className="text-lg">Ready to explore further or revisit your insights?</CardDescription>
        </CardHeader>
        <CardContent className="flex flex-col sm:flex-row gap-3">
          <Button asChild className="w-full sm:w-auto text-base py-3">
            <Link href="/report"><BookOpen className="mr-2 h-5 w-5" /> View My Reading</Link>
          </Button>
          <Button asChild variant="secondary" className="w-full sm:w-auto text-base py-3">
            <Link href="/palm-input"><RefreshCw className="mr-2 h-5 w-5" /> Start New Reading</Link>
          </Button>
        </CardContent>
      </Card>

      <section>
        <h2 className="font-headline text-3xl font-bold text-center mb-6 text-foreground">Explore Our Services</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {coreServices.map((service) => (
            <Card key={service.name} className="shadow-lg hover:shadow-xl transition-shadow duration-300 flex flex-col bg-card/90 backdrop-blur-sm">
              <CardHeader className="items-center text-center">
                <div className="p-3 bg-primary/10 rounded-full mb-2 w-fit">
                  <service.icon className="h-8 w-8 text-primary" />
                </div>
                <CardTitle className="font-headline text-2xl">{service.name}</CardTitle>
              </CardHeader>
              <CardContent className="flex-grow text-center">
                <p className="text-muted-foreground text-sm mb-4">{service.description}</p>
              </CardContent>
              <CardFooter className="justify-center">
                <Button asChild variant={service.disabled ? "outline" : "default"} disabled={service.disabled} className="w-full sm:w-auto">
                  <Link href={service.link}>{service.cta}</Link>
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>
      </section>
    </div>
  );

  return (
    <div className="relative flex flex-col items-center py-8 md:py-12 space-y-12 min-h-full">
      <div className="absolute inset-0 z-0 opacity-[0.03] pointer-events-none">
        <Image
          src="https://placehold.co/1920x1080.png"
          alt="Sacred Geometry Page Background"
          layout="fill"
          objectFit="cover"
          data-ai-hint="sacred geometry pattern"
          priority
        />
      </div>

      {isAuthenticated ? renderAuthenticatedView() : renderUnauthenticatedView()}

      {/* Common Sections */}
      <div className="relative z-10 w-full max-w-5xl px-4 space-y-12">
        <section id="learn-palmistry" className="scroll-mt-20">
          <h2 className="font-headline text-3xl md:text-4xl font-bold text-center mb-6 text-foreground">
            Unlock the Secrets in Your Palm
          </h2>
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
             {!isAuthenticated && (
                <CardFooter className="justify-center pt-4 border-t">
                     <Button size="lg" asChild className="bg-primary hover:bg-primary/90 text-primary-foreground text-lg py-3 px-8 shadow-lg">
                        <Link href="/palm-input">
                            <Handshake className="mr-2 h-6 w-6" /> Get Your AI Palm Reading
                        </Link>
                    </Button>
                </CardFooter>
            )}
          </Card>
        </section>

        <section id="spiritual-products">
          <h2 className="font-headline text-3xl md:text-4xl font-bold text-center mb-6 text-foreground">Enhance Your Journey</h2>
          <Card className="shadow-lg bg-card/90 backdrop-blur-sm border border-border">
            <CardHeader>
              <CardTitle className="font-headline text-2xl md:text-3xl text-foreground">Curated Spiritual Products</CardTitle>
              <CardDescription className="text-base md:text-lg">Explore our collection to support your spiritual practice.</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
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
                    <CardHeader className="p-3">
                      <CardTitle className="font-headline text-lg text-card-foreground">{category.name}</CardTitle>
                    </CardHeader>
                    <CardContent className="p-3 pt-0 flex-grow">
                      <p className="text-muted-foreground text-sm line-clamp-2">{category.description}</p>
                    </CardContent>
                    <CardFooter className="p-3 border-t border-border flex-col items-center">
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
            {productCategories.length > 0 && (
              <CardFooter className="p-4 text-center border-t flex-col items-center">
                <Button size="lg" className="w-full sm:w-auto bg-primary hover:bg-primary/90 text-primary-foreground text-md py-3 px-6" disabled>
                  Visit Our Full Shop <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
                <p className="text-sm text-center mt-2 text-accent font-semibold">More products coming soon!</p>
              </CardFooter>
            )}
          </Card>
        </section>
      </div>
    </div>
  );
}
