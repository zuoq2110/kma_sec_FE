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
import { Toolbar } from "primereact/toolbar";
import { InputNumber } from "primereact/inputnumber";
import { FilterMatchMode, FilterOperator } from "primereact/api";
import moment from "moment";
import {
  createModels,
  getModelDetails,
  getModels,
  getModelSource,
  isValidFilename,
  updateModelState,
  validateVersionName,
} from "../services/kSecurityService";
import { FileUploadDataset } from "../components/ModelsPage/FileUpload";
import { classNames } from "primereact/utils";
import { ProgressSpinner } from "primereact/progressspinner";

const MODEL_TYPE_HDF5 = "HDF5/H5";
const MODEL_TYPE_PICKLE = "PICKLE";

const stateEdit = ["Deactivate", "Activate"];

export default function ModelsPage() {
  const [models, setModels] = useState(null);
  const [globalFilter, setGlobalFilter] = useState("");
  const [filters, setFilters] = useState(null);
  const [editModelDialog, setEditModelDialog] = useState(false);
  const [dataModelEdited, setDataModelEdited] = useState(null);
  const [addNewModelDialog, setAddNewModelDialog] = useState(false);
  const [dataAddNewModel, setDataAddNewModel] = useState(null);
  const [progress, setProgessState] = useState(0);
  const [trainingSession, setTrainingSession] = useState(false);
  const [totalFile, setTotalFile] = useState(null);
  const [submitted, setSubmitted] = useState(false);
  const [invalidVersionName, setInvalidVersionName] = useState(false);
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
        {rawData?.state === "Training" ? (
          <></>
        ) : (
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
        )}
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
      if (response.status === 200) {
        toast.current.show({
          severity: "success",
          summary: "Success",
          detail: response.data.message,
          life: 2000,
        });
        await onloadModels();
      } else {
        toast.current.show({
          severity: "error",
          summary: "Failure",
          detail: response.data.message,
          life: 2000,
        });
      }
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

  // Add new models training
  const baseVersionItemTemplate = (option) => {
    return <span className={`customer-badge status-version`}>{option}</span>;
  };

  const onShowAddModel = () => {
    setAddNewModelDialog(true);
  };

  const rightToolbarTemplate = () => {
    return (
      <Button
        label="New"
        icon="pi pi-plus"
        severity="success"
        onClick={onShowAddModel}
      />
    );
  };

  const onHideAddNewModelDialog = () => {
    setAddNewModelDialog(false);
    setDataAddNewModel(null);
    setSubmitted(false);
    setTotalFile(null);
    setInvalidVersionName(false);
  };

  const onVersionNameChange = (e) => {
    const val = (e.target && e.target.value) || "";
    if (dataAddNewModel) {
      setDataAddNewModel({
        ...dataAddNewModel,
        versionName: val,
      });
    } else {
      setDataAddNewModel({
        versionName: val,
      });
    }
  };

  const onDropdownVersionChange = (e) => {
    const val = (e.target && e.target.value) || "";
    const value = val.toString();

    if (dataAddNewModel) {
      const selectedModel = models.find((item) => item.version === value);
      if (selectedModel) {
        setDataAddNewModel({
          ...dataAddNewModel,
          id: selectedModel.id,
          baseVersion: value,
        });
      }
    } else {
      const selectedModel = models.find((item) => item.version === value);
      if (selectedModel) {
        setDataAddNewModel({
          id: selectedModel.id,
          baseVersion: value,
        });
      }
    }
  };

  const onEpochChange = (e) => {
    const val = (e.target && e.target.value) || "";
    if (dataAddNewModel) {
      setDataAddNewModel({
        ...dataAddNewModel,
        epoch: val,
      });
    } else {
      setDataAddNewModel({
        epoch: val,
      });
    }
  };

  const addNewModelDialogFooter = () => {
    return (
      <React.Fragment>
        <Button
          label="Cancel"
          severity="danger"
          icon="pi pi-times"
          outlined
          onClick={onHideAddNewModelDialog}
        />
        {dataAddNewModel?.versionName &&
        dataAddNewModel?.epoch &&
        dataAddNewModel?.baseVersion &&
        totalFile ? (
          <Button
            label="Train"
            severity="success"
            icon="pi pi-check"
            outlined
            onClick={onAddNewModel}
          />
        ) : (
          <Button
            label="Train"
            severity="success"
            icon="pi pi-check"
            outlined
            disabled
            onClick={onAddNewModel}
          />
        )}
      </React.Fragment>
    );
  };

  // handler upload dataset

  const uploadHandler = async (event) => {
    const files = event.files || [];

    if (files.length >= 1) {
      if (totalFile) {
        setTotalFile({ ...totalFile, files: [...totalFile.files, ...files] });
      } else {
        setTotalFile({ files });
      }
      return;
    }
  };

  const onAddNewModel = async () => {
    setSubmitted(true);
    let invalidFlag = false;
    let listFilenameInvalid = [];

    const response = await getModelDetails(dataAddNewModel?.id).then(
      (response) => response.data
    );
    // check valid filename format
    if (totalFile) {
      totalFile.files.forEach((file) => {
        if (isValidFilename(file.name, response?.output) === false) {
          invalidFlag = true;
          listFilenameInvalid.push(file.name);
        }
      });
    }
    // check validate version name format
    if (dataAddNewModel && !validateVersionName(dataAddNewModel?.versionName)) {
      setInvalidVersionName(true);
    } else {
      setInvalidVersionName(false);
      if (invalidFlag) {
        toast.current.show({
          severity: "error",
          summary: "Failure",
          detail: `Filename of ${listFilenameInvalid.map(
            (item) => item
          )} are incorrect format`,
        });
        listFilenameInvalid = [];
        setTotalFile(null);
        return;
      } else {
        setTrainingSession(true);
        await createModels(
          totalFile?.files,
          dataAddNewModel?.versionName,
          dataAddNewModel?.id,
          dataAddNewModel?.epoch
        );
        setTrainingSession(false);
        onHideAddNewModelDialog();
        onloadModels();
      }
    }
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
        <Toolbar
          className="mb-2"
          end={rightToolbarTemplate}
          pt={{
            root: { className: "p-2" },
          }}
        ></Toolbar>
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

      {/* Dialog Edit Models */}
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

      {/* Dialog Add New Models */}

      <Dialog
        visible={addNewModelDialog}
        style={{ width: "64rem" }}
        breakpoints={{ "960px": "75vw", "641px": "90vw" }}
        header="Add New Models"
        modal
        className="p-fluid"
        footer={addNewModelDialogFooter}
        onHide={onHideAddNewModelDialog}
      >
        <div className="field">
          <label htmlFor="name" className="font-bold">
            Version Name
          </label>
          <InputText
            id="version_name"
            onChange={(e) => onVersionNameChange(e)}
            placeholder="Version Name"
            required
            className={classNames({
              "p-invalid":
                submitted && !dataAddNewModel?.versionName | invalidVersionName,
            })}
          />
          {submitted && !dataAddNewModel?.versionName && (
            <small className="p-error">Version Name is required.</small>
          )}
          {invalidVersionName && (
            <small className="p-error">Invalid Version Name Format</small>
          )}
        </div>
        <div className="field">
          <label className="mb-3 font-bold">Base Model</label>
          {models && (
            <Dropdown
              value={dataAddNewModel?.baseVersion}
              options={models.reduce((acc, item) => {
                const version = item.version;
                if (!acc.includes(version)) {
                  acc.push(version);
                }
                return acc;
              }, [])}
              placeholder="Select a Base Model"
              onChange={(e) => onDropdownVersionChange(e)}
              itemTemplate={baseVersionItemTemplate}
            />
          )}
        </div>
        <div className="formgrid grid">
          <div className="field col">
            <label htmlFor="quantity" className="font-bold">
              Epoch
            </label>
            <InputNumber
              id="quantity"
              placeholder="Enter Epoch"
              min={1}
              required
              onValueChange={(e) => onEpochChange(e)}
              className={classNames({
                "p-invalid": submitted && !dataAddNewModel?.epoch,
              })}
            />
            {submitted && !dataAddNewModel?.epoch && (
              <small className="p-error">Epoch Field is required.</small>
            )}
          </div>
        </div>
        {dataAddNewModel?.baseVersion && (
          <div className="field">
            <label className="mb-3 font-bold">Dataset</label>

            <FileUploadDataset
              maxFileSize={100000000}
              progress={progress}
              uploadHandler={uploadHandler}
              onClear={() => {
                setTotalFile(null);
              }}
              onRemoveFile={(filename) => {
                setTotalFile(
                  totalFile?.files.filter((file) => file.name !== filename)
                );
              }}
            />
          </div>
        )}
      </Dialog>
      {/* Progress dialog */}
      <Dialog
        visible={trainingSession}
        style={{ width: "40rem" }}
        breakpoints={{ "960px": "75vw", "641px": "90vw" }}
        pt={{
          closeButton: {
            className: "hidden",
          },
        }}
      >
        <h5 className="text-center">Model is being created, wait a minutes!</h5>
        <div className="m-0 flex justify-content-center">
          <ProgressSpinner />
        </div>
      </Dialog>
    </>
  );
}
