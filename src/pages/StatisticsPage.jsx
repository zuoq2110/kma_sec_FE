import React, { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { Toast } from "primereact/toast";
import { BreadCrumb } from "primereact/breadcrumb";
import { Column } from "primereact/column";
import { DataTable } from "primereact/datatable";
import { Divider } from "primereact/divider";
import { InputText } from "primereact/inputtext";
import { Dropdown } from "primereact/dropdown";
import { Calendar } from "primereact/calendar";
import { FilterMatchMode, FilterOperator } from "primereact/api";
import moment from "moment";
import { getAnalysis } from "../services/kSecurityService";

export default function StatisticsPage() {
  const [analysisData, setAnalysisData] = useState(null);
  const [globalFilter, setGlobalFilter] = useState("");
  const [filters, setFilters] = useState(null);
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

  const onGlobalFilterChange = (event) => {
    const value = event.target.value;
    let _filters = { ...filters };

    _filters["global"].value = value;
    setFilters(_filters);
    setGlobalFilter(value);
  };

  const header = (
    <div className="flex flex-wrap gap-2 align-items-center justify-content-between">
      <h4 className="m-0">Analysis</h4>
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
  const idTemplate = (rawData) => {
    return (
      <Link
        to={`/statistics/android/${rawData.id}`}
        style={{ textDecoration: "none", color: "var(--primary-color)" }}
      >
        {rawData.name}
      </Link>
    );
  };

  const typeFilterElement = (options) => {
    const typeItemTemplate = (option) => {
      return (
        <span className={`customer-badge status-${option}`}>{option}</span>
      );
    };

    const types = analysisData?.map((element) => element["malware_type"]) ?? [];

    return (
      <Dropdown
        value={options.value}
        options={[...new Set(types)]}
        onChange={(e) => options.filterCallback(e.value, options.index)}
        itemTemplate={typeItemTemplate}
        placeholder="Select a Type"
        className="p-column-filter"
        showClear
        filterMatchMode="equals"
      />
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

  const home = { icon: "pi pi-home", url: "/", template: iconItemTemplate };
  const items = [{ label: "Statistics" }];

  useEffect(() => {
    const _filters = {
      global: { value: null, matchMode: FilterMatchMode.CONTAINS },
      malware_type: {
        operator: FilterOperator.OR,
        constraints: [{ value: null, matchMode: FilterMatchMode.EQUALS }],
      },
      created_at: {
        operator: FilterOperator.AND,
        constraints: [{ value: null, matchMode: FilterMatchMode.DATE_IS }],
      },
    };

    setFilters(_filters);
    getAnalysis().then((response) => {
      const data = response.data.map((item) => {
        return { ...item, created_at: new Date(item.created_at) };
      });

      setAnalysisData(data);
    });
  }, []);

  return (
    <>
      <Toast ref={toast} />

      <div className="flex flex-wrap gap-2 align-items-center mb-4">
        <h3 className="mr-3" style={{ marginBottom: 0 }}>
          Statistics
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
          paginator
          filters={filters}
          removableSort
          rows={10}
          rowsPerPageOptions={[10, 20, 50, 100]}
          paginatorTemplate="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink CurrentPageReport RowsPerPageDropdown"
          currentPageReportTemplate="Showing {first} to {last} of {totalRecords} products"
          header={header}
        >
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
            filterElement={typeFilterElement}
            showAddButton={false}
          ></Column>
          <Column
            field="created_at"
            header="Created Date"
            sortable
            body={createdDateTemplate}
            style={{ minWidth: "16rem" }}
            filter
            filterField="created_at"
            dataType="date"
            filterElement={dateFilterTemplate}
          ></Column>
        </DataTable>
      </div>
    </>
  );
}