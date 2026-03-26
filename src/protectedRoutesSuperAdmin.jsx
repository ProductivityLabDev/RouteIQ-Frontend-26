import React from "react";
import { Navigate, Outlet, useLocation } from "react-router-dom";

export default function SuperAdminProtectedRoute() {
  const location = useLocation();
  const rawSession = localStorage.getItem("superAdminSession");

  if (!rawSession) {
    return (
      <Navigate
        to="/super-admin/sign-in"
        replace
        state={{ from: location.pathname }}
      />
    );
  }

  try {
    const session = JSON.parse(rawSession);
    if (!session?.active) {
      return (
        <Navigate
          to="/super-admin/sign-in"
          replace
          state={{ from: location.pathname }}
        />
      );
    }
  } catch (error) {
    return (
      <Navigate
        to="/super-admin/sign-in"
        replace
        state={{ from: location.pathname }}
      />
    );
  }

  return <Outlet />;
}
