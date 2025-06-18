
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
import { useAppContext } from '@/context/AppContext';
import { useToast } from '@/hooks/use-toast';
import { generatePalmReading, type GeneratePalmReadingInput } from '@/ai/flows/generate-palm-reading';
import { Hand, UploadCloud, CalendarDays, MapPin, Clock, UserCircle, ListChecks, Loader2, Sparkles, CreditCard } from 'lucide-react';

const SESSION_STORAGE_KEY = 'palmVerseCheckoutForm';

const PalmInputForm = () => {
  const [leftPalmImage, setLeftPalmImage] = useState<File | null>(null);
  const [rightPalmImage, setRightPalmImage] = useState<File | null>(null);
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
    generateNewReport, 
    startLoading, 
    stopLoading, 
    isLoading, 
    hasPaid, 
    clearReport 
  } = useAppContext();
  const { toast } = useToast();

  const handleImageChange = (e: ChangeEvent<HTMLInputElement>, setImage: (file: File | null) => void, setPreview: (url: string | null) => void) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setImage(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    } else {
        setImage(null);
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

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();

    if (!hasPaid) {
      // Save current form state (complete or not) to sessionStorage before redirecting to payment
      const formDataToPersist = {
        dateOfBirth,
        placeOfBirth,
        timeOfBirth,
        dominantHand,
        category,
        leftPalmPreview, // This is the Data URI string
        rightPalmPreview, // This is the Data URI string
      };
      sessionStorage.setItem(SESSION_STORAGE_KEY, JSON.stringify(formDataToPersist));
      
      // Optionally, inform the user if they proceed to payment with an incomplete form.
      // For now, we just proceed as per streamlining request.
      // if (!leftPalmImage || !rightPalmImage || !dateOfBirth || !placeOfBirth || !dominantHand || !category) {
      //   toast({ title: "Proceeding to Payment", description: "Some information may be missing. You can complete it after payment if needed.", variant: "default" });
      // } else {
      //   toast({ title: "Proceeding to Payment", description: "Your information has been saved."});
      // }
      router.push('/payment'); 
      return; // Return after redirecting
    }

    // This part executes if hasPaid is true (i.e., manual submission after returning from payment with incomplete data, or some other edge case)
    if (!leftPalmImage || !rightPalmImage || !dateOfBirth || !placeOfBirth || !dominantHand || !category) {
      toast({ title: "Missing Information", description: "Please fill all required fields and upload both palm images.", variant: "destructive" });
      return;
    }
    
    // Clear session storage as we are performing a manual submission that supersedes any persisted auto-submit data.
    sessionStorage.removeItem(SESSION_STORAGE_KEY); 
    
    clearReport(); 
    startLoading();
    try {
      const leftPalmDataUriFromFile = await fileToDataUri(leftPalmImage);
      const rightPalmDataUriFromFile = await fileToDataUri(rightPalmImage);

      const input: GeneratePalmReadingInput = {
        leftPalmDataUri: leftPalmDataUriFromFile,
        rightPalmDataUri: rightPalmDataUriFromFile,
        dateOfBirth,
        placeOfBirth,
        timeOfBirth: timeOfBirth || "Not specified",
        dominantHand,
        category,
      };

      const result = await generatePalmReading(input);
      generateNewReport(result.report); 
      toast({ title: "Palm Reading Generated!", description: "Your report is now pending expert review." });
      router.push('/report');
    } catch (error) {
      console.error("Error generating palm reading:", error);
      toast({ title: "Error", description: "Failed to generate palm reading. Please try again.", variant: "destructive" });
    } finally {
      stopLoading();
    }
  };

  const attemptAutoSubmit = useCallback(async () => {
    if (searchParams.get('payment_success') === 'true' && hasPaid) {
      const persistedFormDataJson = sessionStorage.getItem(SESSION_STORAGE_KEY);
      
      const newParams = new URLSearchParams(searchParams.toString());
      newParams.delete('payment_success');
      router.replace(`${router.pathname}?${newParams.toString()}`, { scroll: false });

      if (persistedFormDataJson) {
        const persistedData = JSON.parse(persistedFormDataJson);
        // We've retrieved the data, so remove it from session storage to prevent reuse on refresh if auto-submit fails.
        sessionStorage.removeItem(SESSION_STORAGE_KEY); 

        // Restore form state for UI consistency, regardless of auto-submit outcome
        setDateOfBirth(persistedData.dateOfBirth || '');
        setPlaceOfBirth(persistedData.placeOfBirth || '');
        setTimeOfBirth(persistedData.timeOfBirth || '');
        setDominantHand(persistedData.dominantHand || '');
        setCategory(persistedData.category || '');
        setLeftPalmPreview(persistedData.leftPalmPreview || null);
        setRightPalmPreview(persistedData.rightPalmPreview || null);
        // File objects (leftPalmImage, rightPalmImage) are not restored here.
        // Auto-submission will use the persisted Data URIs (leftPalmPreview, rightPalmPreview).

        if (
          persistedData.leftPalmPreview &&
          persistedData.rightPalmPreview &&
          persistedData.dateOfBirth &&
          persistedData.placeOfBirth && // Not checking timeOfBirth as it's optional
          persistedData.dominantHand &&
          persistedData.category
        ) {
          toast({ title: "Payment Successful", description: "Generating your report..." });
          clearReport();
          startLoading();
          try {
            const input: GeneratePalmReadingInput = {
              leftPalmDataUri: persistedData.leftPalmPreview,
              rightPalmDataUri: persistedData.rightPalmPreview,
              dateOfBirth: persistedData.dateOfBirth,
              placeOfBirth: persistedData.placeOfBirth,
              timeOfBirth: persistedData.timeOfBirth || "Not specified",
              dominantHand: persistedData.dominantHand,
              category: persistedData.category,
            };

            const result = await generatePalmReading(input);
            generateNewReport(result.report);
            router.push('/report');
          } catch (error) {
            console.error("Error auto-generating palm reading:", error);
            toast({ title: "Auto-Generation Error", description: "Failed to auto-generate. Please verify details and submit manually.", variant: "destructive" });
             // Stop loading on error so user can interact with the form
            stopLoading();
          } 
          // No finally here for stopLoading, as successful navigation means component unmounts.
          // Error case handles stopLoading. If more logic added, reconsider.
        } else {
          toast({ title: "Payment Successful", description: "Please complete any missing fields (images will need re-upload if not previously selected) and submit." });
          // User needs to manually submit, isLoading should be false.
          if (isLoading) stopLoading(); 
        }
      } else {
        toast({ title: "Payment Successful", description: "Please fill your details to generate the report." });
         if (isLoading) stopLoading();
      }
    }
  }, [searchParams, hasPaid, router, toast, clearReport, startLoading, stopLoading, generateNewReport, isLoading,
      setDateOfBirth, setPlaceOfBirth, setTimeOfBirth, setDominantHand, setCategory, setLeftPalmPreview, setRightPalmPreview]);

  useEffect(() => {
    attemptAutoSubmit();
  }, [attemptAutoSubmit]);

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
          <form onSubmit={handleSubmit} className="space-y-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label htmlFor="leftPalm" className="text-base flex items-center gap-2"><UploadCloud className="h-5 w-5 text-primary"/>Left Palm Image</Label>
                {renderImagePreview(leftPalmPreview, "Left Palm", "palm hand")}
                <Input id="leftPalm" type="file" accept="image/jpeg, image/png" onChange={(e) => handleImageChange(e, setLeftPalmImage, setLeftPalmPreview)} className="mt-2 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-primary/10 file:text-primary hover:file:bg-primary/20"/>
              </div>
              <div className="space-y-2">
                <Label htmlFor="rightPalm" className="text-base flex items-center gap-2"><UploadCloud className="h-5 w-5 text-primary"/>Right Palm Image</Label>
                {renderImagePreview(rightPalmPreview, "Right Palm", "palm hand")}
                <Input id="rightPalm" type="file" accept="image/jpeg, image/png" onChange={(e) => handleImageChange(e, setRightPalmImage, setRightPalmPreview)} className="mt-2 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-primary/10 file:text-primary hover:file:bg-primary/20"/>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label htmlFor="dob" className="text-base flex items-center gap-2"><CalendarDays className="h-5 w-5 text-primary"/>Date of Birth</Label>
                <Input id="dob" type="date" value={dateOfBirth} onChange={(e) => setDateOfBirth(e.target.value)}  />
              </div>
              <div className="space-y-2">
                <Label htmlFor="tob" className="text-base flex items-center gap-2"><Clock className="h-5 w-5 text-primary"/>Time of Birth (Optional)</Label>
                <Input id="tob" type="time" value={timeOfBirth} onChange={(e) => setTimeOfBirth(e.target.value)} />
              </div>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="pob" className="text-base flex items-center gap-2"><MapPin className="h-5 w-5 text-primary"/>Place of Birth</Label>
              <Textarea id="pob" value={placeOfBirth} onChange={(e) => setPlaceOfBirth(e.target.value)} placeholder="e.g., City, Country"  />
            </div>


            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label htmlFor="dominantHand" className="text-base flex items-center gap-2"><UserCircle className="h-5 w-5 text-primary"/>Dominant Hand</Label>
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
                <Label htmlFor="category" className="text-base flex items-center gap-2"><ListChecks className="h-5 w-5 text-primary"/>Reading Category</Label>
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
            
            <Button type="submit" className="w-full text-lg py-6 mt-8" disabled={isLoading}>
              {isLoading ? (
                <><Loader2 className="mr-2 h-5 w-5 animate-spin" /> Generating Report...</>
              ) : (
                hasPaid ? <><Sparkles className="mr-2 h-5 w-5" /> Generate Palm Reading</> : <><CreditCard className="mr-2 h-5 w-5" /> Proceed to Payment</>
              )}
            </Button>
          </form>
        </CardContent>
         <CardFooter className="mt-4">
          <p className="text-xs text-muted-foreground text-center w-full">
            Your information is used solely for generating your palm reading. Payment is required.
          </p>
        </CardFooter>
      </Card>
    </div>
  );
};

export default PalmInputForm;
