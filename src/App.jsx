import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { privateRoutes } from "./routes/privateRoutes";
import { defaultRoutes } from "./routes/defaultRoutes";
import { DataContext } from "./context/dataContext";

import { useContext } from "react";

import "primereact/resources/themes/lara-light-blue/theme.css";
import "primereact/resources/primereact.min.css";
import "primeicons/primeicons.css";
import "primeflex/primeflex.css";
import "./styles/scss/index.scss";
import "./styles/css/flags.min.css";

export default function App() {
  const { dataUser } = useContext(DataContext);

  return (
    <Router>
      <Routes>
        {dataUser
          ? privateRoutes.map((route) => (
              <Route
                element={route.element}
                key={route.path}
                path={route.path}
              />
            ))
          : defaultRoutes.map((route) => (
              <Route
                element={route.element}
                key={route.path}
                path={route.path}
              />
            ))}
      </Routes>
    </Router>
  );
}
