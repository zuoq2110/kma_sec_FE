import DefaultLayout from "../layout/DefaultLayout.jsx";
import WindowAnalyzeDetail from "../pages/WindowAnalyzeDetail.jsx";
import ModelsPage from "../pages/ModelsPage.jsx";
import ModelDetailsPage from "../pages/ModelDetailsPage.jsx";
import LoginPage from "../pages/Login.jsx";
import StatisticsPage from "../pages/StatisticsPage.jsx";
import AnalyzePage from "../pages/AnalyzePage.jsx";
import AndroidAnalyzeDetail from "../pages/AndroidAnalyzeDetail.jsx";
import NotFoundPage from "../pages/NotFoundPage.jsx";

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
    path: "*",
    element: <NotFoundPage />,
  },
];
