import React, { useState, useEffect } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { Navigate } from "react-router-dom";
import { authUtils } from "./utils/auth";
import Login from "./component/Login";
import ScreenRecord from "./component/ScreenRecord";
import VideoEditor from "./component/VideoEditor";
import Home from "./pages/Home";
import Registration from "./component/Register";
import "./styles/globals.css";

export default function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check if user is authenticated on app load
    const checkAuth = async () => {
      if (authUtils.isAuthenticated()) {
        // Verify token is still valid by trying to get profile
        const result = await authUtils.getProfile();
        if (result.success) {
          setIsAuthenticated(true);
        } else {
          // Token is invalid, clear it
          authUtils.clearTokens();
          setIsAuthenticated(false);
        }
      } else {
        setIsAuthenticated(false);
      }
      setLoading(false);
    };

    checkAuth();
  }, []);

  // Show loading spinner while checking authentication
  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-primary-50 via-white to-secondary-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto mb-4"></div>
          <p className="text-secondary-600">Loading...</p>
        </div>
      </div>
    );
  }

  // Listen for authentication changes
  useEffect(() => {
    const handleStorageChange = () => {
      setIsAuthenticated(authUtils.isAuthenticated());
    };

    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, []);

  // Update authentication state when tokens change
  useEffect(() => {
    const interval = setInterval(() => {
      const currentAuthState = authUtils.isAuthenticated();
      if (currentAuthState !== isAuthenticated) {
        setIsAuthenticated(currentAuthState);
      }
    }, 1000);

    return () => clearInterval(interval);
  }, [isAuthenticated]);

  // Legacy support - remove after migration
  useEffect(() => {
    const legacyToken = localStorage.getItem("Token");
    if (legacyToken && !authUtils.getAccessToken()) {
      // Migrate legacy token - this is a temporary measure
      // In production, you'd want to validate this token first
      setIsAuthenticated(true);
    }
  }, []);

  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route 
          path="/login" 
          element={
            isAuthenticated ? <Navigate to="/screen" replace /> : <Login />
          } 
        />
        <Route 
          path="/register" 
          element={
            isAuthenticated ? <Navigate to="/screen" replace /> : <Registration />
          } 
        />
        <Route path="*" element={<div> Page not found </div>} />

        <Route
          path="/screen"
          element={
            isAuthenticated ? (
              <ScreenRecord />
            ) : (
              <Navigate to="/login" replace />
            )
          }
        />

        <Route
          path="/edit/:recordingId"
          element={
            isAuthenticated ? (
              <VideoEditor />
            ) : (
              <Navigate to="/login" replace />
            )
          }
        />
      </Routes>
    </Router>
  );
}