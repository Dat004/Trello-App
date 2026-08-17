import { Navigate } from "react-router-dom";

import AppLoadingScreen from "@/Components/AppLoadingScreen";
import { useAuthStore } from "@/store";

function PublicRoute({ children }) {
  const { isAuthenticated, loading } = useAuthStore();

  if (loading) {
    return <AppLoadingScreen />;
  }

  return isAuthenticated ? <Navigate to="/" replace /> : children;
}

export default PublicRoute;
