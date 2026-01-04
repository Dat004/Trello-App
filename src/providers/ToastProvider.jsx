import {
  AlertCircle,
  AlertTriangle,
  CheckCircle,
  Loader2,
  Info,
  X,
} from "lucide-react";
import { useState } from "react";

import { Button } from "@/Components/UI";
import ToastContext from "@/context/ToastContext";

function ToastProvider({ children }) {
  const [toasts, setToasts] = useState([]);

  const addToast = (toast) => {
    const id = Date.now().toString();

    const newToast = {
      ...toast,
      id,
      closing: false,
    };

    setToasts((prev) => [...prev, newToast]);

    if (toast.type !== "loading") {
      setTimeout(() => {
        closeToast(id);
      }, toast.duration || 5000);
    }

    return id;
  };

  const closeToast = (id) => {
    // Step 1: trigger closing animation
    setToasts((prev) =>
      prev.map((toast) =>
        toast.id === id ? { ...toast, closing: true } : toast
      )
    );

    // Step 2: remove after animation
    setTimeout(() => {
      removeToast(id);
    }, 300);
  };

  const removeToast = (id) => {
    setToasts((prev) => prev.filter((toast) => toast.id !== id));
  };

  const getIcon = (type) => {
    switch (type) {
      case "success":
        return <CheckCircle className="h-5 w-5 text-green-500" />;
      case "error":
        return <AlertCircle className="h-5 w-5 text-red-500" />;
      case "warning":
        return <AlertTriangle className="h-5 w-5 text-yellow-500" />;
      case "info":
        return <Info className="h-5 w-5 text-blue-500" />;
      case "loading":
        return <Loader2 className="h-5 w-5 text-gray-500 animate-spin" />;
      default:
        return null;
    }
  };

  const getBackgroundColor = (type) => {
    switch (type) {
      case "success":
        return "bg-green-50 border-green-200";
      case "error":
        return "bg-red-50 border-red-200";
      case "warning":
        return "bg-yellow-50 border-yellow-200";
      case "info":
        return "bg-blue-50 border-blue-200";
      case "loading":
        return "bg-gray-50 border-gray-200";
      default:
        return "";
    }
  };

  return (
    <ToastContext.Provider
      value={{ toasts, addToast, removeToast: closeToast }}
    >
      {children}

      <div className="fixed top-4 right-4 z-9999 space-y-2">
        {toasts.map((toast) => (
          <div
            key={toast.id}
            className={`max-w-sm w-full border rounded-lg shadow-lg p-4
              ${getBackgroundColor(toast.type)}
              ${
                toast.closing
                  ? "animate-slide-out-right"
                  : "animate-slide-in-right"
              }
            `}
          >
            <div className="flex items-start gap-3">
              {getIcon(toast.type)}

              <div className="flex-1 min-w-0">
                <h4 className="text-sm font-medium">{toast.title}</h4>
                {toast.description && (
                  <p className="text-sm text-muted-foreground mt-1">
                    {toast.description}
                  </p>
                )}
              </div>

              <Button
                variant="ghost"
                size="sm"
                className="h-6 w-6 p-0"
                onClick={() => closeToast(toast.id)}
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  );
}

export default ToastProvider;
