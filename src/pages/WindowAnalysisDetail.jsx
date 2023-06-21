import React, { useContext, useState, useRef, useEffect } from "react";
import { useLocation } from "react-router-dom";
import { Toast } from "primereact/toast";
import { Divider } from "primereact/divider";
import { BreadCrumb } from "primereact/breadcrumb";
import { Button } from "primereact/button";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { DataContext } from "../context/dataContext";

const WindowAnalysisDetail = () => {
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

  const pathNames = path.pathname.split("/").slice(1);
  const home = { icon: "pi pi-home", url: "/" };
  const items = pathNames.map((name) => {
    return { label: name.charAt(0).toUpperCase() + name.slice(1) };
  });

  useEffect(() => {
    const _summary = Object.keys(dataWindowAnalysis)
      .slice(0, -1)
      .map((key) => {
        return { name: key, value: dataWindowAnalysis[key] };
      });

    setSumnary(_summary);
  }, []);

  return (
    <>
      <Toast ref={toast}></Toast>

      <div className="flex flex-wrap gap-2 align-items-center mb-5">
        <h3 className="mr-3 mb-0">Analysis</h3>
        <Divider layout="vertical" />
        <BreadCrumb
          model={items}
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
};

export default WindowAnalysisDetail;
