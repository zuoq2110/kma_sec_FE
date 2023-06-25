import React, {
  forwardRef,
  useContext,
  useImperativeHandle,
  useRef,
} from "react";
import { Link, useNavigate } from "react-router-dom";
import { classNames } from "primereact/utils";
import { LayoutContext } from "../context/layoutContext";
import { DataContext } from "../context/dataContext";
import { OverlayPanel } from "primereact/overlaypanel";
import { DataView } from "primereact/dataview";
import { Button } from "primereact/button";

const AppTopbar = forwardRef((props, ref) => {
  const navigate = useNavigate();
  const { layoutState, onMenuToggle, showProfileSidebar } =
    useContext(LayoutContext);
  const { dataUser, logout } = useContext(DataContext);
  const menubuttonRef = useRef(null);
  const topbarmenuRef = useRef(null);
  const topbarmenubuttonRef = useRef(null);
  const dropdownBtn = useRef(null);

  useImperativeHandle(ref, () => ({
    menubutton: menubuttonRef.current,
    topbarmenu: topbarmenuRef.current,
    topbarmenubutton: topbarmenubuttonRef.current,
  }));

  const items = [
    { label: "Information", value: () => information() },
    { label: "Log out", value: () => logout() },
  ];

  const information = () => {
    console.log("test");
  };

  const dropdownTemplate = (item) => {
    return (
      <div className="col-12 cursor-pointer flex justify-center">
        <Button
          label={item.label}
          link
          className="w-full"
          onClick={item.value}
        />
      </div>
    );
  };

  return (
    <div className="layout-topbar">
      <Link to="/" className="layout-topbar-logo">
        <span>KMA - Security</span>
      </Link>

      <button
        ref={menubuttonRef}
        type="button"
        className="p-link layout-menu-button layout-topbar-button"
        onClick={onMenuToggle}
      >
        <i className="pi pi-bars" />
      </button>

      <button
        ref={topbarmenubuttonRef}
        type="button"
        className="p-link layout-topbar-menu-button layout-topbar-button"
        onClick={showProfileSidebar}
      >
        <i className="pi pi-ellipsis-v" />
      </button>

      <div
        ref={topbarmenuRef}
        className={classNames("layout-topbar-menu", {
          "layout-topbar-menu-mobile-active": layoutState.profileSidebarVisible,
        })}
      >
        {dataUser ? (
          <button
            type="button"
            className="p-link layout-topbar-button"
            onClick={(e) => dropdownBtn.current.toggle(e)}
          >
            <i className="pi pi-user"></i>
            <span>Profile</span>
            <OverlayPanel ref={dropdownBtn}>
              <DataView value={items} itemTemplate={dropdownTemplate} />
            </OverlayPanel>
          </button>
        ) : (
          <button
            type="button"
            className="p-link layout-topbar-button"
            onClick={() => navigate("/login")}
          >
            <i className="pi pi-user"></i>
            <span>Profile</span>
          </button>
        )}

        <button type="button" className="p-link layout-topbar-button">
          <i className="pi pi-cog"></i>
          <span>Settings</span>
        </button>
      </div>
    </div>
  );
});

export default AppTopbar;
