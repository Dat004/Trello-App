import { Navigate } from "react-router-dom";

import { useAuthStore } from "@/store";

function PublicRoute({ children }) {
  const { isAuthenticated, loading } = useAuthStore();

  if (loading) return;

  return isAuthenticated ? <Navigate to="/" replace /> : children;
}

export default PublicRoute;
