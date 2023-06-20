import React from "react";
import Footer from "../components/Footer";

const DefaultLayout = (props) => {
  return (
    <div>
      <div className="layout-main-container">
        <div className="layout-main">{props.children}</div>
        <Footer />
      </div>
      <div className="layout-mask"></div>
    </div>
  );
};

export default DefaultLayout;
