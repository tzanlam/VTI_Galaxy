import { useSelector } from "react-redux";
import { Navigate, Outlet } from "react-router-dom";

export const PrivateRouter = ({ allowedRoles = [] }) => {
  const { isLoggedIn, position } = useSelector((state) => state.auth);
  const role = position?.[0]?.authority;

  if (!isLoggedIn) return <Navigate to="/" replace />;
  if (!allowedRoles.includes(role)) return <Navigate to="/" replace />;

  return <Outlet />;
};
