
"use client";
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { useAppContext } from '@/context/AppContext';
import { useToast } from '@/hooks/use-toast';
import { Phone, KeyRound, UserPlus, ArrowLeft } from 'lucide-react';

interface OtpFormProps {
  onBack?: () => void;
  mode?: 'login' | 'register';
}

const OtpForm = ({ onBack, mode = 'login' }: OtpFormProps) => {
  const [mobileNumber, setMobileNumber] = useState('');
  const [otp, setOtp] = useState('');
  const [otpSent, setOtpSent] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();
  const { login } = useAppContext();
  const { toast } = useToast();

  const cardTitle = mode === 'register' ? "Create Your Account" : "Login to PalmVerse";
  const cardDescription = mode === 'register' ? "Enter your mobile to register." : "Enter your mobile number to begin.";
  const primaryButtonText = mode === 'register' ? "Register & Send OTP" : "Send OTP";
  const verifyButtonText = mode === 'register' ? "Verify OTP & Register" : "Verify OTP & Continue";


  const handleSendOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!/^\d{10}$/.test(mobileNumber)) {
      toast({ title: "Invalid Mobile Number", description: "Please enter a 10-digit mobile number.", variant: "destructive" });
      return;
    }
    setIsLoading(true);
    await new Promise(resolve => setTimeout(resolve, 1000));
    setOtpSent(true);
    setIsLoading(false);
    toast({ title: "OTP Sent", description: "An OTP has been sent to your mobile (simulated: 123456)." });
  };

  const handleVerifyOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    await new Promise(resolve => setTimeout(resolve, 1000));
    if (otp === '123456') { 
      login(mobileNumber); 
      toast({ title: mode === 'register' ? "Registration Successful" : "Login Successful", description: "Welcome to PalmVerse!" });
      router.push('/palm-input');
    } else {
      toast({ title: "Invalid OTP", description: "The OTP you entered is incorrect.", variant: "destructive" });
    }
    setIsLoading(false);
  };

  return (
    <div className="flex justify-center items-center py-12">
      <Card className="w-full max-w-md shadow-xl animate-fade-in">
        <CardHeader className="text-center">
          <div className="mx-auto bg-primary/10 p-3 rounded-full w-fit mb-4">
            {mode === 'register' ? <UserPlus className="h-10 w-10 text-primary" /> : <KeyRound className="h-10 w-10 text-primary" />}
          </div>
          <CardTitle className="font-headline text-3xl">{cardTitle}</CardTitle>
          <CardDescription>{cardDescription}</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {!otpSent ? (
            <form onSubmit={handleSendOtp} className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="mobileNumber" className="text-base">Mobile Number</Label>
                <div className="flex items-center gap-2 border rounded-md px-3 focus-within:ring-2 focus-within:ring-ring">
                  <Phone className="h-5 w-5 text-muted-foreground" />
                  <Input
                    id="mobileNumber"
                    type="tel"
                    value={mobileNumber}
                    onChange={(e) => setMobileNumber(e.target.value)}
                    placeholder="Enter 10-digit mobile number"
                    required
                    className="border-0 focus-visible:ring-0 focus-visible:ring-offset-0 px-1 text-base"
                    aria-label="Mobile Number"
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
                    placeholder="Enter 6-digit OTP"
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
                Change mobile number
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
