import routes from "@/config/routes";
import { Route, BrowserRouter as Router, Routes } from "react-router-dom";

import { useGlobalRealtimeSync } from "@/hooks";
import ConnectionIndicator from "./Components/ConnectionIndicator";
import AppInitializer from "./initializers/AppInitializer";
import SocketProvider from "./providers/ContextProvider";
import ThemeProvider from "./providers/ThemeProvider";
import ToastProvider from "./providers/ToastProvider";
import ProtectedRoute from "./routes/ProtectedRoute";
import PublicRoute from "./routes/PublicRoute";

function GlobalRealtimeSync() {
  useGlobalRealtimeSync();
  return null;
}

function App() {
  return (
    <Router>
      <AppInitializer>
        <ThemeProvider>
          <ToastProvider>
            <SocketProvider>
              <GlobalRealtimeSync />
              <ConnectionIndicator />
              
              <Routes>
                {routes.map((route) => (
                  <Route
                    key={route.path}
                    path={route.path}
                    element={
                      route.auth === "protected" ? (
                        <ProtectedRoute>
                          {route.layout ? (
                            <route.layout>
                              <route.page />
                            </route.layout>
                          ) : (
                            <route.page />
                          )}
                        </ProtectedRoute>
                      ) : (
                        <PublicRoute>
                          {route.layout ? (
                            <route.layout>
                              <route.page />
                            </route.layout>
                          ) : (
                            <route.page />
                          )}
                        </PublicRoute>
                      )
                    }
                  />
                ))}
              </Routes>
            </SocketProvider>
          </ToastProvider>
        </ThemeProvider>
      </AppInitializer>
    </Router>
  );
}

export default App;
