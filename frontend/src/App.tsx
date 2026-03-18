// ─────────────────────────────────────────────────────────
// App Root — React Router setup with animated routes
// ─────────────────────────────────────────────────────────

import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { AnimatePresence } from 'framer-motion';
import { Toaster } from 'react-hot-toast';
import { AuthProvider } from './context/AuthContext';
import { LandingPage } from './pages/LandingPage';
import { LoginPage } from './pages/LoginPage';
import { GuestPage } from './pages/GuestPage';
import { AdminDashboard } from './pages/AdminDashboard';
import { DeveloperDashboard } from './pages/DeveloperDashboard';
import { MerchantDashboard } from './pages/MerchantDashboard';
import { ProtectedRoute } from './components/ProtectedRoute';

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <AnimatePresence mode="wait">
          <Routes>
            <Route path="/" element={<LandingPage />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/guest" element={<GuestPage />} />

            {/* Protected Role-Based Routes */}
            <Route path="/admin" element={
              <ProtectedRoute role="admin">
                <AdminDashboard />
              </ProtectedRoute>
            } />
            <Route path="/developer" element={
              <ProtectedRoute role="developer">
                <DeveloperDashboard />
              </ProtectedRoute>
            } />
            <Route path="/merchant" element={
              <ProtectedRoute role="admin">
                <MerchantDashboard />
              </ProtectedRoute>
            } />
          </Routes>
        </AnimatePresence>

        {/* Global Toast Notifications */}
        <Toaster
          position="top-right"
          toastOptions={{
            duration: 3000,
            style: {
              borderRadius: '12px',
              background: '#1f2937',
              color: '#fff',
              fontSize: '14px',
              fontWeight: 600,
            },
            success: {
              iconTheme: { primary: '#10b981', secondary: '#fff' },
            },
            error: {
              iconTheme: { primary: '#ef4444', secondary: '#fff' },
            },
          }}
        />
      </BrowserRouter>
    </AuthProvider>
  );
}
