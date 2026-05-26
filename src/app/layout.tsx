
import type { Metadata, Viewport } from 'next';
import './globals.css';
import { AppProvider } from '@/context/AppContext';
import { Toaster } from '@/components/ui/toaster';
import Header from '@/components/shared/Header';
import Footer from '@/components/shared/Footer';
import MobileNav from '@/components/shared/MobileNav';
import { FirebaseClientProvider } from '@/firebase/client-provider';
import { Suspense } from 'react';

export const metadata: Metadata = {
  title: 'PalmVerse - AI Palm Reading',
  description: 'Discover your destiny with AI-powered palm readings.',
  manifest: "/manifest.json",
  appleWebApp: {
    capable: true,
    statusBarStyle: "default",
    title: "PalmVerse",
  },
  formatDetection: {
    telephone: false,
  },
};

export const viewport: Viewport = {
  themeColor: "#050814",
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
};
export default function RootLayout({
  children,
}: Readonly<{
  children: React.React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
      </head>
      <body className="font-body antialiased flex flex-col min-h-screen pb-20 md:pb-0">
        <FirebaseClientProvider>
          <AppProvider>
            <Suspense fallback={null}>
              <Header />
            </Suspense>
            <main className="flex-grow container mx-auto px-4 py-8">
              {children}
            </main>
            <Footer />
            <Suspense fallback={null}>
              <MobileNav />
            </Suspense>
            <Toaster />
          </AppProvider>
        </FirebaseClientProvider>
      </body>
    </html>
  );
}
