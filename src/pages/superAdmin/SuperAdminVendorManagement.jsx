import React from "react";
import { useNavigate } from "react-router-dom";

const vendors = [
  {
    id: 1,
    name: "Urban Trans",
    contractNumber: "6542334600456",
    contact: "+42325643232",
    status: "Active",
  },
  {
    id: 2,
    name: "Travel Trek",
    contractNumber: "6542334600456",
    contact: "+42325643232",
    status: "Active",
  },
  {
    id: 3,
    name: "Rapid Ride",
    contractNumber: "6542334600456",
    contact: "+42325643232",
    status: "Active",
  },
  {
    id: 4,
    name: "Bus Connect",
    contractNumber: "6542334600456",
    contact: "+42325643232",
    status: "Active",
  },
  {
    id: 5,
    name: "Swift Shuttles",
    contractNumber: "6542334600456",
    contact: "+42325643232",
    status: "Inactive",
  },
  {
    id: 6,
    name: "City Link",
    contractNumber: "6542334600456",
    contact: "+42325643232",
    status: "Inactive",
  },
];

export default function SuperAdminVendorManagement() {
  const navigate = useNavigate();

  const openVendorWorkspace = (vendor) => {
    localStorage.setItem(
      "superAdminVendorContext",
      JSON.stringify({
        active: true,
        vendorId: vendor.id,
        vendorName: vendor.name,
        enteredAt: new Date().toISOString(),
      })
    );

    navigate("/dashboard");
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-4xl font-bold text-[#171a2a]">Vendor Management</h3>
          <p className="mt-2 text-base text-[#6f7280]">
            Open any vendor workspace from a single platform-level control panel.
          </p>
        </div>
        <button
          type="button"
          className="rounded-2xl bg-[#c01824] px-6 py-4 text-lg font-semibold text-white transition hover:bg-[#a61520]"
        >
          Add New Vendor
        </button>
      </div>

      <div className="overflow-hidden rounded-[28px] border border-[#ebe6da] bg-white shadow-sm">
        <table className="min-w-full">
          <thead className="bg-[#f3f1eb]">
            <tr className="text-left text-lg font-semibold text-[#171a2a]">
              <th className="px-8 py-6">Vendor</th>
              <th className="px-8 py-6">Contract Number</th>
              <th className="px-8 py-6">Contact Info</th>
              <th className="px-8 py-6">Service Agreement</th>
              <th className="px-8 py-6">Status</th>
              <th className="px-8 py-6">Action</th>
            </tr>
          </thead>
          <tbody>
            {vendors.map((vendor) => (
              <tr
                key={vendor.id}
                className="border-t border-[#eee9df] text-lg text-[#171a2a]"
              >
                <td className="px-8 py-6 font-semibold">{vendor.name}</td>
                <td className="px-8 py-6">{vendor.contractNumber}</td>
                <td className="px-8 py-6">{vendor.contact}</td>
                <td className="px-8 py-6">
                  <button
                    type="button"
                    className="font-semibold text-[#171a2a] underline-offset-4 hover:underline"
                  >
                    View Agreement
                  </button>
                </td>
                <td
                  className={`px-8 py-6 font-semibold ${
                    vendor.status === "Active" ? "text-[#2ca44f]" : "text-[#c01824]"
                  }`}
                >
                  {vendor.status}
                </td>
                <td className="px-8 py-6">
                  <button
                    type="button"
                    onClick={() => openVendorWorkspace(vendor)}
                    className="rounded-xl border border-[#c01824] px-4 py-2 font-semibold text-[#c01824] transition hover:bg-[#fff2f3]"
                  >
                    Open Workspace
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
