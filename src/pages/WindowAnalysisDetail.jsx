import React, { useContext } from "react";
import Footer from "../components/Footer";
import { Link, useLocation } from "react-router-dom";
import { DataContext } from "../context/dataContext";
import ToastNotification from "../components/ToastMessage";

const WindowAnalysisDetail = () => {
  const { dataWindowAnalysis } = useContext(DataContext);
  const path = useLocation();
  const pathNames = path.pathname.replace("/analysis/window/", "").trim();
  const analysisId = pathNames.replace("/", "").trim();

  function notify(message, type) {
    const content = {
      title: "K-Security",
      message: message,
      // icon: "flaticon-alarm-1",
    };

    ToastNotification(content, type);
  }

  function save(analysisId) {
    try {
      const json = JSON.stringify(analysisId);
      const blob = new Blob([json], { type: "application/json" });
      const link = document.createElement("a");
      link.href = window.URL.createObjectURL(blob);
      link.download = "analysis";
      link.click();
      notify("Export application's analysis successfully!", "success");
    } catch (error) {
      notify(error, "error");
    }
  }

  return (
    <>
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
                  <Link to="/analysis/">Analysis</Link>
                </li>
                <li className="separator">
                  <i className="flaticon-right-arrow"></i>
                </li>
                <li className="nav-item">
                  <Link style={{ cursor: "default" }}>Windows</Link>
                </li>
                <li className="separator">
                  <i className="flaticon-right-arrow"></i>
                </li>
                <li className="nav-item">
                  <Link style={{ cursor: "default" }}>{analysisId}</Link>
                </li>
              </ul>
            </div>
            {dataWindowAnalysis && (
              <div className="row justify-content-center">
                <div className="col-12 col-lg-10 col-xl-9">
                  <div className="row align-items-center">
                    <div className="col">
                      <h6 className="page-title">{""}</h6>
                      <h4 className="page-title">ID: #{analysisId}</h4>
                    </div>
                    <div className="col-auto">
                      <button
                        id="btn-save"
                        className="btn btn-primary ml-2"
                        onClick={() => save(dataWindowAnalysis)}
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
                            <h3>MD5: {dataWindowAnalysis.MD5}</h3>
                            <h3 className="invoice-title">
                              <strong>{dataWindowAnalysis.malware_type}</strong>
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
                                        {Object.entries(dataWindowAnalysis)
                                          .filter(
                                            ([attribute]) =>
                                              attribute !== "MD5" &&
                                              !attribute.includes("SHA")
                                          )
                                          .map(([attribute, value]) => (
                                            <tr key={attribute}>
                                              <td className="text-center">
                                                <strong>
                                                  {attribute
                                                    .split("_")
                                                    .map(
                                                      (word) =>
                                                        word
                                                          .charAt(0)
                                                          .toUpperCase() +
                                                        word.slice(1)
                                                    )
                                                    .join(" ")}
                                                </strong>
                                              </td>
                                              <td className="text-center">
                                                {value}
                                              </td>
                                            </tr>
                                          ))}
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
            )}
          </div>
        </div>
        <Footer />
      </div>
    </>
  );
};

export default WindowAnalysisDetail;
