import React from "react";
import Footer from "../components/Footer";

const Models = () => {
  return (
    <>
      <div className="main-panel">
        <div className="content">
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
                  <span>Models</span>
                </li>
              </ul>
            </div>
            <div className="row">
              <div className="col-md-12">
                <div className="card">
                  <div className="card-header">
                    <div className="d-flex align-items-center">
                      <h4 className="card-title">Trained models</h4>
                    </div>
                  </div>
                  <div className="card-body">
                    <div className="table-responsive">
                      <table
                        id="trained-models"
                        className="display table table-striped table-hover"
                      >
                        <thead>
                          <tr>
                            <th>ID</th>
                            <th>Version</th>
                            <th>Type</th>
                            <th>Input Format</th>
                            <th>Created At</th>
                            <th
                              style={{
                                width: "10%",
                              }}
                            >
                              Action
                            </th>
                          </tr>
                        </thead>
                        <tbody>
                          {/* {% for model in models %} */}
                          <tr>
                            <td>
                              <a href="/models/{{ model.id }}/">
                                {/* {{ model.id }} */}
                              </a>
                            </td>
                            <td>{/* {{ model.version }} */}</td>
                            <td>{/* {{ model.type }} */}</td>
                            <td>{/* {{ model.input_format }} */}</td>
                            <td>
                              {/* {{ model.created_at.strftime("%d-%m-%Y %H:%M:%S") }} */}
                            </td>
                            <td>
                              <div className="form-button-action">
                                <button
                                  type="button"
                                  data-toggle="tooltip"
                                  title=""
                                  className="btn btn-link btn-primary btn-lg"
                                  data-original-title="Download"
                                  //   onClick="download('{{ model.id }}', '{{ model.type }}')"
                                >
                                  <i className="fa fa-download"></i>
                                </button>
                              </div>
                            </td>
                          </tr>
                          {/* {% endfor %} */}
                        </tbody>
                      </table>
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

export default Models;
