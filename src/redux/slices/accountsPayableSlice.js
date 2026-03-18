import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { accountsPayableService } from "@/services/accountsPayableService";

// ─── Thunks ───────────────────────────────────────────────────────────────────

export const fetchWalletBalance = createAsyncThunk(
  "accountsPayable/fetchWalletBalance",
  async (_, { rejectWithValue }) => {
    try {
      const res = await accountsPayableService.getWalletBalance();
      return res.data;
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || "Failed to fetch wallet balance");
    }
  }
);

export const fetchWalletSummary = createAsyncThunk(
  "accountsPayable/fetchWalletSummary",
  async (_, { rejectWithValue }) => {
    try {
      const res = await accountsPayableService.getWalletSummary();
      return res.data;
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || "Failed to fetch wallet summary");
    }
  }
);

export const fundWallet = createAsyncThunk(
  "accountsPayable/fundWallet",
  async (data, { rejectWithValue }) => {
    try {
      const res = await accountsPayableService.fundWallet(data);
      return res.data;
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || "Failed to fund wallet");
    }
  }
);

export const topUpWallet = createAsyncThunk(
  "accountsPayable/topUpWallet",
  async (data, { rejectWithValue }) => {
    try {
      const res = await accountsPayableService.topUpWallet(data);
      return res.data;
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || "Failed to top up wallet");
    }
  }
);

export const payFromWallet = createAsyncThunk(
  "accountsPayable/payFromWallet",
  async (data, { rejectWithValue }) => {
    try {
      const res = await accountsPayableService.payFromWallet(data);
      return res.data;
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || "Failed to process payment");
    }
  }
);

export const withdrawWallet = createAsyncThunk(
  "accountsPayable/withdrawWallet",
  async (data, { rejectWithValue }) => {
    try {
      const res = await accountsPayableService.withdrawWallet(data);
      return res.data;
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || "Failed to withdraw from wallet");
    }
  }
);

export const payPayrollFromWallet = createAsyncThunk(
  "accountsPayable/payPayrollFromWallet",
  async (data, { rejectWithValue }) => {
    try {
      const res = await accountsPayableService.payPayrollFromWallet(data);
      return res.data;
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || "Failed to pay payroll from wallet");
    }
  }
);

export const createWalletStripeSetup = createAsyncThunk(
  "accountsPayable/createWalletStripeSetup",
  async (_, { rejectWithValue }) => {
    try {
      const res = await accountsPayableService.createStripeSetupIntent();
      return res.data;
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || "Failed to create Stripe setup intent");
    }
  }
);

export const fetchWalletTransactions = createAsyncThunk(
  "accountsPayable/fetchWalletTransactions",
  async (params = {}, { rejectWithValue }) => {
    try {
      const res = await accountsPayableService.getWalletTransactions(params);
      return res.data;
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || "Failed to fetch transactions");
    }
  }
);

export const fetchExpenses = createAsyncThunk(
  "accountsPayable/fetchExpenses",
  async (params = {}, { rejectWithValue }) => {
    try {
      const res = await accountsPayableService.getExpenses(params);
      return res.data;
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || "Failed to fetch expenses");
    }
  }
);

export const addExpense = createAsyncThunk(
  "accountsPayable/addExpense",
  async (data, { rejectWithValue }) => {
    try {
      const res = await accountsPayableService.addExpense(data);
      return res.data;
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || "Failed to add expense");
    }
  }
);

export const deleteExpense = createAsyncThunk(
  "accountsPayable/deleteExpense",
  async (id, { rejectWithValue }) => {
    try {
      await accountsPayableService.deleteExpense(id);
      return id;
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || "Failed to delete expense");
    }
  }
);

// ─── Slice ────────────────────────────────────────────────────────────────────

const accountsPayableSlice = createSlice({
  name: "accountsPayable",
  initialState: {
    walletSummary: null,
    walletBalance: null,
    walletSetup: null,
    walletTransactions: { total: 0, transactions: [], limit: 20, offset: 0 },
    expenses: { total: 0, data: [], limit: 20, offset: 0 },
    loading: {
      walletSummary: false,
      walletBalance: false,
      fundWallet: false,
      topUpWallet: false,
      payFromWallet: false,
      withdrawWallet: false,
      payPayrollFromWallet: false,
      walletSetup: false,
      walletTransactions: false,
      expenses: false,
      addExpense: false,
      deleteExpense: false,
    },
    error: {
      walletSummary: null,
      walletBalance: null,
      fundWallet: null,
      topUpWallet: null,
      payFromWallet: null,
      withdrawWallet: null,
      payPayrollFromWallet: null,
      walletSetup: null,
      walletTransactions: null,
      expenses: null,
      addExpense: null,
      deleteExpense: null,
    },
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchWalletSummary.pending, (state) => { state.loading.walletSummary = true; state.error.walletSummary = null; })
      .addCase(fetchWalletSummary.fulfilled, (state, action) => { state.loading.walletSummary = false; state.walletSummary = action.payload; })
      .addCase(fetchWalletSummary.rejected, (state, action) => { state.loading.walletSummary = false; state.error.walletSummary = action.payload; });

    // fetchWalletBalance
    builder
      .addCase(fetchWalletBalance.pending, (state) => { state.loading.walletBalance = true; state.error.walletBalance = null; })
      .addCase(fetchWalletBalance.fulfilled, (state, action) => { state.loading.walletBalance = false; state.walletBalance = action.payload; })
      .addCase(fetchWalletBalance.rejected, (state, action) => { state.loading.walletBalance = false; state.error.walletBalance = action.payload; });

    // fundWallet
    builder
      .addCase(fundWallet.pending, (state) => { state.loading.fundWallet = true; state.error.fundWallet = null; })
      .addCase(fundWallet.fulfilled, (state) => { state.loading.fundWallet = false; })
      .addCase(fundWallet.rejected, (state, action) => { state.loading.fundWallet = false; state.error.fundWallet = action.payload; });

    builder
      .addCase(topUpWallet.pending, (state) => { state.loading.topUpWallet = true; state.error.topUpWallet = null; })
      .addCase(topUpWallet.fulfilled, (state) => { state.loading.topUpWallet = false; })
      .addCase(topUpWallet.rejected, (state, action) => { state.loading.topUpWallet = false; state.error.topUpWallet = action.payload; });

    // payFromWallet
    builder
      .addCase(payFromWallet.pending, (state) => { state.loading.payFromWallet = true; state.error.payFromWallet = null; })
      .addCase(payFromWallet.fulfilled, (state) => { state.loading.payFromWallet = false; })
      .addCase(payFromWallet.rejected, (state, action) => { state.loading.payFromWallet = false; state.error.payFromWallet = action.payload; });

    builder
      .addCase(withdrawWallet.pending, (state) => { state.loading.withdrawWallet = true; state.error.withdrawWallet = null; })
      .addCase(withdrawWallet.fulfilled, (state) => { state.loading.withdrawWallet = false; })
      .addCase(withdrawWallet.rejected, (state, action) => { state.loading.withdrawWallet = false; state.error.withdrawWallet = action.payload; });

    builder
      .addCase(payPayrollFromWallet.pending, (state) => { state.loading.payPayrollFromWallet = true; state.error.payPayrollFromWallet = null; })
      .addCase(payPayrollFromWallet.fulfilled, (state) => { state.loading.payPayrollFromWallet = false; })
      .addCase(payPayrollFromWallet.rejected, (state, action) => { state.loading.payPayrollFromWallet = false; state.error.payPayrollFromWallet = action.payload; });

    builder
      .addCase(createWalletStripeSetup.pending, (state) => { state.loading.walletSetup = true; state.error.walletSetup = null; })
      .addCase(createWalletStripeSetup.fulfilled, (state, action) => {
        state.loading.walletSetup = false;
        state.walletSetup = action.payload;
      })
      .addCase(createWalletStripeSetup.rejected, (state, action) => { state.loading.walletSetup = false; state.error.walletSetup = action.payload; });

    // fetchWalletTransactions
    builder
      .addCase(fetchWalletTransactions.pending, (state) => { state.loading.walletTransactions = true; state.error.walletTransactions = null; })
      .addCase(fetchWalletTransactions.fulfilled, (state, action) => { state.loading.walletTransactions = false; state.walletTransactions = action.payload || state.walletTransactions; })
      .addCase(fetchWalletTransactions.rejected, (state, action) => { state.loading.walletTransactions = false; state.error.walletTransactions = action.payload; });

    // fetchExpenses
    builder
      .addCase(fetchExpenses.pending, (state) => { state.loading.expenses = true; state.error.expenses = null; })
      .addCase(fetchExpenses.fulfilled, (state, action) => { state.loading.expenses = false; state.expenses = action.payload || state.expenses; })
      .addCase(fetchExpenses.rejected, (state, action) => { state.loading.expenses = false; state.error.expenses = action.payload; });

    // addExpense
    builder
      .addCase(addExpense.pending, (state) => { state.loading.addExpense = true; state.error.addExpense = null; })
      .addCase(addExpense.fulfilled, (state, action) => {
        state.loading.addExpense = false;
        if (action.payload) state.expenses.data.unshift(action.payload);
      })
      .addCase(addExpense.rejected, (state, action) => { state.loading.addExpense = false; state.error.addExpense = action.payload; });

    // deleteExpense
    builder
      .addCase(deleteExpense.pending, (state) => { state.loading.deleteExpense = true; state.error.deleteExpense = null; })
      .addCase(deleteExpense.fulfilled, (state, action) => {
        state.loading.deleteExpense = false;
        state.expenses.data = state.expenses.data.filter((e) => e.id !== action.payload);
      })
      .addCase(deleteExpense.rejected, (state, action) => { state.loading.deleteExpense = false; state.error.deleteExpense = action.payload; });
  },
});

export default accountsPayableSlice.reducer;
