
"use client";

import AuthOptions from '@/components/auth/AuthOptions';
import Image from 'next/image';

export default function LandingPage() {
  return (
    <div className="relative flex flex-col items-center justify-center py-8 md:py-12 space-y-12 md:space-y-16 min-h-full">
      <div className="absolute inset-0 z-0 opacity-5">
        <Image
          src="https://placehold.co/1200x800.png"
          alt="Sacred Geometry Background"
          layout="fill"
          objectFit="cover"
          data-ai-hint="sacred geometry pattern"
          priority
        />
      </div>

      {/* Main content area: Auth Options Only */}
      <div className="relative z-10 w-full max-w-md px-4">
        <AuthOptions />
      </div>
    </div>
  );
}
