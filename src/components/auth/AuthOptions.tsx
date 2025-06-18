
"use client";
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { LogIn, Smartphone, Mail, UserPlus, Edit } from 'lucide-react'; // Changed ShieldCheck to Edit for Editor
import OtpForm from './OtpForm';
import { useAppContext } from '@/context/AppContext';
import { useRouter } from 'next/navigation';
import { useToast } from '@/hooks/use-toast';

const AuthOptions = () => {
  const [showOtpForm, setShowOtpForm] = useState(false);
  const [otpMode, setOtpMode] = useState<'login' | 'register' | 'editor'>('login'); // Changed 'admin' to 'editor'
  const { login } = useAppContext();
  const router = useRouter();
  const { toast } = useToast();

  const handleGoogleLogin = () => {
    login("GoogleUser");
    toast({ title: "Login Successful (Simulated)", description: "Welcome via Google!" });
    router.push('/palm-input');
  };

  const handleShowOtpLogin = () => {
    setOtpMode('login');
    setShowOtpForm(true);
  };

  const handleShowOtpRegister = () => {
    setOtpMode('register');
    setShowOtpForm(true);
  };

  const handleShowEditorLogin = () => { // Renamed from handleShowAdminLogin
    setOtpMode('editor'); // Changed from 'admin'
    setShowOtpForm(true);
  };

  if (showOtpForm) {
    return (
      <OtpForm
        onBack={() => setShowOtpForm(false)}
        mode={otpMode}
      />
    );
  }

  return (
    <Card className="w-full max-w-md shadow-xl animate-fade-in">
      <CardHeader className="text-center">
        <div className="mx-auto bg-primary/10 p-3 rounded-full w-fit mb-4">
          <LogIn className="h-10 w-10 text-primary" />
        </div>
        <CardTitle className="font-headline text-3xl">Welcome to PalmVerse</CardTitle>
        <CardDescription>Choose how you'd like to connect.</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <Button onClick={handleShowOtpLogin} className="w-full text-lg py-3 sm:py-4 md:py-6">
          <Smartphone className="mr-2 h-5 w-5" /> Login with Mobile Number
        </Button>
        <Button onClick={handleGoogleLogin} variant="outline" className="w-full text-lg py-3 sm:py-4 md:py-6">
          <Mail className="mr-2 h-5 w-5" /> Continue with Google (Simulated)
        </Button>
         <div className="relative my-3">
          <div className="absolute inset-0 flex items-center">
            <span className="w-full border-t" />
          </div>
          <div className="relative flex justify-center text-xs uppercase">
            <span className="bg-card px-2 text-muted-foreground">
              Or
            </span>
          </div>
        </div>
        <Button onClick={handleShowOtpRegister} variant="secondary" className="w-full text-lg py-3 sm:py-4 md:py-6">
          <UserPlus className="mr-2 h-5 w-5" /> Register / Create Account
        </Button>
        <Button onClick={handleShowEditorLogin} variant="ghost" className="w-full text-lg py-3 sm:py-4 md:py-6 mt-2 border border-primary/50 hover:bg-primary/10"> {/* Changed variant and text */}
          <Edit className="mr-2 h-5 w-5" /> Editor Login
        </Button>
      </CardContent>
      <CardFooter>
        <p className="text-xs text-muted-foreground text-center w-full">
            PalmVerse - Your destiny, revealed.
        </p>
      </CardFooter>
    </Card>
  );
};

export default AuthOptions;
