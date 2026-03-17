import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { accountsReceivableService } from "@/services/accountsReceivableService";

// ─── Thunks ───────────────────────────────────────────────────────────────────

export const fetchInvoices = createAsyncThunk(
  "accountsReceivable/fetchInvoices",
  async (params = {}, { rejectWithValue }) => {
    try {
      const res = await accountsReceivableService.getInvoices(params);
      return res.data;
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || "Failed to fetch invoices");
    }
  }
);

export const fetchInvoiceDetail = createAsyncThunk(
  "accountsReceivable/fetchInvoiceDetail",
  async (id, { rejectWithValue }) => {
    try {
      const res = await accountsReceivableService.getInvoiceDetail(id);
      return res.data;
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || "Failed to fetch invoice detail");
    }
  }
);

export const markInvoicePaid = createAsyncThunk(
  "accountsReceivable/markInvoicePaid",
  async (id, { rejectWithValue }) => {
    try {
      await accountsReceivableService.markInvoicePaid(id);
      return id;
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || "Failed to mark invoice as paid");
    }
  }
);

// ─── Slice ────────────────────────────────────────────────────────────────────

const accountsReceivableSlice = createSlice({
  name: "accountsReceivable",
  initialState: {
    invoices: { total: 0, data: [], limit: 20, offset: 0 },
    invoiceDetail: null,
    loading: {
      invoices: false,
      invoiceDetail: false,
      markPaid: false,
    },
    error: {
      invoices: null,
      invoiceDetail: null,
      markPaid: null,
    },
  },
  reducers: {
    clearInvoiceDetail: (state) => { state.invoiceDetail = null; },
  },
  extraReducers: (builder) => {
    // fetchInvoices
    builder
      .addCase(fetchInvoices.pending, (state) => { state.loading.invoices = true; state.error.invoices = null; })
      .addCase(fetchInvoices.fulfilled, (state, action) => { state.loading.invoices = false; state.invoices = action.payload || state.invoices; })
      .addCase(fetchInvoices.rejected, (state, action) => { state.loading.invoices = false; state.error.invoices = action.payload; });

    // fetchInvoiceDetail
    builder
      .addCase(fetchInvoiceDetail.pending, (state) => { state.loading.invoiceDetail = true; state.error.invoiceDetail = null; })
      .addCase(fetchInvoiceDetail.fulfilled, (state, action) => { state.loading.invoiceDetail = false; state.invoiceDetail = action.payload; })
      .addCase(fetchInvoiceDetail.rejected, (state, action) => { state.loading.invoiceDetail = false; state.error.invoiceDetail = action.payload; });

    // markInvoicePaid
    builder
      .addCase(markInvoicePaid.pending, (state) => { state.loading.markPaid = true; state.error.markPaid = null; })
      .addCase(markInvoicePaid.fulfilled, (state, action) => {
        state.loading.markPaid = false;
        const invoice = state.invoices.data.find((i) => i.id === action.payload);
        if (invoice) invoice.status = "Paid";
      })
      .addCase(markInvoicePaid.rejected, (state, action) => { state.loading.markPaid = false; state.error.markPaid = action.payload; });
  },
});

export const { clearInvoiceDetail } = accountsReceivableSlice.actions;
export default accountsReceivableSlice.reducer;
