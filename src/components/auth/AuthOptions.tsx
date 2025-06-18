
"use client";
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { LogIn, Smartphone, Mail, UserPlus, Edit, ShieldCheck } from 'lucide-react';
import OtpForm from './OtpForm';
import { useAppContext } from '@/context/AppContext';
import { useRouter } from 'next/navigation';
import { useToast } from '@/hooks/use-toast';

const AuthOptions = () => {
  const [showOtpForm, setShowOtpForm] = useState(false);
  const [otpMode, setOtpMode] = useState<'login' | 'register' | 'editor' | 'admin'>('login');
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

  const handleShowEditorLogin = () => {
    setOtpMode('editor');
    setShowOtpForm(true);
  };

  const handleShowAdminLogin = () => {
    setOtpMode('admin');
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
    <Card className="w-full max-w-md shadow-xl animate-fade-in flex-shrink-0 bg-card/95 backdrop-blur-sm">
      <CardHeader>
        <CardTitle className="font-headline text-2xl md:text-3xl">Login or Register</CardTitle>
        <CardDescription>to access your AI Palm Reading.</CardDescription>
      </CardHeader>
      <CardContent className="space-y-3">
        <Button onClick={handleShowOtpLogin} className="w-full text-base sm:text-lg py-3 sm:py-4">
          <Smartphone className="mr-2 h-5 w-5" /> Login with Mobile
        </Button>
        <Button onClick={handleGoogleLogin} variant="outline" className="w-full text-base sm:text-lg py-3 sm:py-4">
          <Mail className="mr-2 h-5 w-5" /> Continue with Google
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
        <Button onClick={handleShowOtpRegister} variant="secondary" className="w-full text-base sm:text-lg py-3 sm:py-4">
          <UserPlus className="mr-2 h-5 w-5" /> Create New Account
        </Button>

        <div className="relative my-3 pt-2">
          <div className="absolute inset-0 flex items-center">
            <span className="w-full border-t" />
          </div>
          <div className="relative flex justify-center text-xs uppercase">
            <span className="bg-card px-2 text-muted-foreground">
              Special Access
            </span>
          </div>
        </div>

        <Button onClick={handleShowEditorLogin} variant="ghost" className="w-full text-sm sm:text-base py-3 sm:py-4 border border-purple-500/50 hover:bg-purple-500/10 text-purple-600">
          <Edit className="mr-2 h-5 w-5" /> Editor Login
        </Button>
        <Button onClick={handleShowAdminLogin} variant="ghost" className="w-full text-sm sm:text-base py-3 sm:py-4 border border-teal-500/50 hover:bg-teal-500/10 text-teal-600">
          <ShieldCheck className="mr-2 h-5 w-5" /> Admin Login
        </Button>
      </CardContent>
      <CardFooter className="mt-2">
        <p className="text-xs text-muted-foreground text-center w-full">
            Your journey to self-discovery starts here.
        </p>
      </CardFooter>
    </Card>
  );
};

export default AuthOptions;
