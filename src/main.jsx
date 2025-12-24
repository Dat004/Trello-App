import { StrictMode } from "react";
import { createRoot } from "react-dom/client";

import AuthInitializer from "./initializers/AuthInitializer";
import ToastProvider from "./providers/ToastProvider";
import App from "@/App";
import "@/global.css";

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <AuthInitializer>
      <ToastProvider>
        <App />
      </ToastProvider>
    </AuthInitializer>
  </StrictMode>
);
