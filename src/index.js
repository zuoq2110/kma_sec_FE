import React from "react";
import { createRoot } from "react-dom/client";

import App from "./App";
import DataProvider from "./context/dataContext";
import { LayoutProvider } from "./context/layoutContext";
import { MenuProvider } from "./context/menuContext";

const container = document.getElementById("root");
const root = createRoot(container);

root.render(
  <DataProvider>
    <LayoutProvider>
      <MenuProvider>
        <App />
      </MenuProvider>{" "}
    </LayoutProvider>{" "}
  </DataProvider>
);
