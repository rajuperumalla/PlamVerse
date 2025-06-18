
"use client";
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';
import { FileText, RefreshCw, ArrowLeft } from 'lucide-react';
import { useRouter } from 'next/navigation';

interface ReportDisplayProps {
  report: string;
}

const ReportDisplay = ({ report }: ReportDisplayProps) => {
  const router = useRouter();

  // Split report into paragraphs for better readability
  const reportParagraphs = report.split('\n').filter(p => p.trim() !== '');

  return (
    <div className="flex justify-center items-center py-8">
      <Card className="w-full max-w-3xl shadow-xl animate-fade-in">
        <CardHeader className="text-center">
          <div className="mx-auto bg-accent/10 p-3 rounded-full w-fit mb-4">
            <FileText className="h-10 w-10 text-accent" />
          </div>
          <CardTitle className="font-headline text-3xl">Your Palm Reading Report</CardTitle>
          <CardDescription>Insights from the lines on your hands.</CardDescription>
        </CardHeader>
        <CardContent>
          <ScrollArea className="h-[400px] w-full rounded-md border p-6 bg-background shadow-inner">
            {reportParagraphs.length > 0 ? (
              reportParagraphs.map((paragraph, index) => (
                <p key={index} className="mb-4 text-base leading-relaxed font-body animate-slide-in-up" style={{animationDelay: `${index * 0.1}s`}}>
                  {paragraph}
                </p>
              ))
            ) : (
              <p className="text-muted-foreground">No report data available.</p>
            )}
          </ScrollArea>
        </CardContent>
        <CardFooter className="flex flex-col sm:flex-row justify-center gap-4 mt-6">
          <Button onClick={() => router.push('/palm-input')} variant="outline" className="w-full sm:w-auto">
            <ArrowLeft className="mr-2 h-4 w-4" /> Back to Input
          </Button>
          <Button onClick={() => router.push('/palm-input')} className="w-full sm:w-auto">
            <RefreshCw className="mr-2 h-4 w-4" /> Start New Reading
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
};

export default ReportDisplay;
