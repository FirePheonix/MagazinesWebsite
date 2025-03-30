import { createBrowserRouter } from "react-router-dom";
import MainPage from "@/pages/MainPage";
import About from "@/pages/About";
import Contact from "@/pages/Contact";
import Creative from "@/pages/Creative";
import EditorsChoice from "@/pages/EditorsChoice";
import Publications from "@/pages/Publications";
import Series from "@/pages/Series";
import StudentLog from "@/pages/StudentLog";

const router = createBrowserRouter([
  { path: `/`, element: <MainPage /> },
  { path: `/about`, element: <About /> },
  { path: `/contact`, element: <Contact /> },
  { path: `/creative`, element: <Creative /> },
  { path: `/editors-choice`, element: <EditorsChoice /> },
  { path: `/publications`, element: <Publications /> },
  { path: `/series`, element: <Series /> },
  { path: `/student-log`, element: <StudentLog /> },
]);

export default router;
