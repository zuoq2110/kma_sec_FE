import React, { useCallback, useEffect, useState } from "react";

const DataContext = React.createContext();

function DataProvider({ children }) {
  const [dataWindowAnalysis, setDataWindowAnalysis] = useState(null);
  const [dataUser, setDataUser] = useState(null);

  useEffect(() => {
    setDataUser(JSON.parse(localStorage.getItem("dataUser")));
  }, []);

  useEffect(() => {
    if (dataUser !== null) {
      localStorage.setItem("dataUser", JSON.stringify(dataUser));
    } else {
      localStorage.removeItem("dataUser");
    }
  }, [dataUser]);

  const login = useCallback((email, password) => {
    setDataUser({ email, password });
  }, []);

  const logout = useCallback(() => {
    setDataUser(null);
  }, []);

  return (
    <DataContext.Provider
      value={{
        dataWindowAnalysis,
        setDataWindowAnalysis,
        dataUser,
        setDataUser,
        login,
        logout,
      }}
    >
      {children}{" "}
    </DataContext.Provider>
  );
}

export default DataProvider;
export { DataContext };
