import React, { useState, useEffect, useRef } from "react";
import { Link, useLocation } from "react-router-dom";
import { BreadCrumb } from "primereact/breadcrumb";
import { Divider } from "primereact/divider";
import { InputText } from "primereact/inputtext";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { Button } from "primereact/button";
import { Toast } from "primereact/toast";
import { FilterMatchMode, FilterOperator } from "primereact/api";
import moment from "moment";
import { getModels, getModelSource } from "../services/kSecurityService";

const MODEL_TYPE_HDF5 = "HDF5/H5";
const MODEL_TYPE_PICKLE = "PICKLE";

export default function ModelsPage() {
  const [models, setModels] = useState(null);
  const [globalFilter, setGlobalFilter] = useState("");
  const [filters, setFilters] = useState(null);
  const toast = useRef(null);
  const path = useLocation();
  const type = path.pathname.replace("/models/", "").trim();

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
  const items = [{ label: "Models" }, { label: `${type}` }];

  const onGlobalFilterChange = (event) => {
    const value = event.target.value;
    let _filters = { ...filters };

    _filters["global"].value = value;
    setFilters(_filters);
    setGlobalFilter(value);
  };
  const header = (
    <div className="flex flex-wrap gap-2 align-items-center justify-content-between">
      <h4 className="m-0">Trained Models</h4>
      <span className="p-input-icon-left">
        <i className="pi pi-search" />
        <InputText
          value={globalFilter}
          onChange={onGlobalFilterChange}
          placeholder="Search..."
        />
      </span>
    </div>
  );

  const versionBody = (rawData) => {
    return (
      <Link
        to={`/models/${rawData.id}`}
        style={{ textDecoration: "none", color: "var(--primary-color)" }}
      >
        {rawData.version}
      </Link>
    );
  };

  const createdDateBody = (rawData) => {
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

    getModelSource(id, format);
    toast.current.show({
      severity: "success",
      summary: "Successful",
      detail: "Download successfully!",
      life: 3000,
    });
  };

  const actionBody = (rawData) => {
    return (
      <Button
        icon="pi pi-download"
        rounded
        outlined
        className="mr-2"
        onClick={() => download(rawData.id, rawData.type)}
      />
    );
  };

  useEffect(() => {
    const _filters = {
      global: { value: null, matchMode: FilterMatchMode.CONTAINS },
      input_format: {
        operator: FilterOperator.OR,
        constraints: [{ value: null, matchMode: FilterMatchMode.EQUALS }],
      },
    };

    setFilters(_filters);
    getModels(type).then((response) => setModels(response.data));
  }, [type]);

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
          dataKey="id"
          paginator
          removableSort
          rows={10}
          rowsPerPageOptions={[10, 20, 50, 100]}
          paginatorTemplate="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink CurrentPageReport RowsPerPageDropdown"
          currentPageReportTemplate="Showing {first} to {last} of {totalRecords} products"
          filters={filters}
          header={header}
        >
          <Column
            field="version"
            header="Version"
            body={versionBody}
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
            showAddButton={false}
          ></Column>
          <Column
            field="created_at"
            header="Created Date"
            sortable
            body={createdDateBody}
            style={{ minWidth: "16rem" }}
          ></Column>
          <Column
            body={actionBody}
            exportable={false}
            style={{ minWidth: "8rem" }}
          ></Column>
        </DataTable>
      </div>
    </>
  );
}
