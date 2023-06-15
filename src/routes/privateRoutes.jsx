import DefaultLayout from "../layout/DefaultLayout.jsx";
import Analysis from "../pages/Analysis";
import AndroidAnalysisDetail from "../pages/AndroidAnalysisDetail.jsx";
import Home from "../pages/Home";
import Models from "../pages/Models";
import ModelsDetail from "../pages/ModelsDetail.jsx";

export const privateRoutes = [
  {
    path: "/",
    element: <Home />,
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
    path: "/analysis/:id",
    element: (
      <DefaultLayout>
        <AndroidAnalysisDetail />
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
