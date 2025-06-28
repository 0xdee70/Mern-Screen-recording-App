import React, { useState, useEffect } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { Navigate } from "react-router-dom";
import Login from "./component/Login";
import ScreenRecord from "./component/ScreenRecord";
import VideoEditor from "./component/VideoEditor";
import Home from "./pages/Home";
import Registration from "./component/Register";
import "./styles/globals.css";

export default function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem("Token");
    if (token) {
      setIsAuthenticated(true);
    }
  }, []);

  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Registration />} />
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