import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './app/context/AuthContext';
import ProtectedRoute from './app/components/shared/ProtectedRoute';

import PublicLayout from './app/components/layout/PublicLayout';
import HomePage from './app/pages/public/HomePage';
import AboutPage from './app/pages/public/AboutPage';
import ServicesPage from './app/pages/public/ServicesPage';
import DestinationsPage from './app/pages/public/DestinationsPage';
import ContactPage from './app/pages/public/ContactPage';
import BookACallPage from './app/pages/public/BookACallPage';
import TrackPage from './app/pages/public/TrackPage';

import LoginPage from './app/pages/auth/LoginPage';
import RegisterPage from './app/pages/auth/RegisterPage';
import ForgotPasswordPage from './app/pages/auth/ForgotPasswordPage';
import VerifyEmailPage from './app/pages/auth/VerifyEmailPage';

import PortalLayout from './app/components/layout/PortalLayout';
import PortalOverviewPage from './app/pages/portal/PortalOverviewPage';
import PortalRequestsPage from './app/pages/portal/PortalRequestsPage';
import NewRequestPage from './app/pages/portal/NewRequestPage';
import RequestDetailPage from './app/pages/portal/RequestDetailPage';
import PortalShipmentsPage from './app/pages/portal/PortalShipmentsPage';
import ShipmentDetailPage from './app/pages/portal/ShipmentDetailPage';
import PortalDocumentsPage from './app/pages/portal/PortalDocumentsPage';
import PortalNotificationsPage from './app/pages/portal/PortalNotificationsPage';
import PortalProfilePage from './app/pages/portal/PortalProfilePage';

import AdminLayout from './app/components/layout/AdminLayout';
import AdminOverviewPage from './app/pages/admin/AdminOverviewPage';
import AdminCustomersPage from './app/pages/admin/AdminCustomersPage';
import AdminCustomerDetailPage from './app/pages/admin/AdminCustomerDetailPage';
import AdminRequestsPage from './app/pages/admin/AdminRequestsPage';
import AdminRequestDetailPage from './app/pages/admin/AdminRequestDetailPage';
import AdminShipmentsPage from './app/pages/admin/AdminShipmentsPage';
import AdminShipmentDetailPage from './app/pages/admin/AdminShipmentDetailPage';
import AdminDocumentsPage from './app/pages/admin/AdminDocumentsPage';
import AdminBookingsPage from './app/pages/admin/AdminBookingsPage';
import AdminMessagesPage from './app/pages/admin/AdminMessagesPage';

import NotFoundPage from './app/pages/shared/NotFoundPage';

export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <Routes>
          <Route element={<PublicLayout />}>
            <Route path="/" element={<HomePage />} />
            <Route path="/about" element={<AboutPage />} />
            <Route path="/services" element={<ServicesPage />} />
            <Route path="/destinations" element={<DestinationsPage />} />
            <Route path="/contact" element={<ContactPage />} />
            <Route path="/book-a-call" element={<BookACallPage />} />
            <Route path="/track" element={<TrackPage />} />
          </Route>

          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route path="/forgot-password" element={<ForgotPasswordPage />} />
          <Route path="/verify-email" element={<VerifyEmailPage />} />

          <Route
            path="/portal"
            element={
              <ProtectedRoute role="customer">
                <PortalLayout />
              </ProtectedRoute>
            }
          >
            <Route index element={<PortalOverviewPage />} />
            <Route path="requests" element={<PortalRequestsPage />} />
            <Route path="requests/new" element={<NewRequestPage />} />
            <Route path="requests/:id" element={<RequestDetailPage />} />
            <Route path="shipments" element={<PortalShipmentsPage />} />
            <Route path="shipments/:id" element={<ShipmentDetailPage />} />
            <Route path="documents" element={<PortalDocumentsPage />} />
            <Route path="notifications" element={<PortalNotificationsPage />} />
            <Route path="profile" element={<PortalProfilePage />} />
          </Route>

          <Route
            path="/admin"
            element={
              <ProtectedRoute role="admin">
                <AdminLayout />
              </ProtectedRoute>
            }
          >
            <Route index element={<AdminOverviewPage />} />
            <Route path="customers" element={<AdminCustomersPage />} />
            <Route path="customers/:id" element={<AdminCustomerDetailPage />} />
            <Route path="requests" element={<AdminRequestsPage />} />
            <Route path="requests/:id" element={<AdminRequestDetailPage />} />
            <Route path="shipments" element={<AdminShipmentsPage />} />
            <Route path="shipments/:id" element={<AdminShipmentDetailPage />} />
            <Route path="documents" element={<AdminDocumentsPage />} />
            <Route path="bookings" element={<AdminBookingsPage />} />
            <Route path="messages" element={<AdminMessagesPage />} />
          </Route>

          <Route path="*" element={<NotFoundPage />} />
        </Routes>
      </AuthProvider>
    </BrowserRouter>
  );
}
