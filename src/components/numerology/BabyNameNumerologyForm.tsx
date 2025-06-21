"use client";
import { useState, type FormEvent, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { useAppContext, type ReportNumerologyInputDetails_BabyName } from '@/context/AppContext';
import { useToast } from '@/hooks/use-toast';
import { Baby, User, CalendarDays, Clock, Loader2, Sparkles, CreditCard, Users, Info } from 'lucide-react';
import Image from 'next/image';

const SESSION_STORAGE_KEY_BABY_NAME_NUMEROLOGY = 'palmVerseBabyNameNumerologyCheckoutForm';
const SERVICE_QUERY = 'baby-name-numerology';

interface BabyNameNumerologyFormProps {
  serviceDescription?: string;
}

const BabyNameNumerologyForm = ({ serviceDescription }: BabyNameNumerologyFormProps) => {
  const [proposedNamesText, setProposedNamesText] = useState('');
  const [childDOB, setChildDOB] = useState('');
  const [childTOB, setChildTOB] = useState('');
  const [parent1FullName, setParent1FullName] = useState('');
  const [parent1DOB, setParent1DOB] = useState('');
  const [parent2FullName, setParent2FullName] = useState('');
  const [parent2DOB, setParent2DOB] = useState('');

  const router = useRouter();
  const {
    startOperation,
    stopOperation,
    isOperationInProgress,
    hasPaid,
    createInitialNumerologyReportPlaceholder,
  } = useAppContext();
  const { toast } = useToast();

  const parseProposedNames = (text: string): string[] => {
    return text.split('\n').map(name => name.trim()).filter(name => name.length > 0);
  };
  
  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    const proposedNamesArray = parseProposedNames(proposedNamesText);
    
    if (proposedNamesArray.length === 0 || !childDOB) {
      toast({ title: "Missing Information", description: "Please fill all required fields (Proposed Names, Child's DOB).", variant: "destructive" });
      return;
    }

    const reportInputDetails: ReportNumerologyInputDetails_BabyName = {
      serviceQuery: SERVICE_QUERY,
      proposedNames: proposedNamesArray,
      childDOB,
      childTOB: childTOB || undefined,
      parent1FullName: parent1FullName || undefined,
      parent1DOB: parent1DOB || undefined,
      parent2FullName: parent2FullName || undefined,
      parent2DOB: parent2DOB || undefined,
    };

    sessionStorage.setItem(SESSION_STORAGE_KEY_BABY_NAME_NUMEROLOGY, JSON.stringify(reportInputDetails));

    if (!hasPaid) {
      const returnPath = `/numerology-input?service=${SERVICE_QUERY}`;
      router.push(`/payment?service_type=numerology&return_path=${encodeURIComponent(returnPath)}`);
      return;
    }

    // Post-payment submission logic
    sessionStorage.removeItem(SESSION_STORAGE_KEY_BABY_NAME_NUMEROLOGY);
    startOperation();
    try {
      createInitialNumerologyReportPlaceholder(reportInputDetails, SERVICE_QUERY);
      toast({ title: "Numerology Request Received", description: "Your report is being prepared and will be available under 'My Reading'. Redirecting to Home...", duration: 5000 });
      router.push('/');
    } catch (error) {
      console.error("Error creating baby name numerology report placeholder:", error);
      toast({ title: "Request Error", description: "Failed to submit your numerology request. Please try again.", variant: "destructive" });
    } finally {
      stopOperation();
    }
  };

  const loadPersistedData = useCallback(() => {
    const persistedFormDataJson = sessionStorage.getItem(SESSION_STORAGE_KEY_BABY_NAME_NUMEROLOGY);
    if (persistedFormDataJson) {
        const persistedData = JSON.parse(persistedFormDataJson) as ReportNumerologyInputDetails_BabyName;
        setProposedNamesText(persistedData.proposedNames.join('\n'));
        setChildDOB(persistedData.childDOB || '');
        setChildTOB(persistedData.childTOB || '');
        setParent1FullName(persistedData.parent1FullName || '');
        setParent1DOB(persistedData.parent1DOB || '');
        setParent2FullName(persistedData.parent2FullName || '');
        setParent2DOB(persistedData.parent2DOB || '');
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
            src="https://placehold.co/800x1200.png"
            alt="Subtle Numerology Background"
            layout="fill"
            objectFit="cover"
            data-ai-hint="stars celestial background"
            />
        </div>
        <div className="relative z-10">
            <CardHeader className="text-center">
            <div className="mx-auto bg-primary/10 p-3 rounded-full w-fit mb-4">
                <Baby className="h-10 w-10 text-primary" />
            </div>
            <CardTitle className="font-headline text-3xl">Baby Name Numerology</CardTitle>
            <CardDescription>{serviceDescription || "Find harmonious names based on your child's birth details."}</CardDescription>
            </CardHeader>
            <CardContent>
            <form onSubmit={handleSubmit} className="space-y-8">
                <div className="space-y-2">
                    <Label htmlFor="proposedNamesText" className="text-base flex items-center gap-2"><Baby className="h-5 w-5 text-primary"/>Child's Proposed Names *</Label>
                    <Textarea id="proposedNamesText" value={proposedNamesText} onChange={(e) => setProposedNamesText(e.target.value)} placeholder="Enter potential names, one per line" disabled={isOperationInProgress} rows={4} required />
                    <p className="text-xs text-muted-foreground">Enter each name on a new line. This is a required field.</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                        <Label htmlFor="childDOB" className="text-base flex items-center gap-2"><CalendarDays className="h-5 w-5 text-primary"/>Child's Date of Birth *</Label>
                        <Input id="childDOB" type="date" value={childDOB} onChange={(e) => setChildDOB(e.target.value)} disabled={isOperationInProgress} required />
                         <p className="text-xs text-muted-foreground">This is a required field.</p>
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="childTOB" className="text-base flex items-center gap-2"><Clock className="h-5 w-5 text-primary"/>Child's Time of Birth (Optional)</Label>
                        <Input id="childTOB" type="time" value={childTOB} onChange={(e) => setChildTOB(e.target.value)} disabled={isOperationInProgress}/>
                    </div>
                </div>
                
                <Card className="p-4 bg-muted/30 border-primary/20">
                    <CardTitle className="text-lg mb-2 flex items-center gap-2"><Users className="h-5 w-5 text-primary"/>Parent Details (Optional)</CardTitle>
                    <CardDescription className="text-xs text-muted-foreground mb-3 flex items-start gap-1.5">
                       <Info className="h-4 w-4 text-blue-500 mt-0.5 shrink-0" />
                       <span>Providing parent details can help in a more comprehensive analysis to assess harmony and compatibility of the proposed names with parental energies.</span>
                    </CardDescription>
                    <div className="space-y-4">
                        <div className="space-y-2">
                            <Label htmlFor="parent1FullName" className="text-base">Parent 1 Full Name</Label>
                            <Input id="parent1FullName" type="text" value={parent1FullName} onChange={(e) => setParent1FullName(e.target.value)} placeholder="e.g., John Doe" disabled={isOperationInProgress} />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="parent1DOB" className="text-base">Parent 1 Date of Birth</Label>
                            <Input id="parent1DOB" type="date" value={parent1DOB} onChange={(e) => setParent1DOB(e.target.value)} disabled={isOperationInProgress || !parent1FullName} />
                            {parent1FullName && !parent1DOB && <p className="text-xs text-destructive">Please provide DOB if Parent 1 name is entered.</p>}
                        </div>
                    </div>
                    <hr className="my-4"/>
                     <div className="space-y-4">
                        <div className="space-y-2">
                            <Label htmlFor="parent2FullName" className="text-base">Parent 2 Full Name</Label>
                            <Input id="parent2FullName" type="text" value={parent2FullName} onChange={(e) => setParent2FullName(e.target.value)} placeholder="e.g., Jane Smith" disabled={isOperationInProgress} />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="parent2DOB" className="text-base">Parent 2 Date of Birth</Label>
                            <Input id="parent2DOB" type="date" value={parent2DOB} onChange={(e) => setParent2DOB(e.target.value)} disabled={isOperationInProgress || !parent2FullName} />
                             {parent2FullName && !parent2DOB && <p className="text-xs text-destructive">Please provide DOB if Parent 2 name is entered.</p>}
                        </div>
                    </div>
                </Card>
                
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
                <p className="text-xs text-muted-foreground text-center">* Required fields are marked with an asterisk if not already obvious.</p>
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

export default BabyNameNumerologyForm;
