import React from "react";
import { useSelector } from "react-redux";
import MainLayout from "@/layouts/SchoolLayout";
import { Sidenav, DashboardNavbar } from "@/widgets/layout";
import { VendorProfile } from "./vendor-profile";
import { Profile as SchoolProfile } from "./profile";

const ProfileEntry = () => {
  const loggedInUser = useSelector((state) => state.user?.user);
  const normalizedRole = String(loggedInUser?.role || "").trim().toUpperCase();
  const isSchoolUser = normalizedRole === "INSTITUTE" || normalizedRole === "SCHOOL";

  if (isSchoolUser) {
    return (
      <div className="min-h-screen bg-[#F7F6F2]">
        <Sidenav />
        <div className="md:p-4 p-2 xl:ml-64">
          <DashboardNavbar />
          <SchoolProfile />
        </div>
      </div>
    );
  }

  return (
    <MainLayout>
      <VendorProfile />
    </MainLayout>
  );
};

export default ProfileEntry;
