
"use client";

import AuthOptions from '@/components/auth/AuthOptions';

export default function AuthenticationPage() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[calc(100vh-200px)]"> {/* Adjust height based on header/footer */}
      <AuthOptions />
    </div>
  );
}
