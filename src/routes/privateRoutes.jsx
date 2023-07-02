import DefaultLayout from "../layout/DefaultLayout.jsx";
import WindowAnalyzeDetail from "../pages/WindowAnalyzeDetail.jsx";
import ModelsPage from "../pages/ModelsPage.jsx";
import ModelDetailsPage from "../pages/ModelDetailsPage.jsx";
import LoginPage from "../pages/Login.jsx";
import StatisticsPage from "../pages/StatisticsPage.jsx";
import AnalyzePage from "../pages/AnalyzePage.jsx";
import AndroidAnalyzeDetail from "../pages/AndroidAnalyzeDetail.jsx";

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
  {
    path: "/analyze/android/:id",
    element: (
      <DefaultLayout>
        <AndroidAnalyzeDetail />
      </DefaultLayout>
    ),
  },
  {
    path: "/statistics/android/:id",
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
  {
    path: "/models",
    element: (
      <DefaultLayout>
        <ModelsPage />
      </DefaultLayout>
    ),
  },
  {
    path: "/models/:id",
    element: (
      <DefaultLayout>
        <ModelDetailsPage />
      </DefaultLayout>
    ),
  },
  {
    path: "/login",
    element: <LoginPage />,
  },
  {
    path: "/statistics",
    element: (
      <DefaultLayout>
        <StatisticsPage />
      </DefaultLayout>
    ),
  },
];
