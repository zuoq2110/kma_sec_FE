import React, { useEffect, useState } from "react";
import Footer from "../components/Footer";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import moment from "moment";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { Button } from "primereact/button";
import { InputText } from "primereact/inputtext";

const BASE_URL = process.env.REACT_APP_KSECURITY_SERVICE_URL;

const Models = () => {
  const navigate = useNavigate();
  const [dataModel, setDataModel] = useState();
  const [globalFilter, setGlobalFilter] = useState(null);

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

  function download(modelId, type) {
    switch (type) {
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

  useEffect(() => {
    fetch(`${BASE_URL}/api/v1/models`, { method: "GET" })
      .then((response) => response.json())
      .then((response) => {
        setDataModel(response);
      });
  }, []);

  const header = (
    <div
      className="flex-wrap gap-2 align-items-center justify-content-between"
      style={{ display: "flex" }}
    >
      <h4 className="m-0">Trained models</h4>
      <span className="p-input-icon-left">
        <i className="pi pi-search" />
        <InputText
          type="search"
          onInput={(e) => setGlobalFilter(e.target.value)}
          placeholder="Search..."
        />
      </span>
    </div>
  );

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
            {/* <div
              className="flex flex-wrap  gap-2 mb-4"
              style={{ display: "flex", justifyContent: "end" }}
            >
              <Button label="Add Model" icon="pi pi-plus" severity="success" />
            </div> */}
            <div className="card">
              {dataModel && (
                <>
                  <DataTable
                    value={dataModel.data}
                    dataKey="id"
                    paginator
                    rows={10}
                    rowsPerPageOptions={[5, 10, 25]}
                    removableSort
                    paginatorTemplate="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink CurrentPageReport RowsPerPageDropdown"
                    currentPageReportTemplate="Showing {first} to {last} of {totalRecords} products"
                    globalFilter={globalFilter}
                    header={header}
                  >
                    <Column
                      field="id"
                      header="ID"
                      sortable
                      style={{ minWidth: "18rem" }}
                      body={(rowData) => (
                        <span
                          style={{
                            cursor: "pointer",
                            color: "#1572e8",
                          }}
                          onClick={() => navigate(`/models/${rowData.id}`)}
                        >
                          {rowData.id}
                        </span>
                      )}
                    ></Column>
                    <Column
                      field="version"
                      header="Version"
                      sortable
                      style={{ minWidth: "6rem" }}
                    ></Column>
                    <Column
                      field="type"
                      header="Type"
                      sortable
                      style={{ minWidth: "8rem" }}
                    ></Column>
                    <Column
                      field="input_format"
                      header="Input Format"
                      sortable
                      style={{ minWidth: "10rem" }}
                    ></Column>
                    <Column
                      field="created_at"
                      header="Create At"
                      sortable
                      style={{ minWidth: "12rem" }}
                      body={(rowData) => (
                        <span>
                          {moment(rowData.create_at).format(
                            "DD/MM/YYYY HH:mm:ss"
                          )}
                        </span>
                      )}
                    ></Column>
                    <Column
                      body={(rowData) => (
                        <>
                          <Button
                            icon="pi pi-download"
                            rounded
                            outlined
                            className="mr-2"
                            onClick={() => download(rowData.id, rowData.type)}
                          />
                        </>
                      )}
                      exportable={false}
                      style={{ minWidth: "6rem" }}
                    ></Column>
                  </DataTable>
                </>
              )}
            </div>
          </div>
        </div>

        <Footer />
      </div>
    </>
  );
};

export default Models;
