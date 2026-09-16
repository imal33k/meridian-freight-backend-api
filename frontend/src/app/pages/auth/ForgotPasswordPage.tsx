import { useState, type FormEvent } from 'react';
import { Link } from 'react-router-dom';
import { CheckCircle2, AlertCircle } from 'lucide-react';
import AuthLayout from './AuthLayout';
import { TextInput } from '../../components/ui/Field';
import Button from '../../components/ui/Button';
import * as authService from '../../services/authService';

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState('');
  const [error, setError] = useState('');
  const [status, setStatus] = useState<'idle' | 'submitting' | 'sent' | 'error'>('idle');

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    if (!email.trim() || !/^\S+@\S+\.\S+$/.test(email)) {
      setError('Enter a valid email address.');
      return;
    }
    setError('');
    setStatus('submitting');
    try {
      await authService.forgotPassword(email);
      setStatus('sent');
    } catch {
      setStatus('error');
    }
  }

  if (status === 'sent') {
    return (
      <AuthLayout title="Check your email" subtitle="">
        <div className="flex flex-col items-start gap-3 rounded-sm border border-success/30 bg-success/5 p-6">
          <CheckCircle2 size={26} className="text-success" />
          <p className="text-[15px] text-ink-mid">
            If an account exists for <span className="font-medium text-ink">{email}</span>, we've sent a link
            to reset your password.
          </p>
          <Link to="/login" className="text-sm font-medium text-cargo hover:text-cargo-dark">
            Back to log in
          </Link>
        </div>
      </AuthLayout>
    );
  }

  return (
    <AuthLayout title="Reset your password" subtitle="Enter your email and we'll send you a reset link.">
      <form onSubmit={handleSubmit} noValidate className="flex flex-col gap-5">
        {status === 'error' && (
          <div className="flex items-center gap-2.5 rounded-sm border border-danger/30 bg-danger/5 px-4 py-3 text-sm text-danger">
            <AlertCircle size={16} />
            Something went wrong. Please try again.
          </div>
        )}
        <TextInput
          id="email"
          type="email"
          label="Email address"
          required
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          error={error}
          placeholder="you@company.com"
        />
        <Button type="submit" size="lg" fullWidth disabled={status === 'submitting'}>
          {status === 'submitting' ? 'Sending link…' : 'Send reset link'}
        </Button>
      </form>
      <p className="mt-8 text-sm text-ink-mid">
        Remembered your password?{' '}
        <Link to="/login" className="font-medium text-cargo hover:text-cargo-dark">
          Log in
        </Link>
      </p>
    </AuthLayout>
  );
}
