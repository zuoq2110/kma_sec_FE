import DefaultLayout from '../layout/DefaultLayout'
import AnalyzePage from '../pages/AnalyzePage'
import AndroidAnalyzeDetail from '../pages/AndroidAnalyzeDetail'
import LoginPage from '../pages/Login'
import NotFoundPage from '../pages/NotFoundPage'
import PDFAnalyzeDetail from '../pages/PdfAnalyzeDetail'
import Register from '../pages/Register'
import StatisticsPage from '../pages/StatisticsPage'
import WindowAnalyzeDetail from '../pages/WindowAnalyzeDetail'

export const userRoutes = [
  {
    path: '/',
    element: (
      <DefaultLayout>
        <AnalyzePage />
      </DefaultLayout>
    ),
  },
  {
    path: '/login',
    element: <LoginPage />,
  },
  {
    path: '/register',
    element: <Register />,
  },
  {
    path: '/analyze/',
    element: (
      <DefaultLayout>
        <AnalyzePage />
      </DefaultLayout>
    ),
  },
  {
    path: '/statistics/APK/:id',
    element: (
      <DefaultLayout>
        <AndroidAnalyzeDetail />
      </DefaultLayout>
    ),
  },
  {
    path: '/statistics/PE/:id',
    element: (
      <DefaultLayout>
        <WindowAnalyzeDetail />
      </DefaultLayout>
    ),
  },
  {
    path: '/statistics/PDF/:id',
    element: (
      <DefaultLayout>
        <PDFAnalyzeDetail />
      </DefaultLayout>
    ),
  },
  {
    path: '/statistics/APK',
    element: (
      <DefaultLayout>
        <StatisticsPage />
      </DefaultLayout>
    ),
  },
  {
    path: '/statistics/PE',
    element: (
      <DefaultLayout>
        <StatisticsPage />
      </DefaultLayout>
    ),
  },
  {
    path: '/statistics/PDF',
    element: (
      <DefaultLayout>
        <StatisticsPage />
      </DefaultLayout>
    ),
  },
  {
    path: '/analyze/android/:id',
    element: (
      <DefaultLayout>
        <AndroidAnalyzeDetail />
      </DefaultLayout>
    ),
  },
  {
    path: '/analyze/windows/:id',
    element: (
      <DefaultLayout>
        <WindowAnalyzeDetail />
      </DefaultLayout>
    ),
  },
  {
    path: '/analyze/PDF/:id',
    element: (
      <DefaultLayout>
        <PDFAnalyzeDetail />
      </DefaultLayout>
    ),
  },
  {
    path: '*',
    element: <NotFoundPage />,
  },
]
