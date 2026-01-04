import { StrictMode } from "react";
import { createRoot } from "react-dom/client";

import AppInitializer from "./initializers/AppInitializer";
import ToastProvider from "./providers/ToastProvider";
import App from "@/App";
import "@/global.css";

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <AppInitializer>
      <ToastProvider>
        <App />
      </ToastProvider>
    </AppInitializer>
  </StrictMode>
);
