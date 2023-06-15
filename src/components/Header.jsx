import React, { useState } from "react";

import { useDispatch } from "react-redux";
import { onToggleSidebar } from "../redux/actions/animationActions";

const Header = () => {
  const dispatch = useDispatch();
  const [toggleSidebar, setToggleSidebar] = useState(false);

  const onToggleMenuSidebar = () => {
    setToggleSidebar(!toggleSidebar);
    dispatch(onToggleSidebar(!toggleSidebar));
  };

  return (
    <div className="main-header">
      {/* Logo Header */}
      <div className="logo-header" data-background-color="blue">
        <a href="/" className="logo">
          {/* <img src="#" alt="Logo" className="navbar-brand" />  */}
        </a>
        <button
          className="navbar-toggler sidenav-toggler ml-auto"
          type="button"
          data-toggle="collapse"
          data-target="collapse"
          aria-expanded="false"
          aria-label="Toggle navigation"
        >
          <span className="navbar-toggler-icon">
            <i className="icon-menu"></i>
          </span>
        </button>
        <button className="topbar-toggler more">
          <i className="icon-options-vertical"></i>
        </button>
        <div className="nav-toggle">
          <button
            className={
              toggleSidebar
                ? "btn btn-toggle toggle-sidebar toggled"
                : "btn btn-toggle toggle-sidebar"
            }
            onClick={() => onToggleMenuSidebar()}
          >
            {toggleSidebar ? (
              <i className="icon-options-vertical"></i>
            ) : (
              <i className="icon-menu"></i>
            )}
          </button>
        </div>
      </div>
      {/* End Logo Header */}

      {/* Navbar Header */}
      <nav
        className="navbar navbar-header navbar-expand-lg"
        data-background-color="blue2"
      >
        <div className="container-fluid">
          <div className="collapse" id="search-nav">
            <form className="navbar-left navbar-form nav-search mr-md-3">
              <div className="input-group">
                <div className="input-group-prepend">
                  <button type="submit" className="btn btn-search pr-1">
                    <i className="fa fa-search search-icon"></i>
                  </button>
                </div>
                <input
                  type="text"
                  placeholder="Search ..."
                  className="form-control"
                />
              </div>
            </form>
          </div>
          <ul className="navbar-nav topbar-nav ml-md-auto align-items-center">
            <li className="nav-item toggle-nav-search hidden-caret">
              <a
                className="nav-link"
                data-toggle="collapse"
                href="#search-nav"
                role="button"
                aria-expanded="false"
                aria-controls="search-nav"
              >
                <i className="fa fa-search"></i>
              </a>
            </li>
            <li className="nav-item dropdown hidden-caret">
              <a
                className="nav-link dropdown-toggle"
                href="/"
                id="notifDropdown"
                role="button"
                data-toggle="dropdown"
                aria-haspopup="true"
                aria-expanded="false"
              >
                <i className="fa fa-bell"></i>
                <span className="notification">1</span>
              </a>
              <ul
                className="dropdown-menu notif-box animated fadeIn"
                aria-labelledby="notifDropdown"
              >
                <li>
                  <div className="dropdown-title">
                    You have 1 new notification
                  </div>
                </li>
                <li>
                  <div className="notif-scroll scrollbar-outer">
                    <div className="notif-center">
                      <a href="/">
                        <div className="notif-icon notif-primary">
                          <i className="fa fa-user-plus"></i>
                        </div>
                        <div className="notif-content">
                          <span className="block"> New user registered </span>
                          <span className="time">5 minutes ago</span>
                        </div>
                      </a>
                    </div>
                  </div>
                </li>
                <li>
                  <a className="see-all" href="/">
                    See all notifications<i className="fa fa-angle-right"></i>{" "}
                  </a>
                </li>
              </ul>
            </li>
            <li className="nav-item dropdown hidden-caret">
              <a
                className="dropdown-toggle profile-pic"
                data-toggle="dropdown"
                href="/"
                aria-expanded="false"
              >
                <div className="avatar-sm">
                  <img
                    src="https://www.w3schools.com/howto/img_avatar.png"
                    alt="..."
                    className="avatar-img rounded-circle"
                  />
                </div>
              </a>
              <ul className="dropdown-menu dropdown-user animated fadeIn">
                <div className="dropdown-user-scroll scrollbar-outer">
                  <li>
                    <div className="user-box">
                      <div className="avatar-lg">
                        <img
                          src="https://www.w3schools.com/howto/img_avatar.png"
                          alt="profile"
                          className="avatar-img rounded"
                        />
                      </div>
                      <div className="u-text">
                        <h4>Admin</h4>
                        <p className="text-muted">admin.kma@gmail.com</p>
                        <a
                          href="profile.html"
                          className="btn btn-xs btn-secondary btn-sm"
                        >
                          View Profile
                        </a>
                      </div>
                    </div>
                  </li>
                  <li>
                    <div className="dropdown-divider"></div>
                    <a className="dropdown-item" href="/">
                      My Profile
                    </a>
                    <a className="dropdown-item" href="/">
                      Inbox
                    </a>
                    <div className="dropdown-divider"></div>
                    <a className="dropdown-item" href="/">
                      Account Setting
                    </a>
                    <div className="dropdown-divider"></div>
                    <a className="dropdown-item" href="/">
                      Logout
                    </a>
                  </li>
                </div>
              </ul>
            </li>
          </ul>
        </div>
      </nav>
      {/* End Navbar */}
    </div>
  );
};

export default Header;
