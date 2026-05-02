
"use client";
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { useAppContext } from '@/context/AppContext';
import { useToast } from '@/hooks/use-toast';
import { Phone, KeyRound, UserPlus, ArrowLeft, Edit, ShieldCheck, Briefcase } from 'lucide-react';

interface OtpFormProps {
  onBack?: () => void;
  mode?: 'login' | 'register' | 'editor' | 'admin';
}

const OtpForm = ({ onBack, mode = 'login' }: OtpFormProps) => {
  const [mobileNumber, setMobileNumber] = useState(''); // This field will be used for 'identifier'
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
  let identifierLabel = "Mobile Number";
  let identifierPlaceholder = "Enter 10-digit mobile number";
  let otpPlaceholder = "Enter 6-digit OTP";
  let formIcon = <KeyRound className="h-10 w-10 text-primary" />;
  let inputType: 'tel' | 'text' = 'tel';

  if (mode === 'register') {
    cardTitle = "Create Your Account";
    cardDescription = "Enter your mobile to register.";
    primaryButtonText = "Register & Send OTP";
    verifyButtonText = "Verify OTP & Register";
    formIcon = <UserPlus className="h-10 w-10 text-primary" />;
  } else if (mode === 'editor') {
    cardTitle = "Editor Portal Access";
    cardDescription = "Enter editor credentials to proceed.";
    primaryButtonText = "Send Editor OTP";
    verifyButtonText = "Verify OTP & Login as Editor";
    identifierLabel = "Editor ID";
    identifierPlaceholder = "Enter Editor ID (use 'editor')";
    otpPlaceholder = "Editor OTP (use '000000')";
    formIcon = <Edit className="h-10 w-10 text-primary" />;
    inputType = 'text';
  } else if (mode === 'admin') {
    cardTitle = "Admin Portal Access";
    cardDescription = "Enter admin credentials to proceed.";
    primaryButtonText = "Send Admin OTP";
    verifyButtonText = "Verify OTP & Login as Admin";
    identifierLabel = "Admin ID";
    identifierPlaceholder = "Enter Admin ID (use 'admin')";
    otpPlaceholder = "Admin OTP (use '111111')";
    formIcon = <ShieldCheck className="h-10 w-10 text-accent" />;
    inputType = 'text';
  }

  const handleSendOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    if (mode === 'editor') {
      if (mobileNumber !== 'editor') {
        toast({ title: "Invalid Editor ID", description: "Please enter the correct Editor ID.", variant: "destructive" });
        return;
      }
    } else if (mode === 'admin') {
      if (mobileNumber !== 'admin') {
        toast({ title: "Invalid Admin ID", description: "Please enter the correct Admin ID.", variant: "destructive" });
        return;
      }
    } else if (!/^\d{10}$/.test(mobileNumber)) { // For 'login' and 'register'
      toast({ title: "Invalid Mobile Number", description: "Please enter a 10-digit mobile number.", variant: "destructive" });
      return;
    }
    setIsLoading(true);
    await new Promise(resolve => setTimeout(resolve, 1000));
    setOtpSent(true);
    setIsLoading(false);
    const simulatedOtp = mode === 'editor' ? '000000' : (mode === 'admin' ? '111111' : '123456');
    toast({ title: "OTP Sent", description: `An OTP has been sent (simulated: ${simulatedOtp}).` });
  };

  const handleVerifyOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    await new Promise(resolve => setTimeout(resolve, 1000));

    if (mode === 'editor') {
      if (mobileNumber === 'editor' && otp === '000000') {
        login('editor_user');
        toast({ title: "Editor Login Successful", description: "Redirecting to Editor Panel..." });
        router.push('/editor');
      } else {
        toast({ title: "Invalid Editor Credentials", description: "The Editor ID or OTP is incorrect.", variant: "destructive" });
      }
    } else if (mode === 'admin') {
      if (mobileNumber === 'admin' && otp === '111111') {
        login('admin_user');
        toast({ title: "Admin Login Successful", description: "Redirecting to Admin Panel..." });
        router.push('/admin'); 
      } else {
        toast({ title: "Invalid Admin Credentials", description: "The Admin ID or OTP is incorrect.", variant: "destructive" });
      }
    } else { // Regular login or register
      if (otp === '123456') {
        login(mobileNumber);
        toast({ title: mode === 'register' ? "Registration Successful" : "Login Successful", description: "Welcome to PalmVerse!" });
        const redirectPath = sessionStorage.getItem('palmverse_redirectAfterLogin') || '/palm-input';
        sessionStorage.removeItem('palmverse_redirectAfterLogin');
        router.push(redirectPath);
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
          <div className={`mx-auto ${mode === 'admin' ? 'bg-accent/10' : 'bg-primary/10'} p-3 rounded-full w-fit mb-4`}>
            {formIcon}
          </div>
          <CardTitle className="font-headline text-3xl">{cardTitle}</CardTitle>
          <CardDescription>{cardDescription}</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {!otpSent ? (
            <form onSubmit={handleSendOtp} className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="identifier" className="text-base">{identifierLabel}</Label>
                <div className="flex items-center gap-2 border rounded-md px-3 focus-within:ring-2 focus-within:ring-ring">
                  {mode === 'login' || mode === 'register' ? <Phone className="h-5 w-5 text-muted-foreground" /> : (mode === 'editor' ? <Edit className="h-5 w-5 text-muted-foreground" /> : <ShieldCheck className="h-5 w-5 text-muted-foreground" />)}
                  <Input
                    id="identifier"
                    type={inputType}
                    value={mobileNumber}
                    onChange={(e) => setMobileNumber(e.target.value)}
                    placeholder={identifierPlaceholder}
                    required
                    className="border-0 focus-visible:ring-0 focus-visible:ring-offset-0 px-1 text-base"
                    aria-label={identifierLabel}
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
                Change {identifierLabel}
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
