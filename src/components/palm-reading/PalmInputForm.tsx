
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
import { Hand, UploadCloud, CalendarDays, MapPin, Clock, UserCircle, ListChecks, Loader2, Sparkles, CreditCard, Info } from 'lucide-react';

const SESSION_STORAGE_KEY = 'palmVerseCheckoutForm';

const readingCategories = [
  { value: "General Personality", label: "General Personality" },
  { value: "Career & Finance", label: "Career & Finance" },
  { value: "Health & Wellness", label: "Health & Wellness" },
  { value: "Marriage & Relationships", label: "Marriage & Relationships" },
  { value: "Comprehensive Analysis", label: "Comprehensive Analysis" },
];

interface PalmInputFormProps {
  categoryFromQuery: string | null;
  categoryDescription?: string;
}

const PalmInputForm = ({ categoryFromQuery, categoryDescription }: PalmInputFormProps) => {
  const [leftPalmImageFile, setLeftPalmImageFile] = useState<File | null>(null);
  const [rightPalmImageFile, setRightPalmImageFile] = useState<File | null>(null);
  const [leftPalmPreview, setLeftPalmPreview] = useState<string | null>(null);
  const [rightPalmPreview, setRightPalmPreview] = useState<string | null>(null);

  const [dateOfBirth, setDateOfBirth] = useState('');
  const [placeOfBirth, setPlaceOfBirth] = useState('');
  const [timeOfBirth, setTimeOfBirth] = useState('');
  const [dominantHand, setDominantHand] = useState('');
  const [category, setCategory] = useState(categoryFromQuery || '');

  const router = useRouter();
  const searchParams = useSearchParams();
  const {
    startOperation,
    stopOperation,
    isOperationInProgress,
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

    sessionStorage.setItem(SESSION_STORAGE_KEY, JSON.stringify(reportInputDetails));

    if (!hasPaid) {
      if (!category) {
        toast({ title: "Missing Category", description: "Please select a reading category before proceeding to payment.", variant: "destructive" });
        return;
      }
      const returnPath = `/palm-input${category ? `?category=${encodeURIComponent(category)}` : ''}`;
      router.push(`/payment?service_type=palmistry&return_path=${encodeURIComponent(returnPath)}`);
      return;
    }

    if (!leftPalmImageFile || !rightPalmImageFile || !dateOfBirth || !placeOfBirth || !dominantHand || !category) {
      toast({ title: "Missing Information", description: "Please fill all required fields and upload both palm images to generate your report.", variant: "destructive" });
      return;
    }

    sessionStorage.removeItem(SESSION_STORAGE_KEY);
    startOperation();
    let initialReportId = '';
    try {
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
      toast({ title: "Request Received", description: "Your report is being prepared and will be available under 'My Reading'. Redirecting to Home...", duration: 5000 });

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
      router.push('/');
    } catch (error) {
      console.error("Error generating palm reading:", error);
      const errorMessage = error instanceof Error ? error.message : "An unknown error occurred during report generation.";
      if (initialReportId) {
        markReportAsGenerationFailed(initialReportId, `Report generation failed: ${errorMessage}`);
      }
      toast({ title: "Generation Error", description: "Failed to generate palm reading. Please try again.", variant: "destructive" });
      router.push('/');
    } finally {
      stopOperation();
    }
  };

  const onFormSubmit = (e: FormEvent) => {
    e.preventDefault();
    handleSubmitOrProceedToPayment();
  };

  const attemptAutoSubmitAfterPayment = useCallback(async () => {
    if (searchParams && searchParams.get('payment_success') === 'true' && hasPaid && userName) {
      const persistedFormDataJson = sessionStorage.getItem(SESSION_STORAGE_KEY);

      const currentSearchParamsString = searchParams.toString();
      const newParams = new URLSearchParams(currentSearchParamsString);
      newParams.delete('payment_success');

      const basePath = '/palm-input';
      const finalRedirectPath = categoryFromQuery ? `${basePath}?category=${encodeURIComponent(categoryFromQuery)}` : basePath;
      router.replace(finalRedirectPath, { scroll: false });


      if (persistedFormDataJson) {
        const persistedData = JSON.parse(persistedFormDataJson) as ReportPalmInputDetails;

        setDateOfBirth(persistedData.dateOfBirth || '');
        setPlaceOfBirth(persistedData.placeOfBirth || '');
        setTimeOfBirth(persistedData.timeOfBirth === "Not specified" ? '' : persistedData.timeOfBirth || '');
        setDominantHand(persistedData.dominantHand || '');
        setCategory(categoryFromQuery || persistedData.category || '');
        setLeftPalmPreview(persistedData.leftPalmDataUri || null);
        setRightPalmPreview(persistedData.rightPalmDataUri || null);

        if (
          persistedData.leftPalmDataUri &&
          persistedData.rightPalmDataUri &&
          persistedData.dateOfBirth &&
          persistedData.placeOfBirth &&
          persistedData.dominantHand &&
          (categoryFromQuery || persistedData.category)
        ) {
          sessionStorage.removeItem(SESSION_STORAGE_KEY);
          startOperation();
          let initialReportId = '';
          try {
            const finalCategoryForReport = categoryFromQuery || persistedData.category;
            const reportDetailsForPlaceholder: ReportPalmInputDetails = {
                ...persistedData,
                category: finalCategoryForReport!,
            };

            initialReportId = createInitialReportPlaceholder(reportDetailsForPlaceholder);
            toast({ title: "Request Received", description: "Your report is being prepared and will be available under 'My Reading'. Redirecting to Home...", duration: 5000 });

            const aiFlowInput: GeneratePalmReadingInput = {
              leftPalmDataUri: persistedData.leftPalmDataUri,
              rightPalmDataUri: persistedData.rightPalmDataUri,
              dateOfBirth: persistedData.dateOfBirth,
              placeOfBirth: persistedData.placeOfBirth,
              timeOfBirth: persistedData.timeOfBirth || "Not specified",
              dominantHand: persistedData.dominantHand,
              category: finalCategoryForReport!,
            };

            const result = await generatePalmReading(aiFlowInput);
            updateReportWithGeneratedContent(initialReportId, result.report);
            router.push('/');
          } catch (error) {
            console.error("Error auto-generating palm reading:", error);
            const errorMessage = error instanceof Error ? error.message : "An unknown error occurred during auto-generation.";
            if (initialReportId) {
               markReportAsGenerationFailed(initialReportId, `Auto-generation failed after payment: ${errorMessage}`);
            }
            toast({ title: "Auto-Generation Error", description: `An issue occurred while automatically preparing your report. Please try submitting your details again from the palm input page.`, variant: "destructive" });
            router.push('/');
          } finally {
            if(isOperationInProgress) stopOperation();
          }
        } else {
          toast({ title: "Payment Successful", description: "Please complete any missing fields and upload images if necessary, then click 'Generate Palm Reading'." });
          if (isOperationInProgress) stopOperation();
        }
      } else {
        setCategory(categoryFromQuery || '');
        toast({ title: "Payment Successful", description: "Please fill your details to generate the report." });
        if (isOperationInProgress) stopOperation();
      }
    }
  }, [searchParams, hasPaid, userName, router, toast, startOperation, stopOperation, createInitialReportPlaceholder, updateReportWithGeneratedContent, markReportAsGenerationFailed, isOperationInProgress, categoryFromQuery]);


  useEffect(() => {
    attemptAutoSubmitAfterPayment();
  }, [attemptAutoSubmitAfterPayment]);

  const renderImagePreview = (previewUrl: string | null, palmName: string, dataAiHint: string) => (
    <div className="w-full h-48 border-2 border-dashed border-primary/50 rounded-lg flex items-center justify-center bg-muted/50 relative overflow-hidden">
      {previewUrl ? (
        <Image src={previewUrl} alt={`${palmName} preview`} layout="fill" objectFit="contain" data-ai-hint={dataAiHint}/>
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

  const isReadyForManualSubmitAfterPayment =
    leftPalmImageFile &&
    rightPalmImageFile &&
    dateOfBirth &&
    placeOfBirth &&
    dominantHand &&
    category;

  let finalButtonDisabled = isOperationInProgress;
  if (hasPaid) {
    if (!isReadyForManualSubmitAfterPayment) {
      finalButtonDisabled = true;
    }
  }


  return (
    <div className="flex justify-center items-center py-8">
      <Card className="w-full max-w-2xl shadow-xl animate-fade-in relative overflow-hidden">
        <div className="absolute inset-0 z-0 opacity-[0.03] pointer-events-none">
            <Image
            src="https://placehold.co/800x1000.png"
            alt="Subtle Geometry Background"
            layout="fill"
            objectFit="cover"
            data-ai-hint="mandala pattern"
            />
        </div>
        <div className="relative z-10">
            <CardHeader className="text-center">
              <div className="mx-auto bg-primary/10 p-3 rounded-full w-fit mb-4">
                  <Hand className="h-10 w-10 text-primary" />
              </div>
              <CardTitle className="font-headline text-3xl">Palm Reading: {category || "Select Category"}</CardTitle>
              <CardDescription>
                {categoryDescription ? (
                  <span className="block mt-1 text-sm text-accent flex items-start justify-center gap-1.5">
                    <Info className="h-4 w-4 mt-0.5 shrink-0"/>
                    {categoryDescription}
                  </span>
                ) : (
                  "Provide your information to generate a personalized palm reading."
                )}
              </CardDescription>
            </CardHeader>
            <CardContent>
            <form onSubmit={onFormSubmit} className="space-y-8">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                    <Label htmlFor="leftPalm" className="text-base flex items-center gap-2"><UploadCloud className="h-5 w-5 text-primary"/>Left Palm Image *</Label>
                    {renderImagePreview(leftPalmPreview, "Left Palm", "palm hand")}
                    <Input id="leftPalm" type="file" accept="image/jpeg, image/png" onChange={(e) => handleImageChange(e, setLeftPalmImageFile, setLeftPalmPreview)} className="mt-2 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-primary/10 file:text-primary hover:file:bg-primary/20" disabled={isOperationInProgress} required={hasPaid}/>
                </div>
                <div className="space-y-2">
                    <Label htmlFor="rightPalm" className="text-base flex items-center gap-2"><UploadCloud className="h-5 w-5 text-primary"/>Right Palm Image *</Label>
                    {renderImagePreview(rightPalmPreview, "Right Palm", "palm hand")}
                    <Input id="rightPalm" type="file" accept="image/jpeg, image/png" onChange={(e) => handleImageChange(e, setRightPalmImageFile, setRightPalmPreview)} className="mt-2 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-primary/10 file:text-primary hover:file:bg-primary/20" disabled={isOperationInProgress} required={hasPaid}/>
                </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                    <Label htmlFor="dob" className="text-base flex items-center gap-2"><CalendarDays className="h-5 w-5 text-primary"/>Date of Birth *</Label>
                    <Input id="dob" type="date" value={dateOfBirth} onChange={(e) => setDateOfBirth(e.target.value)} disabled={isOperationInProgress} required />
                </div>
                <div className="space-y-2">
                    <Label htmlFor="tob" className="text-base flex items-center gap-2"><Clock className="h-5 w-5 text-primary"/>Time of Birth (Optional)</Label>
                    <Input id="tob" type="time" value={timeOfBirth} onChange={(e) => setTimeOfBirth(e.target.value)} disabled={isOperationInProgress}/>
                </div>
                </div>

                <div className="space-y-2">
                <Label htmlFor="pob" className="text-base flex items-center gap-2"><MapPin className="h-5 w-5 text-primary"/>Place of Birth *</Label>
                <Textarea id="pob" value={placeOfBirth} onChange={(e) => setPlaceOfBirth(e.target.value)} placeholder="e.g., City, Country" disabled={isOperationInProgress} required />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                    <Label htmlFor="dominantHand" className="text-base flex items-center gap-2"><UserCircle className="h-5 w-5 text-primary"/>Dominant Hand *</Label>
                    <Select onValueChange={setDominantHand} value={dominantHand} disabled={isOperationInProgress} required>
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
                    <Select onValueChange={setCategory} value={category} disabled={isOperationInProgress || !!categoryFromQuery} required>
                    <SelectTrigger id="category">
                        <SelectValue placeholder="Select a category" />
                    </SelectTrigger>
                    <SelectContent>
                        {readingCategories.map(rc => (
                            <SelectItem key={rc.value} value={rc.value}>{rc.label}</SelectItem>
                        ))}
                    </SelectContent>
                    </Select>
                </div>
                </div>

                <Button
                type="submit"
                className="w-full text-lg py-6 mt-8"
                disabled={finalButtonDisabled}
                >
                {isOperationInProgress ? (
                    <><Loader2 className="mr-2 h-5 w-5 animate-spin" /> Processing...</>
                ) : (
                    hasPaid ? <><Sparkles className="mr-2 h-5 w-5" /> Generate Palm Reading</> : <><CreditCard className="mr-2 h-5 w-5" /> Proceed to Payment</>
                )}
                </Button>
                <p className="text-xs text-muted-foreground text-center">* Required fields{hasPaid ? " when generating report after payment" : " before proceeding to payment"}.</p>
            </form>
            </CardContent>
            <CardFooter className="mt-4">
            <p className="text-xs text-muted-foreground text-center w-full">
                Your information is used solely for generating your palm reading. Payment is required for report generation.
            </p>
            </CardFooter>
        </div>
      </Card>
    </div>
  );
};

export default PalmInputForm;
