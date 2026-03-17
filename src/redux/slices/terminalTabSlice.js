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

export const fetchTerminalTrack = createAsyncThunk(
  "terminalTab/fetchTrack",
  async ({ terminalId, year }, { rejectWithValue }) => {
    try {
      const res = await terminalTabService.getTrack(terminalId, year);
      return { terminalId, year, data: res.data };
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || "Failed to fetch track data");
    }
  }
);

export const fetchTerminalInvoices = createAsyncThunk(
  "terminalTab/fetchInvoices",
  async (params = {}, { rejectWithValue }) => {
    try {
      const res = await terminalTabService.getInvoices(params);
      return res.data;
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || "Failed to fetch terminal invoices");
    }
  }
);

export const createTerminalInvoice = createAsyncThunk(
  "terminalTab/createInvoice",
  async (data, { rejectWithValue }) => {
    try {
      const res = await terminalTabService.createInvoice(data);
      return res.data;
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || "Failed to create terminal invoice");
    }
  }
);

export const fetchTerminalInvoiceById = createAsyncThunk(
  "terminalTab/fetchInvoiceById",
  async (id, { rejectWithValue }) => {
    try {
      const res = await terminalTabService.getInvoiceById(id);
      return res.data;
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || "Failed to fetch terminal invoice");
    }
  }
);

export const deleteTerminalInvoice = createAsyncThunk(
  "terminalTab/deleteInvoice",
  async (id, { rejectWithValue }) => {
    try {
      await terminalTabService.deleteInvoice(id);
      return id;
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || "Failed to delete terminal invoice");
    }
  }
);

const terminalTabSlice = createSlice({
  name: "terminalTab",
  initialState: {
    summary: null,
    list: [],
    trackData: {},  // keyed by terminalId
    invoices: { total: 0, data: [] },
    selectedInvoice: null,
    loading: {
      summary: false,
      list: false,
      track: false,
      invoices: false,
      invoiceDetail: false,
      create: false,
      delete: false,
    },
    error: {
      summary: null,
      list: null,
      track: null,
      invoices: null,
      invoiceDetail: null,
      create: null,
      delete: null,
    },
  },
  reducers: {},
  extraReducers: (builder) => {
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

    builder
      .addCase(fetchTerminalTrack.pending, (state) => {
        state.loading.track = true;
        state.error.track = null;
      })
      .addCase(fetchTerminalTrack.fulfilled, (state, action) => {
        state.loading.track = false;
        const trackKey = `${action.payload.terminalId}_${action.payload.year}`;
        state.trackData[trackKey] = action.payload.data || {};
      })
      .addCase(fetchTerminalTrack.rejected, (state, action) => {
        state.loading.track = false;
        state.error.track = action.payload;
      });

    builder
      .addCase(fetchTerminalInvoices.pending, (state) => {
        state.loading.invoices = true;
        state.error.invoices = null;
        state.invoices = { total: 0, data: [] };
      })
      .addCase(fetchTerminalInvoices.fulfilled, (state, action) => {
        state.loading.invoices = false;
        state.invoices = action.payload || state.invoices;
      })
      .addCase(fetchTerminalInvoices.rejected, (state, action) => {
        state.loading.invoices = false;
        state.error.invoices = action.payload;
      });

    builder
      .addCase(fetchTerminalInvoiceById.pending, (state) => {
        state.loading.invoiceDetail = true;
        state.error.invoiceDetail = null;
      })
      .addCase(fetchTerminalInvoiceById.fulfilled, (state, action) => {
        state.loading.invoiceDetail = false;
        state.selectedInvoice = action.payload || null;
      })
      .addCase(fetchTerminalInvoiceById.rejected, (state, action) => {
        state.loading.invoiceDetail = false;
        state.error.invoiceDetail = action.payload;
      });

    builder
      .addCase(createTerminalInvoice.pending, (state) => {
        state.loading.create = true;
        state.error.create = null;
      })
      .addCase(createTerminalInvoice.fulfilled, (state, action) => {
        state.loading.create = false;
        if (action.payload) {
          state.invoices.data.unshift(action.payload);
          state.invoices.total += 1;
        }
      })
      .addCase(createTerminalInvoice.rejected, (state, action) => {
        state.loading.create = false;
        state.error.create = action.payload;
      });

    builder
      .addCase(deleteTerminalInvoice.pending, (state) => {
        state.loading.delete = true;
        state.error.delete = null;
      })
      .addCase(deleteTerminalInvoice.fulfilled, (state, action) => {
        state.loading.delete = false;
        state.invoices.data = state.invoices.data.filter((invoice) => {
          const id = invoice.id ?? invoice.invoiceId;
          return id !== action.payload;
        });
        state.invoices.total = Math.max(0, state.invoices.total - 1);
      })
      .addCase(deleteTerminalInvoice.rejected, (state, action) => {
        state.loading.delete = false;
        state.error.delete = action.payload;
      });
  },
});

export default terminalTabSlice.reducer;
