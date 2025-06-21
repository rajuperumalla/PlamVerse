
"use client";
import { useState, type FormEvent, useEffect, useCallback } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { useAppContext, type ReportNumerologyInputDetails_Business } from '@/context/AppContext';
import { useToast } from '@/hooks/use-toast';
import { Briefcase, User, CalendarDays, Clock, Loader2, Sparkles, CreditCard } from 'lucide-react';
import Image from 'next/image';

const SESSION_STORAGE_KEY_BUSINESS_NUMEROLOGY = 'palmVerseBusinessNumerologyCheckoutForm';
const SERVICE_QUERY = 'business-name-calculator';

interface BusinessNumerologyFormProps {
  serviceDescription?: string;
}

const BusinessNumerologyForm = ({ serviceDescription }: BusinessNumerologyFormProps) => {
  const [businessName, setBusinessName] = useState('');
  const [additionalBusinessNames, setAdditionalBusinessNames] = useState('');
  const [founderFullName, setFounderFullName] = useState('');
  const [founderDOB, setFounderDOB] = useState('');
  const [founderTOB, setFounderTOB] = useState('');

  const router = useRouter();
  const {
    startOperation,
    stopOperation,
    isOperationInProgress,
    hasPaid,
    setHasPaid,
    createInitialNumerologyReportPlaceholder,
  } = useAppContext();
  const { toast } = useToast();

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();

    if (!businessName || !founderFullName || !founderDOB) {
      toast({ title: "Missing Information", description: "Please fill all required fields (Business Name, Founder's Name, Founder's DOB).", variant: "destructive" });
      return;
    }

    const reportInputDetails: ReportNumerologyInputDetails_Business = {
      serviceQuery: SERVICE_QUERY,
      businessName,
      additionalBusinessNames: additionalBusinessNames || undefined,
      founderFullName,
      founderDOB,
      founderTOB: founderTOB || undefined,
    };

    sessionStorage.setItem(SESSION_STORAGE_KEY_BUSINESS_NUMEROLOGY, JSON.stringify(reportInputDetails));

    if (!hasPaid) {
      const returnPath = `/numerology-input?service=${SERVICE_QUERY}`;
      router.push(`/payment?service_type=numerology&return_path=${encodeURIComponent(returnPath)}`);
      return;
    }

    // Post-payment submission logic
    startOperation();
    try {
      createInitialNumerologyReportPlaceholder(reportInputDetails, SERVICE_QUERY);
      setHasPaid(false); // Consume payment token
      sessionStorage.removeItem(SESSION_STORAGE_KEY_BUSINESS_NUMEROLOGY);
      toast({ title: "Numerology Request Received", description: "Your report is being prepared and will be available under 'My Reading'. Redirecting to Home...", duration: 5000 });
      router.push('/');
    } catch (error) {
      console.error("Error creating numerology report placeholder:", error);
      toast({ title: "Request Error", description: "Failed to submit your numerology request. Please try again.", variant: "destructive" });
    } finally {
      stopOperation();
    }
  };

  const loadPersistedData = useCallback(() => {
    const persistedFormDataJson = sessionStorage.getItem(SESSION_STORAGE_KEY_BUSINESS_NUMEROLOGY);
    if (persistedFormDataJson) {
        const persistedData = JSON.parse(persistedFormDataJson) as ReportNumerologyInputDetails_Business;
        setBusinessName(persistedData.businessName || '');
        setAdditionalBusinessNames(persistedData.additionalBusinessNames || '');
        setFounderFullName(persistedData.founderFullName || '');
        setFounderDOB(persistedData.founderDOB || '');
        setFounderTOB(persistedData.founderTOB || '');
    }
  }, []);

  useEffect(() => {
    loadPersistedData();
  }, [loadPersistedData]);
  
  return (
    <div className="flex justify-center items-center py-8">
      <Card className="w-full max-w-2xl shadow-xl animate-fade-in relative overflow-hidden">
        <div className="absolute inset-0 z-0 opacity-[0.03] pointer-events-none">
            <Image
            src="https://placehold.co/800x1000.png"
            alt="Subtle Numerology Background"
            layout="fill"
            objectFit="cover"
            data-ai-hint="numbers digits background"
            />
        </div>
        <div className="relative z-10">
            <CardHeader className="text-center">
            <div className="mx-auto bg-primary/10 p-3 rounded-full w-fit mb-4">
                <Briefcase className="h-10 w-10 text-primary" />
            </div>
            <CardTitle className="font-headline text-3xl">Business Name Numerology Calculator</CardTitle>
            <CardDescription>{serviceDescription || "Enter details for your business name analysis."}</CardDescription>
            </CardHeader>
            <CardContent>
            <form onSubmit={handleSubmit} className="space-y-8">
                <div className="space-y-2">
                    <Label htmlFor="businessName" className="text-base flex items-center gap-2"><Briefcase className="h-5 w-5 text-primary"/>Primary Business Name *</Label>
                    <Input id="businessName" type="text" value={businessName} onChange={(e) => setBusinessName(e.target.value)} placeholder="e.g., PalmVerse Dynamics" disabled={isOperationInProgress} required />
                </div>

                <div className="space-y-2">
                    <Label htmlFor="additionalBusinessNames" className="text-base flex items-center gap-2"><Briefcase className="h-5 w-5 text-primary"/>Additional Business Names/Variations (Optional)</Label>
                    <Textarea id="additionalBusinessNames" value={additionalBusinessNames} onChange={(e) => setAdditionalBusinessNames(e.target.value)} placeholder="Enter other names you are considering, one per line" disabled={isOperationInProgress} rows={3} />
                </div>
                
                <div className="space-y-2">
                    <Label htmlFor="founderFullName" className="text-base flex items-center gap-2"><User className="h-5 w-5 text-primary"/>Founder's Full Name (as per official documents) *</Label>
                    <Input id="founderFullName" type="text" value={founderFullName} onChange={(e) => setFounderFullName(e.target.value)} placeholder="e.g., Jane Mary Doe" disabled={isOperationInProgress} required />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                        <Label htmlFor="founderDOB" className="text-base flex items-center gap-2"><CalendarDays className="h-5 w-5 text-primary"/>Founder's Date of Birth *</Label>
                        <Input id="founderDOB" type="date" value={founderDOB} onChange={(e) => setFounderDOB(e.target.value)} disabled={isOperationInProgress} required />
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="founderTOB" className="text-base flex items-center gap-2"><Clock className="h-5 w-5 text-primary"/>Founder's Time of Birth (Optional)</Label>
                        <Input id="founderTOB" type="time" value={founderTOB} onChange={(e) => setFounderTOB(e.target.value)} disabled={isOperationInProgress}/>
                    </div>
                </div>
                
                <Button 
                    type="submit" 
                    className="w-full text-lg py-6 mt-8" 
                    disabled={isOperationInProgress}
                >
                    {isOperationInProgress ? ( 
                        <><Loader2 className="mr-2 h-5 w-5 animate-spin" /> Processing...</>
                    ) : (
                        <><Sparkles className="mr-2 h-5 w-5" /> Generate Report</>
                    )}
                </Button>
                <p className="text-xs text-muted-foreground text-center">* Required fields.</p>
            </form>
            </CardContent>
            <CardFooter className="mt-4">
            <p className="text-xs text-muted-foreground text-center w-full">
                Your information is used solely for generating your numerology report. Payment may be required.
            </p>
            </CardFooter>
        </div>
      </Card>
    </div>
  );
};

export default BusinessNumerologyForm;
