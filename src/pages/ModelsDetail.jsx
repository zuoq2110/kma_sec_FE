import React from "react";
import Footer from "../components/Footer";

const ModelsDetail = () => {
  return (
    <>
      <div className="main-panel">
        <div className="container">
          <div className="page-inner">
            <div className="page-header">
              <h4 className="page-title">Models</h4>
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
                  <a href="/models/">Models</a>
                </li>
                <li className="separator">
                  <i className="flaticon-right-arrow"></i>
                </li>
                <li className="nav-item">
                  <span>{/* {{ model.id }} */}</span>
                </li>
              </ul>
            </div>
          </div>
          <div className="page-inner mt--5">
            <div className="d-flex align-items-left align-items-md-center flex-column flex-md-row pb-4">
              <div className="ml-md-auto py-2 py-md-0">
                {/* <a href="/analysis/?model_id={{ model.id }}" className="btn btn-primary btn-border btn-round mr-2">Analyze</a> */}
                <button id="btn-export" className="btn btn-primary btn-round">
                  Export
                </button>
              </div>
            </div>
            <div className="row mt--2">
              <div className="col-md-6">
                <div className="card full-height">
                  <div className="card-body">
                    <div className="card-title">Overall Summary</div>
                    <div className="card-category">
                      Overview information about accuracy prediction of model
                    </div>
                    <div className="d-flex flex-wrap justify-content-around pb-2 pt-4">
                      <div className="px-2 pb-2 pb-md-0 text-center">
                        <div id="circles-1"></div>
                        <h6 className="fw-bold mt-3 mb-0">Accuracy</h6>
                      </div>
                      <div className="px-2 pb-2 pb-md-0 text-center">
                        <div id="circles-2"></div>
                        <h6 className="fw-bold mt-3 mb-0">Precision</h6>
                      </div>
                      <div className="px-2 pb-2 pb-md-0 text-center">
                        <div id="circles-3"></div>
                        <h6 className="fw-bold mt-3 mb-0">Recall</h6>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div className="col-md-6">
                <div className="card full-height">
                  <div className="card-body">
                    <div className="card-title">Details Information</div>
                    <div className="row py-4">
                      <div className="col-md-6 d-flex flex-column justify-content-around">
                        <div>
                          <h5 className="fw-bold op-8">Version</h5>
                          <h3 className="fw-bold">
                            {/* {{ model["version"] }} */}
                          </h3>
                        </div>
                        <div className="py-2"></div>
                        <div>
                          <h5 className="fw-bold op-8">File Size</h5>
                          <h3 className="fw-bold">
                            {/* {{ model["size"] | filesizeformat }} */}
                          </h3>
                        </div>
                      </div>
                      <div className="col-md-6 d-flex flex-column justify-content-around">
                        <div>
                          <h5 className="fw-bold op-8">Type</h5>
                          <h3 className="fw-bold text-uppercase">
                            {/* {{ model["type"] }} */}
                          </h3>
                        </div>
                        <div className="py-2"></div>
                        <div>
                          <h5 className="fw-bold op-8">Created Date</h5>
                          <h3 className="fw-bold">
                            {/* {{ model["created_at"].strftime("%d-%m-%Y %H:%M:%S") }} */}
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
                      <div id="accuracy-charts"></div>
                    </div>
                    <div className="col-md-6 chart-container">
                      <div id="loss-charts"></div>
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
                          <table className="table">
                            {/* {% set total = model.datasets | sum(attribute='quantity') %} */}
                            <tbody>
                              {/* {% for dataset in model.datasets %} */}
                              <tr>
                                <td>{/* {{ dataset.label }} */}</td>
                                <td className="text-right">
                                  {/* {{ dataset.quantity }} */}
                                </td>
                                <td className="text-right">
                                  {/* {{ ((dataset.quantity / total) * 100) | round(2) }}% */}
                                </td>
                              </tr>
                              {/* {% endfor %} */}
                            </tbody>
                          </table>
                        </div>
                      </div>
                      <div className="col-md-6">
                        <div className="chart-container">
                          <canvas id="pieChart"></canvas>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <Footer />
      </div>
    </>
  );
};

export default ModelsDetail;
