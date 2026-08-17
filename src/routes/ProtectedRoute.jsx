import { Navigate } from "react-router-dom";

import AppLoadingScreen from "@/Components/AppLoadingScreen";
import { useAuthStore } from "@/store";

function ProtectedRoute({ children }) {
  const { isAuthenticated, loading } = useAuthStore();

  if (loading) {
    return <AppLoadingScreen />;
  }

  return isAuthenticated ? children : <Navigate to="/login" replace />;
}

export default ProtectedRoute;
