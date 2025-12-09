import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import { BASE_URL, getAxiosConfig, getAuthToken } from "@/configs/api";
import { decodeToken } from "@/redux/authHelper";

// Async thunk to create a route
export const createRoute = createAsyncThunk(
  "routes/createRoute",
  async (routeData, { rejectWithValue }) => {
    try {
      console.log("🔄 [Redux] Creating route...", routeData);

      // Get token for auth (and optionally user context)
      const token = getAuthToken();
      if (!token) {
        console.error("❌ [Redux] No token found, cannot create route.");
        return rejectWithValue("Authentication token not found");
      }

      // Optional: decode token if we ever need vendorId / instituteId etc.
      try {
        const decoded = decodeToken(token);
        console.log("👤 [Redux] Decoded token for createRoute:", decoded);
      } catch (err) {
        console.warn("⚠️ [Redux] Failed to decode token for createRoute:", err);
      }

      // Map frontend payload to DTO that backend expects
      // Backend expects: pickup, dropoff, routeDate, routeTime, driverId, busId
      const payload = {
        pickup: routeData.pickup || "",
        dropoff: routeData.dropoff || "",
        routeDate: routeData.routeDate || null,
        routeTime: routeData.routeTime || null,
        driverId: routeData.driverId ? Number(routeData.driverId) : null,
        busId: routeData.busId ? Number(routeData.busId) : null,
      };

      console.log("📤 [Redux] Submitting route payload:", payload);

      const res = await axios.post(
        `${BASE_URL}/institute/createRoute`,
        payload,
        getAxiosConfig()
      );

      console.log("✅ [Redux] Route created successfully:", res.data);
      return res.data;
    } catch (error) {
      console.error("❌ [Redux] Error creating route:", error);
      const errorMessage =
        error.response?.data?.message ||
        error.response?.data?.error ||
        error.message ||
        "Failed to create route";
      return rejectWithValue(errorMessage);
    }
  }
);

const initialState = {
  creating: false,
  error: null,
  lastCreatedRoute: null,
};

const routesSlice = createSlice({
  name: "routes",
  initialState,
  reducers: {
    clearRouteState: (state) => {
      state.creating = false;
      state.error = null;
      state.lastCreatedRoute = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(createRoute.pending, (state) => {
        state.creating = true;
        state.error = null;
        console.log("⏳ [Redux] Creating route...");
      })
      .addCase(createRoute.fulfilled, (state, action) => {
        state.creating = false;
        state.error = null;
        state.lastCreatedRoute = action.payload;
        console.log("✅ [Redux] Route created (slice state updated).");
      })
      .addCase(createRoute.rejected, (state, action) => {
        state.creating = false;
        state.error = action.payload || "Failed to create route";
        console.error("❌ [Redux] Create route failed:", action.payload);
      });
  },
});

export const { clearRouteState } = routesSlice.actions;
export default routesSlice.reducer;


