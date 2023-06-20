import React, { useContext } from "react";
import { useLocation } from "react-router-dom";
import { DataContext } from "../context/dataContext";
import ToastNotification from "../components/ToastMessage";
import { Divider } from "primereact/divider";
import { BreadCrumb } from "primereact/breadcrumb";
import { Button } from "primereact/button";

const WindowAnalysisDetail = () => {
  const { dataWindowAnalysis } = useContext(DataContext);
  const path = useLocation();
  const pathNames = path.pathname.replace("/analysis/windows/", "").trim();
  const analysisId = pathNames.replace("/", "").trim();

  const home = { icon: "pi pi-home", url: "/" };
  const items = [
    { label: "Analysis" },
    { label: "Windows" },
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
        {dataWindowAnalysis && (
          <div className="container-analysis-detail">
            <div className="col-12 col-lg-10 col-xl-9">
              <div className="row align-items-center title-analysis-detail">
                <div className="col">
                  <h6 className="page-title">{""}</h6>
                  <h4 className="page-title">ID: #{analysisId}</h4>
                </div>
                <div className="col-auto">
                  <Button
                    label="Save"
                    onClick={() => save(dataWindowAnalysis)}
                  />
                </div>
              </div>
              <Divider layout="horizontal" />
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
                      <Divider layout="horizontal" />
                      <div className="card-detail">
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
    </>
  );
};

export default WindowAnalysisDetail;
