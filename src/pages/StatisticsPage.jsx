import React, { useContext, useEffect, useRef, useState } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { Toast } from 'primereact/toast'
import { BreadCrumb } from 'primereact/breadcrumb'
import { Column } from 'primereact/column'
import { DataTable } from 'primereact/datatable'
import { Divider } from 'primereact/divider'
import { InputText } from 'primereact/inputtext'
import { Dropdown } from 'primereact/dropdown'
import { Calendar } from 'primereact/calendar'
import { FilterMatchMode, FilterOperator } from 'primereact/api'
import moment from 'moment'
import {
  BASE_URL,
  getAndroidAnalysis,
  getWindowAnalysis,
  getPdfAnalysis,
  getDataAnalyzePage,
} from '../services/kSecurityService'
import { DataContext } from '../context/dataContext'
import { Button } from 'primereact/button'

export default function StatisticsPage() {
  const [analysisData, setAnalysisData] = useState(null)
  const [globalFilter, setGlobalFilter] = useState('')
  const [filters, setFilters] = useState(null)
  const toast = useRef(null)
  const location = useLocation()
  const path = location.pathname
  const statisticType = path.replace('/statistics/', '').trim()
  const { isAdmin } = useContext(DataContext)

  const iconItemTemplate = (item, options) => {
    return (
      <Link
        className={options.className}
        to={item.url}
        style={{ color: '#495057' }}
      >
        {item.icon ? (
          <span className={item.icon}></span>
        ) : (
          <span>{item.label}</span>
        )}
      </Link>
    )
  }

  const onGlobalFilterChange = (event) => {
    const value = event.target.value
    let _filters = { ...filters }

    _filters['global'].value = value
    setFilters(_filters)
    setGlobalFilter(value)
  }

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
  )
  const idTemplate = (rawData) => {
    console.log(rawData);
    return (
      <>
        {/* {statisticType === "APK" ? (
          <Link
            to={`/statistics/APK/${rawData.id}`}
            style={{ textDecoration: "none", color: "var(--primary-color)" }}
          >
            {rawData.name}
          </Link>
        ) : (
          <Link
            to={`/statistics/PE/${rawData.id}`}
            style={{ textDecoration: "none", color: "var(--primary-color)" }}
          >
            {rawData.md5}
          </Link>
        )} */}
        {statisticType === 'APK' ? (
          <Link
            to={`/statistics/APK/${rawData.id}`}
            style={{ textDecoration: 'none', color: 'var(--primary-color)' }}
          >
            {rawData.name}
          </Link>
        ) : statisticType === 'PDF' ? (
          <Link
            to={`/statistics/PDF/${rawData.id}`}
            style={{ textDecoration: 'none', color: 'var(--primary-color)' }}
          >
            {rawData.name}
          </Link>
        ) : (
          <Link
            to={`/statistics/PE/${rawData.id}`}
            style={{ textDecoration: 'none', color: 'var(--primary-color)' }}
          >
            {rawData.md5}
          </Link>
        )}
      </>
    )
  }

  const typeFilterElement = (options) => {
    const typeItemTemplate = (option) => {
      return <span className={`customer-badge status-${option}`}>{option}</span>
    }

    const types = analysisData?.map((element) => element['malware_type']) ?? []

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
    )
  }

  const createdDateTemplate = (rawData) => {
    const data = moment(rawData.created_at).format('YYYY-MM-DD HH:mm:ss')
    const date = moment.utc(data).toDate()

    return moment(date).local().format('DD/MM/YYYY HH:mm:ss')
  }
  const dateFilterTemplate = (options) => {
    return (
      <Calendar
        value={options.value}
        onChange={(e) => options.filterCallback(e.value, options.index)}
        dateFormat="mm/dd/yy"
        placeholder="mm/dd/yyyy"
        mask="99/99/9999"
      />
    )
  }

  const home = { icon: 'pi pi-home', url: '/', template: iconItemTemplate }
  const items = [{ label: 'Statistics' }, { label: `${statisticType}` }]

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
    }

    setFilters(_filters)
    const userId = localStorage.getItem('id')
    if (isAdmin === false) {
      if (statisticType === 'APK') {
        getAndroidAnalysis().then((response) => {
          const data = response.data.map((item) => {
            return { ...item, created_at: new Date(item.created_at) }
          })
          console.log(data)

          const userData = data.filter((item) => item.created_by === userId)

          setAnalysisData(userData)
        })
      } else if (statisticType === 'PDF') {
        getPdfAnalysis().then((response) => {
          const data = response.data.map((item) => {
            return { ...item, created_at: new Date(item.created_at) }
          })
          console.log(data)
          const userData = data.filter((item) => item.created_by === userId)
          console.log(userData)
          setAnalysisData(userData)
        })
      } else {
        getWindowAnalysis().then((response) => {
          const data = response.data.map((item) => {
            return { ...item, created_at: new Date(item.created_at) }
          })
          console.log(data)
          const userData = data.filter((item) => item.created_by === userId)
          console.log(userData)
          setAnalysisData(userData)
        })
      }
    } else {
      if (statisticType === 'APK') {
        getAndroidAnalysis().then((response) => {
          const data = response.data.map((item) => {
            return { ...item, created_at: new Date(item.created_at) }
          })
          console.log(data)
          setAnalysisData(data)
        })
      } else if (statisticType === 'PDF') {
        getPdfAnalysis().then((response) => {
          const data = response.data.map((item) => {
            return { ...item, created_at: new Date(item.created_at) }
          })
          console.log(data)
          setAnalysisData(data)
        })
      } else {
        getWindowAnalysis().then((response) => {
          const data = response.data.map((item) => {
            return { ...item, created_at: new Date(item.created_at) }
          })
          console.log(data)
          setAnalysisData(data)
        })
      }
    }
  }, [statisticType])

  const downloadTemplate = (rowData) => {

    const webName = 'KMA_SEC1'; // Tên thư mục trên HDFS hoặc tên bạn đã sử dụng

    const handleDownload = async () => {
      let _dataAnalyze = getDataAnalyzePage();
      let dataAnalyzes = _dataAnalyze ? _dataAnalyze : [];

      let fileName = '';
      if (dataAnalyzes) {
        if (statisticType === "APK") {
          const matchingItem = dataAnalyzes.find(item => item.appName === rowData.name);
          if (matchingItem) {
            fileName = matchingItem.fileName;
            console.log('fileName:', fileName);
          }
        } else if (statisticType === "PE") {
          console.log(rowData.md5);
          const matchingItem = dataAnalyzes.find(item => item.appName === rowData.md5);
          if (matchingItem) {
            fileName = matchingItem.fileName;
            console.log('fileName:', fileName);
          }
        }
        else {
          console.log(rowData.name);
          fileName = rowData.name
        }

      }

      if (!fileName) {
        console.error('No matching file found');
        return;
      }

      try {
        console.log(`Attempting to download ${fileName} from ${webName}`);
        const response = await fetch(`http://192.168.1.103:8086/download1?file_name=${fileName}&web_name=${webName}`);
        console.log('Fetch response:', response);

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        // const blob = await response.blob();
        // console.log('Blob created:', blob);

        // const url = window.URL.createObjectURL(blob);
        // const link = document.createElement('a');
        // link.href = url;
        // link.setAttribute('download', fileName);
        // document.body.appendChild(link);
        // link.click();
        // link.remove();
        // window.URL.revokeObjectURL(url);

        // console.log(`File ${fileName} downloaded successfully`);

        const contentType = response.headers.get('Content-Type');
        console.log('Content-Type:', contentType);

        const blob = await response.blob();
        console.log('Blob created:', blob);

        // Tạo một Blob URL với Content-Type
        const url = window.URL.createObjectURL(new Blob([blob], { type: contentType }));

        // Tạo một link ẩn và kích hoạt click event
        const link = document.createElement('a');
        link.href = url;
        link.setAttribute('download', fileName);
        link.setAttribute('target', '_blank');
        document.body.appendChild(link);
        link.click();

        // Cleanup
        window.URL.revokeObjectURL(url);
        document.body.removeChild(link);

        console.log(`File ${fileName} download initiated`);
      } catch (error) {
        console.error('Error downloading the file:', error);
      }
    };
    return (
      <Button
        className="p-button-text"
        onClick={handleDownload}
      >
        <i className="pi pi-download" ></i>
      </Button>

    );
  };

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
          style={{ background: 'transparent', border: 0 }}
        />
      </div>

      <div className="card mb-5">
        {statisticType === 'APK' ? (
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
              header="Download"
              body={downloadTemplate}
              style={{ minWidth: '5rem' }}
            ></Column>
            <Column
              field="name"
              header="Name"
              sortable
              body={idTemplate}
              style={{ minWidth: '10rem' }}
            ></Column>
            <Column
              field="package"
              header="Package"
              style={{ minWidth: '10rem' }}
            ></Column>
            <Column
              field="malware_type"
              header="Type"
              style={{ minWidth: '10rem' }}
              filter
              filterElement={typeFilterElement}
              showAddButton={false}
            ></Column>
            <Column
              field="created_at"
              header="Created Date"
              sortable
              body={createdDateTemplate}
              style={{ minWidth: '16rem' }}
              filter
              filterField="created_at"
              dataType="date"
              filterElement={dateFilterTemplate}
            ></Column>
          </DataTable>
        ) : statisticType === 'PE' ? (
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
              header="Download"
              body={downloadTemplate}
              style={{ minWidth: '5rem' }}
            ></Column>
            <Column
              field="md5"
              header="MD5"
              sortable
              body={idTemplate}
              style={{ minWidth: '10rem' }}
            ></Column>
            <Column
              field="malware_type"
              header="Type"
              style={{ minWidth: '10rem' }}
              filter
              filterElement={typeFilterElement}
              showAddButton={false}
            ></Column>
            <Column
              field="created_at"
              header="Created Date"
              sortable
              body={createdDateTemplate}
              style={{ minWidth: '16rem' }}
              filter
              filterField="created_at"
              dataType="date"
              filterElement={dateFilterTemplate}
            ></Column>
          </DataTable>
        ) : <DataTable
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
            header="Download"
            body={downloadTemplate}
            style={{ minWidth: '5rem' }}
          ></Column>
          <Column
            field="name"
            header="Name"
            sortable
            body={idTemplate}
            style={{ minWidth: '10rem' }}
          ></Column>
          <Column
            field="malware_type"
            header="Type"
            style={{ minWidth: '10rem' }}
            filter
            filterElement={typeFilterElement}
            showAddButton={false}
          ></Column>
          <Column
            field="created_at"
            header="Created Date"
            sortable
            body={createdDateTemplate}
            style={{ minWidth: '16rem' }}
            filter
            filterField="created_at"
            dataType="date"
            filterElement={dateFilterTemplate}
          ></Column>
        </DataTable>}
      </div>
    </>
  )
}
