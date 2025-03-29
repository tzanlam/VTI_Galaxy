// routes/RouterConfig.js
import React from "react";
import { createBrowserRouter } from "react-router-dom";
import HomePage from "../pages/HomePage"; // Đảm bảo đường dẫn đúng
import MovieDetails from "../components/MovieDetails"; // Đảm bảo đường dẫn đúng
import Layout from "../components/Layout"; // Import Layout

const router = createBrowserRouter([
  {
    element: <Layout />, // Layout bao bọc tất cả các route
    children: [
      {
        path: "/",
        element: <HomePage />,
      },
      {
        path: "/movie/:id",
        element: <MovieDetails />,
      },
    ],
  },
]);

export default router;
