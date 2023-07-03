import React, { useState, useEffect, useRef } from "react";
import { Link, useLocation } from "react-router-dom";
import { Toast } from "primereact/toast";
import { BreadCrumb } from "primereact/breadcrumb";
import { Divider } from "primereact/divider";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { Chart } from "primereact/chart";
import { CircularProgressbar, buildStyles } from "react-circular-progressbar";
import Plot from "react-plotly.js";
import "react-circular-progressbar/dist/styles.css";
import moment from "moment";
import {
  getModelDetails,
  getModelHistory,
  getModelDatasets,
} from "../services/kSecurityService";

export default function ModelDetailsPage() {
  const [modelDetails, setModelDetails] = useState(null);
  const [history, setHistory] = useState(null);
  const [datasetDistribute, setDatasetDistribute] = useState(null);
  const path = useLocation();
  const toast = useRef(null);

  function formatDate(raw, format) {
    const data = moment(raw).format("YYYY-MM-DD HH:mm:ss");
    const date = moment.utc(data).toDate();

    return moment(date).local().format(format);
  }

  const percentageBody = (rawData) => {
    return `${rawData.percentage.toFixed(2)}%`;
  };

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

  const home = { icon: "pi pi-home", url: "/", template: iconItemTemplate };
  const items = path.pathname
    .split("/")
    .slice(1)
    .map((name) => {
      return { label: name.charAt(0).toUpperCase() + name.slice(1) };
    });

  const itemsBreadCrumb = items.map((item) => {
    if (item.label === "Models") {
      return {
        ...item,
        url: "/models/",
        template: iconItemTemplate,
      };
    } else {
      return {
        ...item,
      };
    }
  });

  useEffect(() => {
    const id = path.pathname.split("/").at(-1);

    getModelDetails(id).then((response) => setModelDetails(response.data));
    getModelHistory(id).then((response) => setHistory(response.data));
    getModelDatasets(id).then((response) => {
      const datasets = response.data;
      const _quantity = datasets
        .map((dataset) => dataset.quantity)
        .reduce((accumulator, quantity) => accumulator + quantity);
      const _datasetDistribute = datasets.map((dataset) => {
        return {
          label: dataset.label,
          quantity: dataset.quantity,
          percentage: (dataset.quantity / _quantity) * 100,
        };
      });

      setDatasetDistribute(_datasetDistribute);
    });
  }, [path.pathname]);

  return (
    <>
      <Toast ref={toast} />

      <div className="flex flex-wrap gap-2 align-items-center mb-4">
        <h3 className="mr-3" style={{ marginBottom: 0 }}>
          Models
        </h3>
        <Divider layout="vertical" />
        <BreadCrumb
          model={itemsBreadCrumb}
          home={home}
          style={{ background: "transparent", border: 0 }}
        />
      </div>

      {modelDetails && (
        <div className="grid">
          <div className="col-12 md:col-6">
            <div className="card">
              <h5 className="mb-4">Overrall Performance</h5>
              <div className="flex align-items-center mt-2">
                <div
                  className="flex flex-column align-items-center px-1"
                  style={{ height: 150 }}
                >
                  <CircularProgressbar
                    value={modelDetails.accuracy}
                    maxValue={1}
                    text={`${Math.round(modelDetails.accuracy * 100)}%`}
                    strokeWidth={8}
                    styles={buildStyles({
                      textSize: "1.5rem",
                      textColor: "var(--text-color)",
                      pathColor: "#28a745",
                    })}
                    className="mb-2"
                  />
                  <span className="font-semibold mb-0">Accuracy</span>
                </div>
                <div
                  className="flex flex-column align-items-center px-1"
                  style={{ height: 150 }}
                >
                  <CircularProgressbar
                    value={modelDetails.precision}
                    maxValue={1}
                    text={`${Math.round(modelDetails.precision * 100)}%`}
                    strokeWidth={8}
                    styles={buildStyles({
                      textSize: "1.5rem",
                      textColor: "var(--text-color)",
                      pathColor: "#28a745",
                    })}
                    className="mb-2"
                  />
                  <span className="font-semibold mb-0">Precision</span>
                </div>
                <div
                  className="flex flex-column align-items-center px-1"
                  style={{ height: 150 }}
                >
                  <CircularProgressbar
                    value={modelDetails.recall}
                    maxValue={1}
                    text={`${Math.round(modelDetails.recall * 100)}%`}
                    strokeWidth={8}
                    styles={buildStyles({
                      textSize: "1.5rem",
                      textColor: "var(--text-color)",
                      pathColor: "#28a745",
                    })}
                    className="mb-2"
                  />
                  <span className="font-semibold mb-0">Recall</span>
                </div>
              </div>
            </div>
          </div>

          <div className="col-12 md:col-6">
            <div className="card">
              <h5 className="mb-4">Details Information</h5>
              <div className="grid">
                <div className="col-12 md:col-6">
                  <p className="my-1">Version</p>
                  <p className="text-xl font-semibold">
                    {modelDetails.version}
                  </p>
                </div>
                <div className="col-12 md:col-6">
                  <p className="my-1">Input Format</p>
                  <p className="text-xl font-semibold">
                    {modelDetails.input_format}
                  </p>
                </div>
                <div className="col-12 md:col-6">
                  <p className="my-1">Type</p>
                  <p className="text-xl font-semibold">{modelDetails.type}</p>
                </div>
                <div className="col-12 md:col-6">
                  <p className="my-1">Created Date</p>
                  <p className="text-xl font-semibold">
                    {formatDate(modelDetails.created_at, "DD/MM/YYYY")}
                  </p>
                </div>
              </div>
            </div>
          </div>

          <div className="col-12">
            <div className="card" style={{ minHeight: "680px" }}>
              <h5>Training History</h5>
              <Divider />
              <div className="grid">
                <div className="col-12 md:col-6">
                  <Plot
                    data={[
                      {
                        x: Array.from({ length: 101 }, (x, i) => i),
                        y: history ? history.accuracy : [],
                        mode: "lines",
                        name: "train",
                      },
                      {
                        x: Array.from({ length: 101 }, (x, i) => i),
                        y: history ? history.val_accuracy : [],
                        mode: "lines",
                        name: "validation",
                      },
                    ]}
                    layout={{
                      title: "Model Accuracy",
                      xaxis: { title: "Epoch" },
                      yaxis: { title: "Accuracy" },
                    }}
                    config={{
                      responsive: true,
                      displaylogo: false,
                    }}
                    useResizeHandler={true}
                    className="w-full"
                  />
                </div>
                <div className="col-12 md:col-6">
                  <Plot
                    data={[
                      {
                        x: Array.from({ length: 101 }, (x, i) => i),
                        y: history ? history.loss : [],
                        mode: "lines",
                        name: "train",
                      },
                      {
                        x: Array.from({ length: 101 }, (x, i) => i),
                        y: history ? history.val_loss : [],
                        mode: "lines",
                        name: "validation",
                      },
                    ]}
                    layout={{
                      title: "Model Loss",
                      xaxis: { title: "Epoch" },
                      yaxis: { title: "Loss" },
                    }}
                    config={{
                      responsive: true,
                      displaylogo: false,
                    }}
                    useResizeHandler={true}
                    className="w-full"
                  />
                </div>
              </div>
            </div>
          </div>

          {datasetDistribute && (
            <div className="col-12 mb-5">
              <div className="card">
                <h5>Dataset</h5>
                <p>Map of the distribution of labels used to train model</p>
                <Divider />
                <div className="grid">
                  <div className="col-12 md:col-6">
                    <DataTable
                      stripedRows
                      value={datasetDistribute}
                      scrollable
                      scrollHeight="340px"
                    >
                      <Column field="label" header="Label" sortable></Column>
                      <Column
                        field="quantity"
                        header="Quantity"
                        sortable
                        align={"center"}
                      ></Column>
                      <Column
                        field="percentage"
                        header="Percentage"
                        body={percentageBody}
                        sortable
                        align={"center"}
                      ></Column>
                    </DataTable>
                  </div>
                  <div className="col-12 md:col-6">
                    <Chart
                      type="pie"
                      data={{
                        labels: datasetDistribute.map(
                          (dataset) => dataset.label
                        ),
                        datasets: [
                          {
                            data: datasetDistribute.map(
                              (dataset) => dataset.quantity
                            ),
                          },
                        ],
                      }}
                      options={{
                        plugins: {
                          legend: {
                            display: true,
                            position: "right",
                            align: "start",
                            labels: {
                              fontSize: 16,
                              usePointStyle: "circle",
                              padding: 8,
                            },
                          },
                        },
                        responsive: true,
                        maintainAspectRatio: false,
                      }}
                    />
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      )}
    </>
  );
}
