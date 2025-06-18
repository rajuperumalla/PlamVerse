
"use client";
import { useState, type ChangeEvent, type FormEvent, useEffect, useCallback } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { useAppContext, type ReportPalmInputDetails } from '@/context/AppContext';
import { useToast } from '@/hooks/use-toast';
import { generatePalmReading, type GeneratePalmReadingInput } from '@/ai/flows/generate-palm-reading';
import { Hand, UploadCloud, CalendarDays, MapPin, Clock, UserCircle, ListChecks, Loader2, Sparkles, CreditCard } from 'lucide-react';

const SESSION_STORAGE_KEY = 'palmVerseCheckoutForm';

const PalmInputForm = () => {
  const [leftPalmImageFile, setLeftPalmImageFile] = useState<File | null>(null);
  const [rightPalmImageFile, setRightPalmImageFile] = useState<File | null>(null);
  const [leftPalmPreview, setLeftPalmPreview] = useState<string | null>(null);
  const [rightPalmPreview, setRightPalmPreview] = useState<string | null>(null);
  
  const [dateOfBirth, setDateOfBirth] = useState('');
  const [placeOfBirth, setPlaceOfBirth] = useState('');
  const [timeOfBirth, setTimeOfBirth] = useState('');
  const [dominantHand, setDominantHand] = useState('');
  const [category, setCategory] = useState('');

  const router = useRouter();
  const searchParams = useSearchParams();
  const { 
    startLoading, 
    stopLoading, 
    isLoading, 
    hasPaid, 
    userName,
    createInitialReportPlaceholder,
    updateReportWithGeneratedContent,
    markReportAsGenerationFailed,
  } = useAppContext();
  const { toast } = useToast();

  const handleImageChange = (e: ChangeEvent<HTMLInputElement>, setFile: (file: File | null) => void, setPreview: (url: string | null) => void) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setFile(file); 
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreview(reader.result as string); 
      };
      reader.readAsDataURL(file);
    } else {
        setFile(null);
        setPreview(null);
    }
  };

  const fileToDataUri = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => resolve(reader.result as string);
      reader.onerror = reject;
      reader.readAsDataURL(file);
    });
  };

  const handleSubmitOrProceedToPayment = async () => {
    const reportInputDetails: ReportPalmInputDetails = {
      leftPalmDataUri: leftPalmPreview || undefined,
      rightPalmDataUri: rightPalmPreview || undefined,
      dateOfBirth,
      placeOfBirth,
      timeOfBirth: timeOfBirth || "Not specified",
      dominantHand,
      category,
    };

    // Always save current form state to session storage before payment or submission attempt
    sessionStorage.setItem(SESSION_STORAGE_KEY, JSON.stringify(reportInputDetails));

    if (!hasPaid) {
      // Check if essential fields for *payment proceed* are filled (user might not have uploaded images yet)
      if (!dateOfBirth || !placeOfBirth || !dominantHand || !category) {
         toast({ title: "Missing Information", description: "Please fill in your birth details, dominant hand, and category before proceeding to payment. Images can be uploaded now or after payment.", variant: "destructive" });
         return;
      }
      router.push('/payment'); 
      return;
    }

    // This part executes if hasPaid is true (i.e., manual submission or auto-submit after payment)
    // For actual submission, both images are now strictly required.
    if (!leftPalmImageFile || !rightPalmImageFile || !dateOfBirth || !placeOfBirth || !dominantHand || !category) {
      toast({ title: "Missing Information", description: "Please fill all required fields and upload both palm images to generate your report.", variant: "destructive" });
      return;
    }
    
    sessionStorage.removeItem(SESSION_STORAGE_KEY); 
    startLoading();
    let initialReportId = '';
    try {
      // Use fresh data URIs from files for the AI flow and final storage
      const leftPalmDataUriFromFile = await fileToDataUri(leftPalmImageFile);
      const rightPalmDataUriFromFile = await fileToDataUri(rightPalmImageFile);
      
      const finalReportInputDetails: ReportPalmInputDetails = {
        leftPalmDataUri: leftPalmDataUriFromFile,
        rightPalmDataUri: rightPalmDataUriFromFile,
        dateOfBirth,
        placeOfBirth,
        timeOfBirth: timeOfBirth || "Not specified",
        dominantHand,
        category,
      };

      initialReportId = createInitialReportPlaceholder(finalReportInputDetails);
      toast({ title: "Request Received", description: "Generating your report, please wait...", duration: 5000 });

      const aiFlowInput: GeneratePalmReadingInput = {
        leftPalmDataUri: leftPalmDataUriFromFile,
        rightPalmDataUri: rightPalmDataUriFromFile,
        dateOfBirth,
        placeOfBirth,
        timeOfBirth: timeOfBirth || "Not specified",
        dominantHand,
        category,
      };
      
      const result = await generatePalmReading(aiFlowInput);
      updateReportWithGeneratedContent(initialReportId, result.report);
      toast({ title: "Palm Reading Generated!", description: "Your report is now pending expert review." });
      router.push('/report');
    } catch (error) {
      console.error("Error generating palm reading:", error);
      if (initialReportId) {
        markReportAsGenerationFailed(initialReportId, "Failed to generate palm reading. An unexpected error occurred.");
      }
      toast({ title: "Generation Error", description: "Failed to generate palm reading. Please try again.", variant: "destructive" });
      router.push('/report'); // Redirect to report page to show 'generation_failed' status
    } finally {
      stopLoading();
    }
  };
  
  const onFormSubmit = (e: FormEvent) => {
    e.preventDefault();
    handleSubmitOrProceedToPayment();
  };

  const attemptAutoSubmitAfterPayment = useCallback(async () => {
    if (searchParams.get('payment_success') === 'true' && hasPaid && userName) {
      const persistedFormDataJson = sessionStorage.getItem(SESSION_STORAGE_KEY);
      
      const newParams = new URLSearchParams(searchParams.toString());
      newParams.delete('payment_success');
      router.replace(`/palm-input?${newParams.toString()}`, { scroll: false });

      if (persistedFormDataJson) {
        const persistedData = JSON.parse(persistedFormDataJson) as ReportPalmInputDetails;
        
        // Restore form state for UI consistency, user might need to complete it
        setDateOfBirth(persistedData.dateOfBirth || '');
        setPlaceOfBirth(persistedData.placeOfBirth || '');
        setTimeOfBirth(persistedData.timeOfBirth === "Not specified" ? '' : persistedData.timeOfBirth || '');
        setDominantHand(persistedData.dominantHand || '');
        setCategory(persistedData.category || '');
        setLeftPalmPreview(persistedData.leftPalmDataUri || null); // Previews are Data URIs
        setRightPalmPreview(persistedData.rightPalmDataUri || null);
        // IMPORTANT: Actual File objects (leftPalmImageFile, rightPalmImageFile) cannot be restored from sessionStorage.
        // The user MUST re-select files if they were not selected before payment or if auto-submit needs them.
        // For auto-submit to work seamlessly, left/rightPalmDataUri *must* exist in persistedData.

        if (
          persistedData.leftPalmDataUri &&
          persistedData.rightPalmDataUri && // Check for Data URIs
          persistedData.dateOfBirth &&
          persistedData.placeOfBirth &&
          persistedData.dominantHand &&
          persistedData.category
        ) {
          sessionStorage.removeItem(SESSION_STORAGE_KEY);
          startLoading();
          let initialReportId = '';
          try {
            initialReportId = createInitialReportPlaceholder(persistedData);
            toast({ title: "Payment Successful", description: "Generating your report, please wait...", duration: 5000 });

            const aiFlowInput: GeneratePalmReadingInput = {
              leftPalmDataUri: persistedData.leftPalmDataUri, // Use persisted Data URI
              rightPalmDataUri: persistedData.rightPalmDataUri, // Use persisted Data URI
              dateOfBirth: persistedData.dateOfBirth,
              placeOfBirth: persistedData.placeOfBirth,
              timeOfBirth: persistedData.timeOfBirth || "Not specified",
              dominantHand: persistedData.dominantHand,
              category: persistedData.category,
            };

            const result = await generatePalmReading(aiFlowInput);
            updateReportWithGeneratedContent(initialReportId, result.report);
            toast({ title: "Palm Reading Generated!", description: "Your report is now pending expert review." });
            router.push('/report');
          } catch (error) {
            console.error("Error auto-generating palm reading:", error);
             if (initialReportId) {
               markReportAsGenerationFailed(initialReportId, "Failed to auto-generate palm reading after payment.");
             }
            toast({ title: "Auto-Generation Error", description: "Failed to auto-generate. Please verify details and submit manually.", variant: "destructive" });
            router.push('/report');
          } finally {
            if(isLoading) stopLoading(); // Ensure loading stops if not already
          }
        } else {
          toast({ title: "Payment Successful", description: "Please complete any missing fields and upload images if necessary, then click 'Generate Palm Reading'." });
          if (isLoading) stopLoading(); 
        }
      } else {
        toast({ title: "Payment Successful", description: "Please fill your details to generate the report." });
         if (isLoading) stopLoading();
      }
    }
  }, [searchParams, hasPaid, router, toast, startLoading, stopLoading, createInitialReportPlaceholder, updateReportWithGeneratedContent, markReportAsGenerationFailed, isLoading, userName]);

  useEffect(() => {
    attemptAutoSubmitAfterPayment();
  }, [attemptAutoSubmitAfterPayment]);

  const renderImagePreview = (previewUrl: string | null, palmName: string, dataAiHint: string) => (
    <div className="w-full h-48 border-2 border-dashed rounded-lg flex items-center justify-center bg-muted/50 relative overflow-hidden">
      {previewUrl ? (
        <Image src={previewUrl} alt={`${palmName} preview`} layout="fill" objectFit="contain" />
      ) : (
        <div className="text-center text-muted-foreground">
          <UploadCloud className="mx-auto h-12 w-12 mb-2" />
          <p>Upload {palmName} Image</p>
          <p className="text-xs">(Max 5MB, JPG/PNG)</p>
        </div>
      )}
       {!previewUrl && <Image src={`https://placehold.co/300x200.png`} data-ai-hint={dataAiHint} alt={`${palmName} placeholder`} layout="fill" objectFit="cover" className="opacity-20" />}
    </div>
  );

  // Determine if manual submission is ready (all fields + files if payment done)
  const isReadyForManualSubmit = 
    leftPalmImageFile && 
    rightPalmImageFile && 
    dateOfBirth && 
    placeOfBirth && 
    dominantHand && 
    category;

  // Determine if ready to proceed to payment (key fields filled, images optional at this stage)
  const isReadyForPayment = 
    dateOfBirth && 
    placeOfBirth && 
    dominantHand && 
    category;

  return (
    <div className="flex justify-center items-center py-8">
      <Card className="w-full max-w-2xl shadow-xl animate-fade-in">
        <CardHeader className="text-center">
           <div className="mx-auto bg-primary/10 p-3 rounded-full w-fit mb-4">
            <Hand className="h-10 w-10 text-primary" />
          </div>
          <CardTitle className="font-headline text-3xl">Enter Your Palm Details</CardTitle>
          <CardDescription>Provide your information to generate a personalized palm reading.</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={onFormSubmit} className="space-y-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label htmlFor="leftPalm" className="text-base flex items-center gap-2"><UploadCloud className="h-5 w-5 text-primary"/>Left Palm Image *</Label>
                {renderImagePreview(leftPalmPreview, "Left Palm", "palm hand")}
                <Input id="leftPalm" type="file" accept="image/jpeg, image/png" onChange={(e) => handleImageChange(e, setLeftPalmImageFile, setLeftPalmPreview)} className="mt-2 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-primary/10 file:text-primary hover:file:bg-primary/20"/>
              </div>
              <div className="space-y-2">
                <Label htmlFor="rightPalm" className="text-base flex items-center gap-2"><UploadCloud className="h-5 w-5 text-primary"/>Right Palm Image *</Label>
                {renderImagePreview(rightPalmPreview, "Right Palm", "palm hand")}
                <Input id="rightPalm" type="file" accept="image/jpeg, image/png" onChange={(e) => handleImageChange(e, setRightPalmImageFile, setRightPalmPreview)} className="mt-2 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-primary/10 file:text-primary hover:file:bg-primary/20"/>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label htmlFor="dob" className="text-base flex items-center gap-2"><CalendarDays className="h-5 w-5 text-primary"/>Date of Birth *</Label>
                <Input id="dob" type="date" value={dateOfBirth} onChange={(e) => setDateOfBirth(e.target.value)}  />
              </div>
              <div className="space-y-2">
                <Label htmlFor="tob" className="text-base flex items-center gap-2"><Clock className="h-5 w-5 text-primary"/>Time of Birth (Optional)</Label>
                <Input id="tob" type="time" value={timeOfBirth} onChange={(e) => setTimeOfBirth(e.target.value)} />
              </div>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="pob" className="text-base flex items-center gap-2"><MapPin className="h-5 w-5 text-primary"/>Place of Birth *</Label>
              <Textarea id="pob" value={placeOfBirth} onChange={(e) => setPlaceOfBirth(e.target.value)} placeholder="e.g., City, Country"  />
            </div>


            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label htmlFor="dominantHand" className="text-base flex items-center gap-2"><UserCircle className="h-5 w-5 text-primary"/>Dominant Hand *</Label>
                <Select onValueChange={setDominantHand} value={dominantHand} >
                  <SelectTrigger id="dominantHand">
                    <SelectValue placeholder="Select your dominant hand" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Left">Left</SelectItem>
                    <SelectItem value="Right">Right</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="category" className="text-base flex items-center gap-2"><ListChecks className="h-5 w-5 text-primary"/>Reading Category *</Label>
                <Select onValueChange={setCategory} value={category} >
                  <SelectTrigger id="category">
                    <SelectValue placeholder="Select a category" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="General Personality">General Personality</SelectItem>
                    <SelectItem value="Health and Wellness">Health and Wellness</SelectItem>
                    <SelectItem value="Love and relationships">Love and Relationships</SelectItem>
                    <SelectItem value="Career and Finances">Career and Finances</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            
            <Button 
              type="submit" 
              className="w-full text-lg py-6 mt-8" 
              disabled={isLoading || (hasPaid && !isReadyForManualSubmit) || (!hasPaid && !isReadyForPayment)}
            >
              {isLoading ? (
                <><Loader2 className="mr-2 h-5 w-5 animate-spin" /> Processing...</>
              ) : (
                hasPaid ? <><Sparkles className="mr-2 h-5 w-5" /> Generate Palm Reading</> : <><CreditCard className="mr-2 h-5 w-5" /> Proceed to Payment</>
              )}
            </Button>
            <p className="text-xs text-muted-foreground text-center">* Required fields</p>
          </form>
        </CardContent>
         <CardFooter className="mt-4">
          <p className="text-xs text-muted-foreground text-center w-full">
            Your information is used solely for generating your palm reading. Payment is required for report generation.
          </p>
        </CardFooter>
      </Card>
    </div>
  );
};

export default PalmInputForm;

