import './App.css';
import { AuthProvider } from "./contexts/authProvider";
import Home from './pages/Home';
import LogIn from './pages/LogIn';
import Register from './pages/Register';
import OTPVerification from './pages/OTPVerification';
import CategoryProducts from './pages/CategoryProducts';
import ProductDetail from './pages/ProductDetail';
import { ToastProvider } from './contexts/ToastContext';
import { BrowserRouter, Routes, Route, useLocation, Navigate } from "react-router-dom";
import TopNavBar from './components/layout/TopNavBar';
import SearchResults from './pages/SearchResults';
import AllProducts from './pages/AllProducts';
import MyProducts from './pages/MyProducts';
import Profile from './pages/Profile';
import AdminLayout from './components/layout/AdminLayout';
import AdminProducts from './pages/admin/AdminProducts';
import AdminUsers from './pages/admin/AdminUsers';
import AdminUpgradeRequests from './pages/admin/AdminUpgradeRequests';

import ProtectedRoute from './components/common/ProtectedRoute';

const AppContent = () => {
  const location = useLocation();
  const isAuthPage = location.pathname === '/login' || location.pathname === '/register' || location.pathname === '/verify-otp';
  const isAdminPage = location.pathname.startsWith('/admin');

  return (
    <>
      {!isAuthPage && !isAdminPage && <TopNavBar />}
      <Routes>
        <Route path="/" element={<Navigate to="/home" replace />} />
        <Route path="/home" element={<Home />} />
        <Route path="/login" element={<LogIn />} />
        <Route path="/register" element={<Register />} />
        <Route path="/verify-otp" element={<OTPVerification />} />
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
        <Route path="/admin" element={
          <ProtectedRoute requireAdmin>
            <AdminLayout />
          </ProtectedRoute>
        }>
          <Route path="edit/products" element={<AdminProducts />} />
          <Route path="edit/users" element={<AdminUsers />} />
          <Route path="manage/upgraderequests" element={<AdminUpgradeRequests />} />
        </Route>
      </Routes>
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