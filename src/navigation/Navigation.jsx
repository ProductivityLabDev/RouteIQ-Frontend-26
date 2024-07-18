import React from "react";
import { Routes, Route, Outlet, Navigate } from "react-router-dom";
import Login from "../pages/auth/Login";
import SignUp from "../pages/auth/SignUp";
import ForgetPassword from "../pages/auth/ForgetPassword";
import Dashboard from "../pages/dashboard/Dashboard";
import EmailVerify from "../pages/auth/EmailVerify";
import EmailVerifyNote from "../pages/auth/EmailVerifyNote";
import PasswordVerificationCode from "../pages/auth/PasswordVerificationCode";
import PasswordUpdateSuccessfullNote from "../pages/auth/PasswordUpdateSuccessfullNote";
import DashboardSubcription from "../pages/dashboard/DashboardSubcription";
import SubscriptionPage from "../pages/dashboard/SubscriptionPage";
import PaymentSuccess from "../pages/dashboard/PaymentSuccess";

const Navigation = () => {
  // function ProtectedRoutes() {
  //   const accessToken = localStorage.getItem("Sign");

  //   return accessToken ? <Outlet /> : <Navigate to="/" replace />;
  // }

  // function PublicRoutes() {
  //   const accessToken = localStorage.getItem("Sign");

  //   return accessToken ? <Navigate to="/home" replace /> : <Outlet />;
  // }

  return (
    <Routes>
      {/* <Route element={<PublicRoutes />}> */}
      <Route path="/" element={<Login />} />
      <Route path="/sign_up" element={<SignUp />} />
      <Route path="/forget_password" element={<ForgetPassword />} />
      <Route path="/email_verify" element={<EmailVerify />} />
      <Route path="/email_verify_note" element={<EmailVerifyNote />} />
      <Route path="/verification_code" element={<PasswordVerificationCode />} />
      <Route
        path="/password_update"
        element={<PasswordUpdateSuccessfullNote />}
      />

      {/* </Route> */}
      {/* <Route element={<ProtectedRoutes />}> */}
      <Route path="/dashboard" element={<Dashboard />} />
      <Route
        path="/dashboard_subscription"
        element={<DashboardSubcription />}
      />
      <Route path="/subscription_page" element={<SubscriptionPage />} />
      <Route path="/payment_success" element={<PaymentSuccess />} />

      {/* </Route> */}
    </Routes>
  );
};

export default Navigation;
