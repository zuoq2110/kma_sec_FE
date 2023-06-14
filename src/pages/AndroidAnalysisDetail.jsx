import React from "react";
// import "../styles/assets/css/atlantis.css";
// import "../styles/assets/css/fonts.css";
// import "../styles/assets/css/atlantis.min.css";
// import "../styles/assets/css/bootstrap.min.css";
// import "../styles/assets/css/fonts.min.css";

import Header from "../components/Header";
import Footer from "../components/Footer";
import Sidebar from "../components/Sidebar";

const AndroidAnalysisDetail = () => {
  return (
    <div className="wrapper">
      <Header />

      <Sidebar />

      <div className="main-panel">
        <div className="container">
          <div className="page-inner">
            <div className="page-header">
              <h4 className="page-title">Analysis</h4>
              <ul className="breadcrumbs">
                <li className="nav-home">
                  <a href="/">
                    <i className="flaticon-home"></i>
                  </a>
                </li>
                <li className="separator">
                  <i className="flaticon-right-arrow"></i>
                </li>
                <li className="nav-item">
                  <a href="/analysis/">Analysis</a>
                </li>
                <li className="separator">
                  <i className="flaticon-right-arrow"></i>
                </li>
                <li className="nav-item">
                  <span>Windows</span>
                </li>
                <li className="separator">
                  <i className="flaticon-right-arrow"></i>
                </li>
                <li className="nav-item">{/* <a>{{ analysis_id }}</a> */}</li>
              </ul>
            </div>
            <div className="row justify-content-center">
              <div className="col-12 col-lg-10 col-xl-9">
                <div className="row align-items-center">
                  <div className="col">
                    <h6 className="page-title">test</h6>
                    <h4 className="page-title">
                      {/* ID: #{{ analysis_id }} */}
                    </h4>
                  </div>
                  <div className="col-auto">
                    <button
                      id="btn-save"
                      className="btn btn-primary ml-2"
                      // onClick="save('{{ analysis_id }}')"
                    >
                      Save
                    </button>
                  </div>
                </div>
                <div className="page-divider"></div>
                <div className="row">
                  <div className="col-md-12">
                    <div className="card card-invoice">
                      <div className="card-header">
                        <div className="invoice-header">
                          {/* <h3>MD5: {{ analysis["md5"] }}</h3> */}
                          <h3 className="invoice-title">
                            <strong>
                              {/* {{ analysis["malware_type"] }} */}
                            </strong>
                          </h3>
                        </div>
                        <div className="invoice-desc"></div>
                      </div>
                      <div className="card-body">
                        <div className="separator-solid"></div>
                        <div className="row pt-3">
                          <div className="col-md-12">
                            <div className="invoice-detail">
                              <div className="invoice-top">
                                <h3 className="title">
                                  <strong>Summary</strong>
                                </h3>
                              </div>
                              <div className="invoice-item">
                                <div className="table-responsive">
                                  <table className="table table-striped">
                                    <thead>
                                      <tr>
                                        <td className="text-center">
                                          <strong>Fields</strong>
                                        </td>
                                        <td className="text-center">
                                          <strong>Values</strong>
                                        </td>
                                      </tr>
                                    </thead>
                                    <tbody>
                                      {/* {% for attribute, value in analysis.items() if attribute != "md5" %} */}
                                      <tr>
                                        <td className="text-center">
                                          <strong>
                                            {/* {{ " ".join(attribute.split("_")) | title }} */}
                                          </strong>
                                        </td>
                                        <td className="text-center">
                                          {/* {{ value }} */}
                                        </td>
                                      </tr>
                                      {/* {% endfor %} */}
                                    </tbody>
                                  </table>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <Footer />
      </div>
    </div>
  );
};

export default AndroidAnalysisDetail;
