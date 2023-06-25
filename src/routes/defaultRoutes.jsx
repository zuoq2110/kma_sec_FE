import DefaultLayout from "../layout/DefaultLayout";
import Analysis from "../pages/Analysis";
import AndroidAnalysisDetail from "../pages/AndroidAnalysisDetail";
import LoginPage from "../pages/Login";
import WindowAnalysisDetail from "../pages/WindowAnalysisDetail";

export const defaultRoutes = [
  {
    path: "/",
    element: (
      <DefaultLayout>
        <Analysis />
      </DefaultLayout>
    ),
  },
  {
    path: "/login",
    element: <LoginPage />,
  },
  {
    path: "/analysis/",
    element: (
      <DefaultLayout>
        <Analysis />
      </DefaultLayout>
    ),
  },
  {
    path: "/analysis/android/:id",
    element: (
      <DefaultLayout>
        <AndroidAnalysisDetail />
      </DefaultLayout>
    ),
  },
  {
    path: "/analysis/windows/:id",
    element: (
      <DefaultLayout>
        <WindowAnalysisDetail />
      </DefaultLayout>
    ),
  },
];
