import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { reportsService } from "@/services/reportsService";

export const fetchGenerateReport = createAsyncThunk(
  "reports/fetchGenerateReport",
  async (params = {}, { rejectWithValue }) => {
    try {
      const res = await reportsService.getGenerateReport(params);
      return res.data;
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || "Failed to fetch report");
    }
  }
);

const reportsSlice = createSlice({
  name: "reports",
  initialState: {
    generateReport: { total: 0, items: [] },
    loading: { generateReport: false },
    error: { generateReport: null },
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchGenerateReport.pending, (state) => {
        state.loading.generateReport = true;
        state.error.generateReport = null;
        state.generateReport = { total: 0, items: [] };
      })
      .addCase(fetchGenerateReport.fulfilled, (state, action) => {
        state.loading.generateReport = false;
        state.generateReport = action.payload || { total: 0, items: [] };
      })
      .addCase(fetchGenerateReport.rejected, (state, action) => {
        state.loading.generateReport = false;
        state.error.generateReport = action.payload;
      });
  },
});

export default reportsSlice.reducer;
