
"use client";
import { useEffect, useState, Suspense, useCallback } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Image from 'next/image';
import PalmInputForm from '@/components/palm-reading/PalmInputForm';
import { useAppContext, type ReportPalmInputDetails } from '@/context/AppContext';
import { Loader2, Sparkles, ArrowRight, Search } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import { generatePalmReading, type GeneratePalmReadingInput } from '@/ai/flows/generate-palm-reading';
import { useToast } from '@/hooks/use-toast';

const productCategories = [
  { name: "Crystal Bracelets", description: "Harness the energy of natural crystals for balance and healing.", imageUrl: "https://placehold.co/400x300.png", imageHint: "crystal bracelet", link: "/products#crystal-bracelets" },
  { name: "Gemstones", description: "Discover the power of authentic gemstones for well-being.", imageUrl: "https://placehold.co/400x300.png", imageHint: "gemstone collection", link: "/products#gemstones" },
  { name: "Pooja Essentials", description: "All you need for your sacred rituals and pooja.", imageUrl: "https://placehold.co/400x300.png", imageHint: "pooja items", link: "/products#pooja-essentials" },
  { name: "Rudrakshas", description: "Authentic Rudraksha beads for spiritual well-being.", imageUrl: "https://placehold.co/400x300.png", imageHint: "rudraksha beads", link: "/products#rudrakshas" },
  { name: "Yantras", description: "Invite prosperity and protection with sacred geometric yantras.", imageUrl: "https://placehold.co/400x300.png", imageHint: "sacred yantra", link: "/products#yantras" },
];

const readingTypes = [
  { name: "General Personality", query: "General Personality", description: "Understand your core traits, strengths, potential challenges, and overall life outlook." },
  { name: "Career & Finance", query: "Career & Finance", description: "Gain insights into suitable career paths, financial tendencies, work style, and opportunities for growth." },
  { name: "Health & Wellness", query: "Health & Wellness", description: "Discover indications about your vitality levels, potential sensitivities, and wellness practices that support your well-being." },
  { name: "Marriage & Relationships", query: "Marriage & Relationships", description: "Explore your emotional style in relationships, partnership dynamics, and potential strengths or challenges in connections." },
  { name: "Comprehensive Analysis", query: "Comprehensive Analysis", description: "Receive a holistic view combining insights from all major areas of life, including personality, career, health, and relationships." },
];

function PalmInputPageComponent() {
  const {
    isAuthenticated,
    isInitializing,
    hasPaid,
    setHasPaid,
    userName,
    startOperation,
    stopOperation,
    isOperationInProgress,
    createInitialReportPlaceholder,
    updateReportWithGeneratedContent,
    markReportAsGenerationFailed
  } = useAppContext();
  const { toast } = useToast();
  const router = useRouter();
  const searchParams = useSearchParams();
  const [authCheckComplete, setAuthCheckComplete] = useState(false);

  const categoryFromQuery = searchParams ? searchParams.get('category') : null;
  const selectedReadingType = readingTypes.find(rt => rt.query === categoryFromQuery);
  const isValidCategorySelected = !!selectedReadingType;
  const categoryDescription = selectedReadingType?.description;

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

  const handlePaidSubmission = useCallback(async (formData: ReportPalmInputDetails) => {
    startOperation();
    let initialReportId = '';
    try {
      initialReportId = createInitialReportPlaceholder(formData);
      
      const aiFlowInput: GeneratePalmReadingInput = {
        frontPalmDataUri: formData.frontPalmDataUri!,
        sidePalmDataUri: formData.sidePalmDataUri!,
        dateOfBirth: formData.dateOfBirth,
        placeOfBirth: formData.placeOfBirth,
        timeOfBirth: formData.timeOfBirth || "Not specified",
        dominantHand: formData.dominantHand,
        category: formData.category,
      };

      const result = await generatePalmReading(aiFlowInput);
      updateReportWithGeneratedContent(initialReportId, result.report);

      toast({
        title: "Request Submitted for Review",
        description: "Your palm reading information has been sent to our experts. Your report will be available in 'My Reading' once ready.",
        duration: 5000
      });
      router.push('/');
    } catch (error) {
      console.error("Error generating palm reading:", error);
      const errorMessage = error instanceof Error ? error.message : "An unknown error occurred during generation.";
      if (initialReportId) {
        markReportAsGenerationFailed(initialReportId, `Manual submission failed: ${errorMessage}`);
      }
      toast({ title: "Generation Error", description: `An issue occurred. Please try submitting again.`, variant: "destructive" });
      router.push('/');
    } finally {
      setHasPaid(false);
      sessionStorage.removeItem('palmVerseCheckoutForm');
      if (isOperationInProgress) stopOperation();
    }
  }, [userName, startOperation, stopOperation, createInitialReportPlaceholder, updateReportWithGeneratedContent, markReportAsGenerationFailed, setHasPaid, router, toast, isOperationInProgress]);

  const handleFormSubmit = (formData: ReportPalmInputDetails) => {
    try {
        sessionStorage.setItem('palmVerseCheckoutForm', JSON.stringify(formData));
    } catch (error) {
        toast({ title: "Image Too Large", description: "An uploaded image is too large. Please use smaller image files (under 5MB).", variant: "destructive"});
        console.error("Session storage error:", error);
        return;
    }

    if (!hasPaid) {
      const returnPath = `/palm-input${formData.category ? `?category=${encodeURIComponent(formData.category)}` : ''}`;
      router.push(`/payment?service_type=palmistry&return_path=${encodeURIComponent(returnPath)}`);
    } else {
      handlePaidSubmission(formData);
    }
  };

  const attemptAutoSubmitAfterPayment = useCallback(async () => {
    if (searchParams && searchParams.get('payment_success') === 'true' && hasPaid && userName) {
      const persistedFormDataJson = sessionStorage.getItem('palmVerseCheckoutForm');
      
      const newParams = new URLSearchParams(searchParams.toString());
      newParams.delete('payment_success');
      router.replace(`/palm-input?${newParams.toString()}`, { scroll: false });

      if (persistedFormDataJson) {
        const persistedData = JSON.parse(persistedFormDataJson) as ReportPalmInputDetails;
        
        const canAutoSubmit = persistedData.frontPalmDataUri &&
                              persistedData.sidePalmDataUri &&
                              persistedData.dateOfBirth &&
                              persistedData.placeOfBirth &&
                              persistedData.dominantHand &&
                              persistedData.category;

        if (canAutoSubmit) {
          await handlePaidSubmission(persistedData);
        } else {
          toast({
            title: "Payment Successful",
            description: "Please complete your details on the form and submit when ready.",
            duration: 5000
          });
          router.push('/');
        }
      } else {
        toast({
          title: "Payment Successful",
          description: "We couldn't find your form data. Please fill out the form again to submit.",
          duration: 5000
        });
        router.push('/');
      }
    }
  }, [searchParams, hasPaid, userName, router, toast, handlePaidSubmission]);

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

  return (
    <div className="relative space-y-8 md:space-y-10">
      <div className="relative z-10">
        {isValidCategorySelected ? (
          <>
            <PalmInputForm
              categoryFromQuery={categoryFromQuery}
              categoryDescription={categoryDescription}
              onSubmit={handleFormSubmit}
              hasPaid={hasPaid}
            />
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
          <div className="text-center py-10 md:py-16">
            <Card className="max-w-2xl mx-auto shadow-xl bg-card/80 backdrop-blur-sm border-border">
              <CardHeader className="items-center">
                <div className="p-3 bg-primary/10 rounded-full mb-3">
                    <Search className="h-12 w-12 text-primary" />
                </div>
                <CardTitle className="font-headline text-3xl md:text-4xl text-primary">Explore Your Chosen Path</CardTitle>
                <CardDescription className="text-lg text-muted-foreground mt-2">
                    Begin your journey of self-discovery.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <p className="text-muted-foreground text-md md:text-lg">
                  Select a specific reading type from the "Palmistry" menu or a service from the "Numerology" menu in the main header to provide your details and receive personalized insights.
                </p>
                <div className="w-full max-w-lg mx-auto">
                  <Image
                    src="https://placehold.co/600x400.png"
                    alt="Palmistry Overview"
                    width={600}
                    height={400}
                    className="rounded-lg shadow-lg border border-border object-cover"
                    data-ai-hint="palm hand"
                  />
                </div>
                <p className="text-sm text-muted-foreground">
                  Each line on your palm, or number in your life, tells a unique story. Our AI, guided by ancient wisdom, helps you understand yours.
                </p>
              </CardContent>
              <CardFooter>
                <p className="text-xs text-muted-foreground text-center w-full">
                    Choose a category from the main header menu to proceed.
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
