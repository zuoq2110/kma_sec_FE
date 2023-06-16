import React, { useState } from "react";

const DataContext = React.createContext();

function DataProvider({ children }) {
  const [dataWindowAnalysis, setDataWindowAnalysis] = useState(null);

  return (
    <DataContext.Provider
      value={{
        dataWindowAnalysis,
        setDataWindowAnalysis,
      }}
    >
      {children}{" "}
    </DataContext.Provider>
  );
}

export default DataProvider;
export { DataContext };
