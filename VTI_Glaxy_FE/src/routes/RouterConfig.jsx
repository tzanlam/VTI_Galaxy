// routes/RouterConfig.js
import React from "react";
import { createBrowserRouter, Navigate } from "react-router-dom";
import HomePage from "../pages/HomePage";
import MovieDetails from "../components/MovieDetails";
import Layout from "../components/Layout";
import ErrorPage from "../components/ErrorPage";
import HomeAdmin from "../pages/HomeAdmin";
import GalaxyManagement from "../components/admin/GalaxyManagement";
import RoomManagement from "../components/admin/RoomManagement";
import MovieManagement from "../components/admin/MovieManagement";
import SeatSelection from "../components/SeatSelection";
import Other from "../components/Other";
import Payment from "../components/Payment";

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
        path: "/seat-selection/:showtimeId",
        element: <SeatSelection />,
      },
      {
        path: "/other",
        element: <Other />,
      },
      {
        path: "/payment",
        element: <Payment />,
      },
      {
        path: "*",
        element: <ErrorPage />,
      },
    ],
  },
  {
    element: <HomeAdmin />,
    path: "/management",
    children: [
      {
        element: <GalaxyManagement />,
        path: "galaxy",
      },
      {
        element: <RoomManagement />,
        path: "room",
      },
      {
        element: <MovieManagement />,
        path: "movie",
      },
    ],
  },
]);

export default router;
