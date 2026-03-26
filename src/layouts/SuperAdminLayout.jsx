import React from "react";
import { NavLink, Outlet, useLocation, useNavigate } from "react-router-dom";
import {
  ChartBarIcon,
  ArrowRightOnRectangleIcon,
  BuildingOffice2Icon,
  ShieldCheckIcon,
  UserPlusIcon,
} from "@heroicons/react/24/outline";

const navItems = [
  {
    label: "Dashboard",
    path: "/super-admin/dashboard",
    icon: ChartBarIcon,
  },
  {
    label: "Vendor Management",
    path: "/super-admin/vendors",
    icon: BuildingOffice2Icon,
  },
  {
    label: "Sub Admin Management",
    path: "/super-admin/sub-admins",
    icon: UserPlusIcon,
  },
];

export default function SuperAdminLayout() {
  const navigate = useNavigate();
  const location = useLocation();
  const session = JSON.parse(localStorage.getItem("superAdminSession") || "{}");

  const handleLogout = () => {
    localStorage.removeItem("superAdminSession");
    localStorage.removeItem("superAdminVendorContext");
    navigate("/super-admin/sign-in");
  };

  return (
    <div className="min-h-screen bg-[#f7f5ef]">
      <div className="fixed inset-y-0 left-0 z-30 w-72 border-r border-[#ebe6da] bg-white px-8 py-10">
        <div className="mb-10 flex items-center gap-4">
          <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-[#c01824] text-white">
            <ShieldCheckIcon className="h-8 w-8" />
          </div>
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.25em] text-[#8e8a80]">
              Route IQ
            </p>
            <h1 className="text-2xl font-bold text-[#171a2a]">Super Admin</h1>
          </div>
        </div>

        <nav className="space-y-3">
          {navItems.map(({ label, path, icon: Icon }) => (
            <NavLink
              key={path}
              to={path}
              className={({ isActive }) =>
                `flex items-center gap-3 rounded-2xl px-4 py-3 text-base font-semibold transition ${
                  isActive
                    ? "bg-[#c01824] text-white shadow-md"
                    : "text-[#202336] hover:bg-[#f7f5ef]"
                }`
              }
            >
              <Icon className="h-5 w-5" />
              <span>{label}</span>
            </NavLink>
          ))}
        </nav>

        <button
          type="button"
          onClick={handleLogout}
          className="absolute bottom-10 left-8 flex w-[calc(100%-4rem)] items-center justify-center gap-3 rounded-2xl border border-[#e6dfd2] px-4 py-3 font-semibold text-[#202336] transition hover:bg-[#f7f5ef]"
        >
          <ArrowRightOnRectangleIcon className="h-5 w-5" />
          Logout
        </button>
      </div>

      <div className="ml-72 min-h-screen p-6">
        <div className="mb-6 flex items-center justify-between rounded-3xl border border-[#ebe6da] bg-white px-6 py-4 shadow-sm">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.25em] text-[#8e8a80]">
              Platform Control
            </p>
            <h2 className="text-2xl font-bold text-[#171a2a]">
              {location.pathname.includes("/vendors")
                ? "Vendor Management"
                : location.pathname.includes("/sub-admins")
                ? "Sub Admin Management"
                : "Super Admin Dashboard"}
            </h2>
          </div>
          <div className="text-right">
            <p className="text-sm text-[#7c7a73]">Signed in as</p>
            <p className="text-base font-semibold text-[#171a2a]">
              {session?.email || "superadmin@routeiq.com"}
            </p>
          </div>
        </div>

        <Outlet />
      </div>
    </div>
  );
}
