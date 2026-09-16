import { useEffect, useState } from 'react';
import { Bell, CheckCheck } from 'lucide-react';
import PageHeader from '../../components/shared/PageHeader';
import Spinner from '../../components/shared/Spinner';
import EmptyState from '../../components/shared/EmptyState';
import Button from '../../components/ui/Button';
import { useAuth } from '../../context/AuthContext';
import * as notificationsService from '../../services/notificationsService';
import type { AppNotification } from '../../types';
import { timeAgo } from '../../utils/format';

export default function PortalNotificationsPage() {
  const { user } = useAuth();
  const [notifications, setNotifications] = useState<AppNotification[] | null>(null);

  useEffect(() => {
    if (!user) return;
    notificationsService.listNotifications(user.id).then(setNotifications);
  }, [user]);

  async function handleMarkAll() {
    if (!user) return;
    await notificationsService.markAllAsRead(user.id);
    setNotifications((prev) => prev?.map((n) => ({ ...n, read: true })) ?? null);
  }

  async function handleMarkOne(id: string) {
    await notificationsService.markAsRead(id);
    setNotifications((prev) => prev?.map((n) => (n.id === id ? { ...n, read: true } : n)) ?? null);
  }

  const unreadCount = notifications?.filter((n) => !n.read).length ?? 0;

  return (
    <div className="p-6 lg:p-10">
      <PageHeader
        title="Notifications"
        description="Updates about your shipments, requests and quotes."
        actions={
          unreadCount > 0 ? (
            <Button variant="ghost" size="sm" icon={<CheckCheck size={15} />} iconPosition="left" onClick={handleMarkAll}>
              Mark all as read
            </Button>
          ) : undefined
        }
      />

      {!notifications ? (
        <Spinner label="Loading notifications" />
      ) : notifications.length === 0 ? (
        <EmptyState icon={<Bell size={20} />} title="No notifications" description="You're all caught up." />
      ) : (
        <div className="overflow-hidden rounded-sm border border-line bg-white">
          <ul className="divide-y divide-line">
            {notifications.map((n) => (
              <li
                key={n.id}
                onClick={() => !n.read && handleMarkOne(n.id)}
                className={`flex cursor-pointer items-start gap-3 px-5 py-4 ${!n.read ? 'bg-cargo/5' : ''}`}
              >
                <span className={`mt-1.5 h-2 w-2 shrink-0 rounded-full ${n.read ? 'bg-line' : 'bg-cargo'}`} />
                <div className="min-w-0">
                  <p className="text-[15px] font-medium text-ink">{n.title}</p>
                  <p className="mt-0.5 text-sm text-ink-mid">{n.message}</p>
                  <p className="mt-1 text-xs text-ink-mid">{timeAgo(n.createdAt)}</p>
                </div>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
