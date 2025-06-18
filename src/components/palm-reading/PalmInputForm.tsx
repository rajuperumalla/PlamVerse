
"use client";
import { useState, type ChangeEvent, type FormEvent, useEffect } from 'react';
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
  const { setReportContent, startLoading, stopLoading, isLoading, hasPaid, clearReport } = useAppContext();
  const { toast } = useToast();

  // If returning from payment, and it was successful, try to submit.
  useEffect(() => {
    if (searchParams.get('payment_success') === 'true' && hasPaid) {
        // Attempt to resubmit the form, assumes data is still in state.
        // A more robust solution would temporarily store form data (e.g. sessionStorage)
        // before redirecting to payment.
        const canSubmit = leftPalmImage && rightPalmImage && dateOfBirth && placeOfBirth && dominantHand && category;
        if (canSubmit) {
            toast({ title: "Payment Successful", description: "Generating your report..." });
            handleSubmit(new Event('submit') as unknown as FormEvent, true); // bypass payment check
        } else {
            toast({ title: "Payment Successful", description: "Please re-fill any missing fields and submit again." });
        }
    }
  }, [searchParams, hasPaid]);


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

  const handleSubmit = async (e: FormEvent, bypassPaymentCheck = false) => {
    e.preventDefault();
    if (!leftPalmImage || !rightPalmImage || !dateOfBirth || !placeOfBirth || !dominantHand || !category) {
      toast({ title: "Missing Information", description: "Please fill all required fields and upload both palm images.", variant: "destructive" });
      return;
    }

    if (!hasPaid && !bypassPaymentCheck) {
      // Store form data if needed, then redirect
      // For simplicity, we're not storing form data across redirects here. User will need to re-fill.
      // A real app would store this temporarily (e.g., session storage).
      toast({ title: "Payment Required", description: "Please complete payment to generate your report."});
      router.push('/payment'); // Pass current form data as query params if small, or store in context/sessionStorage
      return;
    }
    
    clearReport(); // Clear any previous report before generating a new one
    startLoading();
    try {
      const leftPalmDataUri = await fileToDataUri(leftPalmImage);
      const rightPalmDataUri = await fileToDataUri(rightPalmImage);

      const input: GeneratePalmReadingInput = {
        leftPalmDataUri,
        rightPalmDataUri,
        dateOfBirth,
        placeOfBirth,
        timeOfBirth: timeOfBirth || "Not specified",
        dominantHand,
        category,
      };

      const result = await generatePalmReading(input);
      setReportContent(result.report);
      toast({ title: "Palm Reading Generated!", description: "Your report is now pending expert review." });
      router.push('/report');
    } catch (error) {
      console.error("Error generating palm reading:", error);
      toast({ title: "Error", description: "Failed to generate palm reading. Please try again.", variant: "destructive" });
    } finally {
      stopLoading();
    }
  };
  
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
                <Input id="leftPalm" type="file" accept="image/jpeg, image/png" onChange={(e) => handleImageChange(e, setLeftPalmImage, setLeftPalmPreview)} required className="mt-2 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-primary/10 file:text-primary hover:file:bg-primary/20"/>
              </div>
              <div className="space-y-2">
                <Label htmlFor="rightPalm" className="text-base flex items-center gap-2"><UploadCloud className="h-5 w-5 text-primary"/>Right Palm Image</Label>
                {renderImagePreview(rightPalmPreview, "Right Palm", "palm hand")}
                <Input id="rightPalm" type="file" accept="image/jpeg, image/png" onChange={(e) => handleImageChange(e, setRightPalmImage, setRightPalmPreview)} required className="mt-2 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-primary/10 file:text-primary hover:file:bg-primary/20"/>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label htmlFor="dob" className="text-base flex items-center gap-2"><CalendarDays className="h-5 w-5 text-primary"/>Date of Birth</Label>
                <Input id="dob" type="date" value={dateOfBirth} onChange={(e) => setDateOfBirth(e.target.value)} required />
              </div>
              <div className="space-y-2">
                <Label htmlFor="tob" className="text-base flex items-center gap-2"><Clock className="h-5 w-5 text-primary"/>Time of Birth (Optional)</Label>
                <Input id="tob" type="time" value={timeOfBirth} onChange={(e) => setTimeOfBirth(e.target.value)} />
              </div>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="pob" className="text-base flex items-center gap-2"><MapPin className="h-5 w-5 text-primary"/>Place of Birth</Label>
              <Textarea id="pob" value={placeOfBirth} onChange={(e) => setPlaceOfBirth(e.target.value)} placeholder="e.g., City, Country" required />
            </div>


            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label htmlFor="dominantHand" className="text-base flex items-center gap-2"><UserCircle className="h-5 w-5 text-primary"/>Dominant Hand</Label>
                <Select onValueChange={setDominantHand} value={dominantHand} required>
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
                <Select onValueChange={setCategory} value={category} required>
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
