import React, { useContext, useState, useRef, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { Toast } from "primereact/toast";
import { Divider } from "primereact/divider";
import { BreadCrumb } from "primereact/breadcrumb";
import { Button } from "primereact/button";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { DataContext } from "../context/dataContext";

export default function WindowAnalyzeDetail() {
  const { dataWindowAnalysis } = useContext(DataContext);
  const [summary, setSumnary] = useState(null);
  const path = useLocation();
  const toast = useRef(null);

  function save(analysisDetails) {
    try {
      const json = JSON.stringify(analysisDetails);
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
    } catch (error) {
      toast.current.show({
        severity: "error",
        summary: "Failure",
        detail: error,
      });
    }
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
  const home = { icon: "pi pi-home", url: "/", template: iconItemTemplate };
  const items = pathNames.map((name) => {
    return { label: name.charAt(0).toUpperCase() + name.slice(1) };
  });

  const itemsBreadCrumb = items.map((item) => {
    if (item.label === "Analyze") {
      return {
        ...item,
        url: "/analyze",
        template: iconItemTemplate,
      };
    } else {
      return {
        ...item,
      };
    }
  });

  useEffect(() => {
    const _summary = Object.keys(dataWindowAnalysis)
      .slice(0, -1)
      .filter((key) => {
        return key !== "MD5" && !key.includes("SHA");
      })
      .map((key) => {
        return {
          name: key,
          value: dataWindowAnalysis[key],
        };
      });

    setSumnary(_summary);
  }, [dataWindowAnalysis]);

  return (
    <>
      <Toast ref={toast}></Toast>

      <div className="flex flex-wrap gap-2 align-items-center mb-5">
        <h3 className="mr-3 mb-0">Analysis</h3>
        <Divider layout="vertical" />
        <BreadCrumb
          model={itemsBreadCrumb}
          home={home}
          style={{ background: "transparent", border: 0 }}
        />
      </div>

      {dataWindowAnalysis && (
        <>
          <div className="flex flex-wrap justify-content-between align-items-center mb-4">
            <h5 className="mb-0">ID: #{pathNames.at(-1)}</h5>
            <Button label="Save" onClick={() => save(dataWindowAnalysis)} />
          </div>

          <div className="card px-6 mb-5">
            <div className="flex flex-wrap justify-content-between align-items-center mx-3 mt-2 mb-5">
              <p className="my-0" style={{ fontSize: "1.25rem" }}>
                MD5: {dataWindowAnalysis.MD5}
              </p>
              <h4 className="my-0">{dataWindowAnalysis.malware_type}</h4>
            </div>

            <Divider />

            <h5 className="mx-3 mb-4">Summary</h5>

            <DataTable value={summary} stripedRows>
              <Column field="name" header="Feature" align={"center"}></Column>
              <Column field="value" header="Value" align={"center"}></Column>
            </DataTable>
          </div>
        </>
      )}
    </>
  );
}
