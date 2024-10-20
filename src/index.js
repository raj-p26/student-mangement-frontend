import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import App from "./App";
import "bootstrap/dist/css/bootstrap.css";
import "bootstrap/dist/js/bootstrap.bundle";
import reportWebVitals from "./reportWebVitals";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import { AdmissionForm } from "./views/AdmissionForm";
import Error404 from "./views/Error404";
import { StudentsList } from "./views/StudentsList";
import { Login } from "./views/AuthLogin";
import TCDoc from "./views/TCDoc";
// import NoObjDoc from "./views/NoObjDoc";
import { ViewStudentDetails } from "./views/ViewStudentDetails";
// import BonafideDoc from "./views/BonafideDoc";
// import FirstTrialDoc from "./views/FirstTrialDoc";
import { ViewFirstTrial } from "./views/ViewFirstTrial";
import ViewTc from "./views/ViewTc";
import ViewNoObj from "./views/ViewNoObj";
import { ViewBonafide } from "./views/ViewBonafide";
import { UpdateStudent } from "./views/UpdateStudent";
import { UpdateStudentImage } from "./views/UpdateStudentImage";
import StudentCount from "./views/StudentCount";

const root = ReactDOM.createRoot(document.getElementById("root"));

let allRoutes = createBrowserRouter([
  { path: "/login", element: <Login /> },
  { path: "/", element: <App /> },
  { path: "/admissionForm", element: <AdmissionForm /> },
  { path: "/viewdata", element: <StudentsList /> },
  { path: "/students/:id", element: <ViewStudentDetails /> },
  { path: "*", element: <Error404 /> },
  { path: "/tcdoc", element: <TCDoc /> },
  { path: "/noObjdoc", element: <ViewNoObj /> },
  { path: "/bonafidedoc", element: <ViewBonafide /> },
  { path: "/firsttrialdoc", element: <ViewFirstTrial /> },
  { path: "/view-firstTrial", element: <ViewFirstTrial /> },
  { path: "/view-tc", element: <ViewTc /> },
  { path: "/view-noobj", element: <ViewNoObj /> },
  { path: "/view-bonafide", element: <ViewBonafide /> },
  { path: "/updateStudent", element: <UpdateStudent /> },
  { path: "/update-img/:id", element: <UpdateStudentImage /> },
  { path: "/count-student", element: <StudentCount /> },
]);

root.render(<RouterProvider router={allRoutes} />);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
