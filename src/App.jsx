import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { privateRoutes } from "./routes/privateRoutes";
import DataProvider from "./context/dataContext";
import { LayoutProvider } from "./context/layoutContext";
import { MenuProvider } from "./context/menuContext";

import "primereact/resources/themes/lara-light-blue/theme.css";
import "primereact/resources/primereact.min.css";
import "primeicons/primeicons.css";
import "primeflex/primeflex.css";
import "./styles/scss/index.scss";
import "./styles/css/flags.min.css";

export default function App() {
  return (
    <Router>
      <DataProvider>
        <LayoutProvider>
          <MenuProvider>
            <Routes>
              {privateRoutes.map((route) => (
                <Route
                  element={route.element}
                  key={route.path}
                  path={route.path}
                />
              ))}
            </Routes>
          </MenuProvider>
        </LayoutProvider>
      </DataProvider>
    </Router>
  );
}
