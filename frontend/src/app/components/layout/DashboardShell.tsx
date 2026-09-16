import { useState, type ReactNode } from 'react';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import { Menu, X, ShipWheel, LogOut, Bell } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

export interface DashboardNavItem {
  label: string;
  to: string;
  icon: ReactNode;
  end?: boolean;
}

interface Props {
  navItems: DashboardNavItem[];
  homeLabel: string;
  notificationCount?: number;
  notificationHref?: string;
  children: ReactNode;
}

export default function DashboardShell({ navItems, homeLabel, notificationCount = 0, notificationHref, children }: Props) {
  const [open, setOpen] = useState(false);
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
    navigate('/');
  };

  const SidebarContent = (
    <div className="flex h-full flex-col">
      <div className="flex items-center justify-between px-5 py-5">
        <Link to="/" className="flex items-center gap-2.5">
          <span className="flex h-8 w-8 items-center justify-center rounded-sm bg-cargo">
            <ShipWheel size={16} strokeWidth={2} className="text-white" />
          </span>
          <span className="font-display text-xl font-semibold tracking-tight text-white">
            MERIDIAN
          </span>
        </Link>
        <button className="text-white/60 lg:hidden" onClick={() => setOpen(false)} aria-label="Close menu">
          <X size={20} />
        </button>
      </div>

      <p className="px-5 pb-2 text-xs font-medium uppercase tracking-wide text-white/35">{homeLabel}</p>

      <nav className="flex flex-1 flex-col gap-0.5 px-3">
        {navItems.map((item) => (
          <NavLink
            key={item.to}
            to={item.to}
            end={item.end}
            onClick={() => setOpen(false)}
            className={({ isActive }) =>
              `flex items-center gap-3 rounded-sm px-3 py-2.5 text-[14.5px] font-medium transition-colors ${
                isActive ? 'bg-white/10 text-white' : 'text-white/60 hover:bg-white/5 hover:text-white'
              }`
            }
          >
            {item.icon}
            {item.label}
            {item.to === notificationHref && notificationCount > 0 && (
              <span className="ml-auto flex h-5 min-w-5 items-center justify-center rounded-full bg-cargo px-1 text-[11px] font-semibold text-white">
                {notificationCount}
              </span>
            )}
          </NavLink>
        ))}
      </nav>

      <div className="border-t border-white/10 px-5 py-4">
        <div className="mb-3 flex items-center gap-2.5">
          <span className="flex h-9 w-9 items-center justify-center rounded-full bg-white/10 text-sm font-semibold text-white">
            {user ? `${user.firstName[0]}${user.lastName[0]}` : '—'}
          </span>
          <div className="min-w-0">
            <p className="truncate text-sm font-medium text-white">
              {user ? `${user.firstName} ${user.lastName}` : ''}
            </p>
            <p className="truncate text-xs text-white/45">{user?.company}</p>
          </div>
        </div>
        <button
          onClick={handleLogout}
          className="flex w-full items-center gap-2 rounded-sm border border-white/15 px-3 py-2 text-sm font-medium text-white/70 hover:border-white/30 hover:text-white"
        >
          <LogOut size={15} />
          Log out
        </button>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-paper-dim lg:flex">
      {/* Desktop sidebar */}
      <aside className="hidden w-64 shrink-0 bg-ink lg:block">
        <div className="sticky top-0 h-screen">{SidebarContent}</div>
      </aside>

      {/* Mobile top bar */}
      <div className="flex items-center justify-between border-b border-line-dark bg-ink px-4 py-3 lg:hidden">
        <Link to="/" className="flex items-center gap-2">
          <span className="flex h-7 w-7 items-center justify-center rounded-sm bg-cargo">
            <ShipWheel size={14} className="text-white" />
          </span>
          <span className="font-display text-lg font-semibold text-white">MERIDIAN</span>
        </Link>
        <div className="flex items-center gap-3">
          {notificationHref && (
            <Link to={notificationHref} className="relative text-white/70">
              <Bell size={20} />
              {notificationCount > 0 && (
                <span className="absolute -right-1 -top-1 flex h-4 w-4 items-center justify-center rounded-full bg-cargo text-[10px] font-semibold text-white">
                  {notificationCount}
                </span>
              )}
            </Link>
          )}
          <button onClick={() => setOpen(true)} aria-label="Open menu" className="text-white">
            <Menu size={22} />
          </button>
        </div>
      </div>

      {open && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <div className="absolute inset-0 bg-black/40" onClick={() => setOpen(false)} />
          <div className="absolute inset-y-0 left-0 w-72 bg-ink">{SidebarContent}</div>
        </div>
      )}

      <div className="flex-1 min-w-0">{children}</div>
    </div>
  );
}
