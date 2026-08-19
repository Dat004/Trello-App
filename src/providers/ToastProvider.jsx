import { useCallback, useRef, useState } from "react";
import { AnimatePresence, motion as Motion } from "framer-motion";
import {
  AlertCircle,
  AlertTriangle,
  CheckCircle,
  Info,
  Loader2,
  Undo2,
  X,
} from "lucide-react";

import ToastContext from "@/context/ToastContext";
import { Button } from "@/Components/UI";

function ToastProvider({ children }) {
  const [toasts, setToasts] = useState([]);
  // Track which toast actions have already been invoked to prevent double-fires.
  const firedActionsRef = useRef(new Set());

  const removeToast = useCallback((id) => {
    setToasts((prev) => prev.filter((toast) => toast.id !== id));
    // Clean up the fired-action tracker a tick later so the guard stays
    // active until the toast is fully removed from state.
    setTimeout(() => firedActionsRef.current.delete(id), 0);
  }, []);

  const closeToast = useCallback(
    (id) => {
      removeToast(id);
    },
    [removeToast]
  );

  const addToast = useCallback(
    (toast) => {
      const id = Date.now().toString() + Math.random().toString(36).slice(2, 6);

      const newToast = {
        ...toast,
        id,
      };

      setToasts((prev) => [...prev, newToast]);

      if (toast.type !== "loading") {
        setTimeout(() => {
          closeToast(id);
        }, toast.duration || 5000);
      }

      return id;
    },
    [closeToast]
  );

  const handleAction = useCallback(
    (toast) => {
      // Guard: prevent the action from firing more than once (e.g. rapid clicks).
      if (firedActionsRef.current.has(toast.id)) return;
      firedActionsRef.current.add(toast.id);

      toast.action?.onClick?.();
      closeToast(toast.id);
    },
    [closeToast]
  );

  const getIcon = (type) => {
    switch (type) {
      case "success":
        return <CheckCircle className="h-5 w-5 text-green-500 shrink-0" />;
      case "error":
        return <AlertCircle className="h-5 w-5 text-red-500 shrink-0" />;
      case "warning":
        return <AlertTriangle className="h-5 w-5 text-yellow-500 shrink-0" />;
      case "info":
        return <Info className="h-5 w-5 text-blue-500 shrink-0" />;
      case "loading":
        return <Loader2 className="h-5 w-5 text-gray-500 animate-spin shrink-0" />;
      default:
        return null;
    }
  };

  const getBackgroundColor = (type) => {
    switch (type) {
      case "success":
        return "bg-card border-green-500/30 text-foreground";
      case "error":
        return "bg-card border-red-500/30 text-foreground";
      case "warning":
        return "bg-card border-yellow-500/30 text-foreground";
      case "info":
        return "bg-card border-blue-500/30 text-foreground";
      case "loading":
        return "bg-card border-border text-foreground";
      default:
        return "bg-card border-border text-foreground";
    }
  };

  return (
    <ToastContext.Provider
      value={{ toasts, addToast, removeToast: closeToast }}
    >
      {children}

      <div
        className="fixed top-4 right-4 z-[9999] flex flex-col gap-2 max-w-sm w-full pointer-events-none px-4 sm:px-0"
        aria-live="polite"
        aria-atomic="false"
      >
        <AnimatePresence mode="sync">
          {toasts.map((toast) => (
            <Motion.div
              key={toast.id}
              initial={{ opacity: 0, y: -20, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, x: 100, scale: 0.9 }}
              transition={{ duration: 0.25, ease: "easeOut" }}
              role="status"
              className={`pointer-events-auto border rounded-xl shadow-lg p-4 backdrop-blur-md ${getBackgroundColor(
                toast.type
              )}`}
            >
              <div className="flex items-start gap-3">
                {getIcon(toast.type)}

                <div className="flex-1 min-w-0">
                  <h4 className="text-sm font-semibold leading-tight">
                    {toast.title}
                  </h4>
                  {toast.description && (
                    <p className="text-xs text-muted-foreground mt-1 leading-normal">
                      {toast.description}
                    </p>
                  )}

                  {toast.action && (
                    <Button
                      variant="ghost"
                      size="sm"
                      className="h-auto px-2 py-0.5 mt-1.5 text-xs font-semibold text-primary hover:text-primary hover:bg-primary/10 gap-1"
                      onClick={() => handleAction(toast)}
                    >
                      <Undo2 className="h-3 w-3" />
                      {toast.action.label || "Hoàn tác"}
                    </Button>
                  )}
                </div>

                <Button
                  variant="ghost"
                  size="sm"
                  className="h-6 w-6 p-0 hover:bg-muted text-muted-foreground"
                  onClick={() => closeToast(toast.id)}
                  aria-label="Đóng thông báo"
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
            </Motion.div>
          ))}
        </AnimatePresence>
      </div>
    </ToastContext.Provider>
  );
}

export default ToastProvider;
