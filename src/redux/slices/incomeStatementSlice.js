import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { incomeStatementService } from "@/services/incomeStatementService";

export const fetchIncomeStatement = createAsyncThunk(
  "incomeStatement/fetchStatement",
  async ({ startDate, endDate } = {}, { rejectWithValue }) => {
    try {
      const res = await incomeStatementService.getIncomeStatement(startDate, endDate);
      return res.data;
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || "Failed to fetch income statement");
    }
  }
);

export const fetchIncomeStatementChart = createAsyncThunk(
  "incomeStatement/fetchChart",
  async ({ year } = {}, { rejectWithValue }) => {
    try {
      const res = await incomeStatementService.getIncomeStatementChart(year);
      return res.data;
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || "Failed to fetch income statement chart");
    }
  }
);

const incomeStatementSlice = createSlice({
  name: "incomeStatement",
  initialState: {
    statement: null,
    chartData: [],
    loading: {
      statement: false,
      chartData: false,
    },
    error: {
      statement: null,
      chartData: null,
    },
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchIncomeStatement.pending, (state) => {
        state.loading.statement = true;
        state.error.statement = null;
      })
      .addCase(fetchIncomeStatement.fulfilled, (state, action) => {
        state.loading.statement = false;
        state.statement = action.payload || null;
      })
      .addCase(fetchIncomeStatement.rejected, (state, action) => {
        state.loading.statement = false;
        state.error.statement = action.payload;
      })
      .addCase(fetchIncomeStatementChart.pending, (state) => {
        state.loading.chartData = true;
        state.error.chartData = null;
      })
      .addCase(fetchIncomeStatementChart.fulfilled, (state, action) => {
        state.loading.chartData = false;
        state.chartData = action.payload || [];
      })
      .addCase(fetchIncomeStatementChart.rejected, (state, action) => {
        state.loading.chartData = false;
        state.error.chartData = action.payload;
      });
  },
});

export default incomeStatementSlice.reducer;
