import React from "react";
import HomePage from "../pages/Homepage";
import { createBrowserRouter } from "react-router-dom";

const router = createBrowserRouter([
  {
    path: "/",
    element: <HomePage />,
  },
]);

export default router;
