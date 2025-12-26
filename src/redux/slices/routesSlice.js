import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { routeService } from "@/services/routeService";

// Async thunk to create a route
export const createRoute = createAsyncThunk(
  "routes/createRoute",
  async (routeData, { rejectWithValue }) => {
    try {
      console.log("🔄 [Redux] Creating route...", routeData);

      // Pass routeData directly to service as it's already mapped in the component
      const data = await routeService.createRoute(routeData);

      console.log("✅ [Redux] Route created successfully:", data);
      return data;
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




