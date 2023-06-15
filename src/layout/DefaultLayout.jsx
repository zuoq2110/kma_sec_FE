import React from "react";
import { useSelector } from "react-redux";
import Header from "../components/Header";
import Sidebar from "../components/Sidebar";

const DefaultLayout = ({ children }) => {
  const statusToggleSidebar = useSelector((state) => state.onToggleSidebar);
  const status = statusToggleSidebar.statusSidebar;

  return (
    <div className={status ? "wrapper sidebar_minimize" : "wrapper"}>
      <Header />
      <Sidebar />
      {children}
    </div>
  );
};

export default DefaultLayout;
