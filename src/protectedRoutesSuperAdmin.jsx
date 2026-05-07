import React from "react";
import { Navigate, Outlet, useLocation } from "react-router-dom";
import { jwtDecode } from "jwt-decode";
import Cookies from "js-cookie";
import { getAuthToken, setAuthTokens } from "@/configs";

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

    // Validate token expiration
    const token = getAuthToken();
    if (token) {
      const decoded = jwtDecode(token);
      const currentTime = Math.floor(Date.now() / 1000);
      if (decoded.exp && decoded.exp < currentTime) {
        localStorage.removeItem("superAdminSession");
        return redirectToSignIn();
      }

      const tokenRole = String(decoded?.role || "").toUpperCase();
      if (tokenRole !== "SUPER_ADMIN" && tokenRole !== "SUB_ADMIN") {
        try {
          const originalAuth = JSON.parse(localStorage.getItem("superAdminOriginalAuth") || "null");
          if (originalAuth?.token) {
            const originalDecoded = jwtDecode(originalAuth.token);
            const originalRole = String(originalDecoded?.role || "").toUpperCase();
            const originalCurrentTime = Math.floor(Date.now() / 1000);

            if (
              (originalRole === "SUPER_ADMIN" || originalRole === "SUB_ADMIN") &&
              (!originalDecoded.exp || originalDecoded.exp >= originalCurrentTime)
            ) {
              setAuthTokens(originalAuth.token, originalAuth.refreshToken ?? null);
              Cookies.set("token", originalAuth.token, { expires: 7, secure: true });
              localStorage.removeItem("superAdminOriginalAuth");
              localStorage.removeItem("superAdminVendorContext");
              return <Navigate to={location.pathname} replace />;
            }
          }
        } catch (error) {
          // Ignore malformed restore payload and fall through to sign in redirect.
        }

        localStorage.removeItem("superAdminSession");
        localStorage.removeItem("superAdminOriginalAuth");
        localStorage.removeItem("superAdminVendorContext");
        return redirectToSignIn();
      }
    }
  } catch (error) {
    return redirectToSignIn();
  }

  return <Outlet />;
}
