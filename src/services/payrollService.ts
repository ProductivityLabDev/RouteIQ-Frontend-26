import { apiClient } from "@/configs/api";
import { ApiResponse } from "@/types/api";

// ─── Types ────────────────────────────────────────────────────────────────────

export interface TerminalSummary {
  terminalId: number;
  terminalName: string;
  terminalCode: string;
  employeeCount: number;
  payrollStatus: string;
}

export interface TerminalDriverBenefits {
  plan401K: number;
  companyMatch: number;
  healthInsurance: string;
  savingsAccount: number;
  reimbursement: number;
}

export interface TerminalDriverPayroll {
  payrollId: number;
  status: string;
  totalHours: number;
  grossPay: number;
  netSalary: number;
  federalTax: number;
  stateTax: number;
  periodStart: string;
  periodEnd: string;
}

export interface TerminalDriver {
  employeeId: number;
  name: string;
  payGrade: string;
  routeRate: number;
  payCycle: string;
  payType: string;
  positionType: number;
  ssn: string;
  lastPunchTime: string | null;
  payroll: TerminalDriverPayroll | null;
  ytd: number;
  benefits: TerminalDriverBenefits;
  periodStart: string;
  periodEnd: string;
}

export interface TerminalDetail {
  terminalId: number;
  terminalName: string;
  terminalCode: string;
  month: number;
  year: number;
  periodStart: string;
  periodEnd: string;
  drivers: TerminalDriver[];
}

export interface PayrollSummaryData {
  month: number;
  year: number;
  totalRecords: number;
  totalGross: number;
  totalTaxes: number;
  totalDeductions: number;
  totalNet: number;
  breakdown: {
    federal: number;
    state: number;
    local: number;
    medicare: number;
    socialSecurity: number;
  };
  statusCounts: {
    paid: number;
    processed: number;
    pending: number;
  };
}

export interface GeneratedPayroll {
  payrollId: number;
  employeeId: number;
  employeeName: string;
  periodStart: string;
  periodEnd: string;
  presentDays: number;
  absentDays: number;
  workingDays: number;
  totalHours: number;
  routeRate: number;
  grossPay: number;
  netSalary: number;
  status: string;
}

export interface DriverBenefits {
  employeeId: number;
  plan401K: number;
  companyMatch: number;
  healthInsurance: string;
  savingsAccount: number;
  reimbursement: number;
  reimbursementNote: string;
  ptoAllowanceDays: number;
}

export interface DriverBenefitsInput {
  plan401K: number;
  companyMatch: number;
  healthInsurance: string;
  savingsAccount: number;
  reimbursement: number;
  reimbursementNote: string;
  ptoAllowanceDays: number;
}

export interface DriverDetailsInput {
  name?: string;
  positionType?: number;
  payCycleId?: number;
  payTypeId?: number;
  payGrade?: string;
  routeRate?: number;
  tripRate?: number;
  ssn?: string;
  totalHours?: number;
  federalTaxRate?: number;
  stateTaxRate?: number;
  localTaxRate?: number;
  holidayPay?: number;
  allowances?: number;
  periodStart?: string;
  periodEnd?: string;
}

export interface TimeOffPending {
  requestId: number;
  requestDate: string;
  punchIn: string;
  punchOut: string;
  workHours: number;
  reason: string;
  status: string;
}

export interface TimeOffHistory {
  requestId: number;
  status: string;
  approvedBy: string;
  approvedAt: string;
}

export interface DriverTimeOff {
  employeeId: number;
  pending: TimeOffPending[];
  approvalHistory: TimeOffHistory[];
}

// ─── Service ──────────────────────────────────────────────────────────────────

export const payrollService = {

  // ── Terminals ──────────────────────────────────────────────────────────────
  getTerminals: async (): Promise<ApiResponse<TerminalSummary[]>> => {
    const response = await apiClient.get("/payroll/terminals");
    return { ok: true, data: response.data?.data };
  },

  updateTerminalRates: async (
    terminalId: number,
    data: { routeRate: number; tripRate: number }
  ) => {
    const response = await apiClient.patch(`/payroll/terminal/${terminalId}/rates`, data);
    return { ok: true, data: response.data?.data };
  },

  bulkGeneratePayroll: async (
    terminalId: number,
    data: {
      periodStart: string;
      periodEnd: string;
      federalTaxRate: number;
      stateTaxRate: number;
      localTaxRate: number;
      notes?: string;
    }
  ) => {
    const response = await apiClient.post(`/payroll/terminal/${terminalId}/generate`, data);
    return { ok: true, data: response.data?.data };
  },

  updateTerminalSettings: async (
    terminalId: number,
    data: {
      routeRate?: number;
      tripRate?: number;
      payCycleId?: number;
      payTypeId?: number;
      positionType?: number;
    }
  ) => {
    const response = await apiClient.patch(`/payroll/terminal/${terminalId}/settings`, data);
    return { ok: true, data: response.data?.data };
  },

  getTerminalDetail: async (
    terminalId: number,
    month?: number,
    year?: number,
    limit?: number,
    offset?: number
  ): Promise<ApiResponse<TerminalDetail>> => {
    const params: Record<string, number> = {};
    if (month !== undefined) params.month = month;
    if (year !== undefined) params.year = year;
    if (limit !== undefined) params.limit = limit;
    if (offset !== undefined) params.offset = offset;
    const response = await apiClient.get(`/payroll/terminal/${terminalId}`, { params });
    return { ok: true, data: response.data?.data };
  },

  // ── Summary ────────────────────────────────────────────────────────────────
  getPayrollSummary: async (month?: number, year?: number): Promise<ApiResponse<PayrollSummaryData>> => {
    const params: Record<string, number> = {};
    if (month !== undefined) params.month = month;
    if (year !== undefined) params.year = year;
    const response = await apiClient.get("/payroll/summary", { params });
    return { ok: true, data: response.data?.data };
  },

  // ── Generate / Update ──────────────────────────────────────────────────────
  generatePayroll: async (data: {
    employeeId: number;
    periodStart: string;
    periodEnd: string;
    federalTaxRate: number;
    stateTaxRate: number;
    localTaxRate: number;
  }): Promise<ApiResponse<GeneratedPayroll>> => {
    const response = await apiClient.post("/payroll/generate", data);
    return { ok: true, data: response.data?.data };
  },

  updatePayrollStatus: async (
    payrollId: number,
    status: "Processed" | "Paid"
  ) => {
    const response = await apiClient.patch(`/payroll/${payrollId}`, { status });
    return { ok: true, data: response.data?.data };
  },

  // ── Driver ─────────────────────────────────────────────────────────────────
  getDriverPaystub: async (employeeId: number, payrollId?: number) => {
    const params = payrollId ? { payrollId } : {};
    const response = await apiClient.get(`/payroll/driver/${employeeId}/paystub`, { params });
    return { ok: true, data: response.data?.data };
  },

  getDriverShifts: async (employeeId: number, month?: number, year?: number) => {
    const params: Record<string, number> = {};
    if (month !== undefined) params.month = month;
    if (year !== undefined) params.year = year;
    const response = await apiClient.get(`/payroll/driver/${employeeId}/shifts`, { params });
    return { ok: true, data: response.data?.data };
  },

  updateDriverDetails: async (
    employeeId: number,
    data: DriverDetailsInput
  ) => {
    const response = await apiClient.patch(`/payroll/driver/${employeeId}/details`, data);
    return { ok: true, data: response.data?.data };
  },

  // ── Benefits ───────────────────────────────────────────────────────────────
  getDriverBenefits: async (employeeId: number): Promise<ApiResponse<DriverBenefits>> => {
    const response = await apiClient.get(`/payroll/driver/${employeeId}/benefits`);
    return { ok: true, data: response.data?.data };
  },

  setDriverBenefits: async (employeeId: number, data: DriverBenefitsInput) => {
    const response = await apiClient.post(`/payroll/driver/${employeeId}/benefits`, data);
    return { ok: true, data: response.data?.data };
  },

  // ── Time Off ───────────────────────────────────────────────────────────────
  getDriverTimeOff: async (employeeId: number): Promise<ApiResponse<DriverTimeOff>> => {
    const response = await apiClient.get(`/payroll/driver/${employeeId}/time-off`);
    return { ok: true, data: response.data?.data };
  },

  submitDriverTimeOff: async (
    employeeId: number,
    data: { startDate: string; endDate: string; requestType: 'SICK' | 'CASUAL' | 'ANNUAL' | 'PERSONAL'; reason: string }
  ) => {
    const response = await apiClient.post(`/payroll/driver/${employeeId}/time-off`, data);
    return { ok: true, data: response.data?.data };
  },

  approveTimeOff: async (requestId: number, note?: string) => {
    const response = await apiClient.patch(`/payroll/time-off/${requestId}/approve`, { note });
    return { ok: true, data: response.data?.data };
  },

  rejectTimeOff: async (requestId: number, note?: string) => {
    const response = await apiClient.patch(`/payroll/time-off/${requestId}/reject`, { note });
    return { ok: true, data: response.data?.data };
  },
};
