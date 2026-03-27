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
  salesChart: Array<{ label: string; organic: number; professional: number }>;
  weeklyChart: Array<{ label: string; total: number; partial: number }>;
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
              item?.label,
              typeof item?.month === "number" ? monthLabels[item.month - 1] : undefined,
              item?.month,
              item?.name,
              `P${index + 1}`
            )
          ),
          organic: toNumber(pickFirst(item?.total, item?.organic, item?.red, item?.seriesA, item?.value)),
          professional: toNumber(
            pickFirst(item?.secondaryTotal, item?.professional, item?.black, item?.seriesB, item?.secondaryValue, 0)
          ),
        }))
      : [],
    weeklyChart: Array.isArray(weeklyChartSource)
      ? weeklyChartSource.map((item: any, index: number) => ({
          label: String(
            pickFirst(
              item?.label,
              item?.week != null ? `W${item.week}` : undefined,
              item?.day,
              item?.name,
              `D${index + 1}`
            )
          ),
          total: toNumber(pickFirst(item?.total, item?.primary, item?.dark, item?.value)),
          partial: toNumber(
            pickFirst(item?.partial, item?.secondary, item?.light, item?.secondaryValue, 0)
          ),
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
      item?.VendorName,
      item?.CompanyName,
      item?.BusinessName,
      item?.Name,
      item?.name,
      "Unnamed Vendor"
    )
  ),
  companyName: pickFirst(item?.CompanyName, item?.BusinessName, item?.companyName),
  email: pickFirst(item?.Email, item?.email),
  contact: String(
    pickFirst(
      item?.ContactInfo,
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
    pickFirst(item?.ServiceAgreementUrl, item?.serviceAgreementUrl, "")
  ),
  status: normalizeStatus(pickFirst(item?.Status, item?.status), pickFirst(item?.IsActive, item?.isActive)),
});

const normalizeSubAdmin = (item: any): SuperAdminSubAdmin => ({
  id: pickFirst(item?.SubAdminId, item?.UserId, item?.Id, item?.id) ?? "",
  name: String(pickFirst(item?.Name, item?.FullName, item?.name, "Unnamed Sub Admin")),
  email: String(pickFirst(item?.Email, item?.email, "--")),
  role: String(pickFirst(item?.Role, item?.RoleName, item?.role, "Sub Admin")),
  responsibilities: normalizeResponsibilities(
    pickFirst(item?.Responsibilities, item?.responsibilities, item?.AllowedModules)
  ),
  status: normalizeStatus(pickFirst(item?.Status, item?.status), pickFirst(item?.IsActive, item?.isActive)),
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
    name: string;
    email: string;
    role: string;
    responsibilities: string[];
  }) {
    const response = await apiClient.post("/super-admin/sub-admins", payload);
    return response.data;
  },

  async updateSubAdminStatus(id: number | string, isActive: boolean) {
    const response = await apiClient.patch(`/super-admin/sub-admins/${id}/status`, {
      isActive,
      status: isActive ? "Active" : "Inactive",
    });
    return response.data;
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
};

export default superAdminService;
