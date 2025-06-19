
"use client";
import { useState, type FormEvent, useEffect, useCallback } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { useAppContext, type ReportNumerologyInputDetails_PersonalReport } from '@/context/AppContext';
import { useToast } from '@/hooks/use-toast';
import { UserCircle, CalendarDays, Clock, Loader2, Sparkles, CreditCard } from 'lucide-react';
import Image from 'next/image';

const SESSION_STORAGE_KEY_PERSONAL_REPORT = 'palmVersePersonalLifePathCheckoutForm';
const SERVICE_QUERY = 'life-path-report';

const PersonalLifePathReportForm = () => {
  const [fullName, setFullName] = useState('');
  const [dateOfBirth, setDateOfBirth] = useState('');
  const [timeOfBirth, setTimeOfBirth] = useState('');

  const router = useRouter();
  const searchParams = useSearchParams();
  const {
    startOperation,
    stopOperation,
    isOperationInProgress,
    hasPaid,
    userName,
    createInitialNumerologyReportPlaceholder,
  } = useAppContext();
  const { toast } = useToast();

  const areRequiredFieldsFilled = () => {
    return fullName && dateOfBirth;
  };

  const handleSubmitOrProceedToPayment = async () => {
    const reportInputDetails: ReportNumerologyInputDetails_PersonalReport = {
      serviceQuery: SERVICE_QUERY,
      fullName,
      dateOfBirth,
      timeOfBirth: timeOfBirth || undefined,
    };

    sessionStorage.setItem(SESSION_STORAGE_KEY_PERSONAL_REPORT, JSON.stringify(reportInputDetails));

    if (!hasPaid) {
      if (!areRequiredFieldsFilled()) {
        toast({ title: "Missing Information", description: "Please fill all required fields (Full Name, Date of Birth) before proceeding.", variant: "destructive" });
        return;
      }
      const returnPath = `/numerology-input?service=${SERVICE_QUERY}`;
      router.push(`/payment?service_type=numerology&return_path=${encodeURIComponent(returnPath)}`);
      return;
    }

    // Post-payment submission logic
    if (!areRequiredFieldsFilled()) {
      toast({ title: "Missing Information", description: "Please fill all required fields to generate your report.", variant: "destructive" });
      return;
    }

    sessionStorage.removeItem(SESSION_STORAGE_KEY_PERSONAL_REPORT);
    startOperation();
    try {
      createInitialNumerologyReportPlaceholder(reportInputDetails, SERVICE_QUERY);
      toast({ title: "Numerology Request Received", description: "Your report is being prepared and will be available under 'My Reading'. Redirecting to Home...", duration: 5000 });
      router.push('/');
    } catch (error) {
      console.error("Error creating personal life path report placeholder:", error);
      toast({ title: "Request Error", description: "Failed to submit your numerology request. Please try again.", variant: "destructive" });
    } finally {
      stopOperation();
    }
  };

  const onFormSubmit = (e: FormEvent) => {
    e.preventDefault();
    handleSubmitOrProceedToPayment();
  };

  const attemptAutoSubmitAfterPayment = useCallback(async () => {
    const persistedFormDataJson = sessionStorage.getItem(SESSION_STORAGE_KEY_PERSONAL_REPORT);
    if (persistedFormDataJson) {
        const persistedData = JSON.parse(persistedFormDataJson) as ReportNumerologyInputDetails_PersonalReport;
        setFullName(persistedData.fullName || '');
        setDateOfBirth(persistedData.dateOfBirth || '');
        setTimeOfBirth(persistedData.timeOfBirth || '');
    }
  }, []);

  useEffect(() => {
    attemptAutoSubmitAfterPayment();
  }, [attemptAutoSubmitAfterPayment]);
  
  let finalButtonDisabled = isOperationInProgress;
  if (hasPaid) {
    if (!areRequiredFieldsFilled()) {
      finalButtonDisabled = true;
    }
  }


  return (
    <div className="flex justify-center items-center py-8">
      <Card className="w-full max-w-xl shadow-xl animate-fade-in relative overflow-hidden">
        <div className="absolute inset-0 z-0 opacity-[0.03] pointer-events-none">
            <Image
            src="https://placehold.co/800x900.png"
            alt="Subtle Numerology Background"
            layout="fill"
            objectFit="cover"
            data-ai-hint="spiritual path symbols"
            />
        </div>
        <div className="relative z-10">
            <CardHeader className="text-center">
            <div className="mx-auto bg-primary/10 p-3 rounded-full w-fit mb-4">
                <UserCircle className="h-10 w-10 text-primary" />
            </div>
            <CardTitle className="font-headline text-3xl">Personal Life Path & Destiny Report</CardTitle>
            <CardDescription>Enter your birth details to uncover insights into your life's journey.</CardDescription>
            </CardHeader>
            <CardContent>
            <form onSubmit={onFormSubmit} className="space-y-8">
                <div className="space-y-2">
                    <Label htmlFor="fullName" className="text-base flex items-center gap-2"><UserCircle className="h-5 w-5 text-primary"/>Full Name (as per official documents) *</Label>
                    <Input id="fullName" type="text" value={fullName} onChange={(e) => setFullName(e.target.value)} placeholder="e.g., John Michael Doe" disabled={isOperationInProgress} required />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                        <Label htmlFor="dateOfBirth" className="text-base flex items-center gap-2"><CalendarDays className="h-5 w-5 text-primary"/>Date of Birth *</Label>
                        <Input id="dateOfBirth" type="date" value={dateOfBirth} onChange={(e) => setDateOfBirth(e.target.value)} disabled={isOperationInProgress} required />
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="timeOfBirth" className="text-base flex items-center gap-2"><Clock className="h-5 w-5 text-primary"/>Time of Birth (Optional)</Label>
                        <Input id="timeOfBirth" type="time" value={timeOfBirth} onChange={(e) => setTimeOfBirth(e.target.value)} disabled={isOperationInProgress}/>
                        <p className="text-xs text-muted-foreground">If known, providing time of birth can enhance report accuracy.</p>
                    </div>
                </div>
                
                <Button 
                    type="submit" 
                    className="w-full text-lg py-6 mt-8" 
                    disabled={finalButtonDisabled}
                    title={!areRequiredFieldsFilled() && !hasPaid ? "Please fill all required fields first" : (hasPaid && !areRequiredFieldsFilled() ? "Please fill all required fields to generate" : "")}
                >
                    {isOperationInProgress ? ( 
                        <><Loader2 className="mr-2 h-5 w-5 animate-spin" /> Processing...</>
                    ) : (
                        hasPaid ? <><Sparkles className="mr-2 h-5 w-5" /> Generate Personal Report</> : <><CreditCard className="mr-2 h-5 w-5" /> Proceed to Payment</>
                    )}
                </Button>
                <p className="text-xs text-muted-foreground text-center">* Required fields.</p>
            </form>
            </CardContent>
            <CardFooter className="mt-4">
            <p className="text-xs text-muted-foreground text-center w-full">
                Your information is used solely for generating your numerology report. Payment is required.
            </p>
            </CardFooter>
        </div>
      </Card>
    </div>
  );
};

export default PersonalLifePathReportForm;

