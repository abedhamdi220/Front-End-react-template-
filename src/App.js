import React, { useEffect } from "react";
import { BrowserRouter as Router, Routes, Route, Navigate, useLocation } from "react-router-dom";
import axios from "axios";
import { Toaster } from "sonner";

// Providers
import { ThemeProvider } from "./contexts/ThemeContext";
import { AuthProvider, useAuthContext } from "./contexts/AuthContext";

// Pages
import LandingPage from "./pages/LandingPage";
import Dashboard from "./pages/Dashboard";
import AdminDashboard from "./admin/pages/AdminDashboard";
import ShowcaseManager from "./pages/ShowcaseManager";

const setupAxiosInterceptors = (logoutFunc) => {
  axios.interceptors.request.use((config) => {
    const token = localStorage.getItem("token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  }, (error) => Promise.reject(error));

  axios.interceptors.response.use(
    (response) => response,
    (error) => {
      if (error.response?.status === 401) {
        logoutFunc();
      }
      return Promise.reject(error);
    }
  );
};

const ProtectedRoute = ({ children, requireAdmin = false }) => {
  const { user, loading, isAuthenticated } = useAuthContext();
  const location = useLocation();
  
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[#F5F0E8] to-[#E8DCC8] dark:from-zinc-950 dark:to-zinc-900">
        <div className="w-12 h-12 border-4 border-[#D4AF37] border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }
  
  if (!isAuthenticated) {
    return <Navigate to="/" state={{ from: location }} replace />;
  }
  
  if (requireAdmin && user?.role !== 'admin' && user?.is_admin !== true) {
    return <Navigate to="/dashboard" replace />;
  }
  
  return children;
};

const AppRoutes = () => {
  const { login, logout, isAuthenticated, user } = useAuthContext();
  
  useEffect(() => {
    setupAxiosInterceptors(logout);
  }, [logout]);

  return (
    <Routes>
      <Route 
        path="/" 
        element={
          isAuthenticated 
            ? <Navigate to={user?.role === 'admin' || user?.is_admin ? "/admin" : "/dashboard"} replace /> 
            : <LandingPage onLogin={login} />
        } 
      />
      
      <Route 
        path="/dashboard" 
        element={
          <ProtectedRoute>
            <Dashboard user={user} onLogout={logout} />
          </ProtectedRoute>
        } 
      />
      
      <Route 
        path="/admin" 
        element={
          <ProtectedRoute requireAdmin={true}>
            <AdminDashboard user={user} onLogout={logout} />
          </ProtectedRoute>
        } 
      />
      
      <Route 
        path="/admin/showcase" 
        element={
          <ProtectedRoute requireAdmin={true}>
            <ShowcaseManager token={localStorage.getItem("token")} />
          </ProtectedRoute>
        } 
      />
      
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
};

export default function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <Router>
          <AppRoutes />
          <Toaster position="top-center" dir="rtl" richColors closeButton />
        </Router>
      </AuthProvider>
    </ThemeProvider>
  );
}