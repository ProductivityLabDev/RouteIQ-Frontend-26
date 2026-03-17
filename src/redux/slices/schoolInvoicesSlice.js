import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { schoolInvoicesService } from "@/services/schoolInvoicesService";

export const fetchInvoiceTerminals = createAsyncThunk(
  "schoolInvoices/fetchInvoiceTerminals",
  async (_, { rejectWithValue }) => {
    try {
      const res = await schoolInvoicesService.getTerminals();
      return res.data;
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || "Failed to fetch terminals");
    }
  }
);

export const fetchSchoolsByTerminal = createAsyncThunk(
  "schoolInvoices/fetchSchoolsByTerminal",
  async ({ terminalId, ...params }, { rejectWithValue }) => {
    try {
      const res = await schoolInvoicesService.getSchoolsByTerminal(terminalId, params);
      return res.data;
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || "Failed to fetch schools");
    }
  }
);

export const fetchSchoolInvoices = createAsyncThunk(
  "schoolInvoices/fetchSchoolInvoices",
  async (params = {}, { rejectWithValue }) => {
    try {
      const res = await schoolInvoicesService.getInvoices(params);
      return res.data;
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || "Failed to fetch invoices");
    }
  }
);

export const createSchoolInvoice = createAsyncThunk(
  "schoolInvoices/createSchoolInvoice",
  async (data, { rejectWithValue }) => {
    try {
      const res = await schoolInvoicesService.createInvoice(data);
      return res.data;
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || "Failed to create invoice");
    }
  }
);

export const batchSchoolInvoice = createAsyncThunk(
  "schoolInvoices/batchSchoolInvoice",
  async (data, { rejectWithValue }) => {
    try {
      const res = await schoolInvoicesService.batchInvoice(data);
      return res.data;
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || "Failed to create batch invoice");
    }
  }
);

export const sendSchoolInvoice = createAsyncThunk(
  "schoolInvoices/sendSchoolInvoice",
  async (id, { rejectWithValue }) => {
    try {
      await schoolInvoicesService.sendInvoice(id);
      return id;
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || "Failed to send invoice");
    }
  }
);

export const importSchoolInvoices = createAsyncThunk(
  "schoolInvoices/importSchoolInvoices",
  async (file, { rejectWithValue }) => {
    try {
      const res = await schoolInvoicesService.importInvoices(file);
      return res.data;
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || "Failed to import invoices");
    }
  }
);

export const deleteSchoolInvoice = createAsyncThunk(
  "schoolInvoices/deleteSchoolInvoice",
  async (id, { rejectWithValue }) => {
    try {
      await schoolInvoicesService.deleteInvoice(id);
      return id;
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || "Failed to delete invoice");
    }
  }
);

export const exportSchoolInvoice = createAsyncThunk(
  "schoolInvoices/exportSchoolInvoice",
  async ({ id, format }, { rejectWithValue }) => {
    try {
      const blob = await schoolInvoicesService.exportInvoice(id, format);
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `invoice-${id}.${format}`;
      a.click();
      window.URL.revokeObjectURL(url);
      return id;
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || "Failed to export invoice");
    }
  }
);

const schoolInvoicesSlice = createSlice({
  name: "schoolInvoices",
  initialState: {
    terminals: [],
    schools: { total: 0, data: [] },
    invoices: { total: 0, data: [] },
    loading: { terminals: false, schools: false, invoices: false, send: false, delete: false, export: false, import: false, create: false },
    error: { terminals: null, schools: null, invoices: null },
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchInvoiceTerminals.pending, (state) => { state.loading.terminals = true; state.error.terminals = null; })
      .addCase(fetchInvoiceTerminals.fulfilled, (state, action) => { state.loading.terminals = false; state.terminals = action.payload || []; })
      .addCase(fetchInvoiceTerminals.rejected, (state, action) => { state.loading.terminals = false; state.error.terminals = action.payload; });

    builder
      .addCase(fetchSchoolsByTerminal.pending, (state) => { state.loading.schools = true; state.error.schools = null; state.schools = { total: 0, data: [] }; })
      .addCase(fetchSchoolsByTerminal.fulfilled, (state, action) => { state.loading.schools = false; state.schools = action.payload || state.schools; })
      .addCase(fetchSchoolsByTerminal.rejected, (state, action) => { state.loading.schools = false; state.error.schools = action.payload; });

    builder
      .addCase(fetchSchoolInvoices.pending, (state) => { state.loading.invoices = true; state.invoices = { total: 0, data: [] }; })
      .addCase(fetchSchoolInvoices.fulfilled, (state, action) => { state.loading.invoices = false; state.invoices = action.payload || state.invoices; })
      .addCase(fetchSchoolInvoices.rejected, (state, action) => { state.loading.invoices = false; });

    builder
      .addCase(createSchoolInvoice.pending, (state) => { state.loading.create = true; })
      .addCase(createSchoolInvoice.fulfilled, (state, action) => { state.loading.create = false; if (action.payload) state.invoices.data.unshift(action.payload); })
      .addCase(createSchoolInvoice.rejected, (state) => { state.loading.create = false; });

    builder
      .addCase(sendSchoolInvoice.pending, (state) => { state.loading.send = true; })
      .addCase(sendSchoolInvoice.fulfilled, (state, action) => {
        state.loading.send = false;
        const inv = state.invoices.data.find((i) => i.invoiceId === action.payload);
        if (inv) inv.status = "Invoice Sent";
      })
      .addCase(sendSchoolInvoice.rejected, (state) => { state.loading.send = false; });

    builder
      .addCase(deleteSchoolInvoice.pending, (state) => { state.loading.delete = true; })
      .addCase(deleteSchoolInvoice.fulfilled, (state, action) => {
        state.loading.delete = false;
        state.invoices.data = state.invoices.data.filter((i) => i.invoiceId !== action.payload);
      })
      .addCase(deleteSchoolInvoice.rejected, (state) => { state.loading.delete = false; });

    builder
      .addCase(exportSchoolInvoice.pending, (state) => { state.loading.export = true; })
      .addCase(exportSchoolInvoice.fulfilled, (state) => { state.loading.export = false; })
      .addCase(exportSchoolInvoice.rejected, (state) => { state.loading.export = false; });

    builder
      .addCase(importSchoolInvoices.pending, (state) => { state.loading.import = true; })
      .addCase(importSchoolInvoices.fulfilled, (state) => { state.loading.import = false; })
      .addCase(importSchoolInvoices.rejected, (state) => { state.loading.import = false; });
  },
});

export default schoolInvoicesSlice.reducer;
