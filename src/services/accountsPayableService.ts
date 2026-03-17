import { apiClient } from "@/configs/api";
import { ApiResponse } from "@/types/api";

// ─── Types ────────────────────────────────────────────────────────────────────

export interface WalletBalance {
  balance: number;
  currency?: string;
}

export interface FundWalletInput {
  amount: number;
  paymentMethod: "BankTransfer" | "Card";
  accountNumber?: string;
  bankName?: string;
  beneficiaryName?: string;
  description?: string;
}

export interface PayFromWalletInput {
  amount: number;
  paymentMethod: "BankTransfer" | "Card";
  beneficiaryName: string;
  description?: string;
  apId?: number;
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

// ─── Service ──────────────────────────────────────────────────────────────────

export const accountsPayableService = {

  // ── Wallet ─────────────────────────────────────────────────────────────────
  getWalletBalance: async (): Promise<ApiResponse<WalletBalance>> => {
    const response = await apiClient.get("/accounts-payable/wallet");
    return { ok: true, data: response.data?.data };
  },

  fundWallet: async (data: FundWalletInput) => {
    const response = await apiClient.post("/accounts-payable/wallet/fund", data);
    return { ok: true, data: response.data?.data };
  },

  payFromWallet: async (data: PayFromWalletInput) => {
    const response = await apiClient.post("/accounts-payable/wallet/pay", data);
    return { ok: true, data: response.data?.data };
  },

  getWalletTransactions: async (
    limit = 20,
    offset = 0
  ): Promise<ApiResponse<WalletTransactionHistory>> => {
    const response = await apiClient.get("/accounts-payable/wallet/transactions", {
      params: { limit, offset },
    });
    return { ok: true, data: response.data?.data };
  },

  // ── Expenses ───────────────────────────────────────────────────────────────
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
