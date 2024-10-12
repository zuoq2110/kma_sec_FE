import React, { useState, useRef, useEffect } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { Toast } from 'primereact/toast'
import { Divider } from 'primereact/divider'
import { BreadCrumb } from 'primereact/breadcrumb'
import { Button } from 'primereact/button'
import { Accordion, AccordionTab } from 'primereact/accordion'
import { getDataAnalyzePage, getPdfDetails } from '../services/kSecurityService'

export default function PDFAnalyzeDetail() {
  const path = useLocation()
  const toast = useRef(null)
  const [filename, setFilename] = useState(null)
  const [dataPDF, setDataPDF] = useState(null)
  const [attributes, setAttributes] = useState(null)



  useEffect(() => {
    const analysisPdfId = pathNames.at(-1).trim()
    getPdfDetails(analysisPdfId).then((response) => {
      setDataPDF(response.data)
      setAttributes(response.data.attributes)
    })
    let _dataAnalyze = getDataAnalyzePage()
    let dataAnalyzes = _dataAnalyze ? _dataAnalyze : []

    if (dataAnalyzes) {
      dataAnalyzes.map((item) => {
        if (item.id === analysisPdfId) {
          setFilename(item.fileName)
        }
        return null
      })
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])
  console.log(attributes);

  function save(analysisPdfDetails) {
    try {
      const json = JSON.stringify(analysisPdfDetails)
      const blob = new Blob([json], { type: 'application/json' })
      const link = document.createElement('a')
      link.href = window.URL.createObjectURL(blob)
      link.download = 'analysis'
      link.click()
      toast.current.show({
        severity: 'success',
        summary: 'Success',
        detail: 'Export successfully!',
      })
    } catch (error) {
      toast.current.show({
        severity: 'error',
        summary: 'Failure',
        detail: error,
      })
    }
  }

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

  const pathNames = path.pathname.split('/').slice(1)
  const home = { icon: 'pi pi-home', url: '/', template: iconItemTemplate }
  const items = pathNames.map((name) => {
    return { label: name.charAt(0).toUpperCase() + name.slice(1) }
  })

  const itemsBreadCrumb = items.map((item) => {
    if (item.label === 'Analyze') {
      return {
        ...item,
        url: '/analyze',
        template: iconItemTemplate,
      }
    } else {
      return {
        ...item,
      }
    }
  })

  const itemTemplate = ([key, value]) => {
    return (
      <div className="col-12">
        <div className="flex flex-column xl:flex-row xl:align-items-start p-1 gap-4">
          <div className="flex flex-column sm:flex-row justify-content-between align-items-center xl:align-items-start flex-1 gap-4">
            <div className="flex flex-column align-items-center sm:align-items-start gap-3">
              <div className="text-900">{key} :</div>
            </div>
            <div className="flex sm:flex-column align-items-center sm:align-items-end gap-3 sm:gap-2">
              <span className="font-semibold">{String(value)}</span>
            </div>
          </div>
        </div>
      </div>
    )
  }
  console.log(dataPDF)
  return (
    <>
      <Toast ref={toast}></Toast>

      <div className="flex flex-wrap gap-2 align-items-center mb-5">
        <h3 className="mr-3 mb-0">Analysis</h3>
        <Divider layout="vertical" />
        <BreadCrumb
          model={itemsBreadCrumb}
          home={home}
          style={{ background: 'transparent', border: 0 }}
        />
      </div>

      {dataPDF && (
        <>
          <div className="flex flex-wrap justify-content-between align-items-center mb-4">
            <p className="mb-0" style={{ fontSize: '1.5rem' }}>
              {filename ? `File Name: ${filename}` : ''}
            </p>
            <Button label="Save" onClick={() => save(dataPDF)} />
          </div>

          <div className="card px-6 mb-5">
            <div className="flex flex-wrap justify-content-between align-items-center mx-3 mt-2 mb-5">
              <h4 className="my-0">Malware Type:</h4>

              <h4 className="my-0">{dataPDF.malware_type}</h4>
            </div>
            <Accordion>
              <AccordionTab header="Attributes">
                {Object.entries(attributes).map(([key, value]) => {
                  return (
                    <div className="m-0" key={key}>
                      {itemTemplate([key, value])}
                    </div>
                  );
                })}
              </AccordionTab>
            </Accordion>

          </div>
        </>
      )}
    </>
  )
}
