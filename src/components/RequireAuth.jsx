import React from "react";
import { Navigate } from "react-router-dom";
function RequireAuth({ children }) {
  const isAuthenticated = !!localStorage.getItem("token"); // Check if token exists
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />; // Redirect to login if not authenticated
  }
  return children; // Render children if authenticated
}

export default RequireAuth;
