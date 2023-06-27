import moment from "moment";
import { BreadCrumb } from "primereact/breadcrumb";
import { Column } from "primereact/column";
import { DataTable } from "primereact/datatable";
import { Divider } from "primereact/divider";
import { InputText } from "primereact/inputtext";
import { Toast } from "primereact/toast";
import React, { useEffect, useRef, useState } from "react";
import { Calendar } from "primereact/calendar";
import { Link } from "react-router-dom";

const KSECURITY_URL = process.env.REACT_APP_KSECURITY_SERVICE_URL;

const AnalysisPage = () => {
  const [analysisData, setAnalysisData] = useState(null);
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
    { label: "Analysis", url: "/analysis", template: iconItemTemplate },
  ];

  const header = (
    <div className="flex flex-wrap gap-2 align-items-center justify-content-between">
      <h4 className="m-0">Analysis</h4>
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
        to={`/analyze/android/${rawData.id}`}
        style={{ textDecoration: "none", color: "var(--primary-color)" }}
      >
        {rawData.name}
      </Link>
    );
  };

  const createdDateTemplate = (rawData) => {
    const data = moment(rawData.created_at).format("YYYY-MM-DD HH:mm:ss");
    const date = moment.utc(data).toDate();

    return moment(date).local().format("DD/MM/YYYY HH:mm:ss");
  };

  const dateFilterTemplate = (options) => {
    return (
      <Calendar
        value={options.value}
        onChange={(e) => options.filterCallback(e.value, options.index)}
        dateFormat="mm/dd/yy"
        placeholder="mm/dd/yyyy"
        mask="99/99/9999"
      />
    );
  };

  useEffect(() => {
    const url = `${KSECURITY_URL}/api/v1/android/applications/`;
    const params = {
      page: 1,
      limit: 100,
    };

    const urlWithParams = new URL(url);
    Object.keys(params).forEach((key) =>
      urlWithParams.searchParams.append(key, params[key])
    );
    fetch(urlWithParams, { method: "GET" })
      .then((response) => response.json())
      .then((response) => {
        const data = response.data.map((item) => {
          return {
            ...item,
            created_at: new Date(item.created_at),
          };
        });
        setAnalysisData(data);
      });
  }, []);

  return (
    <>
      <Toast ref={toast} />

      <div className="flex flex-wrap gap-2 align-items-center mb-4">
        <h3 className="mr-3" style={{ marginBottom: 0 }}>
          Analysis
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
          value={analysisData}
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
          showAddButton={false}
        >
          <Column selectionMode="multiple" exportable={false}></Column>
          <Column
            field="name"
            header="Name"
            sortable
            body={idTemplate}
            style={{ minWidth: "10rem" }}
          ></Column>
          <Column
            field="package"
            header="Package"
            style={{ minWidth: "10rem" }}
          ></Column>
          <Column
            field="malware_type"
            header="Type"
            style={{ minWidth: "10rem" }}
            filter
            filterPlaceholder="Search by type"
            showAddButton={false}
          ></Column>

          <Column
            field="created_at"
            header="Created Date"
            sortable
            body={createdDateTemplate}
            style={{ minWidth: "16rem" }}
            filter
            // filterField="date"
            dataType="date"
            filterElement={dateFilterTemplate}
            showAddButton={false}
          ></Column>
        </DataTable>
      </div>
    </>
  );
};

export default AnalysisPage;
