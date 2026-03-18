import { apiClient } from "@/configs/api";
import { ApiResponse } from "@/types/api";

export interface WalletSummary {
  balance?: number;
  totalTopUp?: number;
  totalSpent?: number;
  lastTransactions?: any[];
  [key: string]: any;
}

export interface WalletBalance {
  balance?: number;
  availableBalance?: number;
  pendingBalance?: number;
  currency?: string;
  [key: string]: any;
}

export interface FundWalletInput {
  amount: number;
  paymentMethodId?: string;
  paymentMethod?: string;
  accountNumber?: string;
  bankName?: string;
  beneficiaryName?: string;
  description?: string;
}

export interface WithdrawWalletInput {
  amount: number;
  bankName?: string;
  accountNumber?: string;
  beneficiaryName?: string;
  description?: string;
}

export interface PayPayrollFromWalletInput {
  payrollId: number;
  description?: string;
}

export interface WalletTransaction {
  [key: string]: any;
}

export interface WalletTransactionHistory {
  total: number;
  transactions: WalletTransaction[];
  limit: number;
  offset: number;
}

export interface Expense {
  id: number;
  amount: number;
  expenseType: string;
  vendorName: string;
  glCodeId: number;
  paymentTerm: string;
  paymentMethod: string;
  dueDate: string;
  expenseDate: string;
  terminalId: number;
  status?: string;
  source?: string;
  [key: string]: any;
}

export interface ExpenseListResponse {
  total: number;
  data: Expense[];
  limit: number;
  offset: number;
}

export interface AddExpenseInput {
  amount: number;
  expenseType: string;
  vendorName: string;
  glCodeId: number;
  paymentTerm: string;
  paymentMethod: string;
  dueDate: string;
  expenseDate: string;
  terminalId: number;
}

const normalizePaymentMethod = (paymentMethod?: string) => {
  if (!paymentMethod) return undefined;
  if (paymentMethod === "BankTransfer") return "Bank Transfer";
  return paymentMethod;
};

export const accountsPayableService = {
  getWalletSummary: async (): Promise<ApiResponse<WalletSummary>> => {
    const response = await apiClient.get("/wallet/summary");
    return { ok: true, data: response.data?.data };
  },

  getWalletBalance: async (): Promise<ApiResponse<WalletBalance>> => {
    const response = await apiClient.get("/wallet/balance");
    return { ok: true, data: response.data?.data };
  },

  topUpWallet: async (data: FundWalletInput) => {
    const payload = {
      amount: Number(data.amount || 0),
      paymentMethodId: data.paymentMethodId,
      paymentMethod: normalizePaymentMethod(data.paymentMethod),
    };
    const response = await apiClient.post("/wallet/topup", payload);
    return { ok: true, data: response.data?.data };
  },

  withdrawWallet: async (data: WithdrawWalletInput) => {
    const payload = {
      amount: Number(data.amount || 0),
      bankName: data.bankName,
      accountNumber: data.accountNumber,
      beneficiaryName: data.beneficiaryName,
      description: data.description,
    };
    const response = await apiClient.post("/wallet/withdraw", payload);
    return { ok: true, data: response.data?.data };
  },

  payPayrollFromWallet: async (data: PayPayrollFromWalletInput) => {
    const response = await apiClient.post("/wallet/pay-payroll", data);
    return { ok: true, data: response.data?.data };
  },

  createStripeSetupIntent: async () => {
    const response = await apiClient.post("/wallet/stripe/setup");
    return { ok: true, data: response.data?.data };
  },

  getWalletTransactions: async (params?: {
    type?: string;
    status?: string;
    limit?: number;
    offset?: number;
  }): Promise<ApiResponse<WalletTransactionHistory>> => {
    const response = await apiClient.get("/wallet/transactions", { params });
    const raw =
      response.data?.data?.items ??
      response.data?.data?.transactions ??
      response.data?.data?.rows ??
      response.data?.data;

    return {
      ok: true,
      data: {
        total: response.data?.data?.total ?? (Array.isArray(raw) ? raw.length : 0),
        transactions: Array.isArray(raw) ? raw : [],
        limit: params?.limit ?? 20,
        offset: params?.offset ?? 0,
      },
    };
  },

  // Legacy aliases kept so existing UI keeps working.
  fundWallet: async (data: FundWalletInput) => {
    return accountsPayableService.topUpWallet(data);
  },

  payFromWallet: async (data: WithdrawWalletInput) => {
    return accountsPayableService.withdrawWallet(data);
  },

  getExpenses: async (params?: {
    source?: "Manual" | "Payroll" | "All";
    status?: string;
    search?: string;
    limit?: number;
    offset?: number;
  }): Promise<ApiResponse<ExpenseListResponse>> => {
    const response = await apiClient.get("/accounts-payable", { params });
    return { ok: true, data: { total: response.data?.total, data: response.data?.data } };
  },

  addExpense: async (data: AddExpenseInput): Promise<ApiResponse<Expense>> => {
    const response = await apiClient.post("/accounts-payable", data);
    return { ok: true, data: response.data?.data };
  },

  deleteExpense: async (id: number) => {
    const response = await apiClient.delete(`/accounts-payable/${id}`);
    return { ok: true, data: response.data?.data };
  },
};

