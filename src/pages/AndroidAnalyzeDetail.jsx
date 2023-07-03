import React, { useState, useRef, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { Toast } from "primereact/toast";
import { Divider } from "primereact/divider";
import { BreadCrumb } from "primereact/breadcrumb";
import { Button } from "primereact/button";
import { Accordion, AccordionTab } from "primereact/accordion";
import { storeDataAnalyze } from "../services/kSecurityService";

const KSECURITY_URL = process.env.REACT_APP_KSECURITY_SERVICE_URL;

export default function AndroidAnalyzeDetail() {
  const [analysisDetails, setAnalysisDetails] = useState();
  const path = useLocation();
  const toast = useRef(null);
  const [fileNameAPK, setFileNameAPK] = useState(null);

  function getAnalysisDetails(id) {
    const url = `${KSECURITY_URL}/api/v1/android/applications/${id}`;

    return fetch(url, { method: "GET" }).then((response) => response.json());
  }

  function save(analysisId) {
    getAnalysisDetails(analysisId)
      .then((response) => {
        const json = JSON.stringify(response.data);
        const blob = new Blob([json], { type: "application/json" });
        const link = document.createElement("a");

        link.href = window.URL.createObjectURL(blob);
        link.download = "analysis";
        link.click();
        toast.current.show({
          severity: "success",
          summary: "Success",
          detail: "Export successfully!",
        });
      })
      .catch((error) => {
        toast.current.show({
          severity: "error",
          summary: "Failure",
          detail: error,
        });
      });
  }

  const iconItemTemplate = (item, options) => {
    return (
      <Link
        className={options.className}
        to={item.url}
        style={{ color: "#495057" }}
      >
        {item.icon ? (
          <span className={item.icon}></span>
        ) : (
          <span>{item.label}</span>
        )}
      </Link>
    );
  };

  const pathNames = path.pathname.split("/").slice(1);
  const titlePage =
    pathNames[0].charAt(0).toUpperCase() + pathNames[0].slice(1);
  const home = { icon: "pi pi-home", url: "/", template: iconItemTemplate };
  const items = pathNames.map((name) => {
    return { label: name.charAt(0).toUpperCase() + name.slice(1) };
  });

  const itemsBreadCrumb = items.map((item, index) => {
    if (index === 0) {
      return {
        ...item,
        url: `/${item.label.toLocaleLowerCase()}/`,
        template: iconItemTemplate,
      };
    } else {
      return {
        ...item,
      };
    }
  });

  const summaryFeatures = [
    "user_features",
    "permissions",
    "activities",
    "services",
    "receivers",
  ];

  useEffect(() => {
    const analysisId = pathNames.at(-1).trim();

    getAnalysisDetails(analysisId).then((response) =>
      setAnalysisDetails(response.data)
    );
    let dataAnalyzes = storeDataAnalyze ? [...storeDataAnalyze] : [];
    dataAnalyzes.map((item) => {
      if (item.id === analysisId) {
        setFileNameAPK(item.fileName);
      }
      return null;
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  console.log(fileNameAPK);

  return (
    <>
      <Toast ref={toast}></Toast>

      <div className="flex flex-wrap gap-2 align-items-center mb-5">
        <h3 className="mr-3 mb-0">{titlePage}</h3>
        <Divider layout="vertical" />
        <BreadCrumb
          model={itemsBreadCrumb}
          home={home}
          style={{ background: "transparent", border: 0 }}
        />
      </div>

      {analysisDetails && (
        <>
          <div className="flex flex-wrap justify-content-between align-items-center mb-4">
            <p className="mb-0" style={{ fontSize: "1.5rem" }}>
              File Name: {fileNameAPK}
            </p>
            <Button label="Save" onClick={() => save(analysisDetails.id)} />
          </div>

          <div className="card px-6 mb-5">
            <div className="flex flex-wrap justify-content-between align-items-center mx-3 mt-2 mb-5">
              <p className="my-0" style={{ fontSize: "1.5rem" }}>
                Name: {analysisDetails.name}
              </p>
              <h4 className="my-0">{analysisDetails.malware_type}</h4>
            </div>

            <Divider />

            <div className="flex flex-wrap justify-content-around align-items-center my-5">
              <div>
                <p>
                  <strong>Version</strong>
                </p>
                <p>{analysisDetails.version_name}</p>
              </div>
              <div>
                <p>
                  <strong>Package ID</strong>
                </p>
                <p>{analysisDetails.package}</p>
              </div>
              <div>
                <p>
                  <strong>Version Code</strong>
                </p>
                <p>{analysisDetails.version_code}</p>
              </div>
            </div>

            <h5 className="mx-3">Summary</h5>

            <Accordion multiple>
              {summaryFeatures.map((field) => {
                return (
                  <AccordionTab
                    key={field}
                    header={field
                      .split("_")
                      .map(
                        (word) => word.charAt(0).toUpperCase() + word.slice(1)
                      )
                      .join(" ")}
                  >
                    {analysisDetails[field].map((value, index) => (
                      <p className="m-0" key={index}>
                        - {value}
                      </p>
                    ))}
                  </AccordionTab>
                );
              })}
            </Accordion>
          </div>
        </>
      )}
    </>
  );
}
