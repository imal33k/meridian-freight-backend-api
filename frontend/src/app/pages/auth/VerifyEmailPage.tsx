import { useLocation } from 'react-router-dom';
import { MailCheck } from 'lucide-react';
import AuthLayout from './AuthLayout';
import Button from '../../components/ui/Button';

export default function VerifyEmailPage() {
  const location = useLocation() as { state?: { email?: string } };
  const email = location.state?.email ?? 'your inbox';

  return (
    <AuthLayout title="Verify your email" subtitle="">
      <div className="flex flex-col items-start gap-4 rounded-sm border border-line bg-white p-6">
        <span className="flex h-12 w-12 items-center justify-center rounded-full bg-cargo/10 text-cargo">
          <MailCheck size={22} />
        </span>
        <p className="text-[15px] text-ink-mid">
          We've sent a verification link to <span className="font-medium text-ink">{email}</span>. Click the
          link to activate your account, then log in to access your dashboard.
        </p>
        <Button as="link" to="/login" variant="secondary">
          Continue to log in
        </Button>
      </div>
    </AuthLayout>
  );
}
