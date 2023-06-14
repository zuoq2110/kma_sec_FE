import React from "react";

const Footer = () => {
  return (
    <footer className="footer">
      <div className="container-fluid">
        <nav className="pull-left">
          <ul className="nav">
            <li className="nav-item">
              <span className="nav-link"> Help </span>
            </li>
            <li className="nav-item">
              <span className="nav-link"> Licenses </span>
            </li>
          </ul>
        </nav>
        <div className="copyright ml-auto">
          2023, made with <i className="fa fa-heart heart text-danger"></i> by{" "}
          <span>KMA-Security</span>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
