import { createBrowserRouter } from "react-router-dom";
import Home from "./Home";
import Problems from "./Problems";
import ProblemDetail from "./ProblemDetail";
import Records from "./Records";

const router = createBrowserRouter([
  { path: "/", element: <Home /> },
  { path: "/problems/:flow", element: <Problems /> },
  { path: "/problem/:id/:flow", element: <ProblemDetail /> },
  { path: "/records", element: <Records /> },
]);

export default router;
