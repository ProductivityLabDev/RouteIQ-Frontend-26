import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { employeeDashboardService, employeeModuleService } from "@/services/employeeService";
import toast from "react-hot-toast";

// POST action → resulting punchStatus mapping (API returns these exact values)
const ACTION_TO_STATUS = {
  punch_in:    "PUNCHED_IN",
  punch_out:   "PUNCHED_OUT",
  break_start: "ON_BREAK",
  break_end:   "PUNCHED_IN",  // After break ends, status goes back to PUNCHED_IN
};

// ─── Async Thunks — Attendance ─────────────────────────────────────────────

export const fetchEmployeeDashboard = createAsyncThunk(
  "employeeDashboard/fetchDashboard",
  async (_, { rejectWithValue }) => {
    try {
      const response = await employeeDashboardService.getDashboard();
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to fetch dashboard"
      );
    }
  }
);

export const punchAttendance = createAsyncThunk(
  "employeeDashboard/punchAttendance",
  async (action, { rejectWithValue, dispatch }) => {
    try {
      const response = await employeeDashboardService.postAttendance(action);
      toast.success(response.data?.message || "Action completed");
      setTimeout(() => dispatch(fetchEmployeeDashboard()), 2000);
      return { action, time: response.data?.time };
    } catch (error) {
      const msg = error.response?.data?.message || "Attendance action failed";
      toast.error(msg);
      const errMsg = msg.toLowerCase();
      let inferredStatus = null;
      if (errMsg.includes("already punched in"))  inferredStatus = "PUNCHED_IN";
      if (errMsg.includes("already punched out")) inferredStatus = "PUNCHED_OUT";
      if (errMsg.includes("already on break"))    inferredStatus = "ON_BREAK";
      return rejectWithValue({ msg, inferredStatus });
    }
  }
);

export const fetchAttendanceReport = createAsyncThunk(
  "employeeDashboard/fetchAttendanceReport",
  async ({ month, year } = {}, { rejectWithValue }) => {
    try {
      const response = await employeeDashboardService.getAttendanceReport(month, year);
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to fetch attendance report"
      );
    }
  }
);

// ─── Async Thunks — Time Off ───────────────────────────────────────────────

export const fetchTimeOff = createAsyncThunk(
  "employeeDashboard/fetchTimeOff",
  async (params = {}, { rejectWithValue }) => {
    try {
      const response = await employeeModuleService.getTimeOff(params);
      return { data: response.data, total: response.total };
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to fetch time off requests"
      );
    }
  }
);

export const submitTimeOff = createAsyncThunk(
  "employeeDashboard/submitTimeOff",
  async (data, { rejectWithValue, dispatch }) => {
    try {
      const response = await employeeModuleService.createTimeOff(data);
      toast.success(response.data?.message || "Time off request submitted");
      dispatch(fetchTimeOff());
      return response.data;
    } catch (error) {
      const msg = error.response?.data?.message || "Failed to submit request";
      toast.error(msg);
      return rejectWithValue(msg);
    }
  }
);

export const cancelTimeOffRequest = createAsyncThunk(
  "employeeDashboard/cancelTimeOff",
  async (id, { rejectWithValue, dispatch }) => {
    try {
      const response = await employeeModuleService.cancelTimeOff(id);
      toast.success(response.data?.message || "Request cancelled");
      dispatch(fetchTimeOff());
      return id;
    } catch (error) {
      const msg = error.response?.data?.message || "Failed to cancel request";
      toast.error(msg);
      return rejectWithValue(msg);
    }
  }
);

// ─── Async Thunks — Schedule ──────────────────────────────────────────────

export const fetchSchedule = createAsyncThunk(
  "employeeDashboard/fetchSchedule",
  async (weekStart, { rejectWithValue }) => {
    try {
      const response = await employeeModuleService.getSchedule(weekStart);
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to fetch schedule"
      );
    }
  }
);

// ─── Async Thunks — Profile ───────────────────────────────────────────────

export const fetchEmployeeProfile = createAsyncThunk(
  "employeeDashboard/fetchProfile",
  async (_, { rejectWithValue }) => {
    try {
      const response = await employeeModuleService.getProfile();
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to fetch profile"
      );
    }
  }
);

export const updateEmployeeProfile = createAsyncThunk(
  "employeeDashboard/updateProfile",
  async (data, { rejectWithValue, dispatch }) => {
    try {
      const response = await employeeModuleService.updateProfile(data);
      toast.success(response.data?.message || "Profile updated");
      dispatch(fetchEmployeeProfile());
      return response.data;
    } catch (error) {
      const msg = error.response?.data?.message || "Failed to update profile";
      toast.error(msg);
      return rejectWithValue(msg);
    }
  }
);

// ─── Async Thunks — Documents ─────────────────────────────────────────────

export const fetchDocuments = createAsyncThunk(
  "employeeDashboard/fetchDocuments",
  async (_, { rejectWithValue }) => {
    try {
      const response = await employeeModuleService.getDocuments();
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to fetch documents"
      );
    }
  }
);

export const uploadEmployeeDocument = createAsyncThunk(
  "employeeDashboard/uploadDocument",
  async (formData, { rejectWithValue, dispatch }) => {
    try {
      const response = await employeeModuleService.uploadDocument(formData);
      toast.success(response.data?.message || "Document uploaded successfully");
      dispatch(fetchDocuments());
      return response.data;
    } catch (error) {
      const msg = error.response?.data?.message || "Failed to upload document";
      toast.error(msg);
      return rejectWithValue(msg);
    }
  }
);

// ─── Slice ────────────────────────────────────────────────────────────────────

const initialState = {
  // Attendance
  dashboardData:    null,
  attendanceReport: null,
  lastPunchStatus:  null,
  // Time Off
  timeOffRequests: [],
  timeOffTotal:    0,
  // Schedule
  schedule: null,
  // Profile
  profile: null,
  // Documents
  documents: [],
  // Loading & Error
  loading: {
    dashboard: false, punch: false, report: false,
    timeOff: false, schedule: false, profile: false,
    documents: false, submitting: false,
  },
  error: {
    dashboard: null, punch: null, report: null,
    timeOff: null, schedule: null, profile: null, documents: null,
  },
};

const employeeDashboardSlice = createSlice({
  name: "employeeDashboard",
  initialState,
  reducers: {
    clearDashboard: () => initialState,
  },
  extraReducers: (builder) => {
    builder
      // ── fetchEmployeeDashboard ────────────────────────────────────────────
      .addCase(fetchEmployeeDashboard.pending, (state) => {
        state.loading.dashboard = true;
        state.error.dashboard   = null;
      })
      .addCase(fetchEmployeeDashboard.fulfilled, (state, action) => {
        state.loading.dashboard = false;
        const apiData = action.payload;
        if (!apiData) return;
        if (
          state.lastPunchStatus &&
          apiData?.today?.punchStatus === "NOT_PUNCHED" &&
          state.lastPunchStatus !== "NOT_PUNCHED"
        ) {
          state.dashboardData = {
            ...apiData,
            today: { ...apiData.today, punchStatus: state.lastPunchStatus },
          };
        } else {
          state.dashboardData   = apiData;
          state.lastPunchStatus = null;
        }
      })
      .addCase(fetchEmployeeDashboard.rejected, (state, action) => {
        state.loading.dashboard = false;
        state.error.dashboard   = action.payload;
      })

      // ── punchAttendance ──────────────────────────────────────────────────
      .addCase(punchAttendance.pending, (state) => {
        state.loading.punch = true;
        state.error.punch   = null;
      })
      .addCase(punchAttendance.fulfilled, (state, action) => {
        state.loading.punch = false;
        const { action: punchAction, time } = action.payload;
        const newStatus = ACTION_TO_STATUS[punchAction] || punchAction;
        state.lastPunchStatus = newStatus;
        if (state.dashboardData?.today) {
          state.dashboardData.today.punchStatus = newStatus;
          if (punchAction === "break_start") {
            state.dashboardData.today.breakStartTime = time || new Date().toISOString();
          }
          if (punchAction === "break_end") {
            state.dashboardData.today.breakStartTime = null;
          }
        } else {
          state.dashboardData = {
            today: {
              punchStatus:    newStatus,
              breakStartTime: punchAction === "break_start" ? time : null,
              workingHours:   "0 Hr 00 Mins",
              breakHours:     "0 Hr 00 Mins",
            },
            monthly: null,
          };
        }
      })
      .addCase(punchAttendance.rejected, (state, action) => {
        state.loading.punch = false;
        const { msg, inferredStatus } = action.payload || {};
        state.error.punch = msg || action.payload;
        if (inferredStatus) {
          state.lastPunchStatus = inferredStatus;
          if (state.dashboardData?.today) {
            state.dashboardData.today.punchStatus = inferredStatus;
          } else {
            state.dashboardData = {
              today: { punchStatus: inferredStatus, workingHours: "0 Hr 00 Mins", breakHours: "0 Hr 00 Mins" },
              monthly: null,
            };
          }
        }
      })

      // ── fetchAttendanceReport ────────────────────────────────────────────
      .addCase(fetchAttendanceReport.pending, (state) => {
        state.loading.report = true;
        state.error.report   = null;
      })
      .addCase(fetchAttendanceReport.fulfilled, (state, action) => {
        state.loading.report   = false;
        state.attendanceReport = action.payload;
      })
      .addCase(fetchAttendanceReport.rejected, (state, action) => {
        state.loading.report = false;
        state.error.report   = action.payload;
      })

      // ── fetchTimeOff ─────────────────────────────────────────────────────
      .addCase(fetchTimeOff.pending, (state) => {
        state.loading.timeOff = true;
        state.error.timeOff   = null;
      })
      .addCase(fetchTimeOff.fulfilled, (state, action) => {
        state.loading.timeOff   = false;
        state.timeOffRequests   = action.payload.data;
        state.timeOffTotal      = action.payload.total;
      })
      .addCase(fetchTimeOff.rejected, (state, action) => {
        state.loading.timeOff = false;
        state.error.timeOff   = action.payload;
      })

      // ── submitTimeOff ────────────────────────────────────────────────────
      .addCase(submitTimeOff.pending, (state) => {
        state.loading.submitting = true;
      })
      .addCase(submitTimeOff.fulfilled, (state) => {
        state.loading.submitting = false;
      })
      .addCase(submitTimeOff.rejected, (state) => {
        state.loading.submitting = false;
      })

      // ── cancelTimeOffRequest ─────────────────────────────────────────────
      .addCase(cancelTimeOffRequest.fulfilled, (state, action) => {
        // Optimistically mark as cancelled in local state
        const req = state.timeOffRequests.find(r => r.id === action.payload);
        if (req) req.status = "CANCELLED";
      })

      // ── fetchSchedule ────────────────────────────────────────────────────
      .addCase(fetchSchedule.pending, (state) => {
        state.loading.schedule = true;
        state.error.schedule   = null;
      })
      .addCase(fetchSchedule.fulfilled, (state, action) => {
        state.loading.schedule = false;
        state.schedule         = action.payload;
      })
      .addCase(fetchSchedule.rejected, (state, action) => {
        state.loading.schedule = false;
        state.error.schedule   = action.payload;
      })

      // ── fetchEmployeeProfile ─────────────────────────────────────────────
      .addCase(fetchEmployeeProfile.pending, (state) => {
        state.loading.profile = true;
        state.error.profile   = null;
      })
      .addCase(fetchEmployeeProfile.fulfilled, (state, action) => {
        state.loading.profile = false;
        state.profile         = action.payload;
      })
      .addCase(fetchEmployeeProfile.rejected, (state, action) => {
        state.loading.profile = false;
        state.error.profile   = action.payload;
      })

      // ── updateEmployeeProfile ────────────────────────────────────────────
      .addCase(updateEmployeeProfile.pending, (state) => {
        state.loading.submitting = true;
      })
      .addCase(updateEmployeeProfile.fulfilled, (state) => {
        state.loading.submitting = false;
      })
      .addCase(updateEmployeeProfile.rejected, (state) => {
        state.loading.submitting = false;
      })

      // ── fetchDocuments ───────────────────────────────────────────────────
      .addCase(fetchDocuments.pending, (state) => {
        state.loading.documents = true;
        state.error.documents   = null;
      })
      .addCase(fetchDocuments.fulfilled, (state, action) => {
        state.loading.documents = false;
        state.documents         = action.payload?.documents ?? [];
      })
      .addCase(fetchDocuments.rejected, (state, action) => {
        state.loading.documents = false;
        state.error.documents   = action.payload;
      })

      // ── uploadEmployeeDocument ───────────────────────────────────────────
      .addCase(uploadEmployeeDocument.pending, (state) => {
        state.loading.submitting = true;
      })
      .addCase(uploadEmployeeDocument.fulfilled, (state) => {
        state.loading.submitting = false;
      })
      .addCase(uploadEmployeeDocument.rejected, (state) => {
        state.loading.submitting = false;
      });
  },
});

export const { clearDashboard } = employeeDashboardSlice.actions;
export default employeeDashboardSlice.reducer;
