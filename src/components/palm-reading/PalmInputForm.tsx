
"use client";
import { useState, type ChangeEvent, type FormEvent, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { useAppContext, type ReportPalmInputDetails } from '@/context/AppContext';
import { useToast } from '@/hooks/use-toast';
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
  const [frontPalmImageFile, setFrontPalmImageFile] = useState<File | null>(null);
  const [sidePalmImageFile, setSidePalmImageFile] = useState<File | null>(null);
  const [frontPalmPreview, setFrontPalmPreview] = useState<string | null>(null);
  const [sidePalmPreview, setSidePalmPreview] = useState<string | null>(null);

  const [dateOfBirth, setDateOfBirth] = useState('');
  const [placeOfBirth, setPlaceOfBirth] = useState('');
  const [timeOfBirth, setTimeOfBirth] = useState('');
  const [dominantHand, setDominantHand] = useState('');
  const [category, setCategory] = useState(categoryFromQuery || '');

  const router = useRouter();
  const {
    startOperation,
    stopOperation,
    isOperationInProgress,
    createInitialReportPlaceholder,
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

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();

    if (!frontPalmPreview || !sidePalmPreview || !dateOfBirth || !placeOfBirth || !dominantHand || !category) {
      toast({ title: "Missing Information", description: "Please complete all required fields and upload both images.", variant: "destructive" });
      return;
    }

    const reportInputDetails: ReportPalmInputDetails = {
      frontPalmDataUri: frontPalmPreview,
      sidePalmDataUri: sidePalmPreview,
      dateOfBirth,
      placeOfBirth,
      timeOfBirth: timeOfBirth || "Not specified",
      dominantHand,
      category,
    };
    sessionStorage.setItem(SESSION_STORAGE_KEY, JSON.stringify(reportInputDetails));

    const returnPath = `/palm-input${category ? `?category=${encodeURIComponent(category)}` : ''}`;
    router.push(`/payment?service_type=palmistry&return_path=${encodeURIComponent(returnPath)}`);
  };

  useEffect(() => {
    const persistedFormDataJson = sessionStorage.getItem(SESSION_STORAGE_KEY);
    if (persistedFormDataJson) {
      try {
        const persistedData = JSON.parse(persistedFormDataJson);
        setDateOfBirth(persistedData.dateOfBirth || '');
        setPlaceOfBirth(persistedData.placeOfBirth || '');
        setTimeOfBirth(persistedData.timeOfBirth === 'Not specified' ? '' : persistedData.timeOfBirth || '');
        setDominantHand(persistedData.dominantHand || '');
        setCategory(categoryFromQuery || persistedData.category || '');
      } catch (e) {
        console.error("Failed to parse form data from session storage", e);
        sessionStorage.removeItem(SESSION_STORAGE_KEY);
        setCategory(categoryFromQuery || '');
      }
    } else if (categoryFromQuery) {
      setCategory(categoryFromQuery);
    }
    
    // Always clear image previews on component mount
    setFrontPalmPreview(null);
    setSidePalmPreview(null);
    setFrontPalmImageFile(null);
    setSidePalmImageFile(null);
  }, [categoryFromQuery]);


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
    </div>
  );

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
            <form onSubmit={handleSubmit} className="space-y-8">
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
                
                <div className="space-y-4">
                    <p className="text-base font-medium">Upload Palm Images *</p>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-2">
                            <Label htmlFor="frontPalm" className="text-base flex items-center gap-2"><UploadCloud className="h-5 w-5 text-primary"/>Front of {dominantHand || 'Dominant'} Hand *</Label>
                            {renderImagePreview(frontPalmPreview, "Front Palm", "palm hand front")}
                            <Input id="frontPalm" type="file" accept="image/jpeg, image/png" onChange={(e) => handleImageChange(e, setFrontPalmImageFile, setFrontPalmPreview)} className="mt-2 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-primary/10 file:text-primary hover:file:bg-primary/20" disabled={isOperationInProgress} />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="sidePalm" className="text-base flex items-center gap-2"><UploadCloud className="h-5 w-5 text-primary"/>Side of {dominantHand || 'Dominant'} Hand *</Label>
                            {renderImagePreview(sidePalmPreview, "Side Palm", "palm hand side")}
                            <Input id="sidePalm" type="file" accept="image/jpeg, image/png" onChange={(e) => handleImageChange(e, setSidePalmImageFile, setSidePalmPreview)} className="mt-2 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-primary/10 file:text-primary hover:file:bg-primary/20" disabled={isOperationInProgress} />
                        </div>
                    </div>
                </div>

                <Button
                    type="submit"
                    className="w-full text-lg py-6 mt-8"
                    disabled={isOperationInProgress}
                >
                    <Sparkles className="mr-2 h-5 w-5" />
                    Proceed to Payment
                </Button>

                <p className="text-xs text-muted-foreground text-center">* All fields required to generate your report.</p>
            </form>
            </CardContent>
            <CardFooter className="mt-4">
            <p className="text-xs text-muted-foreground text-center w-full">
                Your information is used solely for generating your palm reading. Payment may be required.
            </p>
            </CardFooter>
        </div>
      </Card>
    </div>
  );
};

export default PalmInputForm;
