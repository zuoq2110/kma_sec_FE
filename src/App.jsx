import "./styles/assets/css/atlantis.css";
import "./styles/assets/css/fonts.css";
import "./styles/assets/css/atlantis.min.css";
import "./styles/assets/css/bootstrap.min.css";
import "./styles/assets/css/fonts.min.css";

import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

import { privateRoutes } from "./routes/privateRoutes";

function App() {
  return (
    <Router>
      <Routes>
        {privateRoutes.map((route) => (
          <Route element={route.element} key={route.path} path={route.path} />
        ))}
      </Routes>
    </Router>
  );
}

export default App;
