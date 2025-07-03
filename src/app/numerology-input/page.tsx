
"use client";
import { useEffect, useState, Suspense, useCallback } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { useAppContext, type ReportNumerologyInputDetails_Business, type ReportNumerologyInputDetails_BabyName, type ReportNumerologyInputDetails_PersonalReport } from '@/context/AppContext';
import { Loader2, Calculator, Search } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import BusinessNumerologyForm from '@/components/numerology/BusinessNumerologyForm';
import BabyNameNumerologyForm from '@/components/numerology/BabyNameNumerologyForm'; 
import PersonalLifePathReportForm from '@/components/numerology/PersonalLifePathReportForm';
import { useToast } from '@/hooks/use-toast';


const numerologyServicesConst = [
  { name: "Business Name Numerology Calculator", query: "business-name-calculator", description: "Helps entrepreneurs choose or correct business names for success, financial growth, and brand attraction." },
  { name: "Baby Name Numerology", query: "baby-name-numerology", description: "Guides parents to choose harmonious names based on the child’s date of birth." },
  { name: "Personal Life Path & Destiny Report", query: "life-path-report", description: "In-depth report based on birth date and full name; reveals life purpose, strengths, and career alignment." },
  { name: "Name Correction & Compatibility Checker", query: "name-correction", description: "Suggests spellings or name changes to align better with the individual’s vibration for better outcomes." },
  { name: "House Number / Address Compatibility", query: "address-compatibility", description: "Checks if your home or flat number supports your personal energy; offers remedies if it doesn't." },
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
    setHasPaid,
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
  const [isProcessingPayment, setIsProcessingPayment] = useState(false);


  const serviceQuery = searchParams ? searchParams.get('service') : null;
  const selectedService = numerologyServicesConst.find(s => s.query === serviceQuery);

  useEffect(() => {
    if (!isInitializing) {
      if (!isAuthenticated) {
        const redirectPath = window.location.pathname + window.location.search;
        sessionStorage.setItem('palmverse_redirectAfterLogin', redirectPath);
        router.push('/');
      } else {
        setAuthCheckComplete(true);
      }
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
          const proposedNamesArray = Array.isArray(data.proposedNames) ? data.proposedNames : (typeof data.proposedNames === 'string' ? data.proposedNames.split('\\n').map(name => name.trim()).filter(name => name.length > 0) : []);
          canAutoSubmit = !!(proposedNamesArray.length > 0 && data.childDOB);
        } else if (serviceQuery === 'life-path-report') {
          const data = persistedData as ReportNumerologyInputDetails_PersonalReport;
          canAutoSubmit = !!(data.fullName && data.dateOfBirth);
        }

        if (canAutoSubmit) {
          setIsProcessingPayment(true);
          startOperation();
          try {
            createInitialNumerologyReportPlaceholder(persistedData, serviceQuery); 
            toast({ title: "Numerology Request Received", description: "Your report is being prepared and will be available under 'My Reading'.", duration: 5000 });
            router.push('/');
          } catch (error) {
            console.error(`Error auto-submitting ${serviceQuery} request:`, error);
            toast({ title: "Auto-Submission Error", description: "Failed to automatically submit your request. Please review and submit manually.", variant: "destructive" });
            setIsProcessingPayment(false); 
          } finally {
            setHasPaid(false); 
            sessionStorage.removeItem(storageKey);
            if(isOperationInProgress) stopOperation();
          }
        } else {
          setIsProcessingPayment(false);
          toast({
            title: "Payment Successful",
            description: "Your payment was processed. Please complete your details on the form and submit when ready.",
            duration: 5000
          });
        }
      } else {
        setIsProcessingPayment(false);
        toast({
          title: "Payment Successful",
          description: "Your payment was processed, but we couldn't find your form data. Please fill out the form again to submit.",
          duration: 5000
        });
      }
    }
  }, [searchParams, hasPaid, setHasPaid, userName, serviceQuery, router, toast, startOperation, stopOperation, createInitialNumerologyReportPlaceholder, isOperationInProgress]);

  useEffect(() => {
    if (authCheckComplete) {
      attemptAutoSubmitAfterPayment();
    }
  }, [authCheckComplete, attemptAutoSubmitAfterPayment]);


  if (isInitializing || !authCheckComplete) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[calc(100vh-200px)]">
        <Loader2 className="h-12 w-12 animate-spin text-primary mb-4" />
        <p className="text-muted-foreground">Loading page data...</p>
      </div>
    );
  }

  if (isProcessingPayment) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[calc(100vh-200px)]">
        <Loader2 className="h-12 w-12 animate-spin text-primary mb-4" />
        <p className="text-muted-foreground">Payment successful! Preparing your report...</p>
        <p className="text-sm text-muted-foreground mt-2">Please wait, you will be redirected shortly.</p>
      </div>
    );
  }

  const renderForm = () => {
    if (!selectedService) {
      return (
        <div className="text-center py-10 md:py-16">
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
                Please select a specific numerology service from the main "Numerology" menu above to get started.
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
          <div className="text-center py-10 md:py-16">
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
      {/* Background image removed */}
      <div className="relative z-10">
        {/* Navigation menu has been moved to Header.tsx and SubHeaderNavigation is removed */}
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
