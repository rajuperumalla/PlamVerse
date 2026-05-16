"use client";
import { useRef, useState } from 'react';
import { useRouter } from 'next/navigation';
import ReportDisplay from '@/components/palm-reading/ReportDisplay';
import { useAppContext } from '@/context/AppContext';
import { Button } from '@/components/ui/button';
import { AlertTriangle, Info, Hourglass, Loader2, ServerCrash, Sparkles, Bell, Upload, ShieldAlert, CheckCircle2 } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { useToast } from '@/hooks/use-toast';

const STEP_LABELS: { key: string; label: string }[] = [
  { key: 'submitted', label: 'Submitted' },
  { key: 'editor', label: 'Editor Review' },
  { key: 'admin', label: 'Final Approval' },
  { key: 'published', label: 'Published' },
];

function StatusTracker({ status }: { status: string }) {
  let activeIndex = 0;
  if (status === 'pending_review') activeIndex = 1;
  else if (status === 'needs_resubmission') activeIndex = 1;
  else if (status === 'pending_admin_approval' || status === 'admin_revision') activeIndex = 2;
  else if (status === 'approved') activeIndex = 3;

  return (
    <div className="flex items-center justify-between w-full max-w-md mx-auto mb-6">
      {STEP_LABELS.map((step, i) => (
        <div key={step.key} className="flex items-center flex-1 last:flex-none">
          <div className="flex flex-col items-center">
            <div className={`h-8 w-8 rounded-full flex items-center justify-center text-xs font-bold ${i <= activeIndex ? 'bg-primary text-primary-foreground' : 'bg-muted text-muted-foreground'}`}>
              {i < activeIndex ? <CheckCircle2 className="h-4 w-4" /> : i + 1}
            </div>
            <span className="text-[10px] mt-1 text-muted-foreground text-center w-16">{step.label}</span>
          </div>
          {i < STEP_LABELS.length - 1 && (
            <div className={`h-0.5 flex-1 mx-1 ${i < activeIndex ? 'bg-primary' : 'bg-muted'}`} />
          )}
        </div>
      ))}
    </div>
  );
}

export default function ReportPage() {
  const { isAuthenticated, isInitializing, getCurrentUserReport, isOperationInProgress, resubmitReportImages, markUserNotificationsRead } = useAppContext();
  const router = useRouter();
  const { toast } = useToast();

  const [frontFile, setFrontFile] = useState<string | null>(null);
  const [sideFile, setSideFile] = useState<string | null>(null);
  const frontRef = useRef<HTMLInputElement>(null);
  const sideRef = useRef<HTMLInputElement>(null);

  if (isInitializing) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[calc(100vh-200px)]">
        <Loader2 className="h-12 w-12 animate-spin text-primary mb-4" />
        <p className="text-muted-foreground">Loading your report status...</p>
      </div>
    );
  }

  if (!isAuthenticated) {
    router.push('/');
    return (
      <div className="flex flex-col items-center justify-center min-h-[calc(100vh-200px)]">
        <Loader2 className="h-12 w-12 animate-spin text-primary mb-4" />
        <p className="text-muted-foreground">Redirecting to login...</p>
      </div>
    );
  }

  const currentUserReport = getCurrentUserReport();

  if (!currentUserReport) {
    return (
      <div className="flex flex-col items-center justify-center text-center py-12 min-h-[calc(100vh-200px)]">
        <Info className="h-16 w-16 text-primary mb-4" />
        <h2 className="text-2xl font-headline mb-2">No Report Journey Started Yet</h2>
        <p className="text-muted-foreground mb-6">It looks like you haven&apos;t submitted details for a reading.</p>
        <Button onClick={() => router.push('/palm-input')}>Start a Palm Reading</Button>
      </div>
    );
  }

  const report = currentUserReport;
  const unreadNotifications = (report.notifications || []).filter(n => !n.read);

  const handleFile = (e: React.ChangeEvent<HTMLInputElement>, setter: (v: string) => void) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (file.size > 5 * 1024 * 1024) {
      toast({ title: "File Too Large", description: "Please upload an image under 5MB.", variant: "destructive" });
      return;
    }
    const reader = new FileReader();
    reader.onload = () => setter(reader.result as string);
    reader.readAsDataURL(file);
  };

  const handleResubmit = () => {
    if (!frontFile || !sideFile) {
      toast({ title: "Both Images Required", description: "Please upload both the front and side palm photos.", variant: "destructive" });
      return;
    }
    resubmitReportImages(report.id, frontFile, sideFile);
    toast({ title: "Images Resubmitted", description: "Your new images are now awaiting editor review." });
    setFrontFile(null);
    setSideFile(null);
  };

  const NotificationsBanner = () => {
    if (unreadNotifications.length === 0) return null;
    return (
      <Alert className="max-w-lg mx-auto mb-6 text-left">
        <Bell className="h-4 w-4" />
        <AlertTitle className="flex items-center justify-between">
          Notifications
          <Button variant="link" size="sm" className="h-auto p-0 text-xs" onClick={() => markUserNotificationsRead(report.id)}>
            Mark all read
          </Button>
        </AlertTitle>
        <AlertDescription>
          <ul className="space-y-1 mt-1">
            {unreadNotifications.slice(-3).map(n => (
              <li key={n.id} className="text-xs">• {n.message}</li>
            ))}
          </ul>
        </AlertDescription>
      </Alert>
    );
  };

  const Shell = ({ children }: { children: React.ReactNode }) => (
    <div className="flex flex-col items-center justify-center text-center py-12 min-h-[calc(100vh-200px)] px-4">
      <div className="w-full max-w-lg">
        <StatusTracker status={report.status} />
        <NotificationsBanner />
        {children}
      </div>
    </div>
  );

  switch (report.status) {
    case 'submitted_for_generation':
      return (
        <Shell>
          <Card className="shadow-lg">
            <CardHeader className="items-center">
              <div className="p-3 bg-primary/10 rounded-full mb-4 animate-pulse-subtle"><Sparkles className="h-12 w-12 text-primary" /></div>
              <CardTitle className="font-headline text-2xl">Report Generation Initiated</CardTitle>
              <CardDescription>Your request is being processed.</CardDescription>
            </CardHeader>
            <CardContent><p className="text-muted-foreground">Report ID: <span className="font-mono text-xs">{report.id.substring(0, 10)}...</span></p></CardContent>
            <CardFooter><Button onClick={() => router.refresh()} variant="outline" className="w-full" disabled={isOperationInProgress}>Refresh Status</Button></CardFooter>
          </Card>
        </Shell>
      );

    case 'generation_failed':
      return (
        <Shell>
          <Card className="shadow-lg border-destructive">
            <CardHeader className="items-center">
              <div className="p-3 bg-destructive/10 rounded-full mb-4"><ServerCrash className="h-12 w-12 text-destructive" /></div>
              <CardTitle className="font-headline text-2xl text-destructive">Report Generation Failed</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <p className="text-destructive/90">{report.content || "An unexpected error occurred."}</p>
              <Button onClick={() => router.push('/palm-input')} className="w-full">Try Again</Button>
            </CardContent>
          </Card>
        </Shell>
      );

    case 'needs_resubmission':
      return (
        <Shell>
          <Card className="shadow-lg border-amber-400">
            <CardHeader className="items-center">
              <div className="p-3 bg-amber-100 dark:bg-amber-900/30 rounded-full mb-4"><ShieldAlert className="h-12 w-12 text-amber-500" /></div>
              <CardTitle className="font-headline text-2xl">Action Needed: Re-upload Images</CardTitle>
              <CardDescription>Our reviewer needs clearer palm photos.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4 text-left">
              {report.rejectionReason && (
                <Alert variant="destructive">
                  <AlertTriangle className="h-4 w-4" />
                  <AlertTitle>Reason</AlertTitle>
                  <AlertDescription>{report.rejectionReason}</AlertDescription>
                </Alert>
              )}
              <div className="space-y-2">
                <label className="text-sm font-medium">Front of Palm</label>
                <input ref={frontRef} type="file" accept="image/png,image/jpeg" className="hidden" onChange={(e) => handleFile(e, setFrontFile)} />
                <Button variant="outline" className="w-full" onClick={() => frontRef.current?.click()}>
                  <Upload className="mr-2 h-4 w-4" /> {frontFile ? 'Front Image Selected ✓' : 'Choose Front Image'}
                </Button>
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Side of Palm</label>
                <input ref={sideRef} type="file" accept="image/png,image/jpeg" className="hidden" onChange={(e) => handleFile(e, setSideFile)} />
                <Button variant="outline" className="w-full" onClick={() => sideRef.current?.click()}>
                  <Upload className="mr-2 h-4 w-4" /> {sideFile ? 'Side Image Selected ✓' : 'Choose Side Image'}
                </Button>
              </div>
              <Button className="w-full" onClick={handleResubmit} disabled={!frontFile || !sideFile}>
                Resubmit Images for Review
              </Button>
            </CardContent>
          </Card>
        </Shell>
      );

    case 'pending_review':
      return (
        <Shell>
          <Card className="shadow-lg">
            <CardHeader className="items-center">
              <div className="p-3 bg-accent/10 rounded-full mb-4"><Hourglass className="h-12 w-12 text-accent" /></div>
              <CardTitle className="font-headline text-2xl">Pending Editor Review</CardTitle>
              <CardDescription>An expert is reviewing your submission and images.</CardDescription>
            </CardHeader>
            <CardContent><p className="text-muted-foreground">Report ID: <span className="font-mono text-xs">{report.id.substring(0, 10)}...</span></p></CardContent>
            <CardFooter><Button onClick={() => router.refresh()} variant="outline" className="w-full">Refresh Status</Button></CardFooter>
          </Card>
        </Shell>
      );

    case 'pending_admin_approval':
    case 'admin_revision':
      return (
        <Shell>
          <Card className="shadow-lg">
            <CardHeader className="items-center">
              <div className="p-3 bg-accent/10 rounded-full mb-4"><Hourglass className="h-12 w-12 text-accent" /></div>
              <CardTitle className="font-headline text-2xl">Final Quality Approval</CardTitle>
              <CardDescription>Your report passed editor review and is in final approval.</CardDescription>
            </CardHeader>
            <CardContent><p className="text-muted-foreground">Report ID: <span className="font-mono text-xs">{report.id.substring(0, 10)}...</span></p></CardContent>
            <CardFooter><Button onClick={() => router.refresh()} variant="outline" className="w-full">Refresh Status</Button></CardFooter>
          </Card>
        </Shell>
      );

    case 'approved':
      return <ReportDisplay report={report} />;

    default:
      return (
        <Shell>
          <Card className="shadow-lg">
            <CardHeader className="items-center">
              <AlertTriangle className="h-12 w-12 text-destructive mb-2" />
              <CardTitle className="font-headline text-2xl">Unknown Report Status</CardTitle>
            </CardHeader>
            <CardContent>
              <Button onClick={() => router.push('/palm-input')}>Back to Palm Input</Button>
            </CardContent>
          </Card>
        </Shell>
      );
  }
}
