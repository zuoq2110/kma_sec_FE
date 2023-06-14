import React, { useState } from "react";
import { Link, useLocation } from "react-router-dom";

const Sidebar = () => {
  const path = useLocation();
  const pathNames = path.pathname.replace("/", "");
  const params = pathNames.split("/").shift();

  const [showCollapse, setShowCollapse] = useState(false);

  const onToggleCollapse = () => {
    setShowCollapse(!showCollapse);
  };

  return (
    <div className="sidebar sidebar-style-2">
      <div className="sidebar-wrapper scrollbar scrollbar-inner">
        <div className="sidebar-content">
          <div className="user">
            <div className="avatar-sm float-left mr-2">
              <img
                src='{{ profile["avatar_url"] }}'
                alt="..."
                className="avatar-img rounded-circle"
              />
            </div>
            <div className="info">
              <Link
                data-toggle="collapse"
                aria-expanded={showCollapse}
                className={showCollapse ? "" : "collapsed"}
                onClick={() => onToggleCollapse()}
              >
                <span>
                  {/* {{ profile["name"] }} */}
                  Login
                  <span className="user-level">
                    Login
                    {/* {{ profile["role"] }} */}
                  </span>
                  <span className="caret"></span>
                </span>
              </Link>
              <div className="clearfix"></div>

              <div
                className={showCollapse ? "in collapse show" : "in collapse "}
                id="collapseExample"
              >
                <ul className="nav">
                  <li>
                    <a href="#profile">
                      <span className="link-collapse">My Profile</span>
                    </a>
                  </li>
                  <li>
                    <a href="#edit">
                      <span className="link-collapse">Edit Profile</span>
                    </a>
                  </li>
                  <li>
                    <a href="#settings">
                      <span className="link-collapse">Settings</span>
                    </a>
                  </li>
                </ul>
              </div>
            </div>
          </div>

          <ul className="nav nav-primary">
            <li
              className={
                params === "analysis" ? " nav-item active" : "nav-item"
              }
            >
              <Link to="/analysis/">
                <i className="far fa-chart-bar"></i>
                <p>Analysis</p>
              </Link>
            </li>
            <li className="nav-section">
              <span className="sidebar-mini-icon">
                <i className="fa fa-ellipsis-h"></i>
              </span>
              <h4 className="text-section">Others</h4>
            </li>
            <li
              className={params === "models" ? " nav-item active" : "nav-item"}
            >
              <Link to="/models/">
                <i className="fas fa-layer-group"></i>
                <p>Models</p>
              </Link>
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default Sidebar;
