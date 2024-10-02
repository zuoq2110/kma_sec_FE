import { BrowserRouter as Router, Routes, Route, useNavigate } from "react-router-dom";
import { PrivateRoutes, privateRoutes } from "./routes/privateRoutes";
import { defaultRoutes } from "./routes/defaultRoutes";
import { DataContext } from "./context/dataContext";

import { useContext, useEffect } from "react";

import "primereact/resources/themes/lara-light-blue/theme.css";
import "primereact/resources/primereact.min.css";
import "primeicons/primeicons.css";
import "primeflex/primeflex.css";
import "./styles/scss/index.scss";
import "./styles/css/flags.min.css";
import { BASE_URL } from "./services/kSecurityService";
import TokenVerify from "./pages/TokenVerify";
import { userRoutes } from "./routes/userRoutes";

export default function App() {
  const { dataUser } = useContext(DataContext);
  const { isAdmin } = useContext(DataContext);
console.log(dataUser);
console.log(isAdmin);
  return (
    <Router>
      <TokenVerify />
      <Routes>
        {(dataUser && isAdmin === true)
          ? privateRoutes.map((route) => (
            <Route
              element={route.element}
              key={route.path}
              path={route.path}
            />
          ))
          : ((dataUser && isAdmin === false) ?
            userRoutes.map((route) => (
              <Route
                element={route.element}
                key={route.path}
                path={route.path}
              />
            )) :
            defaultRoutes.map((route) => (
              <Route
                element={route.element}
                key={route.path}
                path={route.path}
              />
            )))}
      </Routes>
    </Router>
  );
}
