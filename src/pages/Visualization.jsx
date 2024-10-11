import React, { useState, useEffect, useMemo, useRef } from 'react'
import { Chart } from 'primereact/chart'
import {
  getAndroidAnalysis,
  getWindowAnalysis,
  getPdfAnalysis,
} from '../services/kSecurityService'
import { Dropdown } from 'primereact/dropdown'
import {
  BY_LASTEST_15_DAYS,
  BY_LASTEST_30_DAYS,
  BY_LASTEST_3_DAYS,
  BY_LASTEST_7_DAYS,
  BY_MONTH,
  BY_YEAR,
  formatDate,
} from '../utils/Labels'
import { Link, useLocation } from 'react-router-dom'
import { FilterMatchMode, FilterOperator } from 'primereact/api'

const Visualization = () => {
  const [orderByStatistics, setOrderByStatistics] = useState('monthly')

  const [chartData, setChartData] = useState({})
  const [chartOptions, setChartOptions] = useState({})
  const [orderByMonthlyOfYear, setOrderByMonthlyOfYear] = useState(
    new Date().getFullYear() + ''
  )
  const dataNumberOfBenign = useRef(new Array(12).fill(0))
  const dataNumberOfMalware = useRef(new Array(12).fill(0))
  const [orderByLatestDate, setOrderByLatestDate] = useState('3')
  const [latestDays, setLatestDays] = useState()
  const [labels, setLabels] = useState(BY_MONTH)
  const [analysisData, setAnalysisData] = useState(null)
  const location = useLocation()
  const path = location.pathname
  const statisticType = path.replace('/visualization/', '').trim()
  useEffect(() => {
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
  }, [statisticType])

  function handleChangeOrderByStatistics(event) {
    setOrderByStatistics(event.target.value)
    if (event.target.value === 'yearly') {
      setLabels(BY_YEAR)
      updateData(event.target.value)
    }
    if (event.target.value === 'monthly') {
      setLabels(BY_MONTH)
      updateData(event.target.value, new Date().getFullYear() + '')
    }
    if (event.target.value === 'daily') {
      setLabels(BY_LASTEST_3_DAYS)
      setOrderByLatestDate('3')
      setLatestDays(BY_LASTEST_3_DAYS)
      updateData(event.target.value, new Date().getFullYear() + '', latestDays)
    }
  }

  console.log('latestDays:', latestDays)
  console.log('labels:', labels)

  function handleChangeOrderByLatestDate(event) {
    setOrderByLatestDate(event.target.value)
    switch (event.target.value) {
      case '3':
        setLabels(BY_LASTEST_3_DAYS)

        setLatestDays(BY_LASTEST_3_DAYS)

        updateData(orderByStatistics, new Date().getFullYear() + '', latestDays)
        break
      case '7':
        setLabels(BY_LASTEST_7_DAYS)

        setLatestDays(BY_LASTEST_7_DAYS)

        updateData(orderByStatistics, new Date().getFullYear() + '', latestDays)
        break
      case '15':
        setLabels(BY_LASTEST_15_DAYS)

        setLatestDays(BY_LASTEST_15_DAYS)

        updateData(orderByStatistics, new Date().getFullYear() + '', latestDays)
        break
      case '30':
        setLabels(BY_LASTEST_30_DAYS)

        setLatestDays(BY_LASTEST_30_DAYS)

        updateData(orderByStatistics, new Date().getFullYear() + '', latestDays)

        break
      default:
        break
    }
  }

  function handleChangeOrderByMonthlyOfYear(event) {
    setOrderByMonthlyOfYear(event.target.value)
    updateData(orderByStatistics, event.target.value)
  }

  const updateData = useMemo(
    () =>
      (option, year, days = latestDays) => {
        switch (option) {
          case 'yearly':
            console.log('option yearly')
            const newDataNumberOfBenign_Yearly = new Array(BY_YEAR.length).fill(
              0
            )
            const newDataNumberOfMalware_Yearly = new Array(
              BY_YEAR.length
            ).fill(0)
            analysisData?.forEach((app) => {
              const createdDate = new Date(app.created_at)
              if (app.malware_type === 'Benign') {
                const year = createdDate.getFullYear() + ''
                newDataNumberOfBenign_Yearly[BY_YEAR.indexOf(year)] += 1
              } else {
                const year = createdDate.getFullYear() + ''
                newDataNumberOfMalware_Yearly[BY_YEAR.indexOf(year)] += 1
              }
            })
            dataNumberOfBenign.current = newDataNumberOfBenign_Yearly
            dataNumberOfMalware.current = newDataNumberOfMalware_Yearly
            console.log(
              'dataNumberOfBenign.current:',
              dataNumberOfBenign.current
            )
            console.log(
              'dataNumberOfMalware.current:',
              dataNumberOfMalware.current
            )
            break
          case 'monthly':
            const newDataNumberOfBenign_Monthly = new Array(12).fill(0)
            const newDataNumberOfMalware_Monthly = new Array(12).fill(0)
            analysisData?.forEach((app) => {
              const createdDate = new Date(app.created_at)
              if (
                app.malware_type === 'Benign' &&
                createdDate.getFullYear() === parseInt(year + '')
              ) {
                console.log('app.malware_type:', app.malware_type)

                console.log(
                  'createdDate.getFullYear():',
                  createdDate.getFullYear()
                )

                const month = createdDate.getMonth()

                newDataNumberOfBenign_Monthly[month] += 1
                console.log(
                  'newDataNumberOfBenign_Monthly',
                  newDataNumberOfBenign_Monthly
                )
              } else if (
                app.malware_type !== 'Benign' &&
                createdDate.getFullYear() === parseInt(year + '')
              ) {
                console.log('app.malware_type:', app.malware_type)

                console.log(
                  'createdDate.getFullYear():',
                  createdDate.getFullYear()
                )
                const month = createdDate.getMonth()

                newDataNumberOfMalware_Monthly[month] += 1
                console.log(
                  'newDataNumberOfMalware_Monthly',
                  newDataNumberOfMalware_Monthly
                )
              }
            })
            dataNumberOfBenign.current = newDataNumberOfBenign_Monthly
            dataNumberOfMalware.current = newDataNumberOfMalware_Monthly
            break
          case 'daily':
            console.log('days:', days)
            console.log('year:', year)
            console.log('option:', option)
            if (!days) return
            const newDataNumberOfBenign_Daily = new Array(days?.length).fill(0)
            const newDataNumberOfMalware_Daily = new Array(days?.length).fill(0)
            analysisData?.forEach((app) => {
              const createdDate = new Date(app.created_at)
              const createdDateFormatted = formatDate(createdDate)

              if (
                app.malware_type === 'Benign' &&
                days?.includes(createdDateFormatted)
              ) {
                newDataNumberOfBenign_Daily[
                  days.indexOf(createdDateFormatted)
                ] += 1
              } else if (
                app.malware_type !== 'Benign' &&
                days?.includes(createdDateFormatted)
              ) {
                newDataNumberOfMalware_Daily[
                  days.indexOf(createdDateFormatted)
                ] += 1
              }
            })
            dataNumberOfBenign.current = newDataNumberOfBenign_Daily
            dataNumberOfMalware.current = newDataNumberOfMalware_Daily

            break
          default:
            break
        }
      },
    [analysisData, latestDays]
  )

  useEffect(() => {
    if (analysisData) updateData(orderByStatistics, orderByMonthlyOfYear)
  }, [
    analysisData,
    orderByMonthlyOfYear,
    orderByStatistics,
    updateData,
    orderByLatestDate,
  ])

  useEffect(() => {
    console.log('analysisData:', analysisData)
    console.log('Benign Data:', dataNumberOfBenign.current)
    console.log('Malware Data:', dataNumberOfMalware.current)
  }, [analysisData])

  useEffect(() => {
    const documentStyle = getComputedStyle(document.documentElement)
    const textColor = documentStyle.getPropertyValue('--text-color')
    const textColorSecondary = documentStyle.getPropertyValue(
      '--text-color-secondary'
    )
    const surfaceBorder = documentStyle.getPropertyValue('--surface-border')
    const data = {
      labels,
      datasets: [
        {
          label: 'Mã sạch',
          backgroundColor: documentStyle.getPropertyValue('--blue-500'),
          borderColor: documentStyle.getPropertyValue('--blue-500'),
          data: dataNumberOfBenign.current,
        },
        {
          label: 'Mã độc',
          backgroundColor: documentStyle.getPropertyValue('--pink-500'),
          borderColor: documentStyle.getPropertyValue('--pink-500'),
          data: dataNumberOfMalware.current,
        },
      ],
    }
    const options = {
      maintainAspectRatio: false,
      aspectRatio: 1,
      plugins: {
        legend: {
          labels: {
            fontColor: textColor,
          },
        },
      },
      scales: {
        x: {
          ticks: {
            color: textColorSecondary,
            font: {
              weight: 500,
            },
          },
          grid: {
            display: false,
            drawBorder: false,
          },
        },
        y: {
          ticks: {
            color: textColorSecondary,
          },
          grid: {
            color: surfaceBorder,
            drawBorder: false,
          },
        },
      },
    }

    setChartData(data)
    setChartOptions(options)
  }, [updateData, orderByLatestDate, orderByMonthlyOfYear, orderByStatistics])

  return (
    <div className="card shadow-1 rounded p-5 flex  flex-column bg-light">
      <div className="flex justify-content-end mb-5">
        <div className="flex flex-column gap-2">
          <label>Thống kê theo</label>

          <Dropdown
            value={orderByStatistics}
            options={[
              { label: 'Hàng năm', value: 'yearly' },
              { label: 'Hàng tháng', value: 'monthly' },
              { label: 'Hàng ngày', value: 'daily' },
            ]}
            onChange={handleChangeOrderByStatistics}
            placeholder="Thống kê theo"
            className="p-mr-2"
          />
        </div>
        {orderByStatistics === 'daily' && (
          <div className="flex flex-column gap-2 ml-2">
            <label>Lọc theo</label>
            <Dropdown
              value={orderByLatestDate}
              options={[
                { label: '3 ngày gần đây', value: '3' },
                { label: '7 ngày gần đây', value: '7' },
                { label: '15 ngày gần đây', value: '15' },
                { label: '30 ngày gần đây', value: '30' },
              ]}
              onChange={handleChangeOrderByLatestDate}
              placeholder="Lọc theo"
              className="p-mr-2"
            />
          </div>
        )}
        {orderByStatistics === 'monthly' && (
          <div className="flex flex-column gap-2 ml-2">
            <label>Năm</label>
            <Dropdown
              value={orderByMonthlyOfYear}
              options={BY_YEAR.map((year) => ({
                label: year.toString(),
                value: year.toString(),
              }))}
              onChange={handleChangeOrderByMonthlyOfYear}
              placeholder="Năm"
              className="p-mr-2"
            />
          </div>
        )}
      </div>
      <Chart type="bar" data={chartData} options={chartOptions} />
    </div>
  )
}

export default Visualization
