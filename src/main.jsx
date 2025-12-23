import { StrictMode } from "react";
import { createRoot } from "react-dom/client";

import ToastProvider from "./providers/ToastProvider";
import AuthProvider from "@/providers/AuthProvider";
import App from "@/App";
import "@/global.css";

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <AuthProvider>
      <ToastProvider>
        <App />
      </ToastProvider>
    </AuthProvider>
  </StrictMode>
);
