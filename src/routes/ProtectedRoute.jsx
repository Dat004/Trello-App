import { Navigate } from "react-router-dom";

import { useAuthStore } from "@/store";

function ProtectedRoute({ children }) {
  const { isAuthenticated, loading } = useAuthStore();

  if (loading) return;

  return isAuthenticated ? children : <Navigate to="/login" replace />;
}

export default ProtectedRoute;
