import { apiClient } from "@/configs/api";

const pickFirst = <T = any>(...values: T[]): T | undefined => {
  return values.find((value) => value !== undefined && value !== null && value !== "");
};

const toNumber = (value: any, fallback = 0): number => {
  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : fallback;
};

const toCurrency = (value: any): number => {
  return toNumber(value, 0);
};

const normalizeStatus = (value: any, isActive?: any): string => {
  if (typeof value === "string" && value.trim()) return value;
  if (typeof isActive === "boolean") return isActive ? "Active" : "Inactive";
  if (isActive === 1 || isActive === "1") return "Active";
  if (isActive === 0 || isActive === "0") return "Inactive";
  return "Inactive";
};

const normalizeResponsibilities = (value: any): string[] => {
  if (Array.isArray(value)) {
    return value.map((item) => String(item).trim()).filter(Boolean);
  }

  if (typeof value === "string") {
    return value
      .split(",")
      .map((item) => item.trim())
      .filter(Boolean);
  }

  return [];
};

export interface SuperAdminDashboardStats {
  netIncome: number;
  totalSchools: number;
  resolvedIssues: number;
  activeVendors: number;
  inactiveVendors: number;
  pendingReviews: number;
  openEscalations: number;
  salesChart: Array<{ label: string; total: number; month?: number; year?: number }>;
  weeklyChart: Array<{ label: string; total: number; week?: number; year?: number }>;
}

export interface SuperAdminVendor {
  id: number | string;
  name: string;
  companyName?: string;
  email?: string;
  contact: string;
  contractNumber: string;
  serviceAgreementUrl: string;
  status: string;
}

export interface SuperAdminSubAdmin {
  id: number | string;
  name: string;
  email: string;
  role: string;
  responsibilities: string[];
  status: string;
}

export interface SuperAdminInvite {
  id: number | string;
  email: string;
  role: string;
  fullName: string;
  companyName?: string;
  address?: string;
  contactName?: string;
  phone?: string;
  isUsed?: boolean;
  status: string;
  createdAt?: string;
  expiresAt?: string;
  usedAt?: string;
  inviteUrl?: string;
}

export interface SuperAdminAccountingVendor {
  id: number | string;
  name: string;
  email?: string;
  companyName?: string;
}

export interface SuperAdminAccountingInvoice {
  id: number | string;
  invoiceNumber: string;
  type: string;
  status: string;
  instituteName: string;
  amount: number;
  invoiceDate?: string;
  dueDate?: string;
}

export interface SuperAdminAccountingCreateInvoicePayload {
  vendorId: number | string;
  invoiceType: string;
  instituteId?: number;
  tripId?: number;
  terminalId?: number;
  retailId?: number;
  glCodeId?: number;
  invoiceDate?: string;
  dueDate?: string;
  deliveryDate?: string;
  invoiceMode?: string;
  paymentTerms?: string;
  billFrom?: string;
  billTo?: string;
  noOfBuses?: number;
  subTotal?: number;
  taxAmount?: number;
  totalAmount?: number;
  notes?: string;
  lineItems: Array<{
    itemDescription: string;
    quantity: number;
    unitPrice: number;
    totalAmount: number;
    routeId?: number;
    glCodeId?: number;
  }>;
}

export type SuperAdminAccountingExportFormat = "pdf" | "csv" | "excel";

export interface SuperAdminWalletTransaction {
  id: number | string;
  title: string;
  amount: number;
  status: string;
  date?: string;
}

export interface SuperAdminWalletSummary {
  currentBalance: number;
  totalTopup: number;
  totalSpent: number;
  pendingCount: number;
  recentTransactions: SuperAdminWalletTransaction[];
}

export interface SuperAdminPayrollSummary {
  month?: number;
  year?: number;
  terminalId?: number | string;
  terminalName?: string;
  totalEmployees: number;
  totalGrossPayroll: number;
  totalNetPayroll: number;
  pendingPayrollCount: number;
  rows: Array<Record<string, any>>;
}

export interface SuperAdminKpiSummary {
  revenueLastMonth: number;
  averageValue: number;
  newInvoicesThisMonth: number;
  newApThisMonth: number;
  newEmployeesThisMonth: number;
}

export interface SuperAdminPlatformCommissionSummary {
  totalPlatformCommissionRevenue: number;
  earnedAmount: number;
  settledAmount: number;
  pendingCount: number;
  tripCommissionCount: number;
  routeCommissionCount: number;
}

const extractFilename = (contentDisposition?: string, fallback = "invoice-export") => {
  if (!contentDisposition) return fallback;
  const utfMatch = contentDisposition.match(/filename\*=UTF-8''([^;]+)/i);
  if (utfMatch?.[1]) {
    try {
      return decodeURIComponent(utfMatch[1]);
    } catch {
      return utfMatch[1];
    }
  }
  const basicMatch = contentDisposition.match(/filename="?([^";]+)"?/i);
  return basicMatch?.[1] || fallback;
};

const normalizeDashboard = (raw: any): SuperAdminDashboardStats => {
  const stats = raw?.stats ?? raw?.summary ?? raw ?? {};
  const vendorCounts = raw?.vendorCounts ?? raw?.vendors ?? stats?.vendorCounts ?? {};
  const salesChartSource =
    raw?.salesChart ?? raw?.overallSalesChart ?? raw?.monthlySalesChart ?? stats?.salesChart ?? [];
  const weeklyChartSource =
    raw?.weeklyChart ?? raw?.weeklyTransactionChart ?? raw?.weeklyTransactions ?? stats?.weeklyChart ?? [];

  const monthLabels = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

  return {
    netIncome: toCurrency(
      pickFirst(stats?.netIncome, raw?.netIncome, raw?.totalNetIncome, raw?.income, raw?.summary?.netIncome)
    ),
    totalSchools: toNumber(
      pickFirst(stats?.totalSchools, raw?.totalSchools, raw?.schools, raw?.schoolCount, raw?.summary?.totalSchools)
    ),
    resolvedIssues: toNumber(
      pickFirst(stats?.resolvedIssues, raw?.resolvedIssues, raw?.totalResolvedIssues, raw?.issuesResolved)
    ),
    activeVendors: toNumber(
      pickFirst(stats?.activeVendors, vendorCounts?.active, raw?.activeVendors, raw?.vendorActiveCount)
    ),
    inactiveVendors: toNumber(
      pickFirst(stats?.inactiveVendors, vendorCounts?.inactive, raw?.inactiveVendors, raw?.vendorInactiveCount)
    ),
    pendingReviews: toNumber(
      pickFirst(stats?.pendingReviews, vendorCounts?.pending, raw?.pendingReviews, raw?.pendingVendorReviews)
    ),
    openEscalations: toNumber(
      pickFirst(stats?.openEscalations, raw?.openEscalations, raw?.escalations, raw?.openIssues)
    ),
    salesChart: Array.isArray(salesChartSource)
      ? salesChartSource.map((item: any, index: number) => ({
          label: String(
            pickFirst(
              item?.monthLabel,
              item?.label,
              typeof item?.month === "number" ? monthLabels[item.month - 1] : undefined,
              item?.month,
              item?.name,
              `P${index + 1}`
            )
          ),
          total: toNumber(pickFirst(item?.total, item?.organic, item?.red, item?.seriesA, item?.value)),
          month: typeof item?.month === "number" ? item.month : undefined,
          year: typeof item?.year === "number" ? item.year : undefined,
        }))
      : [],
    weeklyChart: Array.isArray(weeklyChartSource)
      ? weeklyChartSource.map((item: any, index: number) => ({
          label: String(
            pickFirst(
              item?.weekLabel,
              item?.label,
              item?.week != null ? `W${item.week}` : undefined,
              item?.day,
              item?.name,
              `D${index + 1}`
            )
          ),
          total: toNumber(pickFirst(item?.total, item?.primary, item?.dark, item?.value)),
          week: typeof item?.week === "number" ? item.week : undefined,
          year: typeof item?.year === "number" ? item.year : undefined,
        }))
      : [],
  };
};

const normalizeVendor = (item: any): SuperAdminVendor => ({
  id:
    pickFirst(
      item?.VendorId,
      item?.vendorId,
      item?.VendorSignupId,
      item?.vendorSignupId,
      item?.VendorSignupID,
      item?.vendorSignupID,
      item?.UserId,
      item?.userId,
      item?.Id,
      item?.id,
      item?.sub
    ) ?? "",
  name: String(
    pickFirst(
      item?.vendorName,
      item?.VendorName,
      item?.companyName,
      item?.CompanyName,
      item?.BusinessName,
      item?.Name,
      item?.name,
      "Unnamed Vendor"
    )
  ),
  companyName: pickFirst(item?.companyName, item?.CompanyName, item?.BusinessName),
  email: pickFirst(item?.Email, item?.email),
  contact: String(
    pickFirst(
      item?.ContactInfo,
      item?.contactPhone,
      item?.ContactPhone,
      item?.Phone,
      item?.Mobile,
      item?.ContactNumber,
      item?.phone,
      item?.email,
      "--"
    )
  ),
  contractNumber: String(pickFirst(item?.ContractNumber, item?.contractNumber, "--")),
  serviceAgreementUrl: String(
    pickFirst(item?.serviceAgreement, item?.ServiceAgreement, item?.ServiceAgreementUrl, item?.serviceAgreementUrl, "")
  ),
  status: normalizeStatus(pickFirst(item?.Status, item?.status), pickFirst(item?.IsActive, item?.isActive)),
});

const normalizeSubAdmin = (item: any): SuperAdminSubAdmin => ({
  id: pickFirst(item?.SubAdminId, item?.UserId, item?.Id, item?.id) ?? "",
  name: String(
    pickFirst(item?.fullName, item?.FullName, item?.Name, item?.name, "Unnamed Sub Admin")
  ),
  email: String(pickFirst(item?.Email, item?.email, "--")),
  role: String(pickFirst(item?.Role, item?.RoleName, item?.role, "Sub Admin")),
  responsibilities: normalizeResponsibilities(
    pickFirst(item?.Responsibilities, item?.responsibilities, item?.AllowedModules)
  ),
  status: normalizeStatus(pickFirst(item?.Status, item?.status), pickFirst(item?.IsActive, item?.isActive)),
});

const normalizeInvite = (item: any, index = 0): SuperAdminInvite => ({
  id: pickFirst(item?.InviteId, item?.inviteId, item?.Id, item?.id, index) ?? index,
  email: String(pickFirst(item?.Email, item?.email, "")),
  role: String(pickFirst(item?.Role, item?.role, "VENDOR")),
  fullName: String(
    pickFirst(
      item?.FullName,
      item?.fullName,
      item?.ContactName,
      item?.contactName,
      item?.CompanyName,
      item?.companyName,
      ""
    )
  ),
  companyName: String(pickFirst(item?.CompanyName, item?.companyName, "")),
  address: String(pickFirst(item?.Address, item?.address, "")),
  contactName: String(pickFirst(item?.ContactName, item?.contactName, "")),
  phone: String(pickFirst(item?.Phone, item?.phone, "")),
  isUsed:
    pickFirst(item?.IsUsed, item?.isUsed) === true ||
    pickFirst(item?.IsUsed, item?.isUsed) === 1 ||
    pickFirst(item?.IsUsed, item?.isUsed) === "1",
  status: String(
    pickFirst(
      item?.Status,
      item?.status,
      pickFirst(item?.IsUsed, item?.isUsed) ? "Accepted" : "Pending"
    )
  ),
  createdAt: pickFirst(item?.CreatedAt, item?.createdAt),
  expiresAt: pickFirst(item?.ExpiresAt, item?.expiresAt),
  usedAt: pickFirst(item?.UsedAt, item?.usedAt),
  inviteUrl: String(pickFirst(item?.inviteUrl, item?.InviteUrl, "")),
});

const normalizeAccountingVendor = (item: any): SuperAdminAccountingVendor => ({
  id:
    pickFirst(
      item?.VendorId,
      item?.vendorId,
      item?.VendorSignupId,
      item?.vendorSignupId,
      item?.UserId,
      item?.userId,
      item?.Id,
      item?.id
    ) ?? "",
  name: String(
    pickFirst(
      item?.vendorName,
      item?.VendorName,
      item?.CompanyName,
      item?.companyName,
      item?.BusinessName,
      item?.Name,
      item?.name,
      "Unnamed Vendor"
    )
  ),
  email: pickFirst(item?.Email, item?.email, ""),
  companyName: pickFirst(item?.CompanyName, item?.companyName, item?.BusinessName, item?.vendorName, ""),
});

const normalizeAccountingInvoice = (item: any): SuperAdminAccountingInvoice => ({
  id: pickFirst(item?.InvoiceId, item?.invoiceId, item?.Id, item?.id) ?? "",
  invoiceNumber: String(
    pickFirst(item?.InvoiceNumber, item?.invoiceNumber, item?.invoiceNo, item?.InvoiceNo, "--")
  ),
  type: String(pickFirst(item?.Type, item?.type, item?.InvoiceType, item?.invoiceType, "--")),
  status: String(pickFirst(item?.Status, item?.status, "--")),
  instituteName: String(
    pickFirst(
      item?.InstituteName,
      item?.SchoolName,
      item?.schoolName,
      item?.instituteName,
      item?.BillTo,
      item?.billTo,
      "--"
    )
  ),
  amount: toCurrency(
    pickFirst(
      item?.InvoiceTotal,
      item?.invoiceTotal,
      item?.TotalAmount,
      item?.totalAmount,
      item?.Amount,
      item?.amount,
      item?.Total,
      item?.total
    )
  ),
  invoiceDate: pickFirst(item?.InvoiceDate, item?.invoiceDate, item?.CreatedAt, item?.createdAt, ""),
  dueDate: pickFirst(item?.DueDate, item?.dueDate, ""),
});

const normalizeWalletTransaction = (item: any): SuperAdminWalletTransaction => ({
  id: pickFirst(item?.TransactionId, item?.transactionId, item?.Id, item?.id) ?? "",
  title: String(
    pickFirst(item?.Title, item?.title, item?.Description, item?.description, item?.Type, item?.type, "Transaction")
  ),
  amount: toCurrency(pickFirst(item?.Amount, item?.amount, item?.Value, item?.value)),
  status: String(pickFirst(item?.Status, item?.status, "--")),
  date: pickFirst(item?.CreatedAt, item?.createdAt, item?.Date, item?.date, ""),
});

const normalizeWalletSummary = (raw: any): SuperAdminWalletSummary => ({
  currentBalance: toCurrency(
    pickFirst(raw?.currentBalance, raw?.walletBalance, raw?.balance, raw?.summary?.currentBalance)
  ),
  totalTopup: toCurrency(pickFirst(raw?.totalTopup, raw?.topupAmount, raw?.totalAdded)),
  totalSpent: toCurrency(pickFirst(raw?.totalSpent, raw?.spentAmount, raw?.totalPaid)),
  pendingCount: toNumber(pickFirst(raw?.pendingCount, raw?.pendingTransactions, raw?.pending)),
  recentTransactions: Array.isArray(raw?.recentTransactions)
    ? raw.recentTransactions.map(normalizeWalletTransaction)
    : Array.isArray(raw?.transactions)
    ? raw.transactions.map(normalizeWalletTransaction)
    : [],
});

const normalizePayrollSummary = (raw: any): SuperAdminPayrollSummary => ({
  month: pickFirst(raw?.month, raw?.Month),
  year: pickFirst(raw?.year, raw?.Year),
  terminalId: pickFirst(raw?.terminalId, raw?.TerminalId),
  terminalName: pickFirst(raw?.terminalName, raw?.TerminalName, ""),
  totalEmployees: toNumber(
    pickFirst(
      raw?.totalEmployees,
      raw?.employeeCount,
      raw?.totalRecords,
      raw?.recordCount,
      raw?.summary?.totalEmployees,
      raw?.summary?.totalRecords
    )
  ),
  totalGrossPayroll: toCurrency(
    pickFirst(
      raw?.totalGrossPayroll,
      raw?.grossPayroll,
      raw?.grossAmount,
      raw?.totalGross,
      raw?.summary?.totalGrossPayroll,
      raw?.summary?.totalGross
    )
  ),
  totalNetPayroll: toCurrency(
    pickFirst(
      raw?.totalNetPayroll,
      raw?.netPayroll,
      raw?.netAmount,
      raw?.totalNet,
      raw?.summary?.totalNetPayroll,
      raw?.summary?.totalNet
    )
  ),
  pendingPayrollCount: toNumber(
    pickFirst(
      raw?.pendingPayrollCount,
      raw?.pendingCount,
      raw?.pendingPayroll,
      raw?.statusCounts?.pending,
      raw?.summary?.pendingPayrollCount,
      raw?.summary?.statusCounts?.pending
    )
  ),
  rows: Array.isArray(raw?.rows)
    ? raw.rows
    : Array.isArray(raw?.items)
    ? raw.items
    : Array.isArray(raw?.employees)
    ? raw.employees
    : Array.isArray(raw?.payrolls)
    ? raw.payrolls
    : Array.isArray(raw?.records)
    ? raw.records
    : Array.isArray(raw?.list)
    ? raw.list
    : [],
});

const normalizeKpiSummary = (raw: any): SuperAdminKpiSummary => ({
  revenueLastMonth: toCurrency(pickFirst(raw?.revenueLastMonth, raw?.lastMonthRevenue)),
  averageValue: toCurrency(pickFirst(raw?.averageValue, raw?.avgValue, raw?.averageInvoiceValue)),
  newInvoicesThisMonth: toNumber(pickFirst(raw?.newInvoicesThisMonth, raw?.invoiceCountThisMonth)),
  newApThisMonth: toNumber(pickFirst(raw?.newApThisMonth, raw?.apCountThisMonth, raw?.newAccountsPayableThisMonth)),
  newEmployeesThisMonth: toNumber(pickFirst(raw?.newEmployeesThisMonth, raw?.employeeCountThisMonth)),
});

const normalizePlatformCommissionSummary = (raw: any): SuperAdminPlatformCommissionSummary => ({
  totalPlatformCommissionRevenue: toCurrency(
    pickFirst(raw?.totalPlatformCommissionRevenue, raw?.totalCommissionRevenue, raw?.totalRevenue)
  ),
  earnedAmount: toCurrency(pickFirst(raw?.earnedAmount, raw?.earned, raw?.totalEarned)),
  settledAmount: toCurrency(pickFirst(raw?.settledAmount, raw?.settled, raw?.totalSettled)),
  pendingCount: toNumber(pickFirst(raw?.pendingCount, raw?.pending, raw?.pendingCommissions)),
  tripCommissionCount: toNumber(pickFirst(raw?.tripCommissionCount, raw?.tripCount)),
  routeCommissionCount: toNumber(pickFirst(raw?.routeCommissionCount, raw?.routeCount)),
});

export const superAdminService = {
  async getDashboard(): Promise<SuperAdminDashboardStats> {
    const response = await apiClient.get("/super-admin/dashboard");
    return normalizeDashboard(response.data?.data ?? response.data);
  },

  async getVendors(): Promise<SuperAdminVendor[]> {
    const response = await apiClient.get("/super-admin/vendors");
    const rows = response.data?.data ?? response.data ?? [];
    return Array.isArray(rows) ? rows.map(normalizeVendor) : [];
  },

  async updateVendorContract(
    id: number | string,
    payload: { contractNumber?: string; serviceAgreementUrl?: string }
  ) {
    const response = await apiClient.patch(`/super-admin/vendors/${id}/contract`, payload);
    return response.data;
  },

  async impersonateVendor(id: number | string) {
    const response = await apiClient.post(`/super-admin/vendors/${id}/impersonate`);
    const body = response.data?.data ?? response.data ?? {};
    return {
      accessToken: pickFirst(
        body?.token,
        body?.access_token,
        body?.accessToken,
        response.data?.token,
        response.data?.access_token,
        response.data?.accessToken
      ),
      refreshToken: pickFirst(
        body?.refresh_token,
        body?.refreshToken,
        response.data?.refresh_token,
        response.data?.refreshToken,
        null
      ),
      vendorName: pickFirst(body?.vendorName, response.data?.vendorName, null),
      allowedModules: body?.allowedModules ?? null,
      impersonatorRole: body?.impersonatorRole ?? "SUPER_ADMIN",
    };
  },

  async getSubAdmins(): Promise<SuperAdminSubAdmin[]> {
    const response = await apiClient.get("/super-admin/sub-admins");
    const rows = response.data?.data ?? response.data ?? [];
    return Array.isArray(rows) ? rows.map(normalizeSubAdmin) : [];
  },

  async createSubAdmin(payload: {
    fullName: string;
    email: string;
    role: string;
    responsibilities: string[];
  }) {
    const response = await apiClient.post("/super-admin/sub-admins", payload);
    return response.data;
  },

  async updateSubAdmin(
    id: number | string,
    payload: {
      fullName?: string;
      role?: string;
      responsibilities?: string[];
    }
  ) {
    const response = await apiClient.patch(`/super-admin/sub-admins/${id}`, payload);
    return response.data?.data ?? response.data;
  },

  async updateSubAdminStatus(id: number | string, isActive: boolean) {
    const response = await apiClient.patch(`/super-admin/sub-admins/${id}/status`, {
      isActive,
    });
    return response.data;
  },

  async createVendor(payload: {
    name: string;
    contact: string;
    contractNumber?: string;
    serviceAgreementUrl?: string;
    status?: string;
  }): Promise<SuperAdminVendor> {
    const response = await apiClient.post("/super-admin/vendors", payload);
    const body = response.data?.data ?? response.data ?? {};
    return normalizeVendor(body);
  },

  async getVendorsAsSubAdmin(): Promise<SuperAdminVendor[]> {
    const response = await apiClient.get("/sub-admin/vendors");
    const rows = response.data?.data ?? response.data ?? [];
    return Array.isArray(rows) ? rows.map(normalizeVendor) : [];
  },

  async impersonateVendorAsSubAdmin(id: number | string) {
    const response = await apiClient.post(`/sub-admin/vendors/${id}/impersonate`);
    const body = response.data?.data ?? response.data ?? {};
    return {
      accessToken: pickFirst(
        body?.token,
        body?.access_token,
        body?.accessToken,
        response.data?.token,
        response.data?.access_token,
        response.data?.accessToken
      ),
      refreshToken: pickFirst(
        body?.refresh_token,
        body?.refreshToken,
        response.data?.refresh_token,
        response.data?.refreshToken,
        null
      ),
      vendorName: pickFirst(body?.vendorName, response.data?.vendorName, null),
      allowedModules: body?.allowedModules ?? null,
      impersonatorRole: body?.impersonatorRole ?? "SUB_ADMIN",
    };
  },

  async createInvite(payload: {
    role: string;
    companyName: string;
    address: string;
    contactName: string;
    phone: string;
    email: string;
  }) {
    const response = await apiClient.post("/super-admin/invites", payload);
    const body = response.data ?? {};
    return {
      message: pickFirst(body?.message, body?.data?.message, "Invite sent successfully"),
      email: pickFirst(body?.email, body?.data?.email, payload.email),
      inviteUrl: pickFirst(body?.inviteUrl, body?.data?.inviteUrl, ""),
      data: body?.data ?? {},
    };
  },

  async getInvites(): Promise<SuperAdminInvite[]> {
    const response = await apiClient.get("/super-admin/invites");
    const rows = response.data?.data ?? response.data ?? [];
    return Array.isArray(rows) ? rows.map(normalizeInvite) : [];
  },

  async getAccountingVendors(): Promise<SuperAdminAccountingVendor[]> {
    const response = await apiClient.get("/super-admin/accounting/vendors");
    const rows = response.data?.data ?? response.data ?? [];
    return Array.isArray(rows) ? rows.map(normalizeAccountingVendor) : [];
  },

  async getAccountingInvoices(params: {
    vendorId: number | string;
    type?: string;
    status?: string;
    instituteId?: number | string;
    search?: string;
    limit?: number;
    offset?: number;
  }): Promise<{ rows: SuperAdminAccountingInvoice[]; total: number }> {
    const response = await apiClient.get("/super-admin/accounting/invoices", { params });
    const body = response.data?.data ?? response.data ?? {};
    const rows = Array.isArray(body?.rows)
      ? body.rows
      : Array.isArray(body?.invoices)
      ? body.invoices
      : Array.isArray(body?.items)
      ? body.items
      : Array.isArray(body)
      ? body
      : [];

    return {
      rows: rows.map(normalizeAccountingInvoice),
      total: toNumber(pickFirst(body?.total, response.data?.total, rows.length), rows.length),
    };
  },

  async createAccountingInvoice(payload: SuperAdminAccountingCreateInvoicePayload) {
    const response = await apiClient.post("/super-admin/accounting/invoices", payload);
    return response.data?.data ?? response.data;
  },

  async exportAccountingInvoice(
    invoiceId: number | string,
    vendorId: number | string,
    format: SuperAdminAccountingExportFormat = "pdf"
  ) {
    const response = await apiClient.get(`/super-admin/accounting/invoices/${invoiceId}/export`, {
      params: { vendorId, format },
      responseType: "blob",
    });

    return {
      blob: response.data,
      filename: extractFilename(
        response.headers?.["content-disposition"],
        `super-admin-invoice-${invoiceId}.${format}`
      ),
    };
  },

  async getAccountingGlCodes(vendorId: number | string) {
    const response = await apiClient.get("/super-admin/accounting/gl-codes", {
      params: { vendorId },
    });
    const body = response.data?.data ?? response.data ?? [];
    const rows = body?.items ?? body?.rows ?? body;
    return Array.isArray(rows) ? rows : [];
  },

  async getAccountingSchoolTerminals(vendorId: number | string) {
    const response = await apiClient.get("/super-admin/accounting/school-terminals", {
      params: { vendorId },
    });
    const rows = response.data?.data ?? response.data ?? [];
    return Array.isArray(rows) ? rows : [];
  },

  async getAccountingSchoolsByTerminal(
    terminalId: number | string,
    params: {
      vendorId: number | string;
      search?: string;
      limit?: number;
      offset?: number;
    }
  ) {
    const response = await apiClient.get(
      `/super-admin/accounting/school-terminals/${terminalId}/schools`,
      { params }
    );
    const body = response.data?.data ?? response.data ?? {};
    const rows = body?.schools ?? body?.items ?? body?.rows ?? body?.data ?? body;
    return Array.isArray(rows) ? rows : [];
  },

  async getAccountingTripTerminals(vendorId: number | string) {
    const response = await apiClient.get("/super-admin/accounting/trip-terminals", {
      params: { vendorId },
    });
    const body = response.data?.data ?? response.data ?? [];
    const rows = body?.items ?? body?.rows ?? body;
    return Array.isArray(rows) ? rows : [];
  },

  async getAccountingWalletSummary(vendorId: number | string): Promise<SuperAdminWalletSummary> {
    const response = await apiClient.get("/super-admin/accounting/wallet/summary", {
      params: { vendorId },
    });
    return normalizeWalletSummary(response.data?.data ?? response.data ?? {});
  },

  async getAccountingPayrollSummary(params: {
    vendorId: number | string;
    month: number;
    year: number;
    terminalId?: number | string;
  }): Promise<SuperAdminPayrollSummary> {
    const response = await apiClient.get("/super-admin/accounting/payroll/summary", {
      params,
    });
    return normalizePayrollSummary(response.data?.data ?? response.data ?? {});
  },

  async getAccountingKpiSummary(vendorId: number | string): Promise<SuperAdminKpiSummary> {
    const response = await apiClient.get("/super-admin/accounting/kpi/summary", {
      params: { vendorId },
    });
    return normalizeKpiSummary(response.data?.data ?? response.data ?? {});
  },

  async getPlatformCommissionSummary(): Promise<SuperAdminPlatformCommissionSummary> {
    const response = await apiClient.get("/super-admin/platform-commissions/summary");
    return normalizePlatformCommissionSummary(response.data?.data ?? response.data ?? {});
  },

  async deleteInvite(id: number | string) {
    const response = await apiClient.delete(`/super-admin/invites/${id}`);
    return response.data?.data ?? response.data;
  },
};

export default superAdminService;
