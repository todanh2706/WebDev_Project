import './App.css';
import { AuthProvider } from "./contexts/authProvider";
import Home from './pages/Home';
import LogIn from './pages/LogIn';
import Register from './pages/Register';
import OTPVerification from './pages/OTPVerification';
import CategoryProducts from './pages/CategoryProducts';
import ProductDetail from './pages/ProductDetail';
import OAuthCallback from './pages/OAuthCallback';
import { ToastProvider } from './contexts/ToastContext';
import { BrowserRouter, Routes, Route, useLocation, Navigate } from "react-router-dom";
import TopNavBar from './components/layout/TopNavBar';
import SearchResults from './pages/SearchResults';
import AllProducts from './pages/AllProducts';
import MyProducts from './pages/MyProducts';
import Profile from './pages/Profile';
import OrderCompletion from './pages/OrderCompletion';
import AdminLayout from './components/layout/AdminLayout';
import AdminProducts from './pages/admin/AdminProducts';
import AdminUsers from './pages/admin/AdminUsers';
import AdminUpgradeRequests from './pages/admin/AdminUpgradeRequests';
import AdminSettings from './pages/admin/AdminSettings';

import ProtectedRoute from './components/common/ProtectedRoute';
import SessionExpiredModal from './components/common/SessionExpiredModal';
import { useAuth } from './hooks/useAuth';
import { useState, useEffect } from 'react';

import AdminProductDetail from './pages/admin/AdminProductDetail';
import AdminUserDetail from './pages/admin/AdminUserDetail';
import AdminCategories from './pages/admin/AdminCategories';
import AdminCategoryDetail from './pages/admin/AdminCategoryDetail';

const AppContent = () => {
  const location = useLocation();
  const isAuthPage = location.pathname === '/login' || location.pathname === '/register' || location.pathname === '/verify-otp';
  const isAdminPage = location.pathname.startsWith('/admin');

  // Session Expiration Logic
  const { logout } = useAuth();
  const [showSessionExpiredModal, setShowSessionExpiredModal] = useState(false);

  useEffect(() => {
    const handleSessionExpired = () => {
      // Don't show the modal if we're already on an auth page
      const currentPath = window.location.pathname;
      if (currentPath === '/login' || currentPath === '/register' || currentPath === '/verify-otp') {
        return;
      }
      setShowSessionExpiredModal(true);
    };

    window.addEventListener('auth:session-expired', handleSessionExpired);

    return () => {
      window.removeEventListener('auth:session-expired', handleSessionExpired);
    };
  }, []);

  const handleSessionExpiredConfirm = () => {
    setShowSessionExpiredModal(false);
    logout(true); // Redirect to login
  };

  const handleSessionExpiredCancel = () => {
    setShowSessionExpiredModal(false);
    logout(false); // Update state but stay on page
  };

  return (
    <>
      {!isAuthPage && !isAdminPage && <TopNavBar />}
      <Routes>
        <Route path="/" element={<Navigate to="/home" replace />} />
        <Route path="/home" element={<Home />} />
        <Route path="/login" element={<LogIn />} />
        <Route path="/register" element={<Register />} />
        <Route path="/verify-otp" element={<OTPVerification />} />
        <Route path="/oauth-callback" element={<OAuthCallback />} />
        <Route path="/category/:id" element={<CategoryProducts />} />
        <Route path="/product/:id" element={<ProductDetail />} />
        <Route path="/search" element={<SearchResults />} />
        <Route path="/products" element={<AllProducts />} />
        <Route path="/profile" element={
          <ProtectedRoute>
            <Profile />
          </ProtectedRoute>
        } />
        <Route path="/my-products" element={
          <ProtectedRoute>
            <MyProducts />
          </ProtectedRoute>
        } />
        <Route path="/order-completion/:productId" element={
          <ProtectedRoute>
            <OrderCompletion />
          </ProtectedRoute>
        } />
        <Route path="/admin" element={
          <ProtectedRoute requireAdmin>
            <AdminLayout />
          </ProtectedRoute>
        }>
          <Route path="edit/products" element={<AdminProducts />} />
          <Route path="products/:id" element={<AdminProductDetail />} />
          <Route path="edit/users" element={<AdminUsers />} />
          <Route path="users/:id" element={<AdminUserDetail />} />
          <Route path="categories" element={<AdminCategories />} />
          <Route path="categories/:id" element={<AdminCategoryDetail />} />
          <Route path="manage/upgraderequests" element={<AdminUpgradeRequests />} />
          <Route path="manage/settings" element={<AdminSettings />} />
        </Route>
      </Routes>

      <SessionExpiredModal
        show={showSessionExpiredModal}
        onConfirm={handleSessionExpiredConfirm}
        onCancel={handleSessionExpiredCancel}
      />
    </>
  )
}

import { WatchlistProvider } from './contexts/WatchlistContext';

export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <ToastProvider>
          <WatchlistProvider>
            <AppContent />
          </WatchlistProvider>
        </ToastProvider>
      </AuthProvider>
    </BrowserRouter>
  )
}