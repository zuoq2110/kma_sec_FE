import "./styles/assets/css/atlantis.css";
import "./styles/assets/css/fonts.css";
import "./styles/assets/css/atlantis.min.css";
import "./styles/assets/css/bootstrap.min.css";
import "./styles/assets/css/fonts.min.css";

//theme
import "primereact/resources/themes/lara-light-indigo/theme.css";

//core
import "primereact/resources/primereact.min.css";
import "primeicons/primeicons.css";

import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import { privateRoutes } from "./routes/privateRoutes";

import DataProvider from "./context/dataContext";

function App() {
  return (
    <Router>
      <DataProvider>
        <Routes>
          {privateRoutes.map((route) => (
            <Route element={route.element} key={route.path} path={route.path} />
          ))}
        </Routes>
      </DataProvider>
      <ToastContainer
        position="bottom-right"
        autoClose={1000}
        hideProgressBar={false}
        newestOnTop
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="light"
      />
    </Router>
  );
}

export default App;
