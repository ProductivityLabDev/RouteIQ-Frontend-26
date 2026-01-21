import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { repairScheduleService } from "@/services/repairScheduleService";
import { toast } from "react-hot-toast";

// Async thunk to fetch repair schedules
export const fetchRepairSchedules = createAsyncThunk(
  "repairSchedule/fetchRepairSchedules",
  async (busId, { rejectWithValue }) => {
    try {
      const response = await repairScheduleService.getRepairSchedules(busId);
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to fetch repair schedules"
      );
    }
  }
);

// Async thunk to fetch single repair schedule
export const fetchRepairScheduleById = createAsyncThunk(
  "repairSchedule/fetchRepairScheduleById",
  async (maintenanceId, { rejectWithValue }) => {
    try {
      const response = await repairScheduleService.getRepairScheduleById(maintenanceId);
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to fetch repair schedule"
      );
    }
  }
);

// Async thunk to create repair schedule
export const createRepairSchedule = createAsyncThunk(
  "repairSchedule/createRepairSchedule",
  async (payload, { rejectWithValue }) => {
    try {
      const response = await repairScheduleService.createRepairSchedule(payload);
      if (response.data?.Success === 1) {
        toast.success(response.data?.Message || "Repair schedule created successfully");
      }
      return response.data;
    } catch (error) {
      const errorMessage = error.response?.data?.message || "Failed to create repair schedule";
      toast.error(errorMessage);
      return rejectWithValue(errorMessage);
    }
  }
);

// Async thunk to update repair schedule
export const updateRepairSchedule = createAsyncThunk(
  "repairSchedule/updateRepairSchedule",
  async ({ maintenanceId, payload }, { rejectWithValue }) => {
    try {
      const response = await repairScheduleService.updateRepairSchedule(maintenanceId, payload);
      toast.success("Repair schedule updated successfully");
      return response.data;
    } catch (error) {
      const errorMessage = error.response?.data?.message || "Failed to update repair schedule";
      toast.error(errorMessage);
      return rejectWithValue(errorMessage);
    }
  }
);

// Async thunk to delete repair schedule
export const deleteRepairSchedule = createAsyncThunk(
  "repairSchedule/deleteRepairSchedule",
  async (maintenanceId, { rejectWithValue }) => {
    try {
      const response = await repairScheduleService.deleteRepairSchedule(maintenanceId);
      toast.success("Repair schedule deleted successfully");
      return maintenanceId;
    } catch (error) {
      const errorMessage = error.response?.data?.message || "Failed to delete repair schedule";
      toast.error(errorMessage);
      return rejectWithValue(errorMessage);
    }
  }
);

const initialState = {
  repairSchedules: [],
  currentRepairSchedule: null,
  loading: {
    fetching: false,
    fetchingById: false,
    creating: false,
    updating: false,
    deleting: false,
  },
  error: null,
};

const repairScheduleSlice = createSlice({
  name: "repairSchedule",
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
    clearCurrentRepairSchedule: (state) => {
      state.currentRepairSchedule = null;
    },
  },
  extraReducers: (builder) => {
    // Fetch repair schedules
    builder
      .addCase(fetchRepairSchedules.pending, (state) => {
        state.loading.fetching = true;
        state.error = null;
      })
      .addCase(fetchRepairSchedules.fulfilled, (state, action) => {
        state.loading.fetching = false;
        state.repairSchedules = action.payload || [];
      })
      .addCase(fetchRepairSchedules.rejected, (state, action) => {
        state.loading.fetching = false;
        state.error = action.payload;
      });

    // Fetch repair schedule by ID
    builder
      .addCase(fetchRepairScheduleById.pending, (state) => {
        state.loading.fetchingById = true;
        state.error = null;
      })
      .addCase(fetchRepairScheduleById.fulfilled, (state, action) => {
        state.loading.fetchingById = false;
        state.currentRepairSchedule = action.payload;
      })
      .addCase(fetchRepairScheduleById.rejected, (state, action) => {
        state.loading.fetchingById = false;
        state.error = action.payload;
      });

    // Create repair schedule
    builder
      .addCase(createRepairSchedule.pending, (state) => {
        state.loading.creating = true;
        state.error = null;
      })
      .addCase(createRepairSchedule.fulfilled, (state, action) => {
        state.loading.creating = false;
        // Optionally add the new schedule to the list
        if (action.payload?.MaintenanceId) {
          // The new schedule will be fetched on refresh
        }
      })
      .addCase(createRepairSchedule.rejected, (state, action) => {
        state.loading.creating = false;
        state.error = action.payload;
      });

    // Update repair schedule
    builder
      .addCase(updateRepairSchedule.pending, (state) => {
        state.loading.updating = true;
        state.error = null;
      })
      .addCase(updateRepairSchedule.fulfilled, (state, action) => {
        state.loading.updating = false;
        // Update the schedule in the list
        const index = state.repairSchedules.findIndex(
          (schedule) => schedule.maintenanceId === action.payload?.maintenanceId
        );
        if (index !== -1) {
          state.repairSchedules[index] = { ...state.repairSchedules[index], ...action.payload };
        }
      })
      .addCase(updateRepairSchedule.rejected, (state, action) => {
        state.loading.updating = false;
        state.error = action.payload;
      });

    // Delete repair schedule
    builder
      .addCase(deleteRepairSchedule.pending, (state) => {
        state.loading.deleting = true;
        state.error = null;
      })
      .addCase(deleteRepairSchedule.fulfilled, (state, action) => {
        state.loading.deleting = false;
        state.repairSchedules = state.repairSchedules.filter(
          (schedule) => schedule.maintenanceId !== action.payload
        );
      })
      .addCase(deleteRepairSchedule.rejected, (state, action) => {
        state.loading.deleting = false;
        state.error = action.payload;
      });
  },
});

export const { clearError, clearCurrentRepairSchedule } = repairScheduleSlice.actions;
export default repairScheduleSlice.reducer;
