import { useSelector } from "react-redux";
import { Navigate, Outlet } from "react-router-dom";

export const PrivateRouter = ({ allowedRoles = [] }) => {
  const { isLoggedIn, position } = useSelector((state) => state.auth);

  if (!isLoggedIn) return <Navigate to="/" replace />;
  if (!allowedRoles.includes(position)) return <Navigate to="/" replace />;

  return <Outlet />;
};
