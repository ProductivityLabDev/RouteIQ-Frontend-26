import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { routeService } from "@/services/routeService";

export const fetchRouteManagementTerminals = createAsyncThunk(
  "routes/fetchRouteManagementTerminals",
  async (_, { rejectWithValue }) => {
    try {
      const res = await routeService.getRouteManagementTerminals();
      return res.data;
    } catch (error) {
      const msg = error?.response?.data?.message;
      const normalized =
        Array.isArray(msg) ? msg.join(", ") : msg || "Failed to fetch terminals";
      return rejectWithValue(normalized);
    }
  }
);

export const fetchInstituteRoutes = createAsyncThunk(
  "routes/fetchInstituteRoutes",
  async (instituteId, { rejectWithValue }) => {
    try {
      const res = await routeService.getInstituteRoutes(Number(instituteId));
      return { instituteId, data: res.data };
    } catch (error) {
      const msg = error?.response?.data?.message;
      const normalized =
        Array.isArray(msg) ? msg.join(", ") : msg || "Failed to fetch routes";
      return rejectWithValue({ instituteId, error: normalized });
    }
  }
);

export const fetchRouteMap = createAsyncThunk(
  "routes/fetchRouteMap",
  async ({ routeId, type = "AM" }, { rejectWithValue }) => {
    try {
      const res = await routeService.getRouteMap(Number(routeId), type);
      return { routeId, type, data: res };
    } catch (error) {
      const msg = error?.response?.data?.message;
      const normalized =
        Array.isArray(msg) ? msg.join(", ") : msg || "Failed to fetch route map";
      return rejectWithValue(normalized);
    }
  }
);

export const fetchRouteStudents = createAsyncThunk(
  "routes/fetchRouteStudents",
  async ({ routeId, type = "AM" }, { rejectWithValue }) => {
    try {
      const res = await routeService.getRouteStudents(Number(routeId), type);
      return { routeId, type, data: res.data };
    } catch (error) {
      const msg = error?.response?.data?.message;
      const normalized =
        Array.isArray(msg) ? msg.join(", ") : msg || "Failed to fetch route students";
      return rejectWithValue({ routeId, error: normalized });
    }
  }
);

export const fetchRouteMetrics = createAsyncThunk(
  "routes/fetchRouteMetrics",
  async (routeId, { rejectWithValue }) => {
    try {
      const data = await routeService.computeRouteMetrics(Number(routeId));
      return data;
    } catch (error) {
      const msg = error?.response?.data?.message;
      const normalized =
        Array.isArray(msg) ? msg.join(", ") : msg || "Failed to compute route metrics";
      return rejectWithValue({ routeId, error: normalized });
    }
  }
);

export const fetchRouteDetails = createAsyncThunk(
  "routes/fetchRouteDetails",
  async (routeId, { rejectWithValue }) => {
    try {
      const data = await routeService.getRouteDetails(Number(routeId));
      return { routeId: Number(routeId), data };
    } catch (error) {
      const msg = error?.response?.data?.message;
      const normalized =
        Array.isArray(msg) ? msg.join(", ") : msg || "Failed to fetch route details";
      return rejectWithValue({ routeId, error: normalized });
    }
  }
);

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
  terminalsHierarchy: [],
  routesByInstitute: {}, // { [instituteId]: Route[] }
  studentsByRoute: {}, // { [routeId]: Student[] }
  metricsByRoute: {}, // { [routeId]: { distanceKm, durationMinutes, ... } }
  detailsByRoute: {}, // { [routeId]: RouteDetails }
  mapView: {
    loading: false,
    error: null,
    data: null,
    routeId: null,
    type: "AM",
  },
  loading: {
    terminalsHierarchy: false,
    instituteRoutes: {}, // { [instituteId]: bool }
    routeStudents: {}, // { [routeId]: bool }
    routeMetrics: {}, // { [routeId]: bool }
    routeDetails: {}, // { [routeId]: bool }
  },
  errors: {
    terminalsHierarchy: null,
    instituteRoutes: {}, // { [instituteId]: string | null }
    routeStudents: {}, // { [routeId]: string | null }
    routeMetrics: {}, // { [routeId]: string | null }
    routeDetails: {}, // { [routeId]: string | null }
  },
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
      .addCase(fetchRouteManagementTerminals.pending, (state) => {
        state.loading.terminalsHierarchy = true;
        state.errors.terminalsHierarchy = null;
      })
      .addCase(fetchRouteManagementTerminals.fulfilled, (state, action) => {
        state.loading.terminalsHierarchy = false;
        state.terminalsHierarchy = action.payload || [];
        state.errors.terminalsHierarchy = null;
      })
      .addCase(fetchRouteManagementTerminals.rejected, (state, action) => {
        state.loading.terminalsHierarchy = false;
        state.terminalsHierarchy = [];
        state.errors.terminalsHierarchy =
          action.payload || "Failed to fetch terminals";
      })
      .addCase(fetchInstituteRoutes.pending, (state, action) => {
        const id = action.meta.arg;
        state.loading.instituteRoutes[id] = true;
        state.errors.instituteRoutes[id] = null;
      })
      .addCase(fetchInstituteRoutes.fulfilled, (state, action) => {
        const { instituteId, data } = action.payload;
        state.loading.instituteRoutes[instituteId] = false;
        state.errors.instituteRoutes[instituteId] = null;
        state.routesByInstitute[instituteId] = data || [];
      })
      .addCase(fetchInstituteRoutes.rejected, (state, action) => {
        const { instituteId, error } = action.payload || {};
        if (instituteId !== undefined) {
          state.loading.instituteRoutes[instituteId] = false;
          state.routesByInstitute[instituteId] = [];
          state.errors.instituteRoutes[instituteId] =
            error || "Failed to fetch routes";
        }
      })
      .addCase(fetchRouteMap.pending, (state, action) => {
        state.mapView.loading = true;
        state.mapView.error = null;
        state.mapView.routeId = action.meta.arg?.routeId ?? null;
        state.mapView.type = action.meta.arg?.type || "AM";
      })
      .addCase(fetchRouteMap.fulfilled, (state, action) => {
        state.mapView.loading = false;
        state.mapView.error = null;
        state.mapView.data = action.payload?.data || null;
        state.mapView.routeId = action.payload?.routeId ?? null;
        state.mapView.type = action.payload?.type || "AM";
      })
      .addCase(fetchRouteMap.rejected, (state, action) => {
        state.mapView.loading = false;
        state.mapView.error = action.payload || "Failed to fetch route map";
        state.mapView.data = null;
      })
      .addCase(fetchRouteStudents.pending, (state, action) => {
        const rid = action.meta.arg?.routeId;
        if (rid !== undefined) {
          state.loading.routeStudents[rid] = true;
          state.errors.routeStudents[rid] = null;
        }
      })
      .addCase(fetchRouteStudents.fulfilled, (state, action) => {
        const { routeId, data } = action.payload || {};
        if (routeId !== undefined) {
          state.loading.routeStudents[routeId] = false;
          state.errors.routeStudents[routeId] = null;
          state.studentsByRoute[routeId] = data || [];
        }
      })
      .addCase(fetchRouteStudents.rejected, (state, action) => {
        const { routeId, error } = action.payload || {};
        if (routeId !== undefined) {
          state.loading.routeStudents[routeId] = false;
          state.errors.routeStudents[routeId] =
            error || "Failed to fetch route students";
          state.studentsByRoute[routeId] = [];
        }
      })
      .addCase(fetchRouteMetrics.pending, (state, action) => {
        const rid = action.meta.arg;
        state.loading.routeMetrics[rid] = true;
        state.errors.routeMetrics[rid] = null;
      })
      .addCase(fetchRouteMetrics.fulfilled, (state, action) => {
        const rid = action.payload?.routeId ?? action.meta.arg;
        state.loading.routeMetrics[rid] = false;
        state.errors.routeMetrics[rid] = null;
        state.metricsByRoute[rid] = action.payload;
      })
      .addCase(fetchRouteMetrics.rejected, (state, action) => {
        const { routeId, error } = action.payload || {};
        if (routeId !== undefined) {
          state.loading.routeMetrics[routeId] = false;
          state.errors.routeMetrics[routeId] =
            error || "Failed to compute route metrics";
        }
      })
      .addCase(fetchRouteDetails.pending, (state, action) => {
        const rid = action.meta.arg;
        state.loading.routeDetails[rid] = true;
        state.errors.routeDetails[rid] = null;
      })
      .addCase(fetchRouteDetails.fulfilled, (state, action) => {
        const rid = action.payload?.routeId ?? action.meta.arg;
        state.loading.routeDetails[rid] = false;
        state.errors.routeDetails[rid] = null;
        state.detailsByRoute[rid] = action.payload?.data || {};
      })
      .addCase(fetchRouteDetails.rejected, (state, action) => {
        const { routeId, error } = action.payload || {};
        if (routeId !== undefined) {
          state.loading.routeDetails[routeId] = false;
          state.errors.routeDetails[routeId] =
            error || "Failed to fetch route details";
        }
      })
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




