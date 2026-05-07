import React, { useCallback, useEffect, useMemo, useState } from "react";
import { toast } from "react-hot-toast";
import { superAdminService } from "@/services/superAdminService";
import SuperAdminInvoiceForm from "@/components/SuperAdminInvoiceForm";

const tabs = ["Overview", "Invoices", "Payroll"];
const DEFAULT_INVOICE_FILTERS = {
  type: "",
  status: "",
  instituteId: "",
  search: "",
  limit: 20,
  offset: 0,
};

const formatCurrency = (value) =>
  new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 2,
  }).format(Number(value || 0));

const formatDate = (value) => {
  if (!value) return "--";
  const parsed = new Date(value);
  return Number.isNaN(parsed.getTime()) ? value : parsed.toLocaleDateString("en-US");
};

const getMaxValue = (rows) => Math.max(0, ...(rows || []).map((item) => Number(item?.total || 0)));

const getBarHeight = (value, maxValue) => {
  if (!maxValue) return 14;
  return Math.max(14, Math.round((Number(value || 0) / maxValue) * 180));
};

const StatCard = ({ label, value, hint }) => (
  <div className="rounded-3xl border border-[#ebe6da] bg-white p-5 shadow-sm">
    <p className="text-xs font-semibold uppercase tracking-[0.22em] text-[#8e8a80]">{label}</p>
    <div className="mt-3 text-3xl font-extrabold text-[#171a2a]">{value}</div>
    {hint ? <p className="mt-2 text-sm text-[#7c7a73]">{hint}</p> : null}
  </div>
);

const SectionCard = ({ title, subtitle, children, actions = null }) => (
  <div className="rounded-3xl border border-[#ebe6da] bg-white p-6 shadow-sm">
    <div className="mb-5 flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
      <div>
        <h3 className="text-xl font-bold text-[#171a2a]">{title}</h3>
        {subtitle ? <p className="mt-1 text-sm text-[#7c7a73]">{subtitle}</p> : null}
      </div>
      {actions}
    </div>
    {children}
  </div>
);

const TrendCard = ({ title, subtitle, rows, accent = "bg-[#c01824]" }) => {
  const maxValue = getMaxValue(rows);

  return (
    <SectionCard title={title} subtitle={subtitle}>
      <div className="grid min-h-[260px] grid-cols-1 gap-6 xl:grid-cols-[120px_minmax(0,1fr)]">
        <div className="rounded-2xl bg-[#fbfaf7] p-4">
          <div className="text-xs font-semibold uppercase tracking-[0.18em] text-[#8e8a80]">Peak</div>
          <div className="mt-3 text-2xl font-extrabold text-[#171a2a]">
            {rows?.length ? formatCurrency(maxValue) : "--"}
          </div>
          <div className="mt-2 text-sm text-[#7c7a73]">
            {rows?.find((item) => Number(item.total || 0) === maxValue)?.label || "No activity"}
          </div>
        </div>

        <div className="flex items-end gap-3 overflow-x-auto rounded-2xl bg-[#fbfaf7] p-4">
          {(rows || []).length === 0 ? (
            <div className="text-sm text-[#7c7a73]">No chart data found.</div>
          ) : (
            rows.map((item, index) => (
              <div key={`${item.label}-${index}`} className="flex min-w-[64px] flex-1 flex-col items-center gap-2">
                <div className="text-xs font-semibold text-[#7c7a73]">{formatCurrency(item.total)}</div>
                <div className="flex h-[190px] items-end">
                  <div
                    className={`w-10 rounded-t-2xl ${accent}`}
                    style={{ height: `${getBarHeight(item.total, maxValue)}px`, opacity: Number(item.total || 0) > 0 ? 1 : 0.18 }}
                  />
                </div>
                <div className="text-xs font-semibold uppercase tracking-[0.1em] text-[#5d6372]">
                  {item.label}
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </SectionCard>
  );
};

export default function SuperAdminAccounting() {
  const [activeTab, setActiveTab] = useState("Overview");
  const [vendors, setVendors] = useState([]);
  const [selectedVendorId, setSelectedVendorId] = useState("");
  const [vendorLoading, setVendorLoading] = useState(true);
  const [sectionLoading, setSectionLoading] = useState(false);
  const [globalLoading, setGlobalLoading] = useState(true);

  const [invoices, setInvoices] = useState([]);
  const [invoiceTotal, setInvoiceTotal] = useState(0);
  const [walletSummary, setWalletSummary] = useState(null);
  const [payrollSummary, setPayrollSummary] = useState(null);
  const [kpiSummary, setKpiSummary] = useState(null);
  const [platformSummary, setPlatformSummary] = useState(null);
  const [dashboardStats, setDashboardStats] = useState(null);
  const [isCreateInvoiceOpen, setIsCreateInvoiceOpen] = useState(false);
  const [createInvoiceSubmitting, setCreateInvoiceSubmitting] = useState(false);
  const [invoiceLookupsLoaded, setInvoiceLookupsLoaded] = useState(false);
  const [glCodes, setGlCodes] = useState([]);
  const [schoolTerminals, setSchoolTerminals] = useState([]);
  const [tripTerminals, setTripTerminals] = useState([]);
  const [schoolsByTerminal, setSchoolsByTerminal] = useState({});
  const [invoiceFilterSchools, setInvoiceFilterSchools] = useState([]);
  const [vendorSchools, setVendorSchools] = useState([]);
  const [invoiceSchoolsLoading, setInvoiceSchoolsLoading] = useState(false);
  const [invoiceLookupWarning, setInvoiceLookupWarning] = useState("");
  const [invoiceExporting, setInvoiceExporting] = useState({ id: "", format: "" });

  const [invoiceFilters, setInvoiceFilters] = useState(DEFAULT_INVOICE_FILTERS);
  const [payrollFilters, setPayrollFilters] = useState({
    month: new Date().getMonth() + 1,
    year: new Date().getFullYear(),
    terminalId: "",
  });

  const fetchVendorScopedData = useCallback(
    async (vendorId, nextInvoiceFilters = invoiceFilters, nextPayrollFilters = payrollFilters) => {
      const invoiceParams = {
        vendorId,
        type: nextInvoiceFilters.type || undefined,
        status: nextInvoiceFilters.status || undefined,
        search: nextInvoiceFilters.search.trim() || undefined,
        limit: nextInvoiceFilters.limit,
        offset: nextInvoiceFilters.offset,
      };

      const [invoiceData, walletData, payrollData, kpiData] = await Promise.all([
        superAdminService.getAccountingInvoices(invoiceParams),
        superAdminService.getAccountingWalletSummary(vendorId),
        superAdminService.getAccountingPayrollSummary({
          vendorId,
          month: nextPayrollFilters.month,
          year: nextPayrollFilters.year,
          terminalId: nextPayrollFilters.terminalId || undefined,
        }),
        superAdminService.getAccountingKpiSummary(vendorId),
      ]);

      return { invoiceData, walletData, payrollData, kpiData };
    },
    [invoiceFilters, payrollFilters]
  );

  useEffect(() => {
    let mounted = true;

    const loadVendors = async () => {
      try {
        setVendorLoading(true);
        const rows = await superAdminService.getAccountingVendors();
        if (!mounted) return;
        setVendors(rows);
        if (rows[0]) {
          setSelectedVendorId(String(rows[0].id));
        }
      } catch (error) {
        toast.error(error?.response?.data?.message || "Failed to load accounting vendors");
      } finally {
        if (mounted) setVendorLoading(false);
      }
    };

    loadVendors();
    return () => {
      mounted = false;
    };
  }, []);

  useEffect(() => {
    let mounted = true;

    const loadGlobalData = async () => {
      try {
        setGlobalLoading(true);
        const [platform, dashboard] = await Promise.all([
          superAdminService.getPlatformCommissionSummary(),
          superAdminService.getDashboard(),
        ]);
        if (!mounted) return;
        setPlatformSummary(platform);
        setDashboardStats(dashboard);
      } catch (error) {
        toast.error(error?.response?.data?.message || "Failed to load super admin accounting overview");
      } finally {
        if (mounted) setGlobalLoading(false);
      }
    };

    loadGlobalData();
    return () => {
      mounted = false;
    };
  }, []);

  useEffect(() => {
    if (!selectedVendorId) return;
    let mounted = true;

    const loadVendorScopedData = async () => {
      try {
        setSectionLoading(true);
        const { invoiceData, walletData, payrollData, kpiData } = await fetchVendorScopedData(
          selectedVendorId,
          invoiceFilters,
          payrollFilters
        );

        if (!mounted) return;
        setInvoices(invoiceData.rows);
        setInvoiceTotal(invoiceData.total);
        setWalletSummary(walletData);
        setPayrollSummary(payrollData);
        setKpiSummary(kpiData);
      } catch (error) {
        toast.error(error?.response?.data?.message || "Failed to load super admin accounting data");
      } finally {
        if (mounted) setSectionLoading(false);
      }
    };

    loadVendorScopedData();
    return () => {
      mounted = false;
    };
  }, [selectedVendorId, invoiceFilters, payrollFilters, fetchVendorScopedData]);

  useEffect(() => {
    setInvoiceLookupsLoaded(false);
    setGlCodes([]);
    setSchoolTerminals([]);
    setTripTerminals([]);
    setSchoolsByTerminal({});
    setInvoiceFilterSchools([]);
    setVendorSchools([]);
    setInvoiceSchoolsLoading(false);
    setInvoiceLookupWarning("");
    setInvoiceFilters(DEFAULT_INVOICE_FILTERS);
  }, [selectedVendorId]);

  useEffect(() => {
    if (!Array.isArray(invoices) || invoices.length === 0) return;

    setInvoiceFilterSchools((prev) => {
      const seen = new Set(prev.map((school) => String(school.id || school.name)));
      const next = [...prev];

      invoices.forEach((invoice) => {
        const name = String(invoice?.instituteName || "").trim();
        if (!name || name === "--") return;
        const key = `name:${name.toLowerCase()}`;
        if (seen.has(key)) return;
        seen.add(key);
        next.push({
          id: key,
          name,
        });
      });

      return next;
    });
  }, [invoices]);

  useEffect(() => {
    if (!invoiceFilters.instituteId) return;
    const stillExists = invoiceFilterSchools.some(
      (school) => String(school.id) === String(invoiceFilters.instituteId)
    );
    if (!stillExists) {
      setInvoiceFilters((prev) => ({ ...prev, instituteId: "", offset: 0 }));
    }
  }, [invoiceFilterSchools, invoiceFilters.instituteId]);

  useEffect(() => {
    if (!selectedVendorId || activeTab !== "Invoices") return;
    let mounted = true;

    const normalizeSchool = (school) => ({
      id:
        school?.instituteId ??
        school?.InstituteId ??
        school?.id ??
        school?.Id ??
        "",
      name:
        school?.instituteName ??
        school?.InstituteName ??
        school?.schoolName ??
        school?.SchoolName ??
        school?.name ??
        school?.Name ??
        `School ${school?.instituteId ?? school?.id ?? ""}`,
    });

    const loadInvoiceSchools = async () => {
      try {
        setInvoiceSchoolsLoading(true);
        const terminals = await superAdminService.getAccountingSchoolTerminals(selectedVendorId);
        if (!mounted) return;
        setSchoolTerminals(terminals);

        if (!Array.isArray(terminals) || terminals.length === 0) {
          setVendorSchools([]);
          return;
        }

        const schoolResults = await Promise.allSettled(
          terminals.map((terminal) =>
            superAdminService.getAccountingSchoolsByTerminal(
              terminal?.terminalId ??
                terminal?.TerminalId ??
                terminal?.id ??
                terminal?.Id,
              {
                vendorId: selectedVendorId,
                search: "",
                limit: 100,
                offset: 0,
              }
            )
          )
        );

        if (!mounted) return;

        const mergedSchools = schoolResults.flatMap((result) =>
          result.status === "fulfilled" ? result.value : []
        );

        const deduped = [];
        const seen = new Set();

        mergedSchools.forEach((school) => {
          const normalized = normalizeSchool(school);
          const key = String(normalized.id || normalized.name);
          if (!normalized.id && !normalized.name) return;
          if (seen.has(key)) return;
          seen.add(key);
          deduped.push(normalized);
        });

        setVendorSchools(deduped);
      } catch {
        if (mounted) {
          setVendorSchools([]);
        }
      } finally {
        if (mounted) {
          setInvoiceSchoolsLoading(false);
        }
      }
    };

    loadInvoiceSchools();
    return () => {
      mounted = false;
    };
  }, [selectedVendorId, activeTab]);

  const loadInvoiceLookups = useCallback(async () => {
    if (invoiceLookupsLoaded || !selectedVendorId) return;
    const [glCodeResult, schoolTerminalResult, tripTerminalResult] = await Promise.allSettled([
      superAdminService.getAccountingGlCodes(selectedVendorId),
      superAdminService.getAccountingSchoolTerminals(selectedVendorId),
      superAdminService.getAccountingTripTerminals(selectedVendorId),
    ]);

    setGlCodes(glCodeResult.status === "fulfilled" ? glCodeResult.value : []);
    setSchoolTerminals(schoolTerminalResult.status === "fulfilled" ? schoolTerminalResult.value : []);
    setTripTerminals(tripTerminalResult.status === "fulfilled" ? tripTerminalResult.value : []);
    setInvoiceLookupsLoaded(true);

    if (
      glCodeResult.status === "rejected" ||
      schoolTerminalResult.status === "rejected" ||
      tripTerminalResult.status === "rejected"
    ) {
      setInvoiceLookupWarning(
        "Some invoice lookups are not available for super admin. You can still enter IDs manually."
      );
    } else {
      setInvoiceLookupWarning("");
    }
  }, [invoiceLookupsLoaded, selectedVendorId]);

  const loadSchoolsByTerminal = useCallback(async (terminalId) => {
    if (!terminalId || !selectedVendorId || schoolsByTerminal[terminalId]) return;
    const rows = await superAdminService.getAccountingSchoolsByTerminal(terminalId, {
      vendorId: selectedVendorId,
      search: "",
      limit: 20,
      offset: 0,
    });
    setSchoolsByTerminal((prev) => ({
      ...prev,
      [terminalId]: rows,
    }));
  }, [schoolsByTerminal, selectedVendorId]);

  const handleOpenCreateInvoice = async () => {
    if (!selectedVendorId) {
      toast.error("Select a vendor first");
      return;
    }

    try {
      await loadInvoiceLookups();
      setIsCreateInvoiceOpen(true);
    } catch (error) {
      toast.error(error?.response?.data?.message || "Failed to load invoice form data");
    }
  };

  const handleCreateInvoice = async (payload) => {
    try {
      setCreateInvoiceSubmitting(true);
      await superAdminService.createAccountingInvoice(payload);
      toast.success("Invoice created successfully");
      setIsCreateInvoiceOpen(false);

      setSectionLoading(true);
      const { invoiceData, walletData, payrollData, kpiData } = await fetchVendorScopedData(
        selectedVendorId,
        invoiceFilters,
        payrollFilters
      );
      setInvoices(invoiceData.rows);
      setInvoiceTotal(invoiceData.total);
      setWalletSummary(walletData);
      setPayrollSummary(payrollData);
      setKpiSummary(kpiData);
    } catch (error) {
      toast.error(error?.response?.data?.message || "Failed to create invoice");
    } finally {
      setCreateInvoiceSubmitting(false);
      setSectionLoading(false);
    }
  };

  const handleExportInvoice = async (invoiceId, format) => {
    if (!selectedVendorId || !invoiceId) {
      toast.error("Missing vendor or invoice");
      return;
    }

    try {
      setInvoiceExporting({ id: String(invoiceId), format });
      const { blob, filename } = await superAdminService.exportAccountingInvoice(
        invoiceId,
        selectedVendorId,
        format
      );
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = filename || `super-admin-invoice-${invoiceId}.${format}`;
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(url);
      toast.success(`Invoice exported as ${format.toUpperCase()}`);
    } catch (error) {
      toast.error(error?.response?.data?.message || "Failed to export invoice");
    } finally {
      setInvoiceExporting({ id: "", format: "" });
    }
  };

  const selectedVendor = useMemo(
    () => vendors.find((vendor) => String(vendor.id) === String(selectedVendorId)) || null,
    [vendors, selectedVendorId]
  );

  const selectedInvoiceSchool = useMemo(
    () =>
      invoiceFilterSchools.find((school) => String(school.id) === String(invoiceFilters.instituteId)) || null,
    [invoiceFilterSchools, invoiceFilters.instituteId]
  );

  const visibleInvoices = useMemo(() => {
    if (!selectedInvoiceSchool) return invoices;
    const target = String(selectedInvoiceSchool.name || "").trim().toLowerCase();
    return invoices.filter(
      (invoice) => String(invoice.instituteName || "").trim().toLowerCase() === target
    );
  }, [invoices, selectedInvoiceSchool]);

  const visibleInvoiceTotal = selectedInvoiceSchool ? visibleInvoices.length : invoiceTotal;

  const recentTransactions = walletSummary?.recentTransactions || [];
  const payrollRows = payrollSummary?.rows || [];
  const salesRows = dashboardStats?.salesChart || [];
  const weeklyRows = dashboardStats?.weeklyChart || [];

  return (
    <div className="space-y-6">
      <SectionCard
        title="Accounting"
        subtitle="Standalone super admin accounting module with vendor-level and platform-level financial visibility."
        actions={
          <div className="flex min-w-[280px] flex-col gap-2">
            <label className="text-xs font-semibold uppercase tracking-[0.18em] text-[#8e8a80]">
              Vendor
            </label>
            <select
              value={selectedVendorId}
              onChange={(event) => {
                setInvoiceFilters(DEFAULT_INVOICE_FILTERS);
                setSelectedVendorId(event.target.value);
              }}
              className="rounded-2xl border border-[#e6dfd2] bg-[#fbfaf7] px-4 py-3 text-sm font-medium text-[#171a2a] outline-none"
              disabled={vendorLoading || vendors.length === 0}
            >
              {vendors.map((vendor) => (
                <option key={vendor.id} value={vendor.id}>
                  {vendor.companyName && vendor.companyName !== vendor.name
                    ? `${vendor.name} - ${vendor.companyName}`
                    : vendor.name}
                </option>
              ))}
            </select>
          </div>
        }
      >
        <div className="mb-4 flex flex-wrap gap-3">
          {tabs.map((tab) => (
            <button
              key={tab}
              type="button"
              onClick={() => setActiveTab(tab)}
              className={`rounded-2xl px-5 py-2.5 text-sm font-semibold transition ${
                activeTab === tab
                  ? "bg-[#c01824] text-white shadow-sm"
                  : "border border-[#e6dfd2] bg-white text-[#202336] hover:bg-[#f7f5ef]"
              }`}
            >
              {tab}
            </button>
          ))}
        </div>

        <div className="rounded-2xl bg-[#fbfaf7] px-4 py-3 text-sm text-[#5d6372]">
          {selectedVendor
            ? `Viewing data for ${selectedVendor.name}${selectedVendor.email ? ` (${selectedVendor.email})` : ""}`
            : "Select a vendor to load accounting data."}
        </div>
      </SectionCard>

      {activeTab === "Overview" ? (
        <>
          <div className="grid grid-cols-1 gap-5 xl:grid-cols-4">
            <StatCard
              label="Platform Commission Revenue"
              value={globalLoading ? "Loading..." : formatCurrency(platformSummary?.totalPlatformCommissionRevenue)}
              hint={`${platformSummary?.tripCommissionCount ?? 0} trip commissions`}
            />
            <StatCard
              label="Earned Amount"
              value={globalLoading ? "Loading..." : formatCurrency(platformSummary?.earnedAmount)}
              hint={`${platformSummary?.routeCommissionCount ?? 0} route commissions`}
            />
            <StatCard
              label="Settled Amount"
              value={globalLoading ? "Loading..." : formatCurrency(platformSummary?.settledAmount)}
              hint={`${platformSummary?.pendingCount ?? 0} pending records`}
            />
            <StatCard
              label="Platform Net Income"
              value={globalLoading ? "Loading..." : formatCurrency(dashboardStats?.netIncome)}
              hint={`${dashboardStats?.activeVendors ?? 0} active vendors`}
            />
          </div>

          <div className="grid grid-cols-1 gap-6 xl:grid-cols-3">
            <SectionCard title="KPI Summary" subtitle="Vendor-scoped KPI metrics for the selected vendor.">
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <StatCard label="Revenue Last Month" value={sectionLoading ? "Loading..." : formatCurrency(kpiSummary?.revenueLastMonth)} />
                <StatCard label="Average Value" value={sectionLoading ? "Loading..." : formatCurrency(kpiSummary?.averageValue)} />
                <StatCard label="New Invoices This Month" value={sectionLoading ? "Loading..." : String(kpiSummary?.newInvoicesThisMonth ?? 0)} />
                <StatCard label="New AP This Month" value={sectionLoading ? "Loading..." : String(kpiSummary?.newApThisMonth ?? 0)} />
                <StatCard label="New Employees This Month" value={sectionLoading ? "Loading..." : String(kpiSummary?.newEmployeesThisMonth ?? 0)} />
                <StatCard label="Invoice Count" value={sectionLoading ? "Loading..." : String(invoiceTotal || 0)} />
              </div>
            </SectionCard>

            <SectionCard title="Wallet Summary" subtitle="Current balance and wallet movement for the selected vendor.">
              <div className="space-y-4">
                <StatCard label="Current Balance" value={sectionLoading ? "Loading..." : formatCurrency(walletSummary?.currentBalance)} />
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
                  <StatCard label="Total Topup" value={sectionLoading ? "Loading..." : formatCurrency(walletSummary?.totalTopup)} />
                  <StatCard label="Total Spent" value={sectionLoading ? "Loading..." : formatCurrency(walletSummary?.totalSpent)} />
                  <StatCard label="Pending Count" value={sectionLoading ? "Loading..." : String(walletSummary?.pendingCount ?? 0)} />
                </div>
              </div>
            </SectionCard>

            <SectionCard title="Recent Transactions" subtitle="Latest wallet transactions for the selected vendor.">
              <div className="space-y-3">
                {sectionLoading ? (
                  <p className="text-sm text-[#7c7a73]">Loading transactions...</p>
                ) : recentTransactions.length === 0 ? (
                  <p className="text-sm text-[#7c7a73]">No recent transactions found.</p>
                ) : (
                  recentTransactions.slice(0, 5).map((transaction) => (
                    <div
                      key={transaction.id}
                      className="flex items-center justify-between rounded-2xl border border-[#ebe6da] bg-[#fbfaf7] px-4 py-3"
                    >
                      <div>
                        <div className="font-semibold text-[#171a2a]">{transaction.title}</div>
                        <div className="text-xs text-[#7c7a73]">
                          {transaction.status} {transaction.date ? `• ${formatDate(transaction.date)}` : ""}
                        </div>
                      </div>
                      <div className="font-bold text-[#171a2a]">{formatCurrency(transaction.amount)}</div>
                    </div>
                  ))
                )}
              </div>
            </SectionCard>
          </div>

          <div className="grid grid-cols-1 gap-6 xl:grid-cols-2">
            <TrendCard
              title="Dashboard Sales Chart"
              subtitle="Commission-based monthly totals from the super admin dashboard endpoint."
              rows={salesRows}
              accent="bg-[#c01824]"
            />
            <TrendCard
              title="Dashboard Weekly Chart"
              subtitle="Weekly transaction totals from the super admin dashboard endpoint."
              rows={weeklyRows}
              accent="bg-[#171a2a]"
            />
          </div>
        </>
      ) : null}

      {activeTab === "Invoices" ? (
        <SectionCard
          title="Invoices"
          subtitle="Vendor-scoped invoice listing through super admin accounting endpoints."
          actions={
            <div className="flex w-full flex-col gap-3">
              <div className="flex justify-end">
                <button
                  type="button"
                  onClick={handleOpenCreateInvoice}
                  disabled={!selectedVendorId}
                  className="rounded-2xl bg-[#c01824] px-5 py-3 text-sm font-semibold text-white shadow-sm disabled:cursor-not-allowed disabled:opacity-60"
                >
                  Create Invoice
                </button>
              </div>
              <div className="grid grid-cols-1 gap-3 md:grid-cols-4">
                <select
                  value={invoiceFilters.type}
                  onChange={(event) =>
                    setInvoiceFilters((prev) => ({ ...prev, type: event.target.value, offset: 0 }))
                  }
                  className="rounded-2xl border border-[#e6dfd2] bg-[#fbfaf7] px-4 py-3 text-sm text-[#171a2a] outline-none"
                >
                  <option value="">All Types</option>
                  <option value="School">School</option>
                  <option value="Trip">Trip</option>
                  <option value="Batch">Batch</option>
                  <option value="Terminal">Terminal</option>
                  <option value="Retailer">Retailer</option>
                </select>
                <select
                  value={invoiceFilters.status}
                  onChange={(event) =>
                    setInvoiceFilters((prev) => ({ ...prev, status: event.target.value, offset: 0 }))
                  }
                  className="rounded-2xl border border-[#e6dfd2] bg-[#fbfaf7] px-4 py-3 text-sm text-[#171a2a] outline-none"
                >
                  <option value="">All Statuses</option>
                  <option value="Paid">Paid</option>
                  <option value="Pending">Pending</option>
                  <option value="Open">Open</option>
                  <option value="Overdue">Overdue</option>
                </select>
                  <select
                    value={invoiceFilters.instituteId}
                    onChange={(event) =>
                      setInvoiceFilters((prev) => ({ ...prev, instituteId: event.target.value, offset: 0 }))
                    }
                    className="rounded-2xl border border-[#e6dfd2] bg-[#fbfaf7] px-4 py-3 text-sm text-[#171a2a] outline-none"
                    disabled={!selectedVendorId}
                  >
                    <option value="">
                      {!selectedVendorId
                        ? "Select vendor first"
                        : "All Schools"}
                    </option>
                    {invoiceFilterSchools.map((school) => (
                      <option key={school.id} value={school.id}>
                        {school.name}
                      </option>
                    ))}
                  </select>
                <input
                  type="text"
                  value={invoiceFilters.search}
                  onChange={(event) =>
                    setInvoiceFilters((prev) => ({ ...prev, search: event.target.value, offset: 0 }))
                  }
                  placeholder="Search invoice..."
                  className="rounded-2xl border border-[#e6dfd2] bg-[#fbfaf7] px-4 py-3 text-sm text-[#171a2a] outline-none"
                />
              </div>
            </div>
          }
        >
          <div className="mb-4 text-sm text-[#7c7a73]">Total invoices: {visibleInvoiceTotal}</div>
          <div className="overflow-x-auto">
            <table className="min-w-full text-left">
              <thead>
                <tr className="border-b border-[#ebe6da] text-xs font-semibold uppercase tracking-[0.18em] text-[#8e8a80]">
                  <th className="px-4 py-3">Invoice</th>
                  <th className="px-4 py-3">Type</th>
                  <th className="px-4 py-3">Institute</th>
                  <th className="px-4 py-3">Date</th>
                  <th className="px-4 py-3">Due</th>
                  <th className="px-4 py-3">Status</th>
                  <th className="px-4 py-3 text-right">Amount</th>
                  <th className="px-4 py-3 text-right">Action</th>
                </tr>
              </thead>
              <tbody>
                {sectionLoading ? (
                  <tr>
                    <td colSpan={8} className="px-4 py-6 text-sm text-[#7c7a73]">
                      Loading invoices...
                    </td>
                  </tr>
                  ) : visibleInvoices.length === 0 ? (
                    <tr>
                      <td colSpan={8} className="px-4 py-6 text-sm text-[#7c7a73]">
                        No invoices found for the selected filters.
                      </td>
                    </tr>
                  ) : (
                    visibleInvoices.map((invoice) => (
                      <tr key={invoice.id} className="border-b border-[#f1ede5] text-sm text-[#171a2a]">
                        <td className="px-4 py-4 font-semibold">{invoice.invoiceNumber}</td>
                        <td className="px-4 py-4">{invoice.type}</td>
                        <td className="px-4 py-4">{invoice.instituteName}</td>
                        <td className="px-4 py-4">{formatDate(invoice.invoiceDate)}</td>
                        <td className="px-4 py-4">{formatDate(invoice.dueDate)}</td>
                        <td className="px-4 py-4">{invoice.status}</td>
                        <td className="px-4 py-4 text-right font-semibold">{formatCurrency(invoice.amount)}</td>
                        <td className="px-4 py-4">
                          <div className="flex justify-end gap-2 whitespace-nowrap">
                            {["pdf", "csv", "excel"].map((format) => {
                              const isLoading =
                                invoiceExporting.id === String(invoice.id) &&
                                invoiceExporting.format === format;
                              return (
                                <button
                                  key={format}
                                  type="button"
                                  onClick={() => handleExportInvoice(invoice.id, format)}
                                  disabled={Boolean(invoiceExporting.id)}
                                  className="rounded-xl border border-[#e6dfd2] bg-[#fbfaf7] px-3 py-1.5 text-xs font-semibold uppercase tracking-[0.08em] text-[#171a2a] transition hover:bg-[#f3efe7] disabled:cursor-not-allowed disabled:opacity-60"
                                >
                                  {isLoading ? "..." : format}
                                </button>
                              );
                            })}
                          </div>
                        </td>
                      </tr>
                    ))
                  )}
              </tbody>
            </table>
          </div>
        </SectionCard>
      ) : null}

      <SuperAdminInvoiceForm
        open={isCreateInvoiceOpen}
        onClose={() => setIsCreateInvoiceOpen(false)}
        onSubmit={handleCreateInvoice}
        submitting={createInvoiceSubmitting}
        vendor={selectedVendor}
        lookupWarning={invoiceLookupWarning}
        glCodes={glCodes}
        schoolTerminals={schoolTerminals}
        tripTerminals={tripTerminals}
        vendorSchools={vendorSchools}
        schoolsByTerminal={schoolsByTerminal}
        loadSchoolsByTerminal={loadSchoolsByTerminal}
      />

      {activeTab === "Payroll" ? (
        <SectionCard
          title="Payroll Summary"
          subtitle="Vendor payroll overview for the selected month and year."
          actions={
            <div className="grid grid-cols-1 gap-3 md:grid-cols-3">
              <select
                value={payrollFilters.month}
                onChange={(event) =>
                  setPayrollFilters((prev) => ({ ...prev, month: Number(event.target.value) }))
                }
                className="rounded-2xl border border-[#e6dfd2] bg-[#fbfaf7] px-4 py-3 text-sm text-[#171a2a] outline-none"
              >
                {Array.from({ length: 12 }, (_, index) => (
                  <option key={index + 1} value={index + 1}>
                    {new Date(2026, index, 1).toLocaleString("en-US", { month: "long" })}
                  </option>
                ))}
              </select>
              <select
                value={payrollFilters.year}
                onChange={(event) =>
                  setPayrollFilters((prev) => ({ ...prev, year: Number(event.target.value) }))
                }
                className="rounded-2xl border border-[#e6dfd2] bg-[#fbfaf7] px-4 py-3 text-sm text-[#171a2a] outline-none"
              >
                {[2024, 2025, 2026, 2027].map((year) => (
                  <option key={year} value={year}>
                    {year}
                  </option>
                ))}
              </select>
              <input
                type="text"
                value={payrollFilters.terminalId}
                onChange={(event) =>
                  setPayrollFilters((prev) => ({ ...prev, terminalId: event.target.value }))
                }
                placeholder="Optional terminal id"
                className="rounded-2xl border border-[#e6dfd2] bg-[#fbfaf7] px-4 py-3 text-sm text-[#171a2a] outline-none"
              />
            </div>
          }
        >
          <div className="grid grid-cols-1 gap-5 md:grid-cols-4">
            <StatCard label="Total Employees" value={sectionLoading ? "Loading..." : String(payrollSummary?.totalEmployees ?? 0)} />
            <StatCard label="Gross Payroll" value={sectionLoading ? "Loading..." : formatCurrency(payrollSummary?.totalGrossPayroll)} />
            <StatCard label="Net Payroll" value={sectionLoading ? "Loading..." : formatCurrency(payrollSummary?.totalNetPayroll)} />
            <StatCard label="Pending Payroll" value={sectionLoading ? "Loading..." : String(payrollSummary?.pendingPayrollCount ?? 0)} />
          </div>

          <div className="mt-6 rounded-2xl bg-[#fbfaf7] px-4 py-3 text-sm text-[#5d6372]">
            Terminal: {payrollSummary?.terminalName || payrollSummary?.terminalId || "All"} • Period:{" "}
            {payrollSummary?.month || payrollFilters.month}/{payrollSummary?.year || payrollFilters.year}
          </div>

          <div className="mt-6 overflow-x-auto">
            <table className="min-w-full text-left">
              <thead>
                <tr className="border-b border-[#ebe6da] text-xs font-semibold uppercase tracking-[0.18em] text-[#8e8a80]">
                  {payrollRows[0]
                    ? Object.keys(payrollRows[0]).map((key) => (
                        <th key={key} className="px-4 py-3">
                          {key}
                        </th>
                      ))
                    : <th className="px-4 py-3">Payroll Data</th>}
                </tr>
              </thead>
              <tbody>
                {sectionLoading ? (
                  <tr>
                    <td className="px-4 py-6 text-sm text-[#7c7a73]">Loading payroll summary...</td>
                  </tr>
                ) : payrollRows.length === 0 ? (
                  <tr>
                    <td className="px-4 py-6 text-sm text-[#7c7a73]">No payroll rows returned for this period.</td>
                  </tr>
                ) : (
                  payrollRows.map((row, index) => (
                    <tr key={index} className="border-b border-[#f1ede5] text-sm text-[#171a2a]">
                      {Object.keys(payrollRows[0]).map((key) => (
                        <td key={key} className="px-4 py-4">
                          {String(row[key] ?? "--")}
                        </td>
                      ))}
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </SectionCard>
      ) : null}
    </div>
  );
}
