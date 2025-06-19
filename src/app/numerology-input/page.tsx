
"use client";
import { useEffect, useState, Suspense, useCallback } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { useAppContext, type ReportNumerologyInputDetails_Business, type ReportNumerologyInputDetails_BabyName, type ReportNumerologyInputDetails_PersonalReport } from '@/context/AppContext';
import { Loader2, Handshake, BookOpen, Calculator, ChevronDown, Search, ShoppingBag } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import BusinessNumerologyForm from '@/components/numerology/BusinessNumerologyForm';
import BabyNameNumerologyForm from '@/components/numerology/BabyNameNumerologyForm'; 
import PersonalLifePathReportForm from '@/components/numerology/PersonalLifePathReportForm';
import { useToast } from '@/hooks/use-toast';

const readingTypes = [
  { name: "General Personality", query: "General Personality" },
  { name: "Career & Finance", query: "Career & Finance" },
  { name: "Health & Wellness", query: "Health & Wellness" },
  { name: "Marriage & Relationships", query: "Marriage & Relationships" },
  { name: "Comprehensive Analysis", query: "Comprehensive Analysis" },
];

const numerologyServicesConst = [
  { name: "Business Name Numerology Calculator", query: "business-name-calculator", description: "Helps entrepreneurs choose or correct business names for success, financial growth, and brand attraction." },
  { name: "Baby Name Numerology", query: "baby-name-numerology", description: "Guides parents to choose harmonious names based on the child’s date of birth." },
  { name: "Personal Life Path & Destiny Report", query: "life-path-report", description: "In-depth report based on birth date and full name; reveals life purpose, strengths, and career alignment." },
  { name: "Name Correction & Compatibility Checker", query: "name-correction", description: "Suggests spellings or name changes to align better with the individual’s vibration for better outcomes." },
  { name: "House Number / Address Compatibility", query: "address-compatibility", description: "Checks if your home or flat number supports your personal energy; offers remedies if it doesn't." },
];

const productMenuItems = [
  { name: "Crystal Bracelets", link: "#products/crystal-bracelets" },
  { name: "Gemstones", link: "#products/gemstones" },
  { name: "Pooja Essentials", link: "#products/pooja-essentials" },
  { name: "Rudrakshas", link: "#products/rudrakshas" },
  { name: "Yantras", link: "#products/yantras" },
];

const SESSION_STORAGE_KEYS = {
  'business-name-calculator': 'palmVerseBusinessNumerologyCheckoutForm',
  'baby-name-numerology': 'palmVerseBabyNameNumerologyCheckoutForm',
  'life-path-report': 'palmVersePersonalLifePathCheckoutForm',
  // Add other keys as new forms are implemented
};


function NumerologyInputPageComponent() {
  const { 
    isAuthenticated, 
    isInitializing, 
    hasPaid, 
    userName, 
    startOperation, 
    stopOperation, 
    isOperationInProgress, 
    createInitialNumerologyReportPlaceholder 
  } = useAppContext();
  const router = useRouter();
  const searchParams = useSearchParams();
  const { toast } = useToast();
  const [authCheckComplete, setAuthCheckComplete] = useState(false);

  const serviceQuery = searchParams ? searchParams.get('service') : null;
  const selectedService = numerologyServicesConst.find(s => s.query === serviceQuery);

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

  const attemptAutoSubmitAfterPayment = useCallback(async () => {
    if (searchParams && searchParams.get('payment_success') === 'true' && hasPaid && userName && serviceQuery) {
      const storageKey = SESSION_STORAGE_KEYS[serviceQuery as keyof typeof SESSION_STORAGE_KEYS];
      if (!storageKey) {
        toast({ title: "Error", description: "Invalid service type for auto-submission.", variant: "destructive" });
        return;
      }
      const persistedFormDataJson = sessionStorage.getItem(storageKey);
      
      const currentSearchParamsString = searchParams.toString();
      const newParams = new URLSearchParams(currentSearchParamsString);
      newParams.delete('payment_success'); 
      router.replace(`/numerology-input?${newParams.toString()}`, { scroll: false });

      if (persistedFormDataJson) {
        const persistedData = JSON.parse(persistedFormDataJson); 
        
        let canAutoSubmit = false;
        if (serviceQuery === 'business-name-calculator') {
          const data = persistedData as ReportNumerologyInputDetails_Business;
          canAutoSubmit = !!(data.businessName && data.founderFullName && data.founderDOB);
        } else if (serviceQuery === 'baby-name-numerology') {
          const data = persistedData as ReportNumerologyInputDetails_BabyName;
          const proposedNamesArray = Array.isArray(data.proposedNames) ? data.proposedNames : (typeof data.proposedNames === 'string' ? data.proposedNames.split('\n').map(name => name.trim()).filter(name => name.length > 0) : []);
          canAutoSubmit = !!(proposedNamesArray.length > 0 && data.childDOB);
        } else if (serviceQuery === 'life-path-report') {
          const data = persistedData as ReportNumerologyInputDetails_PersonalReport;
          canAutoSubmit = !!(data.fullName && data.dateOfBirth);
        }
        // Add more conditions for other forms

        if (canAutoSubmit) {
          sessionStorage.removeItem(storageKey);
          startOperation();
          try {
            createInitialNumerologyReportPlaceholder(persistedData, serviceQuery); 
            toast({ title: "Numerology Request Received", description: "Your report is being prepared and will be available under 'My Reading'. Redirecting to Home...", duration: 5000 });
            router.push('/');
          } catch (error) {
            console.error(`Error auto-submitting ${serviceQuery} request:`, error);
            toast({ title: "Auto-Submission Error", description: "Failed to automatically submit your request. Please review and submit manually.", variant: "destructive" });
          } finally {
            if(isOperationInProgress) stopOperation();
          }
        } else {
          toast({ title: "Payment Successful", description: "Please complete any missing fields and then click 'Generate Report'." });
        }
      } else {
        toast({ title: "Payment Successful", description: "Please fill your details to generate the report." });
      }
    }
  }, [searchParams, hasPaid, userName, serviceQuery, router, toast, startOperation, stopOperation, createInitialNumerologyReportPlaceholder, isOperationInProgress]);

  useEffect(() => {
    attemptAutoSubmitAfterPayment();
  }, [attemptAutoSubmitAfterPayment]);


  if (isInitializing || !authCheckComplete) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[calc(100vh-200px)]">
        <Loader2 className="h-12 w-12 animate-spin text-primary mb-4" />
        <p className="text-muted-foreground">Loading page data...</p>
      </div>
    );
  }

  const isNumerologyActive = !!selectedService;

  const renderForm = () => {
    if (!selectedService) {
      return (
        <div className="text-center py-10 md:py-16 mt-8">
          <Card className="max-w-2xl mx-auto shadow-xl bg-card/80 backdrop-blur-sm border-border">
            <CardHeader className="items-center">
              <div className="p-3 bg-primary/10 rounded-full mb-3">
                <Calculator className="h-12 w-12 text-primary" />
              </div>
              <CardTitle className="font-headline text-3xl md:text-4xl text-primary">
                Numerology Services
              </CardTitle>
              <CardDescription className="text-lg text-muted-foreground mt-2">
                Unlock insights through the power of numbers.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <p className="text-muted-foreground text-md md:text-lg">
                Please select a specific numerology service from the "Numerology" menu above to get started.
              </p>
            </CardContent>
            <CardFooter>
              <p className="text-xs text-muted-foreground text-center w-full">
                Numerology services provide guidance based on ancient numerical wisdom.
              </p>
            </CardFooter>
          </Card>
        </div>
      );
    }

    switch(selectedService.query) {
      case 'business-name-calculator':
        return <BusinessNumerologyForm serviceDescription={selectedService.description} />;
      case 'baby-name-numerology':
        return <BabyNameNumerologyForm serviceDescription={selectedService.description} />;
      case 'life-path-report':
        return <PersonalLifePathReportForm serviceDescription={selectedService.description} />;
      default:
        return (
          <div className="text-center py-10 md:py-16 mt-8">
            <Card className="max-w-2xl mx-auto shadow-xl bg-card/80 backdrop-blur-sm border-border">
              <CardHeader className="items-center">
                <div className="p-3 bg-primary/10 rounded-full mb-3">
                    <Calculator className="h-12 w-12 text-primary" />
                </div>
                <CardTitle className="font-headline text-3xl md:text-4xl text-primary">
                  {selectedService.name}
                </CardTitle>
                <CardDescription className="text-lg text-muted-foreground mt-2">
                  {selectedService.description}
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <p className="text-muted-foreground text-md md:text-lg">
                  The input form for {selectedService.name} will be implemented soon.
                </p>
                <div className="w-full max-w-lg mx-auto">
                  <Image 
                    src="https://placehold.co/600x400.png" 
                    alt={`${selectedService.name} illustration`}
                    width={600} 
                    height={400} 
                    className="rounded-lg shadow-lg border border-border object-cover"
                    data-ai-hint={selectedService.query === 'business-name-calculator' ? "business chart graph" : (selectedService.query === 'baby-name-numerology' ? "baby stars moon" : (selectedService.query === 'life-path-report' ? "spiritual journey path" : "numerology chart symbols"))}
                  />
                </div>
              </CardContent>
              <CardFooter>
                <p className="text-xs text-muted-foreground text-center w-full">
                  Numerology services provide guidance based on ancient numerical wisdom.
                </p>
              </CardFooter>
            </Card>
          </div>
        );
    }
  };


  return (
    <div className="relative space-y-8 md:space-y-10">
      <div className="absolute inset-0 z-0 opacity-[0.03] pointer-events-none">
        <Image
          src="https://placehold.co/1920x1080.png"
          alt="Sacred Geometry Page Background"
          layout="fill"
          objectFit="cover"
          data-ai-hint="sacred geometry patterns"
        />
      </div>
      <div className="relative z-10">
        <nav aria-label="Main navigation">
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
                    className={`transition-colors px-2 py-1 rounded-md flex items-center text-foreground hover:text-primary hover:bg-primary/5 focus:bg-primary/10`}
                  >
                    <Handshake className="inline-block mr-1 h-4 w-4 align-middle" /> Palmistry <ChevronDown className="ml-1 h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="center" className="bg-background border-primary/30 shadow-xl">
                  {readingTypes.map((type) => (
                    <DropdownMenuItem key={type.query} asChild className="cursor-pointer hover:bg-primary/10 w-full">
                      <Link href={`/palm-input?category=${encodeURIComponent(type.query)}`} className="w-full text-foreground">
                        {type.name}
                      </Link>
                    </DropdownMenuItem>
                  ))}
                </DropdownMenuContent>
              </DropdownMenu>
            </li>
            <li>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button
                    variant="ghost"
                    className={`transition-colors px-2 py-1 rounded-md flex items-center hover:bg-primary/5 focus:bg-primary/10 ${isNumerologyActive ? 'font-semibold text-transparent bg-clip-text bg-gradient-to-r from-accent via-primary to-accent animate-shimmer bg-[length:200%_100%] ring-1 ring-primary/50 bg-primary/10' : 'text-foreground hover:text-primary'}`}
                  >
                    <Calculator className="inline-block mr-1 h-4 w-4 align-middle" /> Numerology <ChevronDown className="ml-1 h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="center" className="bg-background border-primary/30 shadow-xl">
                  {numerologyServicesConst.map((service) => (
                    <DropdownMenuItem key={service.query} asChild className="cursor-pointer hover:bg-primary/10 w-full">
                      <Link href={`/numerology-input?service=${encodeURIComponent(service.query)}`} className="w-full text-foreground">
                        {service.name}
                      </Link>
                    </DropdownMenuItem>
                  ))}
                </DropdownMenuContent>
              </DropdownMenu>
            </li>
            <li>
              <Link href="/report" className={`transition-colors px-2 py-1 rounded-md text-foreground hover:text-primary`}>
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
                      <Link href={item.link} className="w-full text-foreground">
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

        {renderForm()}
      </div>
    </div>
  );
}

export default function NumerologyInputPage() {
  return (
    <Suspense fallback={
      <div className="flex flex-col items-center justify-center min-h-[calc(100vh-200px)]">
        <Loader2 className="h-12 w-12 animate-spin text-primary mb-4" />
        <p className="text-muted-foreground">Loading Numerology Page...</p>
      </div>
    }>
      <NumerologyInputPageComponent />
    </Suspense>
  );
}

