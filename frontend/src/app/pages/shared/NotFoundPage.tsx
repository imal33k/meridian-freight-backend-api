import { Link } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';

export default function NotFoundPage() {
  return (
    <div className="flex min-h-[70vh] flex-col items-center justify-center gap-4 px-6 text-center">
      <p className="font-mono text-sm text-cargo">404</p>
      <h1 className="font-display text-4xl font-semibold text-ink">Page not found</h1>
      <p className="max-w-sm text-[15px] text-ink-mid">
        The page you're looking for doesn't exist or may have moved.
      </p>
      <Link to="/" className="flex items-center gap-1.5 text-sm font-medium text-cargo hover:text-cargo-dark">
        <ArrowLeft size={14} /> Back to home
      </Link>
    </div>
  );
}
