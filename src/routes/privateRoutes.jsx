import DefaultLayout from "../layout/DefaultLayout.jsx";
import Analysis from "../pages/Analysis";
import AndroidAnalysisDetail from "../pages/AndroidAnalysisDetail.jsx";
import Models from "../pages/Models";
import ModelsDetail from "../pages/ModelsDetail.jsx";
import WindowAnalysisDetail from "../pages/WindowAnalysisDetail.jsx";

export const privateRoutes = [
  {
    path: "/",
    element: (
      <DefaultLayout>
        <Analysis />
      </DefaultLayout>
    ),
  },
  {
    path: "/analysis",
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
    path: "/analysis/window/:id",
    element: (
      <DefaultLayout>
        <WindowAnalysisDetail />
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
];
