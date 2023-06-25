import React, { useContext } from "react";
import AppMenuitem from "./AppMenuItem";
import { dataMenus, dataMenusAuth } from "../utils/dataMenu";
import { DataContext } from "../context/dataContext";

const AppSidebar = () => {
  const { dataUser } = useContext(DataContext);
  return (
    <ul className="layout-menu">
      {dataUser
        ? dataMenusAuth.map((item, i) => {
            return !item.seperator ? (
              <AppMenuitem item={item} root={true} index={i} key={item.label} />
            ) : (
              <li className="menu-separator"></li>
            );
          })
        : dataMenus.map((item, i) => {
            return !item.seperator ? (
              <AppMenuitem item={item} root={true} index={i} key={item.label} />
            ) : (
              <li className="menu-separator"></li>
            );
          })}
    </ul>
  );
};

export default AppSidebar;
