import React, { useEffect, useState } from "react";

import { useLocation } from "react-router-dom";
import ToastNotification from "../components/ToastMessage";
import { Divider } from "primereact/divider";
import { BreadCrumb } from "primereact/breadcrumb";
import { Button } from "primereact/button";

const BASE_URL = process.env.REACT_APP_KSECURITY_SERVICE_URL;

const AndroidAnalysisDetail = () => {
  const [dataAnalysis, setDataAnalysis] = useState();
  const path = useLocation();
  const pathNames = path.pathname.replace("/analysis/android/", "").trim();
  const analysisId = pathNames.replace("/", "").trim();

  const home = { icon: "pi pi-home", url: "/" };
  const items = [
    { label: "Analysis" },
    { label: "Android" },
    { label: `${analysisId}` },
  ];

  function notify(message, type) {
    const content = {
      title: "K-Security",
      message: message,
      // icon: "flaticon-alarm-1",
    };

    ToastNotification(content, type);
  }

  function save(analysisId) {
    fetch(`${BASE_URL}/api/v1/android/applications/${analysisId}`, {
      method: "GET",
    })
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
      .catch((error) => notify(error, "error"));
  }

  useEffect(() => {
    fetch(`${BASE_URL}/api/v1/android/applications/${analysisId}`, {
      method: "GET",
    })
      .then((response) => response.json())
      .then((response) => {
        setDataAnalysis(response);
      });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <>
      <div className="flex flex-wrap gap-2 align-items-center mb-4">
        <h2 className="mr-3">Analysis</h2>
        <Divider layout="vertical" />
        <BreadCrumb
          model={items}
          home={home}
          style={{ background: "transparent", border: 0 }}
        />
      </div>
      <div className="main-panel">
        {dataAnalysis && (
          <div className="container-analysis-detail">
            <div className="col-12 col-lg-10 col-xl-9">
              <div className="row align-items-center title-analysis-detail">
                <div className="col">
                  <h6 className="page-title">{""}</h6>
                  <h4 className="page-title">ID: #{dataAnalysis.data.id}</h4>
                </div>
                <div className="col-auto">
                  <Button label="Save" onClick={() => save(analysisId)} />
                </div>
              </div>
              <Divider layout="horizontal" />
              <div className="row">
                <div className="col-md-12">
                  <div className="card card-invoice" style={{ width: "900px" }}>
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
                      <Divider layout="horizontal" />
                      <div className="row flex">
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
                                            <div key={index}>{permission}</div>
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
    </>
  );
};

export default AndroidAnalysisDetail;
