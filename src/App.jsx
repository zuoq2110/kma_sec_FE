import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { privateRoutes } from "./routes/privateRoutes";
import DataProvider from "./context/dataContext";
import { LayoutProvider } from "./context/layoutContext";

import "primereact/resources/themes/lara-light-blue/theme.css";
import "primereact/resources/primereact.min.css";
import "primeicons/primeicons.css";
import "primeflex/primeflex.css";
import "./index.css";
import "./flags.min.css";
import "./styles/Layout/layout.scss";

export default function App() {
  return (
    <Router>
      <DataProvider>
        <LayoutProvider>
          <Routes>
            {privateRoutes.map((route) => (
              <Route
                element={route.element}
                key={route.path}
                path={route.path}
              />
            ))}
          </Routes>
        </LayoutProvider>
      </DataProvider>
    </Router>
  );
}
