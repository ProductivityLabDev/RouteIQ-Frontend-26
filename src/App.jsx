// src/App.jsx
import React, { useEffect, useState } from "react";
import { Routes, Route, Navigate, useLocation } from "react-router-dom";
import Loader from "./components/Loader";
import useTitle from "./hooks/useTitle";
import { routeTitles } from "./data";

import { Dashboard, Auth } from "@/layouts";
import EmployeeManagementRoutes from "./layouts/EmployeeDashboard";
import LoginAsVendor from "./pages/auth/login-as-vendor";
import Logout from "./pages/auth/logout"; 

import SchoolDashboard from "./pages/dashboard/Dashboard";
import DashboardSubscription from "./pages/dashboard/DashboardSubcription";
import SubscriptionPage from "./pages/dashboard/SubscriptionPage";
import PaymentSuccess from "./pages/dashboard/PaymentSuccess";
import Notification from "./pages/notification/Notification";
import { VendorChat } from "./pages/vendorChat/VendorChat";
import VehicleManagement from "./pages/vehicleManagement/VehicleManagement";
import RepairSchedule from "./pages/vehicleManagement/RepairSchedule";
import DriverManagement from "./pages/driverManagement/DriverManagement";
import SchoolManagement from "./pages/schoolManagement/SchoolManagement";
import Students from "./pages/studentManagement/Students";
import RouteManagement from "./pages/routeManagement/RouteManagement";
import RealTimeTracking from "./pages/realTimeTracking/RealTimeTracking";
import RouteSchedule from "./pages/routeSchedule/RouteSchedule";
import BillingInvoice from "./pages/Billing&Invoice/BillingInvoice";
import GLCodes from "./pages/glCodes/GLCodes";
import Feedback from "./pages/feedback/Feedback";
import VehicleInfoComponent from "./pages/vehicleManagement/VehicleInfoComponent";
import EditScheduledMaintenance from "./pages/vehicleManagement/EditScheduledMaintenance";
import ReportedDefects from "./pages/vehicleManagement/ReportedDefects";
import Notes from "./pages/vehicleManagement/Notes";
import SehcudleManagement from "./components/SehcudleManagement";
import EmployeeManagement from "./pages/employeeManagement/EmployeeManagement";
import Accounting from "./pages/accounting/Accounting";
import AccessManagement from "./pages/accessManagement/AccessManagement";
import Documents from "./pages/auth/document/Documents";

import ProtectedRoute from "./protectedRoutes";

function App() {
  const [loading, setLoading] = useState(true);
  const location = useLocation();

  useEffect(() => {
    const t = setTimeout(() => setLoading(false), 200);
    return () => clearTimeout(t);
  }, []);

  const currentTitle = routeTitles[location.pathname] || routeTitles["*"];
  useTitle(currentTitle);

  if (loading) return <Loader />;

  return (
    <Routes>
      {/* ---------- PUBLIC ---------- */}
      <Route path="/LoginAsVendor" element={<LoginAsVendor />} />
      <Route path="/account/*" element={<Auth />} />
      <Route path="/account/logout" element={<Logout />} />
      <Route path="/" element={<Navigate to="/LoginAsVendor" replace />} />

      {/* ---------- PRIVATE (GUARDED) ---------- */}
      <Route element={<ProtectedRoute />}>
        <Route path="/dashboard/*" element={<Dashboard />} />
        <Route path="/EmployeeDashboard/*" element={<EmployeeManagementRoutes />} />

        <Route path="/dashboard" element={<SchoolDashboard />} />
        <Route path="/dashboard_subscription" element={<DashboardSubscription />} />
        <Route path="/subscription_page" element={<SubscriptionPage />} />
        <Route path="/payment_success" element={<PaymentSuccess />} />
        <Route path="/notification" element={<Notification />} />
        <Route path="/vendorChat" element={<VendorChat />} />
        <Route path="/vehicleManagement" element={<VehicleManagement />} />
        <Route path="/DriverManagement" element={<DriverManagement />} />
        <Route path="/EmployeeManagement" element={<EmployeeManagement />} />
        <Route path="/SchoolManagement" element={<SchoolManagement />} />
        <Route path="/StudentManagement" element={<Students />} />
        <Route path="/RouteManagement" element={<RouteManagement />} />
        <Route path="/RealTimeTracking" element={<RealTimeTracking />} />
        <Route path="/RouteSchedule" element={<RouteSchedule />} />
        <Route path="/BillingInvoice" element={<BillingInvoice />} />
        <Route path="/GlCodes" element={<GLCodes />} />
        <Route path="/accounting" element={<Accounting />} />
        <Route path="/accessManagement" element={<AccessManagement />} />
        <Route path="/documents" element={<Documents />} />
        <Route path="/feedback" element={<Feedback />} />
        <Route path="/repair-schedule" element={<RepairSchedule />} />
        <Route path="/vehicle-info" element={<VehicleInfoComponent />} />
        <Route path="/edit-scheduled-maintenance" element={<EditScheduledMaintenance />} />
        <Route path="/reported-defects" element={<ReportedDefects />} />
        <Route path="/notes" element={<Notes />} />
        <Route path="/schedule-management" element={<SehcudleManagement />} />
      </Route>

      {/* ---------- 404 ---------- */}
      <Route path="*" element={<Navigate to="/LoginAsVendor" replace />} />
    </Routes>
  );
}

export default App;
