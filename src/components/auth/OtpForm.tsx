
"use client";
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { useAppContext } from '@/context/AppContext';
import { useToast } from '@/hooks/use-toast';
import { Phone, KeyRound, UserPlus, ArrowLeft, Edit } from 'lucide-react'; // Changed ShieldAlert to Edit

interface OtpFormProps {
  onBack?: () => void;
  mode?: 'login' | 'register' | 'editor'; // Changed 'admin' to 'editor'
}

const OtpForm = ({ onBack, mode = 'login' }: OtpFormProps) => {
  const [mobileNumber, setMobileNumber] = useState('');
  const [otp, setOtp] = useState('');
  const [otpSent, setOtpSent] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();
  const { login } = useAppContext();
  const { toast } = useToast();

  let cardTitle = "Login to PalmVerse";
  let cardDescription = "Enter your mobile number to begin.";
  let primaryButtonText = "Send OTP";
  let verifyButtonText = "Verify OTP & Continue";
  let mobileLabel = "Mobile Number";
  let mobilePlaceholder = "Enter 10-digit mobile number";
  let otpPlaceholder = "Enter 6-digit OTP";
  let formIcon = <KeyRound className="h-10 w-10 text-primary" />;

  if (mode === 'register') {
    cardTitle = "Create Your Account";
    cardDescription = "Enter your mobile to register.";
    primaryButtonText = "Register & Send OTP";
    verifyButtonText = "Verify OTP & Register";
    formIcon = <UserPlus className="h-10 w-10 text-primary" />;
  } else if (mode === 'editor') { // Changed from 'admin'
    cardTitle = "Editor Portal Access";
    cardDescription = "Enter editor credentials to proceed.";
    primaryButtonText = "Send Editor OTP";
    verifyButtonText = "Verify OTP & Login as Editor";
    mobileLabel = "Editor ID";
    mobilePlaceholder = "Enter Editor ID (use 'editor')"; // Changed from 'admin'
    otpPlaceholder = "Editor OTP (use '000000')";
    formIcon = <Edit className="h-10 w-10 text-primary" />; // Changed from ShieldAlert
  }

  const handleSendOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    if (mode === 'editor') { // Changed from 'admin'
      if (mobileNumber !== 'editor') { // Changed from 'admin'
        toast({ title: "Invalid Editor ID", description: "Please enter the correct Editor ID.", variant: "destructive" });
        return;
      }
    } else if (!/^\d{10}$/.test(mobileNumber)) {
      toast({ title: "Invalid Mobile Number", description: "Please enter a 10-digit mobile number.", variant: "destructive" });
      return;
    }
    setIsLoading(true);
    await new Promise(resolve => setTimeout(resolve, 1000));
    setOtpSent(true);
    setIsLoading(false);
    const simulatedOtp = mode === 'editor' ? '000000' : '123456'; // Changed from 'admin'
    toast({ title: "OTP Sent", description: `An OTP has been sent (simulated: ${simulatedOtp}).` });
  };

  const handleVerifyOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    await new Promise(resolve => setTimeout(resolve, 1000));

    if (mode === 'editor') { // Changed from 'admin'
      if (mobileNumber === 'editor' && otp === '000000') { // Changed from 'admin_user' to 'editor_user'
        login('editor_user');
        toast({ title: "Editor Login Successful", description: "Redirecting to Editor Panel..." });
        router.push('/editor'); // Changed from '/admin'
      } else {
        toast({ title: "Invalid Editor Credentials", description: "The Editor ID or OTP is incorrect.", variant: "destructive" });
      }
    } else { // Regular login or register
      if (otp === '123456') {
        login(mobileNumber);
        toast({ title: mode === 'register' ? "Registration Successful" : "Login Successful", description: "Welcome to PalmVerse!" });
        router.push('/palm-input');
      } else {
        toast({ title: "Invalid OTP", description: "The OTP you entered is incorrect.", variant: "destructive" });
      }
    }
    setIsLoading(false);
  };

  return (
    <div className="flex justify-center items-center py-12">
      <Card className="w-full max-w-md shadow-xl animate-fade-in">
        <CardHeader className="text-center">
          <div className="mx-auto bg-primary/10 p-3 rounded-full w-fit mb-4">
            {formIcon}
          </div>
          <CardTitle className="font-headline text-3xl">{cardTitle}</CardTitle>
          <CardDescription>{cardDescription}</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {!otpSent ? (
            <form onSubmit={handleSendOtp} className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="mobileNumber" className="text-base">{mobileLabel}</Label>
                <div className="flex items-center gap-2 border rounded-md px-3 focus-within:ring-2 focus-within:ring-ring">
                  <Phone className="h-5 w-5 text-muted-foreground" />
                  <Input
                    id="mobileNumber"
                    type={mode === 'editor' ? 'text' : 'tel'} // Changed from 'admin'
                    value={mobileNumber}
                    onChange={(e) => setMobileNumber(e.target.value)}
                    placeholder={mobilePlaceholder}
                    required
                    className="border-0 focus-visible:ring-0 focus-visible:ring-offset-0 px-1 text-base"
                    aria-label={mobileLabel}
                  />
                </div>
              </div>
              <Button type="submit" className="w-full text-lg py-6" disabled={isLoading}>
                {isLoading ? 'Processing...' : primaryButtonText}
              </Button>
            </form>
          ) : (
            <form onSubmit={handleVerifyOtp} className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="otp" className="text-base">Enter OTP</Label>
                 <div className="flex items-center gap-2 border rounded-md px-3 focus-within:ring-2 focus-within:ring-ring">
                   <KeyRound className="h-5 w-5 text-muted-foreground" />
                  <Input
                    id="otp"
                    type="text"
                    value={otp}
                    onChange={(e) => setOtp(e.target.value)}
                    placeholder={otpPlaceholder}
                    required
                    maxLength={6}
                    className="border-0 focus-visible:ring-0 focus-visible:ring-offset-0 px-1 text-base"
                    aria-label="OTP"
                  />
                </div>
              </div>
              <Button type="submit" className="w-full text-lg py-6" disabled={isLoading}>
                {isLoading ? 'Verifying...' : verifyButtonText}
              </Button>
              <Button variant="link" onClick={() => setOtpSent(false)} className="w-full" disabled={isLoading}>
                {mode === 'editor' ? 'Change Editor ID' : 'Change mobile number'} {/* Changed from 'admin' */}
              </Button>
            </form>
          )}
          {onBack && (
            <Button variant="outline" onClick={onBack} className="w-full mt-4 text-base py-6">
              <ArrowLeft className="mr-2 h-5 w-5" /> Back to Options
            </Button>
          )}
        </CardContent>
        <CardFooter>
          <p className="text-xs text-muted-foreground text-center w-full">
            We respect your privacy. Your information is secure with us.
          </p>
        </CardFooter>
      </Card>
    </div>
  );
};

export default OtpForm;
