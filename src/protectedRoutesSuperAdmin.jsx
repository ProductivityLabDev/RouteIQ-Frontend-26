import React from "react";
import { Navigate, Outlet, useLocation } from "react-router-dom";

export default function SuperAdminProtectedRoute() {
  const location = useLocation();
  const rawSession = localStorage.getItem("superAdminSession");

  const redirectToSignIn = () => (
    <Navigate
      to="/super-admin/sign-in"
      replace
      state={{ from: location.pathname }}
    />
  );

  if (!rawSession) {
    return redirectToSignIn();
  }

  try {
    const session = JSON.parse(rawSession);
    const role = String(session?.role || "").toUpperCase();
    if (
      !session?.active ||
      (role !== "SUPER_ADMIN" && role !== "SUB_ADMIN")
    ) {
      return redirectToSignIn();
    }
  } catch (error) {
    return redirectToSignIn();
  }

  return <Outlet />;
}
