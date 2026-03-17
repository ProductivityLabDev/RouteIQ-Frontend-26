import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { terminalTabService } from "@/services/terminalTabService";

export const fetchTerminalSummary = createAsyncThunk(
  "terminalTab/fetchSummary",
  async (_, { rejectWithValue }) => {
    try {
      const res = await terminalTabService.getSummary();
      return res.data;
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || "Failed to fetch summary");
    }
  }
);

export const fetchTerminalList = createAsyncThunk(
  "terminalTab/fetchList",
  async (_, { rejectWithValue }) => {
    try {
      const res = await terminalTabService.getList();
      return res.data;
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || "Failed to fetch terminals");
    }
  }
);

export const fetchTerminalInvoices = createAsyncThunk(
  "terminalTab/fetchInvoices",
  async (params = {}, { rejectWithValue }) => {
    try {
      const res = await terminalTabService.getInvoices(params);
      return { terminalId: params.terminalId, data: res.data };
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || "Failed to fetch invoices");
    }
  }
);

export const createTerminalInvoice = createAsyncThunk(
  "terminalTab/createInvoice",
  async (payload, { rejectWithValue }) => {
    try {
      const res = await terminalTabService.createInvoice(payload);
      return { terminalId: payload.terminalId, invoice: res.data };
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || "Failed to create invoice");
    }
  }
);

export const deleteTerminalInvoice = createAsyncThunk(
  "terminalTab/deleteInvoice",
  async ({ id, terminalId }, { rejectWithValue }) => {
    try {
      await terminalTabService.deleteInvoice(id);
      return { id, terminalId };
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || "Failed to delete invoice");
    }
  }
);

export const fetchTerminalTrack = createAsyncThunk(
  "terminalTab/fetchTrack",
  async ({ terminalId, year }, { rejectWithValue }) => {
    try {
      const res = await terminalTabService.getTrack(terminalId, year);
      return { terminalId, data: res.data };
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || "Failed to fetch track data");
    }
  }
);

const terminalTabSlice = createSlice({
  name: "terminalTab",
  initialState: {
    summary: null,
    list: [],
    invoices: {},   // keyed by terminalId: { total, items }
    trackData: {},  // keyed by terminalId
    loading: {
      summary: false,
      list: false,
      invoices: false,
      createInvoice: false,
      deleteInvoice: false,
      track: false,
    },
    error: {
      summary: null,
      list: null,
      invoices: null,
      createInvoice: null,
      deleteInvoice: null,
      track: null,
    },
  },
  reducers: {},
  extraReducers: (builder) => {
    // Summary
    builder
      .addCase(fetchTerminalSummary.pending, (state) => {
        state.loading.summary = true;
        state.error.summary = null;
      })
      .addCase(fetchTerminalSummary.fulfilled, (state, action) => {
        state.loading.summary = false;
        state.summary = action.payload || null;
      })
      .addCase(fetchTerminalSummary.rejected, (state, action) => {
        state.loading.summary = false;
        state.error.summary = action.payload;
      });

    // List
    builder
      .addCase(fetchTerminalList.pending, (state) => {
        state.loading.list = true;
        state.error.list = null;
      })
      .addCase(fetchTerminalList.fulfilled, (state, action) => {
        state.loading.list = false;
        state.list = action.payload || [];
      })
      .addCase(fetchTerminalList.rejected, (state, action) => {
        state.loading.list = false;
        state.error.list = action.payload;
      });

    // Invoices
    builder
      .addCase(fetchTerminalInvoices.pending, (state) => {
        state.loading.invoices = true;
        state.error.invoices = null;
      })
      .addCase(fetchTerminalInvoices.fulfilled, (state, action) => {
        state.loading.invoices = false;
        const key = action.payload.terminalId ?? "all";
        state.invoices[key] = action.payload.data || { total: 0, items: [] };
      })
      .addCase(fetchTerminalInvoices.rejected, (state, action) => {
        state.loading.invoices = false;
        state.error.invoices = action.payload;
      });

    // Create Invoice
    builder
      .addCase(createTerminalInvoice.pending, (state) => {
        state.loading.createInvoice = true;
        state.error.createInvoice = null;
      })
      .addCase(createTerminalInvoice.fulfilled, (state, action) => {
        state.loading.createInvoice = false;
        const key = action.payload.terminalId ?? "all";
        if (!state.invoices[key]) state.invoices[key] = { total: 0, items: [] };
        if (action.payload.invoice) {
          state.invoices[key].items.unshift(action.payload.invoice);
          state.invoices[key].total += 1;
        }
      })
      .addCase(createTerminalInvoice.rejected, (state, action) => {
        state.loading.createInvoice = false;
        state.error.createInvoice = action.payload;
      });

    // Delete Invoice
    builder
      .addCase(deleteTerminalInvoice.pending, (state) => {
        state.loading.deleteInvoice = true;
        state.error.deleteInvoice = null;
      })
      .addCase(deleteTerminalInvoice.fulfilled, (state, action) => {
        state.loading.deleteInvoice = false;
        const key = action.payload.terminalId ?? "all";
        if (state.invoices[key]) {
          state.invoices[key].items = state.invoices[key].items.filter(
            (inv) => inv.id !== action.payload.id
          );
          state.invoices[key].total = Math.max(0, state.invoices[key].total - 1);
        }
      })
      .addCase(deleteTerminalInvoice.rejected, (state, action) => {
        state.loading.deleteInvoice = false;
        state.error.deleteInvoice = action.payload;
      });

    // Track
    builder
      .addCase(fetchTerminalTrack.pending, (state) => {
        state.loading.track = true;
        state.error.track = null;
      })
      .addCase(fetchTerminalTrack.fulfilled, (state, action) => {
        state.loading.track = false;
        state.trackData[action.payload.terminalId] = action.payload.data || {};
      })
      .addCase(fetchTerminalTrack.rejected, (state, action) => {
        state.loading.track = false;
        state.error.track = action.payload;
      });
  },
});

export default terminalTabSlice.reducer;
