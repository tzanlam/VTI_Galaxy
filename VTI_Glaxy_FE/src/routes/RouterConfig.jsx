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
import RoomDetails from "../components/admin/details/RoomDetails";
import GalaxyDetails from "../components/admin/details/GalaxyDetails";
import MovieDetailsAdmin from "../components/admin/details/MovieDetailsAdmin";
import VoucherManagement from "../components/admin/VoucherManagement";
import VoucherDetails from "../components/admin/details/VoucherDetails";
import OtherManagement from "../components/admin/OtherManagement";
import OtherDetails from "../components/admin/details/OtherDetails";
import EmployeeManagement from "../components/admin/EmployeeManagement";
import EmployeeDetails from "../components/admin/details/EmployeeDetails";
import { PrivateRouter } from "./PrivateRouter";
import ProfilePage from "../components/admin/details/ProfileManagement";
import UserProfile from "../components/UserProfile";

const router = createBrowserRouter([
  {
    element: <Layout />,
    children: [
      {
        path: "/",
        element: <HomePage />,
        children: [
          {
            index: true,
            element: <Navigate to="/?tab=now-showing" replace />,
          },
        ],
      },
      {
        path: "/movie/:id",
        element: <MovieDetails />,
      },
      {
        path: "/profile",
        element: <UserProfile />,
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
    path: "/management",
    element: <PrivateRouter allowedRoles={["ADMIN"]} />,
    children: [
      {
        path: "",
        element: <HomeAdmin />,
        children: [
          { index: true, element: <Navigate to="profile" replace /> },

          { path: "galaxy", element: <GalaxyManagement /> },
          { path: "galaxy/:galaxyId", element: <GalaxyDetails /> },
          { path: "room", element: <RoomManagement /> },
          { path: "room/:roomId", element: <RoomDetails /> },
          { path: "movie", element: <MovieManagement /> },
          { path: "movie/:movieId", element: <MovieDetailsAdmin /> },
          { path: "voucher", element: <VoucherManagement /> },
          { path: "voucher/:voucherId", element: <VoucherDetails /> },
          { path: "other", element: <OtherManagement /> },
          { path: "other/:otherId", element: <OtherDetails /> },
          { path: "employee", element: <EmployeeManagement /> },
          { path: "employee/:employeeId", element: <EmployeeDetails /> },
          { path: "profile", element: <ProfilePage /> },
        ],
      },
    ],
  },
]);

export default router;
