import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

const initialVendors = [
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
  const [vendors, setVendors] = useState(initialVendors);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({
    name: "",
    contractNumber: "",
    contact: "",
    status: "Active",
  });

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

  const handleCreateVendor = (event) => {
    event.preventDefault();

    if (!form.name.trim() || !form.contractNumber.trim() || !form.contact.trim()) {
      return;
    }

    setVendors((prev) => [
      {
        id: Date.now(),
        name: form.name.trim(),
        contractNumber: form.contractNumber.trim(),
        contact: form.contact.trim(),
        status: form.status,
      },
      ...prev,
    ]);

    setForm({
      name: "",
      contractNumber: "",
      contact: "",
      status: "Active",
    });
    setShowForm(false);
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
          onClick={() => setShowForm((prev) => !prev)}
          className="rounded-2xl bg-[#c01824] px-6 py-4 text-lg font-semibold text-white transition hover:bg-[#a61520]"
        >
          {showForm ? "Close Form" : "Add New Vendor"}
        </button>
      </div>

      {showForm ? (
        <form
          onSubmit={handleCreateVendor}
          className="rounded-[28px] border border-[#ebe6da] bg-white p-8 shadow-sm"
        >
          <div className="grid grid-cols-1 gap-5 xl:grid-cols-2">
            <div>
              <label className="mb-2 block text-sm font-semibold text-[#171a2a]">
                Vendor Name
              </label>
              <input
                type="text"
                value={form.name}
                onChange={(event) =>
                  setForm((prev) => ({ ...prev, name: event.target.value }))
                }
                className="w-full rounded-2xl border border-[#ddd5c7] px-4 py-3 outline-none transition focus:border-[#c01824]"
                placeholder="Enter vendor name"
              />
            </div>

            <div>
              <label className="mb-2 block text-sm font-semibold text-[#171a2a]">
                Contract Number
              </label>
              <input
                type="text"
                value={form.contractNumber}
                onChange={(event) =>
                  setForm((prev) => ({ ...prev, contractNumber: event.target.value }))
                }
                className="w-full rounded-2xl border border-[#ddd5c7] px-4 py-3 outline-none transition focus:border-[#c01824]"
                placeholder="Enter contract number"
              />
            </div>

            <div>
              <label className="mb-2 block text-sm font-semibold text-[#171a2a]">
                Contact Info
              </label>
              <input
                type="text"
                value={form.contact}
                onChange={(event) =>
                  setForm((prev) => ({ ...prev, contact: event.target.value }))
                }
                className="w-full rounded-2xl border border-[#ddd5c7] px-4 py-3 outline-none transition focus:border-[#c01824]"
                placeholder="Enter contact info"
              />
            </div>

            <div>
              <label className="mb-2 block text-sm font-semibold text-[#171a2a]">
                Status
              </label>
              <select
                value={form.status}
                onChange={(event) =>
                  setForm((prev) => ({ ...prev, status: event.target.value }))
                }
                className="w-full rounded-2xl border border-[#ddd5c7] px-4 py-3 outline-none transition focus:border-[#c01824]"
              >
                <option value="Active">Active</option>
                <option value="Inactive">Inactive</option>
              </select>
            </div>
          </div>

          <div className="mt-6 flex justify-end">
            <button
              type="submit"
              className="rounded-2xl bg-[#c01824] px-6 py-3 font-semibold text-white transition hover:bg-[#a61520]"
            >
              Save Vendor
            </button>
          </div>
        </form>
      ) : null}

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
