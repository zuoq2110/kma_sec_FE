import React, { useContext, useState, useRef, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { Toast } from "primereact/toast";
import { Divider } from "primereact/divider";
import { BreadCrumb } from "primereact/breadcrumb";
import { Button } from "primereact/button";
import { DataContext } from "../context/dataContext";
import { Accordion, AccordionTab } from "primereact/accordion";

export default function WindowAnalyzeDetail() {
  const { dataWindowAnalysis } = useContext(DataContext);
  const path = useLocation();
  const toast = useRef(null);
  const [filename, setFilename] = useState(null);
  const [dataPE, setDataPe] = useState(null);

  // data response
  const [dataFieldHeader, setDataFieldHeader] = useState(null);
  const [dataLibraries, setDataLibraries] = useState(null);
  const [dataSections, setDataSections] = useState(null);

  useEffect(() => {
    const { _dataPE, fileName } = dataWindowAnalysis;
    setFilename(fileName);
    setDataPe(_dataPE);
    setDataFieldHeader({
      dos_header: _dataPE.dos_header,
      header: _dataPE.header,
      optional_header: _dataPE.optional_header,
    });
    setDataLibraries(_dataPE.libraries);
    setDataSections(_dataPE.sections);
  }, [dataWindowAnalysis]);

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

  const itemTemplate = ([key, value]) => {
    return (
      <div className="col-12">
        <div className="flex flex-column xl:flex-row xl:align-items-start p-1 gap-4">
          <div className="flex flex-column sm:flex-row justify-content-between align-items-center xl:align-items-start flex-1 gap-4">
            <div className="flex flex-column align-items-center sm:align-items-start gap-3">
              <div className="text-900">{key} :</div>
            </div>
            <div className="flex sm:flex-column align-items-center sm:align-items-end gap-3 sm:gap-2">
              <span className="font-semibold">{String(value)}</span>
            </div>
          </div>
        </div>
      </div>
    );
  };

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

      {dataPE && (
        <>
          <div className="flex flex-wrap justify-content-between align-items-center mb-4">
            <p className="mb-0" style={{ fontSize: "1.5rem" }}>
              File Name: {filename}
            </p>
            <Button label="Save" onClick={() => save(dataPE)} />
          </div>

          <div className="card px-6 mb-5">
            <div className="flex flex-wrap justify-content-between align-items-center mx-3 mt-2 mb-5">
              <p className="my-0" style={{ fontSize: "1.25rem" }}></p>
              <h4 className="my-0">{dataPE.malware_type}</h4>
            </div>

            <Divider />

            <h5 className="mx-3 mb-4">Summary</h5>
            {/* Data field header */}
            <Accordion multiple>
              {Object.keys(dataFieldHeader).map((section) => {
                return (
                  <AccordionTab
                    key={section}
                    header={section
                      .split("_")
                      .map(
                        (word) => word.charAt(0).toUpperCase() + word.slice(1)
                      )
                      .join(" ")}
                  >
                    {Object.entries(dataPE[section]).map(([key, value]) => (
                      <div className="m-0" key={key}>
                        {itemTemplate([key, value])}
                      </div>
                    ))}
                  </AccordionTab>
                );
              })}

              {/* Libraries */}
              {
                <AccordionTab header="Libraries">
                  {dataLibraries.map((item, index) => (
                    <Accordion key={index} multiple>
                      <AccordionTab header={item.name}>
                        {Object.entries(item).map(([key, value]) => {
                          if (key === "entries") {
                            return null;
                          } else {
                            return (
                              <div className="m-0" key={key}>
                                {itemTemplate([key, value])}
                              </div>
                            );
                          }
                        })}
                      </AccordionTab>
                    </Accordion>
                  ))}
                </AccordionTab>
              }
              {/* Section */}
              {
                <AccordionTab header="Section">
                  {dataSections.map((item, index) => (
                    <Accordion key={index} multiple>
                      <AccordionTab header={item.name}>
                        {Object.entries(item).map(([key, value]) => {
                          return (
                            <div className="m-0" key={key}>
                              {itemTemplate([key, value])}
                            </div>
                          );
                        })}
                      </AccordionTab>
                    </Accordion>
                  ))}
                </AccordionTab>
              }
            </Accordion>
          </div>
        </>
      )}
    </>
  );
}
