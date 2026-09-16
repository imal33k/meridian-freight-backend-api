import { useState, type FormEvent } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Eye, EyeOff, AlertCircle } from 'lucide-react';
import AuthLayout from './AuthLayout';
import { TextInput } from '../../components/ui/Field';
import Button from '../../components/ui/Button';
import * as authService from '../../services/authService';

interface FormState {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  company: string;
  country: string;
  password: string;
  confirmPassword: string;
}

const initialForm: FormState = {
  firstName: '',
  lastName: '',
  email: '',
  phone: '',
  company: '',
  country: '',
  password: '',
  confirmPassword: '',
};

export default function RegisterPage() {
  const navigate = useNavigate();
  const [form, setForm] = useState<FormState>(initialForm);
  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState<Partial<Record<keyof FormState, string>>>({});
  const [status, setStatus] = useState<'idle' | 'submitting' | 'error'>('idle');
  const [errorMessage, setErrorMessage] = useState('');

  const update = (key: keyof FormState) => (e: React.ChangeEvent<HTMLInputElement>) =>
    setForm((f) => ({ ...f, [key]: e.target.value }));

  function validate(): boolean {
    const next: Partial<Record<keyof FormState, string>> = {};
    if (!form.firstName.trim()) next.firstName = 'Required';
    if (!form.lastName.trim()) next.lastName = 'Required';
    if (!form.email.trim()) next.email = 'Required';
    else if (!/^\S+@\S+\.\S+$/.test(form.email)) next.email = 'Enter a valid email address.';
    if (!form.phone.trim()) next.phone = 'Required';
    if (!form.company.trim()) next.company = 'Required';
    if (!form.country.trim()) next.country = 'Required';
    if (!form.password) next.password = 'Required';
    else if (form.password.length < 8) next.password = 'Use at least 8 characters.';
    if (form.confirmPassword !== form.password) next.confirmPassword = 'Passwords do not match.';
    setErrors(next);
    return Object.keys(next).length === 0;
  }

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    if (!validate()) return;
    setStatus('submitting');
    try {
      await authService.register(form);
      navigate('/verify-email', { state: { email: form.email } });
    } catch (err) {
      setStatus('error');
      setErrorMessage(err instanceof Error ? err.message : 'Unable to create your account.');
    }
  }

  return (
    <AuthLayout title="Create your customer account" subtitle="Register to request shipments and track your cargo.">
      <form onSubmit={handleSubmit} noValidate className="flex flex-col gap-5">
        {status === 'error' && (
          <div className="flex items-center gap-2.5 rounded-sm border border-danger/30 bg-danger/5 px-4 py-3 text-sm text-danger">
            <AlertCircle size={16} />
            {errorMessage}
          </div>
        )}
        <div className="grid grid-cols-2 gap-4">
          <TextInput id="firstName" label="First name" required value={form.firstName} onChange={update('firstName')} error={errors.firstName} />
          <TextInput id="lastName" label="Last name" required value={form.lastName} onChange={update('lastName')} error={errors.lastName} />
        </div>
        <TextInput id="email" type="email" label="Email address" required value={form.email} onChange={update('email')} error={errors.email} autoComplete="email" />
        <div className="grid grid-cols-2 gap-4">
          <TextInput id="phone" type="tel" label="Phone number" required value={form.phone} onChange={update('phone')} error={errors.phone} />
          <TextInput id="country" label="Country" required value={form.country} onChange={update('country')} error={errors.country} placeholder="Nigeria" />
        </div>
        <TextInput id="company" label="Company" required value={form.company} onChange={update('company')} error={errors.company} />
        <div className="relative">
          <TextInput
            id="password"
            type={showPassword ? 'text' : 'password'}
            label="Password"
            required
            value={form.password}
            onChange={update('password')}
            error={errors.password}
            hint={!errors.password ? 'At least 8 characters.' : undefined}
            autoComplete="new-password"
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
        <TextInput
          id="confirmPassword"
          type={showPassword ? 'text' : 'password'}
          label="Confirm password"
          required
          value={form.confirmPassword}
          onChange={update('confirmPassword')}
          error={errors.confirmPassword}
        />
        <Button type="submit" size="lg" fullWidth disabled={status === 'submitting'}>
          {status === 'submitting' ? 'Creating account…' : 'Create account'}
        </Button>
      </form>
      <p className="mt-8 text-sm text-ink-mid">
        Already have an account?{' '}
        <Link to="/login" className="font-medium text-cargo hover:text-cargo-dark">
          Log in
        </Link>
      </p>
    </AuthLayout>
  );
}
