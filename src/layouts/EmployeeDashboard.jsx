import { Route, Routes } from "react-router-dom";
import Login from "@/pages/EmployeeDashboard/auth/Login";
import ProfileInformation from "@/pages/EmployeeDashboard/auth/ProfileInformation";
import Designation from "@/pages/EmployeeDashboard/auth/Designation";
import Home from "@/pages/EmployeeDashboard/dashboard/Home";
import EmployeePayroll from "@/pages/EmployeeDashboard/payroll/EmployeePayroll";
import TimeOffRequest from "@/pages/EmployeeDashboard/timeOffRequest/TimeOffRequest";
import Information from "@/pages/EmployeeDashboard/information/Information";
import Document from "@/pages/EmployeeDashboard/document/Document";
import Schedule from "@/pages/EmployeeDashboard/schedule/Schedule";

const EmployeeManagementRoutes = () => {
    return (
        <Routes>
            <Route path="/" element={<Login />} />
            <Route path="/profileInformation" element={<ProfileInformation />} />
            <Route path="/designation" element={<Designation />} />
            <Route path="/home" element={<Home />} />
            <Route path="/employeePayroll" element={<EmployeePayroll />} />
            <Route path="/timeOffRequest" element={<TimeOffRequest />} />
            <Route path="/schedule" element={<Schedule />} />
            <Route path="/information" element={<Information />} />
            <Route path="/document" element={<Document />} />
        </Routes>
    );
};

export default EmployeeManagementRoutes;
