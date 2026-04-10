import React, { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-hot-toast";
import { jwtDecode } from "jwt-decode";
import { useDispatch } from "react-redux";
import Cookies from "js-cookie";
import {
  getAuthToken,
  getRefreshToken,
  setAuthTokens,
} from "@/configs";
import { superAdminService } from "@/services/superAdminService";
import { setUser } from "@/redux/slices/userSlice";

const emptyContractForm = {
  vendorId: null,
  vendorName: "",
  contractNumber: "",
  serviceAgreementUrl: "",
};

const FULL_VENDOR_MODULE_ACCESS = {
  VEHICLE: { canRead: true, canWrite: true },
  VEHICLES: { canRead: true, canWrite: true },
  EMPLOYEE: { canRead: true, canWrite: true },
  DRIVER: { canRead: true, canWrite: true },
  DRIVERS: { canRead: true, canWrite: true },
  SCHOOL: { canRead: true, canWrite: true },
  STUDENT: { canRead: true, canWrite: true },
  STUDENTS: { canRead: true, canWrite: true },
  ROUTE: { canRead: true, canWrite: true },
  ROUTES: { canRead: true, canWrite: true },
  TRACKING: { canRead: true, canWrite: true },
  CHAT: { canRead: true, canWrite: true },
  CHATS: { canRead: true, canWrite: true },
  INVOICES: { canRead: true, canWrite: true },
  RFQ: { canRead: true, canWrite: true },
  ACCESS: { canRead: true, canWrite: true },
  DOCUMENTS: { canRead: true, canWrite: true },
  FEEDBACK: { canRead: true, canWrite: true },
};

const RESPONSIBILITY_TO_MODULES = {
  Accounting: ["INVOICES", "RFQ"],
  Invoices: ["INVOICES"],
  "Financial Reports": ["INVOICES", "RFQ"],
  Vendors: ["ACCESS"],
  Schools: ["SCHOOL", "STUDENTS"],
  Routes: ["ROUTE", "ROUTES"],
  Vehicles: ["VEHICLE", "VEHICLES"],
  Drivers: ["DRIVER", "DRIVERS", "EMPLOYEE"],
  Feedback: ["FEEDBACK"],
  Complaints: ["FEEDBACK"],
  "Support Chats": ["CHAT", "CHATS"],
  Development: [],
  "Access Control": ["ACCESS"],
};

export default function SuperAdminVendorManagement() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const session = JSON.parse(localStorage.getItem("superAdminSession") || "{}");
  const currentRole = String(session?.role || "").toUpperCase();
  const [vendors, setVendors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [savingContract, setSavingContract] = useState(false);
  const [creatingVendor, setCreatingVendor] = useState(false);
  const [contractForm, setContractForm] = useState(emptyContractForm);
  const [createForm, setCreateForm] = useState({
    name: "",
    contractNumber: "",
    contact: "",
    serviceAgreementUrl: "",
    status: "Active",
  });

  const loadVendors = async () => {
    try {
      setLoading(true);
      const rows =
        currentRole === "SUB_ADMIN"
          ? await superAdminService.getVendorsAsSubAdmin()
          : await superAdminService.getVendors();
      setVendors(rows);
    } catch (error) {
      toast.error(error?.response?.data?.message || "Failed to load vendors");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadVendors();
  }, []);

  const filteredVendors = useMemo(() => {
    const query = search.trim().toLowerCase();
    if (!query) return vendors;

    return vendors.filter((vendor) =>
      [vendor.name, vendor.contact, vendor.contractNumber, vendor.email, vendor.status]
        .filter(Boolean)
        .some((value) => String(value).toLowerCase().includes(query))
    );
  }, [search, vendors]);

  const openVendorWorkspace = async (vendor) => {
    try {
      if (vendor?.id === null || vendor?.id === undefined || vendor?.id === "") {
        toast.error("Vendor ID not found");
        return;
      }

      const currentToken = getAuthToken();
      const currentRefreshToken = getRefreshToken();

      if (currentToken) {
        localStorage.setItem(
          "superAdminOriginalAuth",
          JSON.stringify({
            token: currentToken,
            refreshToken: currentRefreshToken,
            savedAt: new Date().toISOString(),
          })
        );
      }

      const vendorSession =
        currentRole === "SUB_ADMIN"
          ? await superAdminService.impersonateVendorAsSubAdmin(vendor.id)
          : await superAdminService.impersonateVendor(vendor.id);
      if (!vendorSession?.accessToken) {
        toast.error("Vendor impersonation token not received");
        return;
      }

      if (currentRole === "SUB_ADMIN") {
      }

      const resolvedVendorName =
        vendorSession.vendorName || vendor.name || vendor.companyName || vendor.email || "Vendor";

      const decoded = jwtDecode(vendorSession.accessToken);
      const modulesMap = Array.isArray(decoded?.modules)
        ? decoded.modules.reduce((acc, mod) => {
            acc[mod.module] = { canRead: mod.canRead, canWrite: mod.canWrite };
            return acc;
          }, {})
        : {};

      const tokenModulesMap = Object.keys(modulesMap).length ? modulesMap : null;
      const restrictedModulesFromLabels = Array.isArray(vendorSession.allowedModules)
        ? vendorSession.allowedModules.reduce((acc, label) => {
            const resolvedModules = RESPONSIBILITY_TO_MODULES[label] || [];
            resolvedModules.forEach((moduleName) => {
              acc[moduleName] = { canRead: true, canWrite: true };
            });
            return acc;
          }, {})
        : null;

      const allowedModules = Array.isArray(vendorSession.allowedModules)
        ? tokenModulesMap || restrictedModulesFromLabels || {}
        : vendorSession.allowedModules === null
        ? FULL_VENDOR_MODULE_ACCESS
        : tokenModulesMap
        ? tokenModulesMap
        : FULL_VENDOR_MODULE_ACCESS;

      const vendorUser = {
        name:
          decoded?.name ||
          decoded?.fullName ||
          decoded?.firstName ||
          decoded?.username ||
          decoded?.email ||
          resolvedVendorName,
        username:
          decoded?.username ||
          decoded?.name ||
          decoded?.fullName ||
          decoded?.email ||
          resolvedVendorName,
        email: decoded?.email || vendor.email || resolvedVendorName,
        role: decoded?.role || "VENDOR",
        modules: allowedModules,
        control: "READ_WRITE",
        allowedModules: vendorSession.allowedModules ?? null,
        impersonatedBy: decoded?.impersonatedBy ?? null,
        impersonatorRole:
          decoded?.impersonatorRole ?? vendorSession.impersonatorRole ?? currentRole,
      };

      setAuthTokens(vendorSession.accessToken, vendorSession.refreshToken ?? null);
      Cookies.set("token", vendorSession.accessToken, { expires: 7, secure: true });
      localStorage.setItem("vendor", JSON.stringify(vendorUser));
      dispatch(setUser({ user: vendorUser, token: vendorSession.accessToken }));
      localStorage.setItem(
        "superAdminVendorContext",
        JSON.stringify({
          active: true,
          vendorId: vendor.id,
          vendorName: resolvedVendorName,
          enteredAt: new Date().toISOString(),
          allowedModules: vendorSession.allowedModules ?? null,
          impersonatorRole: vendorSession.impersonatorRole ?? currentRole,
        })
      );

      toast.success(`Opened ${resolvedVendorName} workspace`);
      navigate("/dashboard");
    } catch (error) {
      toast.error(error?.response?.data?.message || "Failed to open vendor workspace");
    }
  };

  const handleSaveContract = async (event) => {
    event.preventDefault();

    if (!contractForm.vendorId) return;

    try {
      setSavingContract(true);
      await superAdminService.updateVendorContract(contractForm.vendorId, {
        contractNumber: contractForm.contractNumber.trim(),
        serviceAgreementUrl: contractForm.serviceAgreementUrl.trim(),
      });
      toast.success("Vendor contract updated");
      setContractForm(emptyContractForm);
      await loadVendors();
    } catch (error) {
      toast.error(error?.response?.data?.message || "Failed to update contract");
    } finally {
      setSavingContract(false);
    }
  };

  const handleCreateVendor = async (event) => {
    event.preventDefault();

    if (!createForm.name.trim() || !createForm.contact.trim()) {
      toast.error("Vendor name and contact info are required");
      return;
    }

    try {
      setCreatingVendor(true);
      const newVendor = await superAdminService.createVendor({
        name: createForm.name.trim(),
        contact: createForm.contact.trim(),
        contractNumber: createForm.contractNumber.trim() || undefined,
        serviceAgreementUrl: createForm.serviceAgreementUrl.trim() || undefined,
        status: createForm.status,
      });
      setVendors((prev) => [newVendor, ...prev]);
      setCreateForm({
        name: "",
        contractNumber: "",
        contact: "",
        serviceAgreementUrl: "",
        status: "Active",
      });
      setShowCreateForm(false);
      toast.success("Vendor created successfully");
    } catch (error) {
      toast.error(error?.response?.data?.message || "Failed to create vendor");
    } finally {
      setCreatingVendor(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 xl:flex-row xl:items-center xl:justify-between">
        <div>
          <h3 className="text-4xl font-bold text-[#171a2a]">Vendor Management</h3>
          <p className="mt-2 text-base text-[#6f7280]">
            {currentRole === "SUB_ADMIN"
              ? "Open vendor workspaces based on your assigned responsibilities."
              : "Monitor vendors, update contract details, and open vendor workspaces directly."}
          </p>
        </div>
        <div className="flex flex-col gap-3 sm:flex-row">
          <input
            type="search"
            value={search}
            onChange={(event) => setSearch(event.target.value)}
            placeholder="Search vendors"
            className="w-full rounded-2xl border border-[#ddd5c7] px-4 py-3 outline-none transition focus:border-[#c01824] sm:min-w-[280px]"
          />
          {currentRole !== "SUB_ADMIN" ? (
            <button
              type="button"
              onClick={() => setShowCreateForm((prev) => !prev)}
              className="rounded-2xl bg-[#c01824] px-6 py-4 text-lg font-semibold text-white transition hover:bg-[#a61520]"
            >
              {showCreateForm ? "Close Form" : "Add New Vendor"}
            </button>
          ) : null}
        </div>
      </div>

      {showCreateForm && currentRole !== "SUB_ADMIN" ? (
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
                value={createForm.name}
                onChange={(event) =>
                  setCreateForm((prev) => ({ ...prev, name: event.target.value }))
                }
                className="w-full rounded-2xl border border-[#ddd5c7] px-4 py-3 outline-none transition focus:border-[#c01824]"
                placeholder="Enter vendor name"
              />
            </div>

            <div>
              <label className="mb-2 block text-sm font-semibold text-[#171a2a]">
                Contact Info
              </label>
              <input
                type="text"
                value={createForm.contact}
                onChange={(event) =>
                  setCreateForm((prev) => ({ ...prev, contact: event.target.value }))
                }
                className="w-full rounded-2xl border border-[#ddd5c7] px-4 py-3 outline-none transition focus:border-[#c01824]"
                placeholder="Enter contact info"
              />
            </div>

            <div>
              <label className="mb-2 block text-sm font-semibold text-[#171a2a]">
                Contract Number
              </label>
              <input
                type="text"
                value={createForm.contractNumber}
                onChange={(event) =>
                  setCreateForm((prev) => ({ ...prev, contractNumber: event.target.value }))
                }
                className="w-full rounded-2xl border border-[#ddd5c7] px-4 py-3 outline-none transition focus:border-[#c01824]"
                placeholder="Enter contract number"
              />
            </div>

            <div>
              <label className="mb-2 block text-sm font-semibold text-[#171a2a]">
                Service Agreement URL
              </label>
              <input
                type="url"
                value={createForm.serviceAgreementUrl}
                onChange={(event) =>
                  setCreateForm((prev) => ({
                    ...prev,
                    serviceAgreementUrl: event.target.value,
                  }))
                }
                className="w-full rounded-2xl border border-[#ddd5c7] px-4 py-3 outline-none transition focus:border-[#c01824]"
                placeholder="https://example.com/agreement.pdf"
              />
            </div>

            <div>
              <label className="mb-2 block text-sm font-semibold text-[#171a2a]">
                Status
              </label>
              <select
                value={createForm.status}
                onChange={(event) =>
                  setCreateForm((prev) => ({ ...prev, status: event.target.value }))
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
              disabled={creatingVendor}
              className="rounded-2xl bg-[#c01824] px-6 py-3 font-semibold text-white transition hover:bg-[#a61520] disabled:cursor-not-allowed disabled:opacity-70"
            >
              {creatingVendor ? "Creating..." : "Save Vendor"}
            </button>
          </div>
        </form>
      ) : null}

      {contractForm.vendorId && currentRole !== "SUB_ADMIN" ? (
        <form
          onSubmit={handleSaveContract}
          className="rounded-[28px] border border-[#ebe6da] bg-white p-8 shadow-sm"
        >
          <div className="flex items-start justify-between gap-4">
            <div>
              <h4 className="text-2xl font-bold text-[#171a2a]">Update Vendor Contract</h4>
              <p className="mt-1 text-sm text-[#6f7280]">{contractForm.vendorName}</p>
            </div>
            <button
              type="button"
              onClick={() => setContractForm(emptyContractForm)}
              className="rounded-xl border border-[#ddd5c7] px-4 py-2 text-sm font-semibold text-[#171a2a]"
            >
              Close
            </button>
          </div>

          <div className="mt-6 grid grid-cols-1 gap-5 xl:grid-cols-2">
            <div>
              <label className="mb-2 block text-sm font-semibold text-[#171a2a]">
                Contract Number
              </label>
              <input
                type="text"
                value={contractForm.contractNumber}
                onChange={(event) =>
                  setContractForm((prev) => ({
                    ...prev,
                    contractNumber: event.target.value,
                  }))
                }
                className="w-full rounded-2xl border border-[#ddd5c7] px-4 py-3 outline-none transition focus:border-[#c01824]"
                placeholder="Enter contract number"
              />
            </div>

            <div>
              <label className="mb-2 block text-sm font-semibold text-[#171a2a]">
                Service Agreement URL
              </label>
              <input
                type="url"
                value={contractForm.serviceAgreementUrl}
                onChange={(event) =>
                  setContractForm((prev) => ({
                    ...prev,
                    serviceAgreementUrl: event.target.value,
                  }))
                }
                className="w-full rounded-2xl border border-[#ddd5c7] px-4 py-3 outline-none transition focus:border-[#c01824]"
                placeholder="https://example.com/agreement.pdf"
              />
            </div>
          </div>

          <div className="mt-6 flex justify-end">
            <button
              type="submit"
              disabled={savingContract}
              className="rounded-2xl bg-[#c01824] px-6 py-3 font-semibold text-white transition hover:bg-[#a61520] disabled:cursor-not-allowed disabled:opacity-70"
            >
              {savingContract ? "Saving..." : "Save Contract"}
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
            {loading ? (
              <tr>
                <td colSpan={6} className="px-8 py-10 text-center text-lg text-[#6f7280]">
                  Loading vendors...
                </td>
              </tr>
            ) : filteredVendors.length === 0 ? (
              <tr>
                <td colSpan={6} className="px-8 py-10 text-center text-lg text-[#6f7280]">
                  No vendors found.
                </td>
              </tr>
            ) : (
              filteredVendors.map((vendor) => (
                <tr
                  key={vendor.id}
                  className="border-t border-[#eee9df] text-lg text-[#171a2a]"
                >
                  <td className="px-8 py-6">
                    <p className="font-semibold">{vendor.name}</p>
                    {vendor.email ? (
                      <p className="mt-1 text-sm text-[#6f7280]">{vendor.email}</p>
                    ) : null}
                  </td>
                  <td className="px-8 py-6">{vendor.contractNumber || "--"}</td>
                  <td className="px-8 py-6">{vendor.contact || "--"}</td>
                  <td className="px-8 py-6">
                    {vendor.serviceAgreementUrl ? (
                      <a
                        href={vendor.serviceAgreementUrl}
                        target="_blank"
                        rel="noreferrer"
                        className="font-semibold text-[#171a2a] underline-offset-4 hover:underline"
                      >
                        View Agreement
                      </a>
                    ) : (
                      <span className="text-[#6f7280]">Not added</span>
                    )}
                  </td>
                  <td
                    className={`px-8 py-6 font-semibold ${
                      String(vendor.status).toLowerCase() === "active"
                        ? "text-[#2ca44f]"
                        : "text-[#c01824]"
                    }`}
                  >
                    {vendor.status}
                  </td>
                  <td className="px-8 py-6">
                    <div className="flex flex-wrap gap-3">
                      {currentRole !== "SUB_ADMIN" ? (
                        <button
                          type="button"
                          onClick={() =>
                            setContractForm({
                              vendorId: vendor.id,
                              vendorName: vendor.name,
                              contractNumber: vendor.contractNumber === "--" ? "" : vendor.contractNumber,
                              serviceAgreementUrl: vendor.serviceAgreementUrl || "",
                            })
                          }
                          className="rounded-xl border border-[#ddd5c7] px-4 py-2 font-semibold text-[#171a2a] transition hover:bg-[#f7f5ef]"
                        >
                          Edit Contract
                        </button>
                      ) : null}
                      <button
                        type="button"
                        onClick={() => openVendorWorkspace(vendor)}
                        className="rounded-xl border border-[#c01824] px-4 py-2 font-semibold text-[#c01824] transition hover:bg-[#fff2f3]"
                      >
                        Open Workspace
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
