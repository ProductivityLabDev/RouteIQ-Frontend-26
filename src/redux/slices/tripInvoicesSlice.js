import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { tripInvoicesService } from "@/services/tripInvoicesService";

export const fetchTripInvoiceTerminals = createAsyncThunk(
  "tripInvoices/fetchTerminals",
  async (_, { rejectWithValue }) => {
    try {
      const res = await tripInvoicesService.getTerminals();
      return res.data;
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || "Failed to fetch terminals");
    }
  }
);

export const fetchTripInvoices = createAsyncThunk(
  "tripInvoices/fetchInvoices",
  async (params = {}, { rejectWithValue }) => {
    try {
      const res = await tripInvoicesService.getInvoices(params);
      return res.data;
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || "Failed to fetch invoices");
    }
  }
);

export const sendTripInvoice = createAsyncThunk(
  "tripInvoices/sendInvoice",
  async (id, { rejectWithValue }) => {
    try {
      await tripInvoicesService.sendInvoice(id);
      return id;
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || "Failed to send invoice");
    }
  }
);

export const importTripInvoices = createAsyncThunk(
  "tripInvoices/importInvoices",
  async (file, { rejectWithValue }) => {
    try {
      const res = await tripInvoicesService.importInvoices(file);
      return res.data;
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || "Failed to import invoices");
    }
  }
);

export const deleteTripInvoice = createAsyncThunk(
  "tripInvoices/deleteInvoice",
  async (id, { rejectWithValue }) => {
    try {
      await tripInvoicesService.deleteInvoice(id);
      return id;
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || "Failed to delete invoice");
    }
  }
);

export const exportTripInvoice = createAsyncThunk(
  "tripInvoices/exportInvoice",
  async ({ id, format }, { rejectWithValue }) => {
    try {
      const blob = await tripInvoicesService.exportInvoice(id, format);
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `trip-invoice-${id}.${format}`;
      a.click();
      window.URL.revokeObjectURL(url);
      return id;
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || "Failed to export invoice");
    }
  }
);

export const batchTripInvoice = createAsyncThunk(
  "tripInvoices/batchInvoice",
  async (data, { rejectWithValue }) => {
    try {
      const res = await tripInvoicesService.batchInvoice(data);
      return res.data;
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || "Failed to batch invoice");
    }
  }
);

const tripInvoicesSlice = createSlice({
  name: "tripInvoices",
  initialState: {
    terminals: [],
    invoices: { total: 0, data: [] },
    loading: { terminals: false, invoices: false, send: false, delete: false, export: false, import: false },
    error: { terminals: null, invoices: null },
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchTripInvoiceTerminals.pending, (state) => { state.loading.terminals = true; state.error.terminals = null; })
      .addCase(fetchTripInvoiceTerminals.fulfilled, (state, action) => { state.loading.terminals = false; state.terminals = action.payload || []; })
      .addCase(fetchTripInvoiceTerminals.rejected, (state, action) => { state.loading.terminals = false; state.error.terminals = action.payload; });

    builder
      .addCase(fetchTripInvoices.pending, (state) => { state.loading.invoices = true; state.invoices = { total: 0, data: [] }; })
      .addCase(fetchTripInvoices.fulfilled, (state, action) => { state.loading.invoices = false; state.invoices = action.payload || state.invoices; })
      .addCase(fetchTripInvoices.rejected, (state, action) => { state.loading.invoices = false; state.error.invoices = action.payload; });

    builder
      .addCase(sendTripInvoice.pending, (state) => { state.loading.send = true; })
      .addCase(sendTripInvoice.fulfilled, (state, action) => {
        state.loading.send = false;
        const inv = state.invoices.data.find((i) => i.invoiceId === action.payload);
        if (inv) inv.status = "Invoice Sent";
      })
      .addCase(sendTripInvoice.rejected, (state) => { state.loading.send = false; });

    builder
      .addCase(deleteTripInvoice.pending, (state) => { state.loading.delete = true; })
      .addCase(deleteTripInvoice.fulfilled, (state, action) => {
        state.loading.delete = false;
        state.invoices.data = state.invoices.data.filter((i) => i.invoiceId !== action.payload);
      })
      .addCase(deleteTripInvoice.rejected, (state) => { state.loading.delete = false; });

    builder
      .addCase(exportTripInvoice.pending, (state) => { state.loading.export = true; })
      .addCase(exportTripInvoice.fulfilled, (state) => { state.loading.export = false; })
      .addCase(exportTripInvoice.rejected, (state) => { state.loading.export = false; });

    builder
      .addCase(importTripInvoices.pending, (state) => { state.loading.import = true; })
      .addCase(importTripInvoices.fulfilled, (state) => { state.loading.import = false; })
      .addCase(importTripInvoices.rejected, (state) => { state.loading.import = false; });
  },
});

export default tripInvoicesSlice.reducer;
