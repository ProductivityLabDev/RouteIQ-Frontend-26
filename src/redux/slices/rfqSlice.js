import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { rfqService } from "@/services/rfqService";

export const fetchRFQs = createAsyncThunk(
  "rfq/fetchRFQs",
  async (_, { rejectWithValue }) => {
    try {
      const data = await rfqService.getAllRFQs();
      return data?.data ?? data;
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || "Failed to fetch RFQs");
    }
  }
);

export const updateRFQStatus = createAsyncThunk(
  "rfq/updateStatus",
  async ({ id, payload }, { rejectWithValue }) => {
    try {
      const data = await rfqService.updateRFQStatus(id, payload);
      return { id, ...payload, response: data };
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || "Failed to update RFQ status");
    }
  }
);

const rfqSlice = createSlice({
  name: "rfq",
  initialState: {
    rfqs: [],
    loading: false,
    updating: false,
    error: null,
    updateError: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchRFQs.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchRFQs.fulfilled, (state, action) => {
        state.loading = false;
        state.rfqs = Array.isArray(action.payload) ? action.payload : [];
      })
      .addCase(fetchRFQs.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(updateRFQStatus.pending, (state) => {
        state.updating = true;
        state.updateError = null;
      })
      .addCase(updateRFQStatus.fulfilled, (state, action) => {
        state.updating = false;
        const { id, status } = action.payload;
        const idx = state.rfqs.findIndex((r) => r.id === id);
        if (idx !== -1) {
          state.rfqs[idx] = { ...state.rfqs[idx], status };
        }
      })
      .addCase(updateRFQStatus.rejected, (state, action) => {
        state.updating = false;
        state.updateError = action.payload;
      });
  },
});

export default rfqSlice.reducer;
