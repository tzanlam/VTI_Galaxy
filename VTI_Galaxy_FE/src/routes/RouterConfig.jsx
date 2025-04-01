// routes/RouterConfig.js
import React from "react";
import { createBrowserRouter } from "react-router-dom";
import HomePage from "../pages/HomePage";
import MovieDetails from "../components/MovieDetails";
import Layout from "../components/Layout";
import ErrorPage from "../components/ErrorPage"; // Import ErrorPage component

const router = createBrowserRouter([
  {
    element: <Layout />,
    children: [
      {
        path: "/",
        element: <HomePage />,
      },
      {
        path: "/movie/:id",
        element: <MovieDetails />,
      },
      {
        path: "/error",
        element: <ErrorPage />,
      },
      {
        path: "*", // Wildcard path cho tất cả các route không xác định
        element: <ErrorPage />,
      },
    ],
  },
]);

export default router;
