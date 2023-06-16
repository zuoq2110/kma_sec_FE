import React, { useEffect, useState } from "react";
import Footer from "../components/Footer";
import { Link } from "react-router-dom";
import Swal from "sweetalert2";
import moment from "moment";

const BASE_URL = process.env.REACT_APP_API_URL;

const Models = () => {
  const [dataModel, setDataModel] = useState();

  function displayOptionsDialog(onSelected) {
    Swal.fire({
      title: "Export",
      showCancelButton: false,
      confirmButtonText: "Close",
      html: `
        <button class="swal2-confirm swal2-styled" value="HDF5/H5">HDF5/H5</button>
        <button class="swal2-confirm swal2-styled" value="TFLite">TFLite</button>
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

  function download(modelId, type) {
    switch (type) {
      case "HDF5/H5":
        displayOptionsDialog((format) => {
          if (format !== null) {
            window.location.href = `/models/${modelId}/source?format=${format}`;
            // navigate(`/models/${modelId}/source?format=${format}`);
          }
        });
        break;

      case "PICKLE":
        window.location.href = `/models/${modelId}/source?format=pickle`;
        // navigate(`/models/${modelId}/source?format=pickle`);
        break;

      default:
        break;
    }
  }

  useEffect(() => {
    fetch(`${BASE_URL}/models`, { method: "GET" })
      .then((response) => response.json())
      .then((response) => {
        setDataModel(response);
      });
  }, []);
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
            {dataModel && (
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
                            {dataModel.data.map((model) => (
                              <tr key={model.id}>
                                <td>
                                  <Link to={`/models/${model.id}/`}>
                                    {model.id}
                                  </Link>
                                </td>
                                <td>{model.version}</td>
                                <td>{model.type}</td>
                                <td>{model.input_format}</td>
                                <td>
                                  {moment(model.created_at).format(
                                    "DD/MM/YYYY HH:mm:ss"
                                  )}
                                </td>
                                <td>
                                  <div className="form-button-action">
                                    <button
                                      type="button"
                                      data-toggle="tooltip"
                                      title=""
                                      className="btn btn-link btn-primary btn-lg"
                                      data-original-title="Download"
                                      onClick={() =>
                                        download(model.id, model.type)
                                      }
                                    >
                                      <i className="fa fa-download"></i>
                                    </button>
                                  </div>
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
            )}
          </div>
        </div>

        <Footer />
      </div>
    </>
  );
};

export default Models;
