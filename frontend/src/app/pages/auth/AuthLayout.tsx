import type { ReactNode } from 'react';
import { Link } from 'react-router-dom';
import { ShipWheel } from 'lucide-react';
import { images } from '../../data/images';

export default function AuthLayout({
  title,
  subtitle,
  children,
}: {
  title: string;
  subtitle: string;
  children: ReactNode;
}) {
  return (
    <div className="grid min-h-screen lg:grid-cols-2">
      <div className="flex flex-col justify-center px-6 py-12 sm:px-12 lg:px-20">
        <Link to="/" className="flex items-center gap-2.5">
          <span className="flex h-9 w-9 items-center justify-center rounded-sm bg-ink text-white">
            <ShipWheel size={18} />
          </span>
          <span className="font-display text-2xl font-semibold tracking-tight text-ink">
            MERIDIAN <span className="text-cargo">FREIGHT</span>
          </span>
        </Link>
        <div className="mt-12 w-full max-w-md">
          <h1 className="font-display text-3xl font-semibold tracking-tight text-ink">{title}</h1>
          <p className="mt-2 text-[15px] text-ink-mid">{subtitle}</p>
          <div className="mt-8">{children}</div>
        </div>
      </div>
      <div className="relative hidden lg:block">
        <img src={images.stackedContainers} alt="" className="h-full w-full object-cover" />
        <div className="absolute inset-0 bg-gradient-to-t from-ink/80 via-ink/10 to-transparent" />
        <div className="absolute bottom-10 left-10 right-10 text-white">
          <p className="font-mono text-xs text-white/60">Customer portal</p>
          <p className="mt-1 max-w-sm text-lg font-medium">
            Track requests, shipments and documents in one place.
          </p>
        </div>
      </div>
    </div>
  );
}
