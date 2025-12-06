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
import Profile from './pages/Profile';

import ProtectedRoute from './components/common/ProtectedRoute';

// ... existing imports ...

const AppContent = () => {
  const location = useLocation();
  const isAuthPage = location.pathname === '/login' || location.pathname === '/register' || location.pathname === '/verify-otp';

  return (
    <>
      {!isAuthPage && <TopNavBar />}
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