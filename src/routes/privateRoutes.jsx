import DefaultLayout from "../layout/DefaultLayout.jsx";
import AnalyzePage from "../pages/AnalyzePage.jsx";
import AndroidAnalyzeDetail from "../pages/AndroidAnalyzeDetail.jsx";
import LoginPage from "../pages/Login.jsx";
import ModelDetailsPage from "../pages/ModelDetailsPage.jsx";
import ModelsPage from "../pages/ModelsPage.jsx";
import NotFoundPage from "../pages/NotFoundPage.jsx";
import Register from "../pages/Register.jsx";
import StatisticsPage from "../pages/StatisticsPage.jsx";
import Visualization from "../pages/Visualization.jsx";
import WindowAnalyzeDetail from "../pages/WindowAnalyzeDetail.jsx";


export const privateRoutes = [
  {
    path: "/",
    element: (
      <DefaultLayout>
        <AnalyzePage />
      </DefaultLayout>
    ),
  },
  {
    path: "/analyze",
    element: (
      <DefaultLayout>
        <AnalyzePage />
      </DefaultLayout>
    ),
  },
  // analyze file
  {
    path: "/analyze/android/:id",
    element: (
      <DefaultLayout>
        <AndroidAnalyzeDetail />
      </DefaultLayout>
    ),
  },
  {
    path: "/analyze/windows/:id",
    element: (
      <DefaultLayout>
        <WindowAnalyzeDetail />
      </DefaultLayout>
    ),
  },
  // Statistic to analyze page
  {
    path: "/statistics/APK/:id",
    element: (
      <DefaultLayout>
        <AndroidAnalyzeDetail />
      </DefaultLayout>
    ),
  },
  {
    path: "/statistics/PE/:id",
    element: (
      <DefaultLayout>
        <WindowAnalyzeDetail />
      </DefaultLayout>
    ),
  },
  // Models
  {
    path: "/models/PE",
    element: (
      <DefaultLayout>
        <ModelsPage />
      </DefaultLayout>
    ),
  },
  {
    path: "/models/APK",
    element: (
      <DefaultLayout>
        <ModelsPage />
      </DefaultLayout>
    ),
  },
  // Models detail
  {
    path: "/models/:id",
    element: (
      <DefaultLayout>
        <ModelDetailsPage />
      </DefaultLayout>
    ),
  },
  //login
  {
    path: "/login",
    element: <LoginPage />,
  },
  {
    path: "/register",
    element: <Register />,
  },
  // Statistic Page
  {
    path: "/statistics/APK",
    element: (
      <DefaultLayout>
        <StatisticsPage />
      </DefaultLayout>
    ),
  },
  {
    path: "/statistics/PE",
    element: (
      <DefaultLayout>
        <StatisticsPage />
      </DefaultLayout>
    ),
  },
  {
    path: "/visualization/APK",
    element: (
      <DefaultLayout>
        <Visualization />
      </DefaultLayout>
    ),
  },
  {
    path: "/visualization/PE",
    element: (
      <DefaultLayout>
        <Visualization />
      </DefaultLayout>
    ),
  },
  {
    path: "*",
    element: <NotFoundPage />,
  },
];
