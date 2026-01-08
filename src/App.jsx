import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

import AppInitializer from "./initializers/AppInitializer";
import ToastProvider from "./providers/ToastProvider";
import ProtectedRoute from "./routes/ProtectedRoute";
import PublicRoute from "./routes/PublicRoute";
import routes from "@/config/routes";

function App() {
  return (
    <Router>
      <AppInitializer>
        <ToastProvider>
          <Routes>
            {routes.map((route) => (
              <Route
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
        </ToastProvider>
      </AppInitializer>
    </Router>
  );
}

export default App;
