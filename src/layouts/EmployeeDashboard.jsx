import { Navigate, Outlet, Route, Routes } from "react-router-dom";
import { jwtDecode } from "jwt-decode";
import Login from "@/pages/EmployeeDashboard/auth/Login";
import ProfileInformation from "@/pages/EmployeeDashboard/auth/ProfileInformation";
import Designation from "@/pages/EmployeeDashboard/auth/Designation";
import Home from "@/pages/EmployeeDashboard/dashboard/Home";
import EmployeePayroll from "@/pages/EmployeeDashboard/payroll/EmployeePayroll";
import TimeOffRequest from "@/pages/EmployeeDashboard/timeOffRequest/TimeOffRequest";
import Information from "@/pages/EmployeeDashboard/information/Information";
import Document from "@/pages/EmployeeDashboard/document/Document";
import Schedule from "@/pages/EmployeeDashboard/schedule/Schedule";

const EmployeeProtectedRoute = () => {
    const token = localStorage.getItem('token');
    const employeeUser = localStorage.getItem('employeeUser');

    // Token ya user missing
    if (!token || !employeeUser) {
        return <Navigate to="/EmployeeDashboard" replace />;
    }

    // Token validate karo — expiry + signature
    try {
        const decoded = jwtDecode(token);
        const now = Date.now() / 1000;

        // Expired token
        if (decoded.exp && decoded.exp < now) {
            localStorage.removeItem('token');
            localStorage.removeItem('employeeUser');
            return <Navigate to="/EmployeeDashboard" replace />;
        }

        // Role check — sirf DRIVER role allow karo (employee portal)
        const role = decoded.role?.toUpperCase();
        if (role && role !== 'DRIVER') {
            return <Navigate to="/EmployeeDashboard" replace />;
        }
    } catch {
        // Malformed / fake token
        localStorage.removeItem('token');
        localStorage.removeItem('employeeUser');
        return <Navigate to="/EmployeeDashboard" replace />;
    }

    return <Outlet />;
};

const EmployeeManagementRoutes = () => {
    return (
        <Routes>
            <Route path="/" element={<Login />} />
            <Route element={<EmployeeProtectedRoute />}>
                <Route path="/profileInformation" element={<ProfileInformation />} />
                <Route path="/designation" element={<Designation />} />
                <Route path="/home" element={<Home />} />
                <Route path="/employeePayroll" element={<EmployeePayroll />} />
                <Route path="/timeOffRequest" element={<TimeOffRequest />} />
                <Route path="/schedule" element={<Schedule />} />
                <Route path="/information" element={<Information />} />
                <Route path="/document" element={<Document />} />
            </Route>
        </Routes>
    );
};

export default EmployeeManagementRoutes;
