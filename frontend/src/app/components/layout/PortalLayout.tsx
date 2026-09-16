import { Outlet } from 'react-router-dom';
import { LayoutGrid, FileText, PackageSearch, FolderClosed, Bell, UserCircle } from 'lucide-react';
import DashboardShell from './DashboardShell';
import { useEffect, useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import * as notificationsService from '../../services/notificationsService';

export default function PortalLayout() {
  const { user } = useAuth();
  const [unread, setUnread] = useState(0);

  useEffect(() => {
    if (!user) return;
    notificationsService.listNotifications(user.id).then((items) => {
      setUnread(items.filter((n) => !n.read).length);
    });
  }, [user]);

  const navItems = [
    { label: 'Overview', to: '/portal', icon: <LayoutGrid size={17} />, end: true },
    { label: 'Requests', to: '/portal/requests', icon: <FileText size={17} /> },
    { label: 'Shipments', to: '/portal/shipments', icon: <PackageSearch size={17} /> },
    { label: 'Documents', to: '/portal/documents', icon: <FolderClosed size={17} /> },
    { label: 'Notifications', to: '/portal/notifications', icon: <Bell size={17} /> },
    { label: 'Profile', to: '/portal/profile', icon: <UserCircle size={17} /> },
  ];

  return (
    <DashboardShell navItems={navItems} homeLabel="Customer portal" notificationCount={unread} notificationHref="/portal/notifications">
      <Outlet />
    </DashboardShell>
  );
}
