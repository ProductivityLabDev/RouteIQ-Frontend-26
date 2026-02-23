import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { vendorService } from "@/services/vendorService";

// ─── Async Thunks ─────────────────────────────────────────────────────────────

export const fetchVendorStats = createAsyncThunk(
  "vendorDashboard/fetchStats",
  async (_, { rejectWithValue }) => {
    try {
      const response = await vendorService.getDashboardStats();
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to fetch dashboard stats"
      );
    }
  }
);

export const fetchVendorSchools = createAsyncThunk(
  "vendorDashboard/fetchSchools",
  async (params = {}, { rejectWithValue }) => {
    try {
      const response = await vendorService.getSchools(params);
      return { data: response.data, total: response.total };
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to fetch schools"
      );
    }
  }
);

export const fetchVendorDrivers = createAsyncThunk(
  "vendorDashboard/fetchDrivers",
  async (params = {}, { rejectWithValue }) => {
    try {
      const response = await vendorService.getDrivers(params);
      return { data: response.data, total: response.total };
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to fetch drivers"
      );
    }
  }
);

// ─── Slice ────────────────────────────────────────────────────────────────────

const initialState = {
  stats:   null,   // { vehicles, schools, trips }
  schools: [],
  schoolsTotal: 0,
  drivers: [],
  driversTotal: 0,
  loading: { stats: false, schools: false, drivers: false },
  error:   { stats: null,  schools: null,  drivers: null  },
};

const vendorDashboardSlice = createSlice({
  name: "vendorDashboard",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      // ── fetchVendorStats ──────────────────────────────────────────────────
      .addCase(fetchVendorStats.pending, (state) => {
        state.loading.stats = true;
        state.error.stats   = null;
      })
      .addCase(fetchVendorStats.fulfilled, (state, action) => {
        state.loading.stats = false;
        state.stats         = action.payload;
      })
      .addCase(fetchVendorStats.rejected, (state, action) => {
        state.loading.stats = false;
        state.error.stats   = action.payload;
      })

      // ── fetchVendorSchools ────────────────────────────────────────────────
      .addCase(fetchVendorSchools.pending, (state) => {
        state.loading.schools = true;
        state.error.schools   = null;
      })
      .addCase(fetchVendorSchools.fulfilled, (state, action) => {
        state.loading.schools = false;
        state.schools         = action.payload.data;
        state.schoolsTotal    = action.payload.total;
      })
      .addCase(fetchVendorSchools.rejected, (state, action) => {
        state.loading.schools = false;
        state.error.schools   = action.payload;
      })

      // ── fetchVendorDrivers ────────────────────────────────────────────────
      .addCase(fetchVendorDrivers.pending, (state) => {
        state.loading.drivers = true;
        state.error.drivers   = null;
      })
      .addCase(fetchVendorDrivers.fulfilled, (state, action) => {
        state.loading.drivers = false;
        state.drivers         = action.payload.data;
        state.driversTotal    = action.payload.total;
      })
      .addCase(fetchVendorDrivers.rejected, (state, action) => {
        state.loading.drivers = false;
        state.error.drivers   = action.payload;
      });
  },
});

export default vendorDashboardSlice.reducer;
