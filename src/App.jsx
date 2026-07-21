import routes from "@/config/routes";
import { lazy, Suspense } from "react";
import { Route, BrowserRouter as Router, Routes } from "react-router-dom";

import { useGlobalRealtimeSync } from "@/hooks";
import ConnectionIndicator from "./Components/ConnectionIndicator";
import ErrorBoundary from "./Components/ErrorBoundary";
import RouteFallback from "./Components/RouteFallback";
import AppInitializer from "./initializers/AppInitializer";
import SocketProvider from "./providers/ContextProvider";
import GoogleProvider from "./providers/GoogleProvider";
import ThemeProvider from "./providers/ThemeProvider";
import ToastProvider from "./providers/ToastProvider";
import ProtectedRoute from "./routes/ProtectedRoute";
import PublicRoute from "./routes/PublicRoute";

const NotFound = lazy(() => import("./Pages/NotFound"));

function GlobalRealtimeSync() {
  useGlobalRealtimeSync();
  return null;
}

function App() {
  return (
    <ErrorBoundary>
      <Router>
        <AppInitializer>
        <GoogleProvider>
          <ThemeProvider>
            <ToastProvider>
              <SocketProvider>
                <GlobalRealtimeSync />
                <ConnectionIndicator />
                
                <Suspense fallback={<RouteFallback />}>
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
                          ) : route.auth === "guest" ? (
                            <PublicRoute>
                              {route.layout ? (
                                <route.layout>
                                  <route.page />
                                </route.layout>
                              ) : (
                                <route.page />
                              )}
                            </PublicRoute>
                          ) : route.layout ? (
                            <route.layout>
                              <route.page />
                            </route.layout>
                          ) : (
                            <route.page />
                          )
                        }
                      />
                    ))}
                    <Route path="*" element={<NotFound />} />
                  </Routes>
                </Suspense>
              </SocketProvider>
            </ToastProvider>
          </ThemeProvider>
        </GoogleProvider>
        </AppInitializer>
      </Router>
    </ErrorBoundary>
  );
}

export default App;
