import './App.css';
import { AuthProvider } from "./contexts/authProvider";
import Home from './pages/Home';
import LogIn from './pages/LogIn';
import { BrowserRouter, Routes, Route, useLocation, Navigate } from "react-router-dom";


function AppRoutes() {
  const location = useLocation()

  return (
    <Routes location={location} key={location.pathname}>
      <Route path="/" element={<Navigate to="/home" replace />} />
      <Route path="/home" element={<Home />} />
      <Route path="/login" element={<LogIn />} />
    </Routes>
  )
}

export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <AppRoutes />
      </AuthProvider>
    </BrowserRouter>
  )
}