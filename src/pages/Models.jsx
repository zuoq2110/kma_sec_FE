import React, { useState, useEffect, useRef } from "react";

import { Link } from "react-router-dom";
import { BreadCrumb } from "primereact/breadcrumb";
import { Divider } from "primereact/divider";
import { InputText } from "primereact/inputtext";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { Button } from "primereact/button";
import { Toast } from "primereact/toast";
import moment from "moment";

const KSECURITY_URL = process.env.REACT_APP_KSECURITY_SERVICE_URL;

const MODEL_TYPE_HDF5 = "HDF5/H5";
const MODEL_TYPE_PICKLE = "PICKLE";

export default function Models() {
  const [models, setModels] = useState(null);
  const [selectedModels, setSelectedModels] = useState(null);
  const [globalFilter, setGlobalFilter] = useState(null);
  const toast = useRef(null);

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
  const items = [
    { label: "Models", url: "/models/", template: iconItemTemplate },
  ];

  const header = (
    <div className="flex flex-wrap gap-2 align-items-center justify-content-between">
      <h4 className="m-0">Trained Models</h4>
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

  const idTemplate = (rawData) => {
    return (
      <Link
        to={`/models/${rawData.id}`}
        style={{ textDecoration: "none", color: "var(--primary-color)" }}
      >
        {rawData.id}
      </Link>
    );
  };

  const createdDateTemplate = (rawData) => {
    const data = moment(rawData.created_at).format("YYYY-MM-DD HH:mm:ss");
    const date = moment.utc(data).toDate();

    return moment(date).local().format("DD/MM/YYYY HH:mm:ss");
  };

  const download = (id, type) => {
    let format;

    switch (type) {
      case MODEL_TYPE_HDF5:
        format = "h5";
        break;

      case MODEL_TYPE_PICKLE:
        format = "pickle";
        break;

      default:
        toast.current.show({
          severity: "error",
          summary: "Failure",
          detail: "Invalid format!",
          life: 3000,
        });
        return;
    }

    window.location.href = `${KSECURITY_URL}/api/v1/models/${id}/source?format=${format}`;
    toast.current.show({
      severity: "success",
      summary: "Successful",
      detail: "Download successfully!",
      life: 3000,
    });
  };

  const actionBodyTemplate = (rawData) => {
    return (
      <React.Fragment>
        <Button
          icon="pi pi-download"
          rounded
          outlined
          className="mr-2"
          onClick={() => download(rawData.id, rawData.type)}
        />
      </React.Fragment>
    );
  };

  useEffect(() => {
    fetch(`${KSECURITY_URL}/api/v1/models`, { method: "GET" })
      .then((response) => response.json())
      .then((response) => setModels(response.data));
  }, []);

  return (
    <>
      <Toast ref={toast} />

      <div className="flex flex-wrap gap-2 align-items-center mb-4">
        <h3 className="mr-3" style={{ marginBottom: 0 }}>
          Models
        </h3>
        <Divider layout="vertical" />
        <BreadCrumb
          model={items}
          home={home}
          style={{ background: "transparent", border: 0 }}
        />
      </div>

      <div className="card mb-5">
        <DataTable
          value={models}
          selection={selectedModels}
          onSelectionChange={(e) => setSelectedModels(e.value)}
          dataKey="id"
          paginator
          removableSort
          rows={10}
          rowsPerPageOptions={[10, 25, 50, 100]}
          paginatorTemplate="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink CurrentPageReport RowsPerPageDropdown"
          currentPageReportTemplate="Showing {first} to {last} of {totalRecords} products"
          globalFilter={globalFilter}
          header={header}
        >
          <Column selectionMode="multiple" exportable={false}></Column>
          <Column
            field="id"
            header="ID"
            body={idTemplate}
            style={{ minWidth: "16rem" }}
          ></Column>
          <Column
            field="version"
            header="Version"
            sortable
            style={{ minWidth: "12rem" }}
          ></Column>
          <Column
            field="type"
            header="Type"
            style={{ minWidth: "10rem" }}
          ></Column>
          <Column
            field="input_format"
            header="Input Format"
            style={{ minWidth: "10rem" }}
          ></Column>
          <Column
            field="created_at"
            header="Created Date"
            sortable
            body={createdDateTemplate}
            style={{ minWidth: "16rem" }}
          ></Column>
          <Column
            field="id"
            body={actionBodyTemplate}
            exportable={false}
            style={{ minWidth: "8rem" }}
          ></Column>
        </DataTable>
      </div>
    </>
  );
}
