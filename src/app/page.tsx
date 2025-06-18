
import OtpForm from '@/components/auth/OtpForm';

export default function LoginPage() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[calc(100vh-200px)]"> {/* Adjust height based on header/footer */}
      <OtpForm />
    </div>
  );
}
