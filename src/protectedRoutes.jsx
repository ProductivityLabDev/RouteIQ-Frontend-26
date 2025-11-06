import { Navigate, Outlet } from "react-router-dom";

export default function ProtectedRoute() {
  const authed = !!localStorage.getItem("token");
  return authed ? <Outlet /> : <Navigate to="/LoginAsVendor" replace />;
}
