import React, { useEffect, useMemo, useState } from "react";
import { toast } from "react-hot-toast";
import { superAdminService } from "@/services/superAdminService";

const responsibilityOptions = [
  "Accounting",
  "Invoices",
  "Financial Reports",
  "Vendors",
  "Schools",
  "Routes",
  "Vehicles",
  "Drivers",
  "Feedback",
  "Complaints",
  "Support Chats",
  "Development",
  "Access Control",
];

const roleOptions = [
  "Accounts Admin",
  "Operations Admin",
  "Support Admin",
  "Development Admin",
];

export default function SuperAdminSubAdmins() {
  const [subAdmins, setSubAdmins] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [showForm, setShowForm] = useState(false);
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState({
    name: "",
    email: "",
    role: roleOptions[0],
    responsibilities: ["Accounting"],
  });

  const loadSubAdmins = async () => {
    try {
      setLoading(true);
      const rows = await superAdminService.getSubAdmins();
      setSubAdmins(rows);
    } catch (error) {
      toast.error(error?.response?.data?.message || "Failed to load sub admins");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadSubAdmins();
  }, []);

  const filteredSubAdmins = useMemo(() => {
    const query = search.trim().toLowerCase();
    if (!query) return subAdmins;

    return subAdmins.filter((item) => {
      return (
        item.name.toLowerCase().includes(query) ||
        item.email.toLowerCase().includes(query) ||
        item.role.toLowerCase().includes(query)
      );
    });
  }, [search, subAdmins]);

  const toggleResponsibility = (value) => {
    setForm((prev) => {
      const exists = prev.responsibilities.includes(value);
      return {
        ...prev,
        responsibilities: exists
          ? prev.responsibilities.filter((item) => item !== value)
          : [...prev.responsibilities, value],
      };
    });
  };

  const handleCreate = async (event) => {
    event.preventDefault();
    if (!form.name.trim() || !form.email.trim()) {
      toast.error("Name and email are required");
      return;
    }

    try {
      setSaving(true);
      await superAdminService.createSubAdmin({
        name: form.name.trim(),
        email: form.email.trim(),
        role: form.role,
        responsibilities: form.responsibilities,
      });
      toast.success("Sub admin created successfully");
      setForm({
        name: "",
        email: "",
        role: roleOptions[0],
        responsibilities: ["Accounting"],
      });
      setShowForm(false);
      await loadSubAdmins();
    } catch (error) {
      toast.error(error?.response?.data?.message || "Failed to create sub admin");
    } finally {
      setSaving(false);
    }
  };

  const toggleStatus = async (item) => {
    const nextIsActive = String(item.status).toLowerCase() !== "active";

    try {
      await superAdminService.updateSubAdminStatus(item.id, nextIsActive);
      toast.success(`Sub admin ${nextIsActive ? "activated" : "deactivated"}`);
      await loadSubAdmins();
    } catch (error) {
      toast.error(error?.response?.data?.message || "Failed to update sub admin status");
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between gap-4">
        <div>
          <h3 className="text-4xl font-bold text-[#171a2a]">Sub Admin Management</h3>
          <p className="mt-2 text-base text-[#6f7280]">
            Assign department-level control without giving full super-admin access.
          </p>
        </div>
        <button
          type="button"
          onClick={() => setShowForm((prev) => !prev)}
          className="rounded-2xl bg-[#c01824] px-6 py-4 text-lg font-semibold text-white transition hover:bg-[#a61520]"
        >
          {showForm ? "Close Form" : "Add Sub Admin"}
        </button>
      </div>

      {showForm ? (
        <form
          onSubmit={handleCreate}
          className="rounded-[28px] border border-[#ebe6da] bg-white p-8 shadow-sm"
        >
          <div className="grid grid-cols-1 gap-5 xl:grid-cols-2">
            <div>
              <label className="mb-2 block text-sm font-semibold text-[#171a2a]">
                Full Name
              </label>
              <input
                type="text"
                value={form.name}
                onChange={(event) =>
                  setForm((prev) => ({ ...prev, name: event.target.value }))
                }
                className="w-full rounded-2xl border border-[#ddd5c7] px-4 py-3 outline-none transition focus:border-[#c01824]"
                placeholder="Enter sub admin name"
              />
            </div>

            <div>
              <label className="mb-2 block text-sm font-semibold text-[#171a2a]">
                Email
              </label>
              <input
                type="email"
                value={form.email}
                onChange={(event) =>
                  setForm((prev) => ({ ...prev, email: event.target.value }))
                }
                className="w-full rounded-2xl border border-[#ddd5c7] px-4 py-3 outline-none transition focus:border-[#c01824]"
                placeholder="Enter email"
              />
            </div>

            <div>
              <label className="mb-2 block text-sm font-semibold text-[#171a2a]">
                Role
              </label>
              <select
                value={form.role}
                onChange={(event) =>
                  setForm((prev) => ({ ...prev, role: event.target.value }))
                }
                className="w-full rounded-2xl border border-[#ddd5c7] px-4 py-3 outline-none transition focus:border-[#c01824]"
              >
                {roleOptions.map((role) => (
                  <option key={role} value={role}>
                    {role}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="mt-6">
            <p className="mb-3 text-sm font-semibold text-[#171a2a]">
              Responsibilities
            </p>
            <div className="grid grid-cols-2 gap-3 xl:grid-cols-4">
              {responsibilityOptions.map((item) => (
                <label
                  key={item}
                  className="flex items-center gap-3 rounded-2xl border border-[#eee9df] px-4 py-3"
                >
                  <input
                    type="checkbox"
                    checked={form.responsibilities.includes(item)}
                    onChange={() => toggleResponsibility(item)}
                    className="h-4 w-4 accent-[#c01824]"
                  />
                  <span className="text-sm font-medium text-[#171a2a]">{item}</span>
                </label>
              ))}
            </div>
          </div>

          <div className="mt-6 flex justify-end">
            <button
              type="submit"
              disabled={saving}
              className="rounded-2xl bg-[#c01824] px-6 py-3 font-semibold text-white transition hover:bg-[#a61520] disabled:cursor-not-allowed disabled:opacity-70"
            >
              {saving ? "Creating..." : "Create Sub Admin"}
            </button>
          </div>
        </form>
      ) : null}

      <div className="rounded-[28px] border border-[#ebe6da] bg-white p-6 shadow-sm">
        <div className="mb-4 flex items-center justify-between gap-4">
          <div>
            <h4 className="text-2xl font-bold text-[#171a2a]">Assigned Team</h4>
            <p className="text-sm text-[#6f7280]">
              Manage delegated admins and their responsibilities.
            </p>
          </div>
          <input
            type="search"
            value={search}
            onChange={(event) => setSearch(event.target.value)}
            placeholder="Search sub admins"
            className="w-full max-w-sm rounded-2xl border border-[#ddd5c7] px-4 py-3 outline-none transition focus:border-[#c01824]"
          />
        </div>

        <div className="overflow-hidden rounded-[24px] border border-[#eee9df]">
          <table className="min-w-full">
            <thead className="bg-[#f3f1eb]">
              <tr className="text-left text-base font-semibold text-[#171a2a]">
                <th className="px-6 py-4">Name</th>
                <th className="px-6 py-4">Email</th>
                <th className="px-6 py-4">Role</th>
                <th className="px-6 py-4">Responsibilities</th>
                <th className="px-6 py-4">Status</th>
                <th className="px-6 py-4">Action</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan={6} className="px-6 py-8 text-center text-[#6f7280]">
                    Loading sub admins...
                  </td>
                </tr>
              ) : filteredSubAdmins.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-6 py-8 text-center text-[#6f7280]">
                    No sub admins found.
                  </td>
                </tr>
              ) : (
                filteredSubAdmins.map((item) => (
                  <tr key={item.id} className="border-t border-[#eee9df] align-top">
                    <td className="px-6 py-4 font-semibold text-[#171a2a]">{item.name}</td>
                    <td className="px-6 py-4 text-[#171a2a]">{item.email}</td>
                    <td className="px-6 py-4 text-[#171a2a]">{item.role}</td>
                    <td className="px-6 py-4">
                      <div className="flex max-w-md flex-wrap gap-2">
                        {item.responsibilities.length ? (
                          item.responsibilities.map((responsibility) => (
                            <span
                              key={responsibility}
                              className="rounded-full bg-[#fff2f3] px-3 py-1 text-xs font-semibold text-[#c01824]"
                            >
                              {responsibility}
                            </span>
                          ))
                        ) : (
                          <span className="text-sm text-[#6f7280]">No responsibilities</span>
                        )}
                      </div>
                    </td>
                    <td
                      className={`px-6 py-4 font-semibold ${
                        String(item.status).toLowerCase() === "active"
                          ? "text-[#2ca44f]"
                          : "text-[#c01824]"
                      }`}
                    >
                      {item.status}
                    </td>
                    <td className="px-6 py-4">
                      <button
                        type="button"
                        onClick={() => toggleStatus(item)}
                        className="rounded-xl border border-[#c01824] px-4 py-2 text-sm font-semibold text-[#c01824] transition hover:bg-[#fff2f3]"
                      >
                        {String(item.status).toLowerCase() === "active"
                          ? "Deactivate"
                          : "Activate"}
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
