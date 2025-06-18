
"use client";

import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { useAppContext } from '@/context/AppContext';
import { CreditCard, CheckCircle } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

export default function PaymentPage() {
  const router = useRouter();
  const { setHasPaid, hasPaid } = useAppContext();
  const { toast } = useToast();

  const handleSimulatePayment = () => {
    setHasPaid(true);
    toast({
      title: 'Payment Successful (Simulated)',
      description: 'You can now proceed to generate your palm reading.',
    });
    // Redirect back to palm-input, with a query param to trigger auto-submission
    router.push('/palm-input?payment_success=true'); 
  };

  if (hasPaid) {
      return (
        <div className="flex flex-col items-center justify-center min-h-[calc(100vh-200px)] py-12">
            <Card className="w-full max-w-md shadow-xl text-center">
                <CardHeader>
                    <div className="mx-auto bg-green-100 p-3 rounded-full w-fit mb-4">
                        <CheckCircle className="h-10 w-10 text-green-600" />
                    </div>
                    <CardTitle className="font-headline text-3xl">Payment Already Completed</CardTitle>
                    <CardDescription>You have already completed the payment. You can generate your report.</CardDescription>
                </CardHeader>
                <CardContent>
                     <Button onClick={() => router.push('/palm-input')} className="w-full text-lg py-6">
                        Go to Palm Input
                    </Button>
                </CardContent>
            </Card>
        </div>
      )
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-[calc(100vh-200px)] py-12">
      <Card className="w-full max-w-md shadow-xl text-center">
        <CardHeader>
          <div className="mx-auto bg-primary/10 p-3 rounded-full w-fit mb-4">
            <CreditCard className="h-10 w-10 text-primary" />
          </div>
          <CardTitle className="font-headline text-3xl">Complete Your Payment</CardTitle>
          <CardDescription>A one-time payment is required to receive your personalized palm reading.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="text-4xl font-bold text-primary">
            $9.99 <span className="text-sm font-normal text-muted-foreground">(Simulated)</span>
          </div>
          <p className="text-muted-foreground text-sm">
            This is a simulated payment page. Click the button below to "complete" your payment.
            In a real application, you would be redirected to a secure payment gateway.
          </p>
          <Button onClick={handleSimulatePayment} className="w-full text-lg py-6">
            Simulate Successful Payment
          </Button>
        </CardContent>
        <CardFooter>
          <p className="text-xs text-muted-foreground text-center w-full">
            Secure payment simulation by PalmVerse.
          </p>
        </CardFooter>
      </Card>
    </div>
  );
}
