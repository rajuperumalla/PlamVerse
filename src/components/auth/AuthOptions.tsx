
"use client";
import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { ScrollArea } from '@/components/ui/scroll-area';
import { KeyRound, Search, ChevronDown } from 'lucide-react';
import { countries } from '@/lib/countries';
import { useAppContext } from '@/context/AppContext';
import { useRouter } from 'next/navigation';
import { useToast } from '@/hooks/use-toast';

const AuthOptions = () => {
  const [view, setView] = useState<'register' | 'login' | 'otp'>('register');
  const [isLoading, setIsLoading] = useState(false);
  const [otpSent, setOtpSent] = useState(false);
  
  const [countryCode, setCountryCode] = useState('+91');
  const [searchCountry, setSearchCountry] = useState('');
  const [countryOpen, setCountryOpen] = useState(false);
  const [authCategory, setAuthCategory] = useState<string | null>(null);
  
  useEffect(() => {
    const storedCat = sessionStorage.getItem('palmverse_authCategory');
    if (storedCat) setAuthCategory(storedCat);

    const handleUpdateCategory = (e: any) => {
      setAuthCategory(e.detail);
    };
    window.addEventListener('update-auth-category', handleUpdateCategory);
    return () => window.removeEventListener('update-auth-category', handleUpdateCategory);
  }, []);
  
  useEffect(() => {
    const fetchCountryCode = async () => {
      try {
        const response = await fetch('https://ipapi.co/json/');
        if (response.ok) {
          const data = await response.json();
          if (data.country_calling_code) {
            setCountryCode(data.country_calling_code);
            return;
          }
        }
        
        // Fallback
        const fallback = await fetch('https://ipinfo.io/json');
        if (fallback.ok) {
          const data = await fallback.json();
          if (data.country) {
            const matchedCountry = countries.find(c => c.iso === data.country);
            if (matchedCountry) setCountryCode(matchedCountry.code);
          }
        }
      } catch (error) {
        console.log("Auto-detect country code failed silently", error);
      }
    };
    fetchCountryCode();
  }, []);
  
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
    if (!firstName || !lastName || !mobile) {
      toast({ title: "Validation Error", description: "First name, last name, and mobile number are required.", variant: "destructive" });
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
      sessionStorage.removeItem('palmverse_authCategory');
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
    <Card className="w-full max-w-md shadow-xl animate-fade-in flex-shrink-0 bg-card/95 backdrop-blur-sm" id="auth-form-card">
      <CardHeader className="text-center">
        <CardTitle className="font-headline text-3xl md:text-4xl text-primary leading-tight">
          {authCategory ? `Know Your ${authCategory}` : "Know Your Future"}
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
            <div className="flex">
              <Popover open={countryOpen} onOpenChange={setCountryOpen}>
                <PopoverTrigger asChild>
                  <Button variant="outline" role="combobox" aria-expanded={countryOpen} className="w-[100px] justify-between rounded-r-none border-r-0 bg-muted/30 px-3 text-sm font-normal hover:bg-muted/50">
                    {countryCode}
                    <ChevronDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-[280px] p-0" align="start">
                  <div className="flex items-center border-b px-3">
                    <Search className="mr-2 h-4 w-4 shrink-0 opacity-50" />
                    <Input
                      placeholder="Search country..."
                      value={searchCountry}
                      onChange={(e) => setSearchCountry(e.target.value)}
                      className="flex h-11 w-full rounded-md bg-transparent py-3 text-sm outline-none border-none focus-visible:ring-0 shadow-none"
                    />
                  </div>
                  <ScrollArea className="h-64">
                    <div className="p-1">
                      {countries
                        .filter(c => c.name.toLowerCase().includes(searchCountry.toLowerCase()) || c.code.includes(searchCountry))
                        .map(c => (
                        <div
                          key={c.iso}
                          className="relative flex w-full cursor-pointer select-none items-center rounded-sm py-2 px-3 text-sm outline-none hover:bg-accent hover:text-accent-foreground data-[disabled]:pointer-events-none data-[disabled]:opacity-50"
                          onClick={() => {
                            setCountryCode(c.code);
                            setCountryOpen(false);
                            setSearchCountry('');
                          }}
                        >
                          <span className="flex-1 truncate">{c.name}</span>
                          <span className="text-muted-foreground ml-2">{c.code}</span>
                        </div>
                      ))}
                      {countries.filter(c => c.name.toLowerCase().includes(searchCountry.toLowerCase()) || c.code.includes(searchCountry)).length === 0 && (
                        <div className="py-6 text-center text-sm text-muted-foreground">No country found.</div>
                      )}
                    </div>
                  </ScrollArea>
                </PopoverContent>
              </Popover>
              <Input id="mobile" type="tel" value={mobile} onChange={e=>setMobile(e.target.value)} placeholder="10-digit Mobile Number" className="rounded-l-none focus-visible:ring-1" required />
            </div>
          </div>
          <div className="space-y-2">
            <Label htmlFor="email">Email ID <span className="text-muted-foreground font-normal text-xs">(Optional)</span></Label>
            <Input id="email" type="email" value={email} onChange={e=>setEmail(e.target.value)} placeholder="Email Address" />
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
