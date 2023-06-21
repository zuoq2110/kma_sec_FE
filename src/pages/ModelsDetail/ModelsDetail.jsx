import { ArcElement, Chart, Legend } from "chart.js";
import moment from "moment";
import React, { useEffect, useState } from "react";
import { Pie } from "react-chartjs-2";
import { CircularProgressbar } from "react-circular-progressbar";
import "react-circular-progressbar/dist/styles.css";
import ChartDataLabels from "chartjs-plugin-datalabels";
import Plot from "react-plotly.js";
import { Link, useLocation } from "react-router-dom";
import Swal from "sweetalert2";
import "./ModelsDetail.css";
Chart.register(ArcElement, ChartDataLabels, Legend);

const BASE_URL = process.env.REACT_APP_KSECURITY_SERVICE_URL;

const ModelsDetail = () => {
  const [accuracy, setAccuracy] = useState(0);
  const [precision, setPrecision] = useState(0);
  const [recall, setRecall] = useState(0);
  const [total, setTotal] = useState(0);
  const [modelDetail, setModelDetail] = useState({});
  const [modelDetailHistory, setModelDetailHistory] = useState({});
  const url = useLocation();
  const modelId = url.pathname.split("/")[2];

  useEffect(() => {
    fetch(`${BASE_URL}/api/v1/models/${modelId}`, { method: "GET" })
      .then((response) => response.json())
      .then(({ data }) => {
        const modelTotalDatasets = data.datasets.reduce(
          (accumulator, dataset) => accumulator + dataset.quantity,
          0
        );

        setAccuracy(data.accuracy > 0 ? Math.trunc(data.accuracy * 100) : 0);
        setPrecision(data.precision > 0 ? Math.trunc(data.accuracy * 100) : 0);
        setRecall(data.recall > 0 ? Math.trunc(data.accuracy * 100) : 0);
        setTotal(modelTotalDatasets);
        setModelDetail(data);
      });

    fetch(`${BASE_URL}/api/v1/models/${modelId}/history`, { method: "GET" })
      .then((response) => response.json())
      .then(({ data }) => {
        setModelDetailHistory(data);
      });
  }, [modelId]);

  function displayOptionsDialog(onSelected) {
    Swal.fire({
      title: "Export",
      showCancelButton: false,
      showConfirmButton: false,
      html: `
      <button class="swal2-confirm swal2-styled" value="h5">HDF5/H5</button>
      <button class="swal2-confirm swal2-styled" value="tflite">TFLite</button>
      `,
      didOpen: () => {
        const buttons =
          Swal.getHtmlContainer().querySelectorAll(".swal2-confirm");
        buttons.forEach((button) => {
          button.addEventListener("click", () => {
            onSelected(button.value);

            Swal.close();
          });
        });
      },
    });
  }

  function download() {
    switch (modelDetail.type) {
      case "HDF5/H5":
        displayOptionsDialog((format) => {
          if (format !== null) {
            window.location.href = `${BASE_URL}/api/v1/models/${modelId}/source?format=${format}`;
          }
        });
        break;

      case "PICKLE":
        window.location.href = `${BASE_URL}/api/v1/models/${modelId}/source?format=pickle`;
        break;

      default:
        break;
    }
  }

  function bytesToSize(bytes) {
    const sizes = ["B", "KB", "MB", "GB", "TB"];
    if (bytes === 0) return "n/a";
    const i = parseInt(Math.floor(Math.log(bytes) / Math.log(1024)), 10);
    if (i === 0) return `${bytes} ${sizes[i]})`;
    return `${(bytes / 1000 ** i).toFixed(1)} ${sizes[i]}`;
  }

  return (
    <>
      <div className="main-panel">
        <div className="container">
          <div className="page-inner">
            <div className="page-header">
              <h4 className="page-title">Models</h4>
              <ul className="breadcrumbs">
                <li className="nav-home">
                  <Link to="/">
                    <i className="flaticon-home"></i>
                  </Link>
                </li>
                <li className="separator">
                  <i className="flaticon-right-arrow"></i>
                </li>
                <li className="nav-item">
                  <Link to="/models/">Models</Link>
                </li>
                <li className="separator">
                  <i className="flaticon-right-arrow"></i>
                </li>
                <li className="nav-item">
                  <Link>{modelId}</Link>
                </li>
              </ul>
            </div>
          </div>
          <div className="page-inner mt--5">
            <div className="d-flex align-items-left align-items-md-center flex-column flex-md-row pb-4">
              <div className="ml-md-auto py-2 py-md-0">
                {/* <a
                  href="/analysis/?model_id={{ model.id }}"
                  className="btn btn-primary btn-border btn-round mr-2"
                >
                  Analyze
                </a> */}
                <button
                  id="btn-export"
                  className="btn btn-primary btn-round"
                  onClick={download}
                >
                  Export
                </button>
              </div>
            </div>
            <div className="row mt--2">
              <div
                className="col-md-6"
                style={{
                  paddingLeft: 0,
                }}
              >
                <div className="card full-height">
                  <div className="card-body">
                    <div className="card-title">Overall Summary</div>
                    <div className="card-category">
                      Overview information about accuracy prediction of model
                    </div>
                    <div className="model-summary-container d-flex flex-wrap justify-content-around pb-2 pt-4">
                      <div className="px-2 pb-2 pb-md-0 text-center">
                        <CircularProgressbar
                          value={accuracy ? accuracy : 0}
                          className="sumary-circle-stat accuracy-circle"
                          strokeWidth={8}
                          text={`${accuracy ? accuracy : 0}%`}
                          styles={{
                            path: {
                              stroke: "#2BB930",
                            },
                            text: {
                              fontSize: "31.5px",
                              dominantBaseline: "central",
                              fill: "#575962",
                            },
                          }}
                        />
                        <h6 className="fw-bold mt-3 mb-0">Accuracy</h6>
                      </div>
                      <div className="px-2 pb-2 pb-md-0 text-center">
                        <CircularProgressbar
                          value={precision}
                          className="sumary-circle-stat precision-circle"
                          strokeWidth={8}
                          text={`${precision}%`}
                          styles={{
                            path: {
                              stroke: "#2BB930",
                            },
                            text: {
                              fontSize: "31.5px",
                              dominantBaseline: "central",
                              fill: "#575962",
                            },
                          }}
                        />
                        <h6 className="fw-bold mt-3 mb-0">Precision</h6>
                      </div>
                      <div className="px-2 pb-2 pb-md-0 text-center">
                        <CircularProgressbar
                          value={recall}
                          className="sumary-circle-stat recall-circle"
                          strokeWidth={8}
                          text={`${recall}%`}
                          styles={{
                            path: {
                              stroke: "#2BB930",
                            },
                            text: {
                              fontSize: "31.5px",
                              dominantBaseline: "central",
                              fill: "#575962",
                            },
                          }}
                        />
                        <h6 className="fw-bold mt-3 mb-0">Recall</h6>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div
                className="col-md-6"
                style={{
                  paddingRight: 0,
                }}
              >
                <div className="card full-height">
                  <div className="card-body">
                    <div className="card-title">Details Information</div>
                    <div className="row py-4 model-detail-info">
                      <div className="col-md-6 d-flex flex-column">
                        <div>
                          <h5 className="fw-bold op-8">Version</h5>
                          <h3 className="fw-bold">{modelDetail.version}</h3>
                        </div>
                        <div className="py-2"></div>
                        <div>
                          <h5 className="fw-bold op-8">File Size</h5>
                          <h3 className="fw-bold">
                            {bytesToSize(modelDetail.size)}
                          </h3>
                        </div>
                      </div>
                      <div className="col-md-6 d-flex flex-column justify-content-around">
                        <div>
                          <h5 className="fw-bold op-8">Type</h5>
                          <h3 className="fw-bold text-uppercase">
                            {modelDetail.type}
                          </h3>
                        </div>
                        <div className="py-2"></div>
                        <div>
                          <h5 className="fw-bold op-8">Created Date</h5>
                          <h3 className="fw-bold">
                            {moment(modelDetail.create_at).format(
                              "DD-MM-YYYY HH:mm:ss"
                            )}
                          </h3>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className="row row-card-no-pd">
              <div className="col-md-12">
                <div className="card">
                  <div className="card-header">
                    <div className="card-head-row card-tools-still-right">
                      <h4 className="card-title">Training History</h4>
                    </div>
                  </div>
                  <div className="card-body row">
                    <div className="col-md-6 chart-container">
                      <Plot
                        data={[
                          {
                            x: Array.from({ length: 101 }, (x, i) => i),
                            y: modelDetailHistory
                              ? modelDetailHistory["accuracy"]
                              : [],
                            mode: "lines",
                            name: "train",
                          },
                          {
                            x: Array.from({ length: 101 }, (x, i) => i),
                            y: modelDetailHistory
                              ? modelDetailHistory["val_accuracy"]
                              : [],
                            mode: "lines",
                            name: "validation",
                          },
                        ]}
                        layout={{
                          width: 520,
                          height: 440,
                          title: "Model Accuracy",
                          xaxis: {
                            title: "Epoch",
                          },
                          yaxis: {
                            title: "Accuracy",
                          },
                        }}
                      />
                    </div>
                    <div className="col-md-6 chart-container">
                      <Plot
                        data={[
                          {
                            x: Array.from({ length: 101 }, (x, i) => i),
                            y: modelDetailHistory
                              ? modelDetailHistory["loss"]
                              : [],
                            mode: "lines",
                            name: "train",
                          },
                          {
                            x: Array.from({ length: 101 }, (x, i) => i),
                            y: modelDetailHistory
                              ? modelDetailHistory["val_loss"]
                              : [],
                            mode: "lines",
                            name: "validation",
                          },
                        ]}
                        layout={{
                          width: 520,
                          height: 440,
                          title: "Model Loss",
                          xaxis: {
                            title: "Epoch",
                          },
                          yaxis: {
                            title: "Loss",
                          },
                        }}
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className="row row-card-no-pd">
              <div className="col-md-12">
                <div className="card">
                  <div className="card-header">
                    <div className="card-head-row card-tools-still-right">
                      <h4 className="card-title">Dataset</h4>
                    </div>
                    <p className="card-category">
                      Map of the distribution of labels used to train model
                    </p>
                  </div>
                  <div className="card-body">
                    <div className="row">
                      <div className="col-md-6">
                        <div className="table-responsive table-hover table-sales">
                          <table className="table model-detail-dataset-table">
                            <tbody>
                              {modelDetail?.datasets &&
                                modelDetail.datasets.map((data, index) => {
                                  return (
                                    <tr key={index}>
                                      <td>{data.label}</td>
                                      <td className="text-right">
                                        {data.quantity}
                                      </td>
                                      <td className="text-right">
                                        {`${(
                                          (data.quantity / total) *
                                          100
                                        ).toFixed(2)}
                                    %`}
                                      </td>
                                    </tr>
                                  );
                                })}
                            </tbody>
                          </table>
                        </div>
                      </div>
                      <div className="col-md-6">
                        <div className="chart-container">
                          {modelDetail && (
                            <Pie
                              data={{
                                labels: modelDetail?.datasets?.map(
                                  (dataset) => dataset.label
                                ),
                                datasets: [
                                  {
                                    data: modelDetail?.datasets?.map(
                                      (dataset) =>
                                        (dataset.quantity / total) * 100
                                    ),
                                    backgroundColor: modelDetail?.datasets?.map(
                                      (_) =>
                                        `#${Math.floor(
                                          Math.random() * 16777215
                                        ).toString(16)}`
                                    ),
                                    borderWidth: 1,
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
                                      fontColor: "rgb(154, 154, 154)",
                                      fontSize: 14,
                                      usePointStyle: "circle",
                                      padding: 16,
                                    },
                                  },
                                  datalabels: {
                                    color: "#fff",
                                    font: {
                                      weight: "bold",
                                      size: "16px",
                                    },
                                    anchor: "center",
                                    align: "center",
                                    formatter: (value) => {
                                      return value > 3
                                        ? parseInt(value) + "%"
                                        : null;
                                    },
                                  },
                                },
                                responsive: true,
                                maintainAspectRatio: false,

                                layout: {
                                  padding: {
                                    left: 16,
                                    right: 16,
                                    top: 16,
                                    bottom: 16,
                                  },
                                },
                              }}
                            />
                          )}
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
    </>
  );
};

export default ModelsDetail;
