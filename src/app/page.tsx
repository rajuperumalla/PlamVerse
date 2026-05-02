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
  { name: "Life Line", icon: LifeBuoy, description: "Represents vitality, physical health, and major life changes. Its length is not an indicator of lifespan.", colorClass: "text-red-400" },
  { name: "Head Line", icon: Brain, description: "Indicates your intellectual curiosity, learning style, communication, and thirst for knowledge.", colorClass: "text-blue-400" },
  { name: "Heart Line", icon: Heart, description: "Reveals your emotional stability, romantic perspectives, psychological state, and interpersonal relationships.", colorClass: "text-pink-400" },
  { name: "Fate Line", icon: Star, description: "Shows the impact of external factors on your life path, including career, choices, and life's purpose.", colorClass: "text-purple-400" },
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
      className="w-full max-w-5xl space-y-10 relative z-10"
    >
      <motion.section variants={fadeInUp}>
        <h2 className="font-headline text-4xl font-bold text-center mb-8 text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-cyan-400 neon-text">Explore Our Services</h2>
        <div className="grid grid-cols-1 md:grid-cols-1 gap-6">
          {coreServices.map((service) => (
            <Card key={service.name} className="flex flex-col neumorphic-glow hover:-translate-y-2 transition-transform duration-300">
              <CardHeader className="items-center text-center">
                <div className="p-4 neumorphic-pressed rounded-full mb-2 w-fit">
                  <service.icon className="h-10 w-10 text-cyan-400" />
                </div>
                <CardTitle className="font-headline text-3xl text-purple-100">{service.name}</CardTitle>
              </CardHeader>
              <CardContent className="flex-grow text-center">
                <p className="text-gray-300 text-base mb-4">{service.description}</p>
              </CardContent>
              <CardFooter className="justify-center">
                 <Button asChild className="w-full sm:w-auto bg-gradient-to-r from-purple-600 to-cyan-600 hover:from-purple-500 hover:to-cyan-500 text-white border-0 shadow-[0_0_15px_rgba(6,182,212,0.5)]">
                    <Link href={`${service.link}?category=Comprehensive%20Analysis`}>{service.cta}</Link>
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>
      </motion.section>
    </motion.div>
  );

  return (
    <div className="relative flex flex-col items-center justify-center py-8 md:py-12 space-y-12 min-h-[calc(100vh_-_var(--header-height)_-_var(--footer-height)_-_1rem)] overflow-hidden">
      <ParticlesBackground />
      <SunAndPlanets />
      
      <div className="relative z-10 w-full max-w-5xl px-4 mt-8">
        {isAuthenticated ? (
          renderAuthenticatedView()
        ) : (
          <motion.div 
            initial="hidden"
            animate="visible"
            variants={staggerContainer}
            className="flex flex-col lg:flex-row items-center justify-center lg:justify-between gap-10 lg:gap-16 w-full"
          >
            {/* Left side: Hero Text */}
            <motion.div variants={fadeInUp} className="relative z-10 w-full max-w-xl text-center lg:text-left">
              <motion.h1 
                className="font-headline text-5xl md:text-6xl font-bold mb-6 text-transparent bg-clip-text bg-gradient-to-r from-purple-400 via-cyan-400 to-purple-400 neon-text"
                animate={{ backgroundPosition: ["0% 50%", "100% 50%", "0% 50%"] }}
                transition={{ duration: 5, ease: "linear", repeat: Infinity }}
                style={{ backgroundSize: "200% 200%" }}
              >
                Your Destiny in the Stars
              </motion.h1>
              <p className="text-gray-300 text-lg md:text-xl mb-8 leading-relaxed drop-shadow-md">
                Discover your life's cosmic path through an immersive AI correlation of palmistry and astrology. Connect your palm with the constellations.
              </p>
              <Button
                asChild
                size="lg"
                className="bg-gradient-to-r from-cyan-500 to-purple-600 hover:from-cyan-400 hover:to-purple-500 text-white text-lg py-6 px-8 rounded-full border border-cyan-400/50 shadow-[0_0_20px_rgba(6,182,212,0.6)] hover:shadow-[0_0_30px_rgba(168,85,247,0.8)] transition-all duration-300"
              >
                <Link href="/palm-input?category=Comprehensive%20Analysis">
                  <Sparkles className="mr-3 h-6 w-6 animate-pulse" /> Get Your Astro-Palm Reading
                </Link>
              </Button>
            </motion.div>

            {/* Right side: Auth Form */}
            <motion.div variants={fadeInUp} className="w-full lg:max-w-md flex-shrink-0 relative">
              <div className="relative neumorphic p-4 border-t border-l border-white/5">
                <AuthOptions />
              </div>
            </motion.div>
          </motion.div>
        )}

        {/* Constellation Palm Section */}
        <motion.section 
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          variants={staggerContainer}
          id="learn-palmistry" 
          className="scroll-mt-20 mt-24 relative z-10"
        >
          <motion.div variants={fadeInUp}>
            <Card className="neumorphic overflow-hidden">
              <CardContent className="p-8">
                <div className="text-center mb-10">
                  <h2 className="font-headline text-3xl md:text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-purple-400 mb-4 neon-text">Cosmic Palm Lines</h2>
                  <p className="text-gray-400">Discover the galaxy hidden within the lines of your hand.</p>
                </div>
                
                <div className="w-full max-w-lg mx-auto mb-10 relative group">
                  <div className="absolute inset-0 bg-gradient-to-r from-purple-600 to-cyan-600 rounded-full blur-3xl opacity-20 group-hover:opacity-40 transition-opacity duration-500"></div>
                  <Image
                    src="https://picsum.photos/seed/galaxyhand/800/600"
                    alt="Cosmic Hand"
                    width={800}
                    height={600}
                    className="rounded-2xl shadow-2xl neumorphic-pressed object-cover relative z-10 mix-blend-screen"
                    data-ai-hint="glowing wireframe hand with galaxy background"
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-left">
                  {palmLines.map((line, index) => (
                    <motion.div 
                      key={line.name} 
                      whileHover={{ scale: 1.02, y: -5 }}
                      className="p-6 neumorphic-pressed hover:neumorphic-glow transition-all duration-300"
                    >
                      <div className="flex items-center mb-3">
                        <div className={`p-2 rounded-lg neumorphic mr-3`}>
                          <line.icon className={`h-6 w-6 ${line.colorClass}`} />
                        </div>
                        <h3 className="font-headline text-xl font-semibold text-white">{line.name}</h3>
                      </div>
                      <p className="text-sm text-gray-400 leading-relaxed">{line.description}</p>
                    </motion.div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </motion.section>

        <motion.section 
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          variants={staggerContainer}
          id="spiritual-products" 
          className="mt-24 relative z-10"
        >
          <motion.div variants={fadeInUp}>
            <Card className="neumorphic">
              <CardHeader className="text-center pb-8">
                <CardTitle className="font-headline text-3xl md:text-4xl text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-cyan-400 neon-text">Cosmic Artifacts</CardTitle>
                <CardDescription className="text-base md:text-lg text-gray-400 mt-2">Enhance your aura with our curated energetic tools.</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8">
                  {productCategories.map((category, i) => (
                    <motion.div 
                      key={category.name} 
                      whileHover={{ y: -10 }}
                      className="h-full"
                    >
                      <Card className="overflow-hidden neumorphic flex flex-col h-full hover:neumorphic-glow transition-all duration-300">
                        <div className="relative h-56 w-full overflow-hidden neumorphic-pressed m-2 rounded-t-xl">
                          <Image
                            src={category.imageUrl}
                            alt={category.name}
                            fill
                            className="object-cover transition-transform duration-700 hover:scale-110 opacity-80 mix-blend-lighten"
                            data-ai-hint={category.imageHint}
                          />
                        </div>
                        <CardHeader className="p-5">
                          <CardTitle className="font-headline text-xl text-white">{category.name}</CardTitle>
                        </CardHeader>
                        <CardContent className="p-5 pt-0 flex-grow">
                          <p className="text-gray-400 text-sm">{category.description}</p>
                        </CardContent>
                        <CardFooter className="p-5 border-t border-white/5 flex-col items-center">
                          <Button variant="outline" className="w-full text-sm py-2 border-cyan-500/50 text-cyan-400 hover:bg-cyan-500/20 hover:text-cyan-300 neumorphic-pressed hover:neumorphic" disabled>
                            Explore Artifact <ArrowRight className="ml-2 h-4 w-4" />
                          </Button>
                        </CardFooter>
                      </Card>
                    </motion.div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </motion.section>
      </div>
    </div>
  );
}
