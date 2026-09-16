import { Outlet } from 'react-router-dom';
import { LayoutGrid, Users, FileText, PackageSearch, FolderClosed, CalendarClock, MessageSquare } from 'lucide-react';
import DashboardShell from './DashboardShell';

const navItems = [
  { label: 'Overview', to: '/admin', icon: <LayoutGrid size={17} />, end: true },
  { label: 'Customers', to: '/admin/customers', icon: <Users size={17} /> },
  { label: 'Requests', to: '/admin/requests', icon: <FileText size={17} /> },
  { label: 'Shipments', to: '/admin/shipments', icon: <PackageSearch size={17} /> },
  { label: 'Documents', to: '/admin/documents', icon: <FolderClosed size={17} /> },
  { label: 'Bookings', to: '/admin/bookings', icon: <CalendarClock size={17} /> },
  { label: 'Messages', to: '/admin/messages', icon: <MessageSquare size={17} /> },
];

export default function AdminLayout() {
  return (
    <DashboardShell navItems={navItems} homeLabel="Operations dashboard">
      <Outlet />
    </DashboardShell>
  );
}
