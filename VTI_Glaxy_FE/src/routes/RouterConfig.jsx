// routes/RouterConfig.js
import React from "react";
import { createBrowserRouter, Navigate } from "react-router-dom";
import HomePage from "../pages/HomePage";
import MovieDetails from "../components/MovieDetails";
import Layout from "../components/Layout";
import ErrorPage from "../components/ErrorPage";

const router = createBrowserRouter([
  {
    element: <Layout />,
    children: [
      {
        path: "/",
        element: <HomePage />,
        children: [
          {
            index: true, // Mặc định khi vào "/"
            element: <Navigate to="/?tab=now-showing" replace />, // Chuyển hướng đến tab "now-showing"
          },
        ],
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
        path: "*",
        element: <ErrorPage />,
      },
    ],
  },
]);

export default router;
