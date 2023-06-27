import DefaultLayout from "../layout/DefaultLayout";
import Analyze from "../pages/Analyze";
import AndroidAnalyzeDetail from "../pages/AndroidAnalyzeDetail";
import LoginPage from "../pages/Login";
import WindowAnalyzeDetail from "../pages/WindowAnalyzeDetail";

export const defaultRoutes = [
  {
    path: "/",
    element: (
      <DefaultLayout>
        <Analyze />
      </DefaultLayout>
    ),
  },
  {
    path: "/login",
    element: <LoginPage />,
  },
  {
    path: "/analyze/",
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
    path: "/analyze/windows/:id",
    element: (
      <DefaultLayout>
        <WindowAnalyzeDetail />
      </DefaultLayout>
    ),
  },
];
