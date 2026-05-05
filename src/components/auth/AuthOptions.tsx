
"use client";
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { KeyRound } from 'lucide-react';
import { useAppContext } from '@/context/AppContext';
import { useRouter } from 'next/navigation';
import { useToast } from '@/hooks/use-toast';

const AuthOptions = () => {
  const [view, setView] = useState<'register' | 'login' | 'otp'>('register');
  const [isLoading, setIsLoading] = useState(false);
  const [otpSent, setOtpSent] = useState(false);
  
  // Form fields
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [mobile, setMobile] = useState('');
  const [email, setEmail] = useState('');
  
  // Login fields
  const [identifier, setIdentifier] = useState('');
  const [otp, setOtp] = useState('');
  
  const { login } = useAppContext();
  const router = useRouter();
  const { toast } = useToast();

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!firstName || !lastName || !mobile || !email) {
      toast({ title: "Validation Error", description: "All fields are required.", variant: "destructive" });
      return;
    }
    setIsLoading(true);
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));
    setOtpSent(true);
    setView('otp');
    setIsLoading(false);
    toast({ title: "OTP Sent", description: "An OTP has been sent to your mobile/email (simulated: 123456)." });
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!identifier) {
      toast({ title: "Validation Error", description: "Identifier is required.", variant: "destructive" });
      return;
    }
    setIsLoading(true);
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));
    setOtpSent(true);
    setView('otp');
    setIsLoading(false);
    toast({ title: "OTP Sent", description: "An OTP has been sent (simulated: 123456)." });
  };

  const handleVerifyOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    if (otp === '123456') {
      login(identifier || mobile);
      toast({ title: "Success", description: "Welcome to PalmVerse!" });
      const redirectPath = sessionStorage.getItem('palmverse_redirectAfterLogin') || '/palm-input';
      sessionStorage.removeItem('palmverse_redirectAfterLogin');
      router.push(redirectPath);
    } else {
      toast({ title: "Invalid OTP", description: "The OTP you entered is incorrect.", variant: "destructive" });
    }
    setIsLoading(false);
  };

  if (view === 'otp') {
    return (
      <Card className="w-full max-w-md shadow-xl animate-fade-in flex-shrink-0 bg-card/95 backdrop-blur-sm">
        <CardHeader className="text-center">
          <div className="mx-auto bg-primary/10 p-3 rounded-full w-fit mb-4">
            <KeyRound className="h-10 w-10 text-primary" />
          </div>
          <CardTitle className="font-headline text-3xl">Verify OTP</CardTitle>
          <CardDescription>Enter the 6-digit code sent to you.</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleVerifyOtp} className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="otp">OTP Code</Label>
              <Input
                id="otp"
                value={otp}
                onChange={(e) => setOtp(e.target.value)}
                placeholder="Enter 6-digit OTP"
                required
                maxLength={6}
                className="text-center text-xl tracking-[0.5em]"
              />
            </div>
            <Button type="submit" className="w-full py-6 text-lg" disabled={isLoading}>
              {isLoading ? 'Verifying...' : 'Verify & Continue'}
            </Button>
            <Button variant="link" onClick={() => { setView('login'); setOtp(''); }} className="w-full">
              Back to Login
            </Button>
          </form>
        </CardContent>
      </Card>
    );
  }

  if (view === 'login') {
    return (
      <Card className="w-full max-w-md shadow-xl animate-fade-in flex-shrink-0 bg-card/95 backdrop-blur-sm">
        <CardHeader>
          <CardTitle className="font-headline text-3xl text-center">
            Welcome Back
          </CardTitle>
          <CardDescription className="text-center">
            Login using your mobile number or email ID via OTP.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleLogin} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="identifier">
                Mobile Number or Email ID
              </Label>
              <Input
                id="identifier"
                value={identifier}
                onChange={(e) => setIdentifier(e.target.value)}
                placeholder="Enter Mobile or Email"
                required
              />
            </div>
            <Button type="submit" className="w-full py-6 text-lg" disabled={isLoading}>
              {isLoading ? 'Sending OTP...' : 'Send OTP'}
            </Button>
          </form>
          
          <div className="mt-6 text-center text-sm">
            <span className="text-muted-foreground">New to PalmVerse? </span>
            <button onClick={() => setView('register')} className="text-primary hover:underline font-medium">
              Create an account
            </button>
          </div>
        </CardContent>
      </Card>
    );
  }

  // default register view
  return (
    <Card className="w-full max-w-md shadow-xl animate-fade-in flex-shrink-0 bg-card/95 backdrop-blur-sm">
      <CardHeader className="text-center">
        <CardTitle className="font-headline text-3xl md:text-4xl text-primary leading-tight">
          Know Your Future
        </CardTitle>
        <CardDescription className="italic text-base mt-2">
          "Discover your destiny in a few simple steps..."
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleRegister} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="firstName">First Name</Label>
              <Input id="firstName" value={firstName} onChange={e=>setFirstName(e.target.value)} placeholder="First Name" required />
            </div>
            <div className="space-y-2">
              <Label htmlFor="lastName">Last Name</Label>
              <Input id="lastName" value={lastName} onChange={e=>setLastName(e.target.value)} placeholder="Last Name" required />
            </div>
          </div>
          <div className="space-y-2">
            <Label htmlFor="mobile">Mobile Number</Label>
            <Input id="mobile" type="tel" value={mobile} onChange={e=>setMobile(e.target.value)} placeholder="10-digit Mobile Number" required />
          </div>
          <div className="space-y-2">
            <Label htmlFor="email">Email ID</Label>
            <Input id="email" type="email" value={email} onChange={e=>setEmail(e.target.value)} placeholder="Email Address" required />
          </div>
          <Button type="submit" className="w-full py-6 text-lg mt-2 font-semibold" disabled={isLoading}>
            {isLoading ? 'Processing...' : 'Sign Up'}
          </Button>
        </form>
        <div className="mt-6 text-center text-sm">
          <span className="text-muted-foreground">Already registered? </span>
          <button onClick={() => setView('login')} className="text-primary hover:underline font-medium text-base">
            Login here
          </button>
        </div>
      </CardContent>
    </Card>
  );
};

export default AuthOptions;
