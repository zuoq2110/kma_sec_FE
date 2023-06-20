import React, { useContext, useRef } from "react";
import Footer from "../components/Footer";
import {
  useEventListener,
  useMountEffect,
  useUnmountEffect,
} from "primereact/hooks";
import { LayoutContext } from "../context/layoutContext";
import { classNames } from "primereact/utils";
import AppTopbar from "../components/TopBar";

const DefaultLayout = (props) => {
  const { layoutConfig, layoutState, setLayoutState } =
    useContext(LayoutContext);
  const topbarRef = useRef(null);

  const containerClass = classNames("layout-wrapper", {
    "layout-overlay": layoutConfig.menuMode === "overlay",
    "layout-static": layoutConfig.menuMode === "static",
    "layout-static-inactive":
      layoutState.staticMenuDesktopInactive &&
      layoutConfig.menuMode === "static",
    "layout-overlay-active": layoutState.overlayMenuActive,
    "layout-mobile-active": layoutState.staticMenuMobileActive,
    "p-input-filled": layoutConfig.inputStyle === "filled",
    "p-ripple-disabled": !layoutConfig.ripple,
  });

  const hideProfileMenu = () => {
    setLayoutState((prevLayoutState) => ({
      ...prevLayoutState,
      profileSidebarVisible: false,
    }));
    unbindProfileMenuOutsideClickListener();
  };

  const [
    bindProfileMenuOutsideClickListener,
    unbindProfileMenuOutsideClickListener,
  ] = useEventListener({
    type: "click",
    listener: (event) => {
      const isOutsideClicked = !(
        topbarRef.current.topbarmenu.isSameNode(event.target) ||
        topbarRef.current.topbarmenu.contains(event.target) ||
        topbarRef.current.topbarmenubutton.isSameNode(event.target) ||
        topbarRef.current.topbarmenubutton.contains(event.target)
      );

      if (isOutsideClicked) {
        hideProfileMenu();
      }
    },
  });
  return (
    <div className={containerClass}>
      <AppTopbar ref={topbarRef} />

      <div className="layout-main-container">
        <div className="layout-main">{props.children}</div>
        <Footer />
      </div>
      <div className="layout-mask"></div>
    </div>
  );
};

export default DefaultLayout;
