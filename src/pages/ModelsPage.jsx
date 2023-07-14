import React, { useState, useEffect, useRef, useCallback } from "react";
import { Link, useLocation } from "react-router-dom";
import { BreadCrumb } from "primereact/breadcrumb";
import { Divider } from "primereact/divider";
import { InputText } from "primereact/inputtext";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { Button } from "primereact/button";
import { Toast } from "primereact/toast";
import { Dropdown } from "primereact/dropdown";
import { Dialog } from "primereact/dialog";
import { FilterMatchMode, FilterOperator } from "primereact/api";
import moment from "moment";
import {
  getModels,
  getModelSource,
  updateModelState,
} from "../services/kSecurityService";

const MODEL_TYPE_HDF5 = "HDF5/H5";
const MODEL_TYPE_PICKLE = "PICKLE";

const stateEdit = ["Deactivate", "Activate"];

export default function ModelsPage() {
  const [models, setModels] = useState(null);
  const [globalFilter, setGlobalFilter] = useState("");
  const [filters, setFilters] = useState(null);
  const [editModelDialog, setEditModelDialog] = useState(false);
  const [dataModelEdited, setDataModelEdited] = useState(null);
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

  function formatDate(raw, format) {
    const data = moment(raw).format("YYYY-MM-DD HH:mm:ss");
    const date = moment.utc(data).toDate();

    return moment(date).local().format(format);
  }

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

  const stateBody = (rawData) => {
    return (
      <span className={`customer-badge status-${rawData.state}`}>
        {rawData.state}
      </span>
    );
  };

  const stateTypes = models?.map((element) => element["state"]) ?? [];

  const stateItemTemplate = (option) => {
    return <span className={`customer-badge status-${option}`}>{option}</span>;
  };

  const stateFilterTemplate = (options) => {
    return (
      <Dropdown
        value={options.value}
        options={[...new Set(stateTypes)]}
        onChange={(e) => options.filterCallback(e.value, options.index)}
        itemTemplate={stateItemTemplate}
        placeholder="Select a Type"
        className="p-column-filter"
        showClear
        filterMatchMode="equals"
      />
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

  const editModels = (model) => {
    setDataModelEdited({ ...model });
    setEditModelDialog(true);
  };

  const actionBody = (rawData) => {
    return (
      <>
        <Button
          icon="pi pi-pencil"
          rounded
          outlined
          severity="warning"
          className="mr-2"
          onClick={() => editModels(rawData)}
        />
        <Button
          icon="pi pi-download"
          rounded
          outlined
          className="mr-2"
          onClick={() => download(rawData.id, rawData.type)}
        />
      </>
    );
  };
  // dialog models

  const hideDialog = () => {
    setEditModelDialog(false);
  };

  const onloadModels = useCallback(async () => {
    await getModels(type).then((response) => setModels(response.data));
  }, [type]);

  const saveEditModel = async () => {
    let response;
    try {
      response = await updateModelState(
        dataModelEdited.id,
        dataModelEdited.state
      );
      toast.current.show({
        severity: "success",
        summary: "Success",
        detail: response.message,
        life: 2000,
      });
      await onloadModels();
      setEditModelDialog(false);
    } catch (error) {
      toast.current.show({
        severity: "error",
        summary: "Failure",
        detail: error,
      });
      return;
    }
  };

  const editModelDialogFooter = (
    <React.Fragment>
      <Button
        label="Cancel"
        severity="danger"
        icon="pi pi-times"
        outlined
        onClick={hideDialog}
      />
      <Button
        label="Save"
        severity="success"
        icon="pi pi-check"
        outlined
        onClick={saveEditModel}
      />
    </React.Fragment>
  );
  const onDropdownStateChange = (e) => {
    const val = (e.target && e.target.value) || "";
    let _dataModel = { ...dataModelEdited };

    setDataModelEdited({ ..._dataModel, state: val });
  };

  useEffect(() => {
    const _filters = {
      global: { value: null, matchMode: FilterMatchMode.CONTAINS },
      state: {
        operator: FilterOperator.OR,
        constraints: [{ value: null, matchMode: FilterMatchMode.EQUALS }],
      },
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
            field="input_format"
            header="Input Format"
            style={{ minWidth: "10rem" }}
            showAddButton={false}
          ></Column>
          <Column
            field="state"
            header="State"
            style={{ minWidth: "10rem" }}
            body={stateBody}
            filter
            filterElement={stateFilterTemplate}
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

      {dataModelEdited && (
        <Dialog
          visible={editModelDialog}
          style={{ width: "32rem" }}
          breakpoints={{ "960px": "75vw", "641px": "90vw" }}
          header="Model Details"
          modal
          className="p-fluid"
          footer={editModelDialogFooter}
          onHide={hideDialog}
        >
          <div className="field">
            <div className="col-12 md:col-6 w-full">
              <div className="grid">
                <div className="col-12 md:col-6">
                  <p className="my-1 ">Version</p>
                  <p className="text-xl font-semibold ">
                    {dataModelEdited.version}
                  </p>
                </div>
                <div className="col-12 md:col-6">
                  <p className="my-1 ">Input Format</p>
                  <p className="text-xl font-semibold ">
                    {dataModelEdited.input_format}
                  </p>
                </div>
                <div className="col-12 md:col-6">
                  <p className="my-1 ">Type</p>
                  <p className="text-xl font-semibold ">
                    {dataModelEdited.type}
                  </p>
                </div>
                <div className="col-12 md:col-6">
                  <p className="my-1 ">Created Date</p>
                  <p className="text-xl font-semibold ">
                    {formatDate(dataModelEdited.created_at, "DD/MM/YYYY")}
                  </p>
                </div>
              </div>
            </div>
          </div>
          <div className="field">
            <label className="font-bold">State</label>
            <Dropdown
              value={dataModelEdited.state}
              options={stateEdit}
              onChange={(e) => onDropdownStateChange(e)}
              itemTemplate={stateItemTemplate}
              placeholder="Select a Type"
              className="p-column-filter"
            />
          </div>
        </Dialog>
      )}
    </>
  );
}
