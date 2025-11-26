import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

import routes from "@/config/routes";

function App({ children }) {
  return (
    <Router>
      <Routes>
        {routes.map((route) => (
          <Route
            path={route.path}
            element={
              route.layout ? (
                <route.layout>
                  <route.page>{children}</route.page>
                </route.layout>
              ) : (
                <route.page>{children}</route.page>
              )
            }
          />
        ))}
      </Routes>
    </Router>
  );
}

export default App;
