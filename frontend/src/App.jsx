import './App.css';
import { AuthProvider } from "./contexts/authProvider";
import Home from './pages/Home';
import LogIn from './pages/LogIn';
import Register from './pages/Register';
import OTPVerification from './pages/OTPVerification';
import { ToastProvider } from './contexts/ToastContext';
import { BrowserRouter, Routes, Route, useLocation, Navigate } from "react-router-dom";
import TopNavBar from './components/TopNavBar';


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
      </Routes>
    </>
  )
}

export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <ToastProvider>
          <AppContent />
        </ToastProvider>
      </AuthProvider>
    </BrowserRouter>
  )
}