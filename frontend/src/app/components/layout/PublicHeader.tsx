import { useState } from 'react';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import { Menu, X, ArrowRight, ShipWheel } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

const navItems = [
  { label: 'About', to: '/about' },
  { label: 'Services', to: '/services' },
  { label: 'Destinations', to: '/destinations' },
  { label: 'Track shipment', to: '/track' },
  { label: 'Contact', to: '/contact' },
];

export default function PublicHeader() {
  const [open, setOpen] = useState(false);
  const { isAuthenticated, user } = useAuth();
  const navigate = useNavigate();

  return (
    <header className="sticky top-0 z-40 border-b border-line bg-paper/95 backdrop-blur">
      <div className="container-page flex h-18 items-center justify-between py-3">
        <Link to="/" className="flex items-center gap-2.5" onClick={() => setOpen(false)}>
          <span className="flex h-9 w-9 items-center justify-center rounded-sm bg-ink text-white">
            <ShipWheel size={18} strokeWidth={2} />
          </span>
          <span className="font-display text-2xl font-semibold tracking-tight text-ink">
            MERIDIAN <span className="text-cargo">FREIGHT</span>
          </span>
        </Link>

        <nav className="hidden items-center gap-8 lg:flex">
          {navItems.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              className={({ isActive }) =>
                `text-[15px] font-medium transition-colors hover:text-cargo ${
                  isActive ? 'text-cargo' : 'text-ink-mid'
                }`
              }
            >
              {item.label}
            </NavLink>
          ))}
        </nav>

        <div className="hidden items-center gap-3 lg:flex">
          {isAuthenticated ? (
            <button
              onClick={() => navigate(user?.role === 'admin' ? '/admin' : '/portal')}
              className="flex items-center gap-2 rounded-sm border border-line px-4 py-2 text-sm font-medium text-ink hover:border-ink"
            >
              {user?.role === 'admin' ? 'Operations dashboard' : 'My dashboard'}
              <ArrowRight size={15} />
            </button>
          ) : (
            <>
              <Link to="/login" className="text-[15px] font-medium text-ink-mid hover:text-ink">
                Log in
              </Link>
              <Link
                to="/book-a-call"
                className="flex items-center gap-2 rounded-sm bg-cargo px-4 py-2.5 text-sm font-medium text-white hover:bg-cargo-dark"
              >
                Book a call
              </Link>
            </>
          )}
        </div>

        <button
          className="flex h-10 w-10 items-center justify-center rounded-sm border border-line lg:hidden"
          onClick={() => setOpen((v) => !v)}
          aria-label={open ? 'Close menu' : 'Open menu'}
          aria-expanded={open}
        >
          {open ? <X size={20} /> : <Menu size={20} />}
        </button>
      </div>

      {open && (
        <div className="border-t border-line bg-paper lg:hidden">
          <div className="container-page flex flex-col gap-1 py-4">
            {navItems.map((item) => (
              <NavLink
                key={item.to}
                to={item.to}
                onClick={() => setOpen(false)}
                className={({ isActive }) =>
                  `rounded-sm px-3 py-2.5 text-[15px] font-medium ${
                    isActive ? 'bg-ink/5 text-cargo' : 'text-ink-mid'
                  }`
                }
              >
                {item.label}
              </NavLink>
            ))}
            <div className="mt-2 flex flex-col gap-2 border-t border-line pt-4">
              {isAuthenticated ? (
                <button
                  onClick={() => {
                    setOpen(false);
                    navigate(user?.role === 'admin' ? '/admin' : '/portal');
                  }}
                  className="rounded-sm border border-line px-3 py-2.5 text-center text-sm font-medium"
                >
                  {user?.role === 'admin' ? 'Operations dashboard' : 'My dashboard'}
                </button>
              ) : (
                <>
                  <Link
                    to="/login"
                    onClick={() => setOpen(false)}
                    className="rounded-sm border border-line px-3 py-2.5 text-center text-sm font-medium"
                  >
                    Log in
                  </Link>
                  <Link
                    to="/book-a-call"
                    onClick={() => setOpen(false)}
                    className="rounded-sm bg-cargo px-3 py-2.5 text-center text-sm font-medium text-white"
                  >
                    Book a call
                  </Link>
                </>
              )}
            </div>
          </div>
        </div>
      )}
    </header>
  );
}
