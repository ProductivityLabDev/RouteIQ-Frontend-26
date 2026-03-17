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

const terminalTabSlice = createSlice({
  name: "terminalTab",
  initialState: {
    summary: null,
    list: [],
    loading: {
      summary: false,
      list: false,
    },
    error: {
      summary: null,
      list: null,
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
  },
});

export default terminalTabSlice.reducer;
