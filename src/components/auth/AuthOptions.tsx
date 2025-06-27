
"use client";
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { LogIn, Smartphone, Mail, UserPlus, Edit, ShieldCheck, Briefcase } from 'lucide-react';
import OtpForm from './OtpForm';
import { useAppContext } from '@/context/AppContext';
import { useRouter } from 'next/navigation';
import { useToast } from '@/hooks/use-toast';

const AuthOptions = () => {
  const [showOtpForm, setShowOtpForm] = useState(false);
  const [otpMode, setOtpMode] = useState<'login' | 'register' | 'editor' | 'admin' | 'manager'>('login');
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

  const handleShowManagerLogin = () => {
    setOtpMode('manager');
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
        <CardTitle className="font-headline text-2xl md:text-3xl">Login / Register for Palm Reading</CardTitle>
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
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
            <Button onClick={handleShowEditorLogin} variant="ghost" className="w-full text-sm py-3 border border-primary/50 hover:bg-primary/10 text-primary">
                <Edit className="mr-2 h-5 w-5" /> Editor Login
            </Button>
             <Button onClick={handleShowManagerLogin} variant="ghost" className="w-full text-sm py-3 border border-purple-500/50 hover:bg-purple-500/10 text-purple-600">
                <Briefcase className="mr-2 h-5 w-5" /> Manager Login
            </Button>
        </div>
        <Button onClick={handleShowAdminLogin} variant="ghost" className="w-full text-sm py-3 border border-accent/70 hover:bg-accent/10 text-accent">
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

    