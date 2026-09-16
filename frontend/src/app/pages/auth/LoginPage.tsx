import { useState, type FormEvent } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Eye, EyeOff, AlertCircle } from 'lucide-react';
import AuthLayout from './AuthLayout';
import { TextInput } from '../../components/ui/Field';
import Button from '../../components/ui/Button';
import { useAuth } from '../../context/AuthContext';

export default function LoginPage() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation() as { state?: { from?: string } };

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState<{ email?: string; password?: string }>({});
  const [status, setStatus] = useState<'idle' | 'submitting' | 'error'>('idle');
  const [errorMessage, setErrorMessage] = useState('');

  function validate(): boolean {
    const next: { email?: string; password?: string } = {};
    if (!email.trim()) next.email = 'Please enter your email address.';
    if (!password) next.password = 'Please enter your password.';
    setErrors(next);
    return Object.keys(next).length === 0;
  }

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    if (!validate()) return;
    setStatus('submitting');
    try {
      const user = await login(email, password);
      const fallback = user.role === 'admin' ? '/admin' : '/portal';
      navigate(location.state?.from ?? fallback, { replace: true });
    } catch (err) {
      setStatus('error');
      setErrorMessage(err instanceof Error ? err.message : 'Unable to log in. Please try again.');
    }
  }

  return (
    <AuthLayout title="Log in to your account" subtitle="Access your shipments, requests and documents.">
      <form onSubmit={handleSubmit} noValidate className="flex flex-col gap-5">
        {status === 'error' && (
          <div className="flex items-center gap-2.5 rounded-sm border border-danger/30 bg-danger/5 px-4 py-3 text-sm text-danger">
            <AlertCircle size={16} />
            {errorMessage}
          </div>
        )}
        <TextInput
          id="email"
          type="email"
          label="Email address"
          required
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          error={errors.email}
          placeholder="you@company.com"
          autoComplete="email"
        />
        <div className="relative">
          <TextInput
            id="password"
            type={showPassword ? 'text' : 'password'}
            label="Password"
            required
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            error={errors.password}
            placeholder="Enter your password"
            autoComplete="current-password"
            className="pr-11"
          />
          <button
            type="button"
            onClick={() => setShowPassword((v) => !v)}
            className="absolute right-3.5 top-[38px] text-ink-mid hover:text-ink"
            aria-label={showPassword ? 'Hide password' : 'Show password'}
          >
            {showPassword ? <EyeOff size={17} /> : <Eye size={17} />}
          </button>
        </div>
        <div className="flex justify-end">
          <Link to="/forgot-password" className="text-sm font-medium text-cargo hover:text-cargo-dark">
            Forgot password?
          </Link>
        </div>
        <Button type="submit" size="lg" fullWidth disabled={status === 'submitting'}>
          {status === 'submitting' ? 'Logging in…' : 'Log in'}
        </Button>
        <p className="rounded-sm bg-paper-dim px-4 py-3 text-xs text-ink-mid">
          Demo: use <span className="font-mono">adaeze.okonkwo@lagosfoodsexports.com</span> for a customer
          account or <span className="font-mono">michael.adeyemi@meridianfreight.com</span> for staff access,
          with any password.
        </p>
      </form>
      <p className="mt-8 text-sm text-ink-mid">
        Don't have an account?{' '}
        <Link to="/register" className="font-medium text-cargo hover:text-cargo-dark">
          Create one
        </Link>
      </p>
    </AuthLayout>
  );
}
