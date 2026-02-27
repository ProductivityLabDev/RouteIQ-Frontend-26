import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { schoolDashboardService } from "@/services/schoolDashboardService";

// ─── Thunks ───────────────────────────────────────────────────────────────────

export const fetchSchoolDashboard = createAsyncThunk(
  "schoolDashboard/fetchDashboard",
  async (_, { rejectWithValue }) => {
    try {
      const res = await schoolDashboardService.getDashboard();
      return res.data;
    } catch (error) {
      const msg = error?.response?.data?.message;
      return rejectWithValue(Array.isArray(msg) ? msg.join(", ") : msg || "Failed to fetch dashboard");
    }
  }
);

export const fetchSchoolStudents = createAsyncThunk(
  "schoolDashboard/fetchStudents",
  async (_, { rejectWithValue }) => {
    try {
      const res = await schoolDashboardService.getStudents();
      return { data: res.data, total: res.total };
    } catch (error) {
      const msg = error?.response?.data?.message;
      return rejectWithValue(Array.isArray(msg) ? msg.join(", ") : msg || "Failed to fetch students");
    }
  }
);

export const fetchSchoolDrivers = createAsyncThunk(
  "schoolDashboard/fetchDrivers",
  async (_, { rejectWithValue }) => {
    try {
      const res = await schoolDashboardService.getDrivers();
      return { data: res.data, total: res.total };
    } catch (error) {
      const msg = error?.response?.data?.message;
      return rejectWithValue(Array.isArray(msg) ? msg.join(", ") : msg || "Failed to fetch drivers");
    }
  }
);

export const fetchSchoolRoutes = createAsyncThunk(
  "schoolDashboard/fetchRoutes",
  async (_, { rejectWithValue }) => {
    try {
      const res = await schoolDashboardService.getRoutes();
      return res.data;
    } catch (error) {
      const msg = error?.response?.data?.message;
      return rejectWithValue(Array.isArray(msg) ? msg.join(", ") : msg || "Failed to fetch routes");
    }
  }
);

export const fetchSchoolBuses = createAsyncThunk(
  "schoolDashboard/fetchBuses",
  async (_, { rejectWithValue }) => {
    try {
      const res = await schoolDashboardService.getBuses();
      return res.data;
    } catch (error) {
      const msg = error?.response?.data?.message;
      return rejectWithValue(Array.isArray(msg) ? msg.join(", ") : msg || "Failed to fetch buses");
    }
  }
);

export const fetchSchoolAnnouncements = createAsyncThunk(
  "schoolDashboard/fetchAnnouncements",
  async (params, { rejectWithValue }) => {
    try {
      const res = await schoolDashboardService.getAnnouncements(params);
      return { data: res.data, total: res.total };
    } catch (error) {
      const msg = error?.response?.data?.message;
      return rejectWithValue(Array.isArray(msg) ? msg.join(", ") : msg || "Failed to fetch announcements");
    }
  }
);

export const fetchSchoolTrips = createAsyncThunk(
  "schoolDashboard/fetchTrips",
  async (params, { rejectWithValue }) => {
    try {
      const res = await schoolDashboardService.getTrips(params);
      return res.data;
    } catch (error) {
      const msg = error?.response?.data?.message;
      return rejectWithValue(Array.isArray(msg) ? msg.join(", ") : msg || "Failed to fetch trips");
    }
  }
);

// ─── Slice ────────────────────────────────────────────────────────────────────

const initialState = {
  dashboardStats: null,
  todayAttendance: null,
  recentAnnouncements: [],
  students: [],
  studentsTotal: 0,
  drivers: [],
  driversTotal: 0,
  routes: [],
  buses: [],
  announcements: [],
  announcementsTotal: 0,
  trips: [],
  loading: {
    dashboard: false,
    students: false,
    drivers: false,
    routes: false,
    buses: false,
    announcements: false,
    trips: false,
  },
  error: {
    dashboard: null,
    students: null,
    drivers: null,
    routes: null,
    buses: null,
    announcements: null,
    trips: null,
  },
};

const schoolDashboardSlice = createSlice({
  name: "schoolDashboard",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      // Dashboard stats
      .addCase(fetchSchoolDashboard.pending, (state) => {
        state.loading.dashboard = true;
        state.error.dashboard = null;
      })
      .addCase(fetchSchoolDashboard.fulfilled, (state, action) => {
        state.loading.dashboard = false;
        state.dashboardStats = action.payload?.stats || null;
        state.todayAttendance = action.payload?.todayAttendance || null;
        state.recentAnnouncements = action.payload?.recentAnnouncements || [];
      })
      .addCase(fetchSchoolDashboard.rejected, (state, action) => {
        state.loading.dashboard = false;
        state.error.dashboard = action.payload;
      })

      // Students
      .addCase(fetchSchoolStudents.pending, (state) => {
        state.loading.students = true;
        state.error.students = null;
      })
      .addCase(fetchSchoolStudents.fulfilled, (state, action) => {
        state.loading.students = false;
        state.students = action.payload.data;
        state.studentsTotal = action.payload.total;
      })
      .addCase(fetchSchoolStudents.rejected, (state, action) => {
        state.loading.students = false;
        state.error.students = action.payload;
      })

      // Drivers
      .addCase(fetchSchoolDrivers.pending, (state) => {
        state.loading.drivers = true;
        state.error.drivers = null;
      })
      .addCase(fetchSchoolDrivers.fulfilled, (state, action) => {
        state.loading.drivers = false;
        state.drivers = action.payload.data;
        state.driversTotal = action.payload.total;
      })
      .addCase(fetchSchoolDrivers.rejected, (state, action) => {
        state.loading.drivers = false;
        state.error.drivers = action.payload;
      })

      // Routes
      .addCase(fetchSchoolRoutes.pending, (state) => {
        state.loading.routes = true;
        state.error.routes = null;
      })
      .addCase(fetchSchoolRoutes.fulfilled, (state, action) => {
        state.loading.routes = false;
        state.routes = action.payload;
      })
      .addCase(fetchSchoolRoutes.rejected, (state, action) => {
        state.loading.routes = false;
        state.error.routes = action.payload;
      })

      // Buses
      .addCase(fetchSchoolBuses.pending, (state) => {
        state.loading.buses = true;
        state.error.buses = null;
      })
      .addCase(fetchSchoolBuses.fulfilled, (state, action) => {
        state.loading.buses = false;
        state.buses = action.payload;
      })
      .addCase(fetchSchoolBuses.rejected, (state, action) => {
        state.loading.buses = false;
        state.error.buses = action.payload;
      })

      // Announcements
      .addCase(fetchSchoolAnnouncements.pending, (state) => {
        state.loading.announcements = true;
        state.error.announcements = null;
      })
      .addCase(fetchSchoolAnnouncements.fulfilled, (state, action) => {
        state.loading.announcements = false;
        state.announcements = action.payload.data;
        state.announcementsTotal = action.payload.total;
      })
      .addCase(fetchSchoolAnnouncements.rejected, (state, action) => {
        state.loading.announcements = false;
        state.error.announcements = action.payload;
      })

      // Trips
      .addCase(fetchSchoolTrips.pending, (state) => {
        state.loading.trips = true;
        state.error.trips = null;
      })
      .addCase(fetchSchoolTrips.fulfilled, (state, action) => {
        state.loading.trips = false;
        state.trips = action.payload;
      })
      .addCase(fetchSchoolTrips.rejected, (state, action) => {
        state.loading.trips = false;
        state.error.trips = action.payload;
      });
  },
});

export default schoolDashboardSlice.reducer;
