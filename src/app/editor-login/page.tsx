"use client";
import OtpForm from '@/components/auth/OtpForm';
import ParticlesBackground from '@/components/ParticlesBackground';
import SunAndPlanets from '@/components/SunAndPlanets';

export default function EditorLoginPage() {
  return (
    <main className="min-h-screen relative flex items-center justify-center pt-20 overflow-hidden">
      <ParticlesBackground />
      <SunAndPlanets />
      <div className="container relative z-10 mx-auto px-4">
        <OtpForm mode="editor" />
      </div>
    </main>
  );
}
