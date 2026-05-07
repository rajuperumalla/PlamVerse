"use client";

import { useAppContext } from '@/context/AppContext';
import AuthOptions from '@/components/auth/AuthOptions';
import Image from 'next/image';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Sparkles, ArrowRight, Hand, BookOpen, LifeBuoy, Brain, Heart, Star } from 'lucide-react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import ParticlesBackground from '@/components/ParticlesBackground';
import SunAndPlanets from '@/components/SunAndPlanets';

const productCategories = [
  { name: "Crystal Bracelets", description: "Harness the energy of natural crystals for balance and healing.", imageUrl: "https://picsum.photos/seed/bracelets/400/300", imageHint: "crystal bracelet", link: "#shop/bracelets" },
  { name: "Sacred Gemstones", description: "Discover the power of authentic gemstones for well-being.", imageUrl: "https://picsum.photos/seed/gemstones/400/300", imageHint: "gemstone collection", link: "#shop/gemstones" },
  { name: "Energized Yantras", description: "Invite prosperity and protection with sacred geometric yantras.", imageUrl: "https://picsum.photos/seed/yantras/400/300", imageHint: "sacred yantra", link: "#shop/yantras" },
];

const palmLines = [
  { name: "Life Line", icon: LifeBuoy, description: "Represents vitality, physical health, and major life changes. Its length is not an indicator of lifespan.", colorClass: "text-amber-400" },
  { name: "Head Line", icon: Brain, description: "Indicates your intellectual curiosity, learning style, communication, and thirst for knowledge.", colorClass: "text-yellow-300" },
  { name: "Heart Line", icon: Heart, description: "Reveals your emotional stability, romantic perspectives, psychological state, and interpersonal relationships.", colorClass: "text-rose-400" },
  { name: "Fate Line", icon: Star, description: "Shows the impact of external factors on your life path, including career, choices, and life's purpose.", colorClass: "text-orange-400" },
];

const coreServices = [
  { name: "Palm-Astro Reading", icon: Hand, description: "An integrated analysis correlating your palm lines with your astrological chart for a comprehensive life overview.", link: "/palm-input", cta: "Get Your Palm-Astro Reading" },
];

const fadeInUp = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.8, ease: "easeOut" } }
};

const staggerContainer = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.2 }
  }
};

export default function HomePage() {
  const { isAuthenticated, userName } = useAppContext();

  const renderAuthenticatedView = () => (
    <motion.div 
      initial="hidden" 
      animate="visible" 
      variants={staggerContainer} 
      className="w-full max-w-5xl mx-auto space-y-8 sm:space-y-10 relative z-10"
    >
      <motion.section variants={fadeInUp}>
        <h2 className="font-headline text-4xl font-bold text-center mb-8 text-transparent bg-clip-text bg-gradient-to-r from-amber-300 to-orange-400 neon-text">Explore Our Services</h2>
        <div className="grid grid-cols-1 md:grid-cols-1 gap-6">
          {coreServices.map((service) => (
            <Card key={service.name} className="flex flex-col neumorphic-glow hover:-translate-y-2 transition-transform duration-300">
              <CardHeader className="items-center text-center">
                <div className="p-4 neumorphic-pressed rounded-full mb-2 w-fit">
                  <service.icon className="h-10 w-10 text-amber-400" />
                </div>
                <CardTitle className="font-headline text-3xl text-amber-50">{service.name}</CardTitle>
              </CardHeader>
              <CardContent className="flex-grow text-center">
                <p className="text-amber-100/60 text-base mb-4">{service.description}</p>
              </CardContent>
              <CardFooter className="justify-center">
                 <Button asChild className="w-full sm:w-auto bg-gradient-to-r from-amber-600 to-orange-600 hover:from-amber-500 hover:to-orange-500 text-white border-0 shadow-[0_0_15px_rgba(212,175,55,0.4)]">
                    <Link href={service.link}>{service.cta}</Link>
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>
      </motion.section>
    </motion.div>
  );

  return (
    <div className="relative w-full overflow-x-hidden">
      <ParticlesBackground />
      <SunAndPlanets />

      {/* Hero Section — full viewport height */}
      <section className="relative min-h-[100svh] flex items-center justify-center px-4 sm:px-6 lg:px-8 pb-20 md:pb-0">
        <div className="relative z-10 w-full max-w-6xl mx-auto">
          {isAuthenticated ? (
            renderAuthenticatedView()
          ) : (
            <motion.div
              initial="hidden"
              animate="visible"
              variants={staggerContainer}
              className="flex flex-col lg:flex-row items-center justify-center lg:justify-between gap-8 lg:gap-12 w-full"
            >
              {/* Left side: Hero Text */}
              <motion.div variants={fadeInUp} className="relative z-10 w-full lg:flex-1 text-center lg:text-left">
                <motion.h1
                  className="font-headline text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold mb-4 lg:mb-6 text-transparent bg-clip-text bg-gradient-to-r from-amber-300 via-yellow-200 to-amber-300 neon-text"
                  animate={{ backgroundPosition: ["0% 50%", "100% 50%", "0% 50%"] }}
                  transition={{ duration: 5, ease: "linear", repeat: Infinity }}
                  style={{ backgroundSize: "200% 200%" }}
                >
                  Your Destiny in the Stars
                </motion.h1>
                <p className="text-amber-100/70 text-base sm:text-lg md:text-xl mb-6 sm:mb-8 leading-relaxed drop-shadow-md">
                  Discover your life&apos;s cosmic path through an immersive AI correlation of palmistry and astrology. Connect your palm with the constellations.
                </p>
                <Button
                  asChild
                  size="lg"
                  className="w-full sm:w-auto bg-gradient-to-r from-amber-500 to-orange-600 hover:from-amber-400 hover:to-orange-500 text-white text-base sm:text-lg py-5 sm:py-6 px-6 sm:px-8 rounded-full border border-amber-400/50 shadow-[0_0_20px_rgba(212,175,55,0.5)] hover:shadow-[0_0_30px_rgba(212,175,55,0.7)] transition-all duration-300"
                >
                  <Link href="/palm-input">
                    <Sparkles className="mr-2 sm:mr-3 h-5 w-5 sm:h-6 sm:w-6 animate-pulse" /> Get Your Astro-Palm Reading
                  </Link>
                </Button>
              </motion.div>

              {/* Right side: Auth Form */}
              <motion.div variants={fadeInUp} className="w-full lg:max-w-md flex-shrink-0 relative">
                <div className="relative neumorphic p-3 sm:p-4 border-t border-l border-white/5">
                  <AuthOptions />
                </div>
              </motion.div>
            </motion.div>
          )}
        </div>
      </section>

      {/* Cosmic Palm Lines Section */}
      <section className="relative px-4 sm:px-6 lg:px-8 pb-16 sm:pb-20 lg:pb-24">
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-80px" }}
          variants={staggerContainer}
          id="learn-palmistry"
          className="scroll-mt-20 w-full max-w-6xl mx-auto relative z-10"
        >
          <motion.div variants={fadeInUp}>
            <Card className="neumorphic overflow-hidden">
              <CardContent className="p-4 sm:p-6 md:p-8">
                <div className="text-center mb-6 sm:mb-10">
                  <h2 className="font-headline text-2xl sm:text-3xl md:text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-amber-300 to-orange-400 mb-3 sm:mb-4 neon-text">Cosmic Palm Lines</h2>
                  <p className="text-amber-200/50 text-sm sm:text-base">Discover the galaxy hidden within the lines of your hand.</p>
                </div>

                <div className="w-full max-w-md sm:max-w-lg mx-auto mb-6 sm:mb-10 relative group">
                  <div className="absolute inset-0 bg-gradient-to-r from-amber-600 to-orange-600 rounded-full blur-3xl opacity-20 group-hover:opacity-40 transition-opacity duration-500"></div>
                  <Image
                    src="https://picsum.photos/seed/galaxyhand/800/600"
                    alt="Cosmic Hand"
                    width={800}
                    height={600}
                    className="rounded-xl sm:rounded-2xl shadow-2xl neumorphic-pressed object-cover relative z-10 mix-blend-screen"
                    data-ai-hint="glowing wireframe hand with galaxy background"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4 md:gap-6 text-left">
                  {palmLines.map((line) => (
                    <motion.div
                      key={line.name}
                      whileHover={{ scale: 1.02, y: -5 }}
                      className="p-4 sm:p-5 md:p-6 neumorphic-pressed hover:neumorphic-glow transition-all duration-300"
                    >
                      <div className="flex items-center mb-2 sm:mb-3">
                        <div className="p-1.5 sm:p-2 rounded-lg neumorphic mr-2 sm:mr-3">
                          <line.icon className={`h-5 w-5 sm:h-6 sm:w-6 ${line.colorClass}`} />
                        </div>
                        <h3 className="font-headline text-lg sm:text-xl font-semibold text-white">{line.name}</h3>
                      </div>
                      <p className="text-xs sm:text-sm text-amber-100/50 leading-relaxed">{line.description}</p>
                    </motion.div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </motion.div>
      </section>

      {/* Cosmic Artifacts Section */}
      <section className="relative px-4 sm:px-6 lg:px-8 pb-24 sm:pb-28 md:pb-32">
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-80px" }}
          variants={staggerContainer}
          id="spiritual-products"
          className="w-full max-w-6xl mx-auto relative z-10"
        >
          <motion.div variants={fadeInUp}>
            <Card className="neumorphic">
              <CardHeader className="text-center pb-4 sm:pb-6 md:pb-8 px-4 sm:px-6">
                <CardTitle className="font-headline text-2xl sm:text-3xl md:text-4xl text-transparent bg-clip-text bg-gradient-to-r from-amber-300 to-orange-400 neon-text">Cosmic Artifacts</CardTitle>
                <CardDescription className="text-sm sm:text-base md:text-lg text-amber-200/50 mt-2">Enhance your aura with our curated energetic tools.</CardDescription>
              </CardHeader>
              <CardContent className="px-3 sm:px-4 md:px-6">
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 md:gap-8">
                  {productCategories.map((category) => (
                    <motion.div
                      key={category.name}
                      whileHover={{ y: -10 }}
                      className="h-full"
                    >
                      <Card className="overflow-hidden neumorphic flex flex-col h-full hover:neumorphic-glow transition-all duration-300">
                        <div className="relative h-40 sm:h-48 md:h-56 w-full overflow-hidden neumorphic-pressed rounded-t-xl">
                          <Image
                            src={category.imageUrl}
                            alt={category.name}
                            fill
                            className="object-cover transition-transform duration-700 hover:scale-110 opacity-80 mix-blend-lighten"
                            data-ai-hint={category.imageHint}
                          />
                        </div>
                        <CardHeader className="p-3 sm:p-4 md:p-5">
                          <CardTitle className="font-headline text-lg sm:text-xl text-white">{category.name}</CardTitle>
                        </CardHeader>
                        <CardContent className="p-3 sm:p-4 md:p-5 pt-0 flex-grow">
                          <p className="text-amber-100/50 text-xs sm:text-sm">{category.description}</p>
                        </CardContent>
                        <CardFooter className="p-3 sm:p-4 md:p-5 border-t border-white/5 flex-col items-center">
                          <Button variant="outline" className="w-full text-xs sm:text-sm py-2 border-amber-500/40 text-amber-400 hover:bg-amber-500/15 hover:text-amber-300 neumorphic-pressed hover:neumorphic" disabled>
                            Explore Artifact <ArrowRight className="ml-2 h-3.5 w-3.5 sm:h-4 sm:w-4" />
                          </Button>
                        </CardFooter>
                      </Card>
                    </motion.div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </motion.div>
      </section>
    </div>
  );
}
