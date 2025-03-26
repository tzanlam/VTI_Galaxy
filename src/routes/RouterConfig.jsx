import React from "react";
import HomePage from "../pages/Homepage";
import MovieDetails from "../components/MovieDetails";
import { createBrowserRouter } from "react-router-dom";

const router = createBrowserRouter([
  {
    path: "/",
    element: <HomePage />,
  },
  {
    path: "/movie/:id",
    element: <MovieDetails />,
  },
]);

export default router;
