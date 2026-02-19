import { Loader2 } from "lucide-react";
import { Navigate } from "react-router-dom";

import { useAuthStore } from "@/store";

function PublicRoute({ children }) {
  const { isAuthenticated, loading } = useAuthStore();

  if (loading) {
      return (
          <div className="flex h-screen w-full items-center justify-center bg-background">
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
          </div>
      );
  }

  return isAuthenticated ? <Navigate to="/" replace /> : children;
}

export default PublicRoute;
