import DefaultLayout from "../layout/DefaultLayout.jsx";
import WindowAnalyzeDetail from "../pages/WindowAnalyzeDetail.jsx";
import Models from "../pages/Models";
import ModelsDetail from "../pages/ModelsDetail.jsx";
import LoginPage from "../pages/Login.jsx";
import StatisticsPage from "../pages/StatisticsPage.jsx";
import Analyze from "../pages/Analyze.jsx";
import AndroidAnalyzeDetail from "../pages/AndroidAnalyzeDetail.jsx";

export const privateRoutes = [
  {
    path: "/",
    element: (
      <DefaultLayout>
        <Analyze />
      </DefaultLayout>
    ),
  },
  {
    path: "/analyze",
    element: (
      <DefaultLayout>
        <Analyze />
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
        <Models />
      </DefaultLayout>
    ),
  },
  {
    path: "/models/:id",
    element: (
      <DefaultLayout>
        <ModelsDetail />
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
