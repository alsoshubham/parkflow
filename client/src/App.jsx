import { useState } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import { NotificationProvider } from './contexts/NotificationContext';
import AppLayout from './components/layout/AppLayout';
import Login from './pages/auth/Login';
import Dashboard from './pages/dashboard/Dashboard';
import LotManagement from './pages/lots/LotManagement';
import FindParking from './pages/booking/FindParking';
import BookingFlow from './pages/booking/BookingFlow';
import MyBookings from './pages/booking/MyBookings';
import GuardConsole from './pages/guard/GuardConsole';
import UserManagement from './pages/users/UserManagement';
import Reports from './pages/reports/Reports';
import Payments from './pages/payments/Payments';
import LandingPage from './pages/landing/LandingPage';

function ProtectedRoute({ children, roles }) {
  const { user } = useAuth();
  if (!user) return <Navigate to="/login" replace />;
  if (roles && !roles.includes(user.role)) return <Navigate to="/dashboard" replace />;
  return children;
}

function AppRoutes() {
  const { user } = useAuth();
  return (
    <Routes>
      <Route path="/login" element={!user ? <Login /> : <Navigate to="/dashboard" replace />} />
      <Route path="/" element={!user ? <LandingPage /> : <Navigate to="/dashboard" replace />} />
      <Route element={<ProtectedRoute><AppLayout /></ProtectedRoute>}>
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/lots" element={<ProtectedRoute roles={['Admin','Operator']}><LotManagement /></ProtectedRoute>} />
        <Route path="/find-parking" element={<FindParking />} />
        <Route path="/book/:lotId" element={<BookingFlow />} />
        <Route path="/my-bookings" element={<MyBookings />} />
        <Route path="/guard" element={<ProtectedRoute roles={['Admin','Guard']}><GuardConsole /></ProtectedRoute>} />
        <Route path="/payments" element={<Payments />} />
        <Route path="/users" element={<ProtectedRoute roles={['Admin']}><UserManagement /></ProtectedRoute>} />
        <Route path="/reports" element={<ProtectedRoute roles={['Admin','Operator']}><Reports /></ProtectedRoute>} />
      </Route>
      <Route path="*" element={<Navigate to="/dashboard" replace />} />
    </Routes>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <NotificationProvider>
        <BrowserRouter>
          <AppRoutes />
          <Toaster
            position="top-right"
            toastOptions={{
              style: {
                background: '#0d1526',
                color: '#f1f5f9',
                border: '1px solid rgba(255,255,255,0.08)',
                borderRadius: '12px',
                fontSize: '14px',
              },
              success: { iconTheme: { primary: '#10b981', secondary: '#0d1526' } },
              error: { iconTheme: { primary: '#ef4444', secondary: '#0d1526' } },
            }}
          />
        </BrowserRouter>
      </NotificationProvider>
    </AuthProvider>
  );
}
