import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { balanceSheetService } from "@/services/balanceSheetService";

export const fetchBalanceSheet = createAsyncThunk(
  "balanceSheet/fetchBalanceSheet",
  async (_, { rejectWithValue }) => {
    try {
      const res = await balanceSheetService.getBalanceSheet();
      return res.data;
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || "Failed to fetch balance sheet");
    }
  }
);

export const fetchBalanceSheetSummary = createAsyncThunk(
  "balanceSheet/fetchSummary",
  async ({ startDate, endDate } = {}, { rejectWithValue }) => {
    try {
      const res = await balanceSheetService.getSummary(startDate, endDate);
      return res.data;
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || "Failed to fetch summary");
    }
  }
);

export const fetchBalanceSheetChart = createAsyncThunk(
  "balanceSheet/fetchChart",
  async ({ year } = {}, { rejectWithValue }) => {
    try {
      const res = await balanceSheetService.getChartData(year);
      return res.data;
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || "Failed to fetch chart data");
    }
  }
);

export const addBalanceSheetEntry = createAsyncThunk(
  "balanceSheet/addEntry",
  async ({ section, label, amount, sortOrder = 0 }, { rejectWithValue }) => {
    try {
      const res = await balanceSheetService.addEntry({ section, label, amount, sortOrder });
      return { section, entry: res.data };
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || "Failed to add entry");
    }
  }
);

export const updateBalanceSheetEntry = createAsyncThunk(
  "balanceSheet/updateEntry",
  async ({ id, section, label, amount, sortOrder }, { rejectWithValue }) => {
    try {
      await balanceSheetService.updateEntry(id, { label, amount, sortOrder });
      return { id, section, label, amount, sortOrder };
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || "Failed to update entry");
    }
  }
);

export const deleteBalanceSheetEntry = createAsyncThunk(
  "balanceSheet/deleteEntry",
  async ({ id, section }, { rejectWithValue }) => {
    try {
      await balanceSheetService.deleteEntry(id);
      return { id, section };
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || "Failed to delete entry");
    }
  }
);

const balanceSheetSlice = createSlice({
  name: "balanceSheet",
  initialState: {
    sections: {
      CurrentAssets: [],
      NonCurrentAssets: [],
      CurrentLiabilities: [],
      NonCurrentLiabilities: [],
    },
    summary: null,
    chartData: [],
    loading: {
      sections: false,
      summary: false,
      chartData: false,
      addEntry: false,
      updateEntry: false,
      deleteEntry: false,
    },
    error: { sections: null, summary: null, chartData: null },
  },
  reducers: {},
  extraReducers: (builder) => {
    // fetchBalanceSheet
    builder
      .addCase(fetchBalanceSheet.pending, (state) => { state.loading.sections = true; state.error.sections = null; })
      .addCase(fetchBalanceSheet.fulfilled, (state, action) => {
        state.loading.sections = false;
        if (action.payload) {
          state.sections.CurrentAssets = action.payload.CurrentAssets || [];
          state.sections.NonCurrentAssets = action.payload.NonCurrentAssets || [];
          state.sections.CurrentLiabilities = action.payload.CurrentLiabilities || [];
          state.sections.NonCurrentLiabilities = action.payload.NonCurrentLiabilities || [];
        }
      })
      .addCase(fetchBalanceSheet.rejected, (state, action) => { state.loading.sections = false; state.error.sections = action.payload; });

    // fetchSummary
    builder
      .addCase(fetchBalanceSheetSummary.pending, (state) => { state.loading.summary = true; state.error.summary = null; })
      .addCase(fetchBalanceSheetSummary.fulfilled, (state, action) => { state.loading.summary = false; state.summary = action.payload; })
      .addCase(fetchBalanceSheetSummary.rejected, (state, action) => { state.loading.summary = false; state.error.summary = action.payload; });

    // fetchChart
    builder
      .addCase(fetchBalanceSheetChart.pending, (state) => { state.loading.chartData = true; state.error.chartData = null; })
      .addCase(fetchBalanceSheetChart.fulfilled, (state, action) => { state.loading.chartData = false; state.chartData = action.payload || []; })
      .addCase(fetchBalanceSheetChart.rejected, (state, action) => { state.loading.chartData = false; state.error.chartData = action.payload; });

    // addEntry
    builder
      .addCase(addBalanceSheetEntry.pending, (state) => { state.loading.addEntry = true; })
      .addCase(addBalanceSheetEntry.fulfilled, (state, action) => {
        state.loading.addEntry = false;
        const { section, entry } = action.payload;
        if (entry && state.sections[section]) {
          state.sections[section].push(entry);
        }
      })
      .addCase(addBalanceSheetEntry.rejected, (state) => { state.loading.addEntry = false; });

    // updateEntry
    builder
      .addCase(updateBalanceSheetEntry.pending, (state) => { state.loading.updateEntry = true; })
      .addCase(updateBalanceSheetEntry.fulfilled, (state, action) => {
        state.loading.updateEntry = false;
        const { id, section, label, amount } = action.payload;
        const items = state.sections[section];
        if (items) {
          const item = items.find((i) => i.id === id);
          if (item) {
            if (label !== undefined) item.label = label;
            if (amount !== undefined) item.amount = amount;
          }
        }
      })
      .addCase(updateBalanceSheetEntry.rejected, (state) => { state.loading.updateEntry = false; });

    // deleteEntry
    builder
      .addCase(deleteBalanceSheetEntry.pending, (state) => { state.loading.deleteEntry = true; })
      .addCase(deleteBalanceSheetEntry.fulfilled, (state, action) => {
        state.loading.deleteEntry = false;
        const { id, section } = action.payload;
        if (state.sections[section]) {
          state.sections[section] = state.sections[section].filter((i) => i.id !== id);
        }
      })
      .addCase(deleteBalanceSheetEntry.rejected, (state) => { state.loading.deleteEntry = false; });
  },
});

export default balanceSheetSlice.reducer;
