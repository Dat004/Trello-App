import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

import ProtectedRoute from "./routes/ProtectedRoute";
import routes from "@/config/routes";
import PublicRoute from "./routes/PublicRoute";

function App() {
  return (
    <Router>
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
    </Router>
  );
}

export default App;
