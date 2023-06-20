import React from "react";
import AppMenuitem from "./AppMenuItem";
import { dataMenus } from "../utils/dataMenu";

const Sidebar = () => {
  return (
    <ul className="layout-menu">
      {dataMenus.map((item, i) => {
        return !item.seperator ? (
          <AppMenuitem item={item} root={true} index={i} key={item.label} />
        ) : (
          <li className="menu-separator"></li>
        );
      })}
    </ul>
  );
};

export default Sidebar;
