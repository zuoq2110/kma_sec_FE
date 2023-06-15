import React, { useEffect, useState } from "react";

import Footer from "../components/Footer";
import { useLocation } from "react-router-dom";

const BASE_URL = "http://14.225.205.142:8000/api/v1/android/applications";

const AndroidAnalysisDetail = () => {
  const [dataAnalysis, setDataAnalysis] = useState();
  const path = useLocation();
  const pathNames = path.pathname.replace("/analysis/android/", "").trim();
  const analysisId = pathNames.replace("/", "").trim();

  function notify(message, type) {
    const content = {
      title: "K-Security",
      message: message,
      icon: "flaticon-alarm-1",
    };

    console.log(content);

    // $.notify(content, {
    //   type: type,
    //   placement: {
    //     from: 'bottom',
    //     align: 'right',
    //   },
    //   time: 1000,
    // });
  }

  function save(analysisId) {
    fetch(`${BASE_URL}/${analysisId}`, { method: "GET" })
      .then((response) => response.json())
      .then((response) => {
        const json = JSON.stringify(response);
        const blob = new Blob([json], { type: "application/json" });
        const link = document.createElement("a");

        link.href = window.URL.createObjectURL(blob);
        link.download = "analysis";
        link.click();
        notify("Export application's analysis successfully!", "success");
      })
      .catch((error) => notify(error, "danger"));
  }

  useEffect(() => {
    fetch(`${BASE_URL}/${analysisId}`, { method: "GET" })
      .then((response) => response.json())
      .then((response) => {
        setDataAnalysis(response);
      });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
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
                <span>Androids</span>
              </li>
              <li className="separator">
                <i className="flaticon-right-arrow"></i>
              </li>
              <li className="nav-item">
                <span>{analysisId}</span>
              </li>
            </ul>
          </div>
          {dataAnalysis && (
            <div className="row justify-content-center">
              <div className="col-12 col-lg-10 col-xl-9">
                <div className="row align-items-center">
                  <div className="col">
                    {/* <h6 className="page-title">test</h6> */}
                    <h4 className="page-title">ID: #{dataAnalysis.data.id}</h4>
                  </div>
                  <div className="col-auto">
                    <button
                      id="btn-save"
                      className="btn btn-primary ml-2"
                      onClick={() => save(analysisId)}
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
                          <h3 className="invoice-title">
                            Name: {dataAnalysis.data.name}
                          </h3>
                          <h3 className="invoice-title">
                            <strong>{dataAnalysis.data.malware_type}</strong>
                          </h3>
                        </div>
                        <div className="invoice-desc"></div>
                      </div>
                      <div className="card-body">
                        <div className="separator-solid"></div>
                        <div className="row">
                          <div className="col-md-4 info-invoice">
                            <h5 className="sub">Version</h5>
                            <h5>{dataAnalysis.data.version_name}</h5>
                          </div>
                          <div className="col-md-4 info-invoice">
                            <h5 className="sub">Package ID</h5>
                            <h5>{dataAnalysis.data.package}</h5>
                          </div>
                          <div className="col-md-4 info-invoice">
                            <h5 className="sub">Version Code</h5>
                            <h5>{dataAnalysis.data.version_code}</h5>
                          </div>
                        </div>

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
                                      <tr>
                                        <td className="text-center">
                                          <strong>User Features</strong>
                                        </td>
                                        <td>
                                          <br />
                                          {dataAnalysis.data.user_features.map(
                                            (user_feature, index) => (
                                              <div key={index}>
                                                {user_feature}
                                              </div>
                                            )
                                          )}
                                          <br />
                                        </td>
                                      </tr>
                                      <tr>
                                        <td className="text-center">
                                          <strong>Permissions</strong>
                                        </td>
                                        <td>
                                          <br />
                                          {dataAnalysis.data.permissions.map(
                                            (permission, index) => (
                                              <div key={index}>
                                                {permission}
                                              </div>
                                            )
                                          )}
                                          <br />
                                        </td>
                                      </tr>
                                      <tr>
                                        <td className="text-center">
                                          <strong>Activities</strong>
                                        </td>
                                        <td>
                                          <br />
                                          {dataAnalysis.data.activities.map(
                                            (activitie, index) => (
                                              <div key={index}>{activitie}</div>
                                            )
                                          )}
                                          <br />
                                        </td>
                                      </tr>
                                      <tr>
                                        <td className="text-center">
                                          <strong>Services</strong>
                                        </td>
                                        <td>
                                          <br />
                                          {dataAnalysis.data.services.map(
                                            (service, index) => (
                                              <div key={index}>{service}</div>
                                            )
                                          )}
                                          <br />
                                        </td>
                                      </tr>
                                      <tr>
                                        <td className="text-center">
                                          <strong>Receivers</strong>
                                        </td>
                                        <td>
                                          <br />
                                          {dataAnalysis.data.receivers.map(
                                            (receiver, index) => (
                                              <div key={index}>{receiver}</div>
                                            )
                                          )}
                                          <br />
                                        </td>
                                      </tr>
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
  );
};

export default AndroidAnalysisDetail;
