import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { schoolService } from "@/services/schoolService";
import { busService } from "@/services/busService";
import { getAuthToken } from "@/configs/api";
import { decodeToken } from "@/redux/authHelper";

// Async thunk to fetch terminals (for school management)
export const fetchTerminals = createAsyncThunk(
  "schools/fetchTerminals",
  async (_, { rejectWithValue }) => {
    try {
      const response = await busService.getTerminals();
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || "Failed to fetch terminals");
    }
  }
);

// Async thunk to fetch states
export const fetchStates = createAsyncThunk(
  "schools/fetchStates",
  async (_, { rejectWithValue }) => {
    try {
      const response = await schoolService.getStates();
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || "Failed to fetch states");
    }
  }
);

// Async thunk to fetch cities
export const fetchCities = createAsyncThunk(
  "schools/fetchCities",
  async (_, { rejectWithValue }) => {
    try {
      const response = await schoolService.getCities();
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || "Failed to fetch cities");
    }
  }
);

// Async thunk to fetch institute types
export const fetchInstituteTypes = createAsyncThunk(
  "schools/fetchInstituteTypes",
  async (_, { rejectWithValue }) => {
    try {
      const response = await schoolService.getInstituteTypes();
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || "Failed to fetch institute types");
    }
  }
);

// Async thunk to fetch school management summary
export const fetchSchoolManagementSummary = createAsyncThunk(
  "schools/fetchSchoolManagementSummary",
  async (_, { rejectWithValue }) => {
    try {
      const token = getAuthToken();
      const decoded = token ? decodeToken(token) : null;
      const userId = decoded?.sub || decoded?.userId || decoded?.UserId || decoded?.id;

      if (!userId || isNaN(Number(userId))) return rejectWithValue("Invalid user id for summary");

      const response = await schoolService.getSchoolManagementSummary(Number(userId));
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || "Failed to fetch school management summary");
    }
  }
);

// Async thunk to create institute
export const createInstitute = createAsyncThunk(
  "schools/createInstitute",
  async (instituteData, { rejectWithValue }) => {
    try {
      const token = getAuthToken();
      const decoded = token ? decodeToken(token) : null;
      const userId = decoded?.sub || decoded?.userId || decoded?.UserId || decoded?.id;

      const payload = {
        District: instituteData.district || null,
        Principle: instituteData.principle || null,
        TerminalId: instituteData.terminal ? Number(instituteData.terminal) : null,
        InstituteType: instituteData.instituteType ? Number(instituteData.instituteType) : null,
        InstituteName: instituteData.school || null,
        TotalStudent: instituteData.totalStudent ? Number(instituteData.totalStudent) : null,
        TotalBus: instituteData.totalBuses ? Number(instituteData.totalBuses) : null,
        ContactPhone: instituteData.contact || instituteData.PhoneNo || null,
        Address: instituteData.Address || null,
        ContactEmail: instituteData.Email || null,
        City: instituteData.city ? Number(instituteData.city) : null,
        StateId: instituteData.stateId ? Number(instituteData.stateId) : null,
        ZipCode: instituteData.ZipCode || instituteData.zipCode || null,
        UserId: userId ? Number(userId) : null,
      };

      const response = await schoolService.createInstitute(payload);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || "Failed to create institute");
    }
  }
);

const initialState = {
  terminals: [],
  states: [],
  cities: [],
  instituteTypes: [],
  schoolManagementSummary: [],
  loading: {
    terminals: false,
    states: false,
    cities: false,
    instituteTypes: false,
    creating: false,
    summary: false,
  },
  error: {
    terminals: null,
    states: null,
    cities: null,
    instituteTypes: null,
    creating: null,
    summary: null,
  },
};

const schoolSlice = createSlice({
  name: "schools",
  initialState,
  reducers: {
    clearSchools: (state) => {
      state.terminals = [];
      state.states = [];
      state.cities = [];
      state.instituteTypes = [];
      state.error = {
        terminals: null,
        states: null,
        cities: null,
        instituteTypes: null,
        creating: null,
      };
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch terminals
      .addCase(fetchTerminals.pending, (state) => {
        state.loading.terminals = true;
        state.error.terminals = null;
      })
      .addCase(fetchTerminals.fulfilled, (state, action) => {
        state.loading.terminals = false;
        state.terminals = action.payload;
        state.error.terminals = null;
      })
      .addCase(fetchTerminals.rejected, (state, action) => {
        state.loading.terminals = false;
        state.error.terminals = action.payload || "Failed to fetch terminals";
        state.terminals = [];
        console.error("Fetch terminals failed:", action.payload);
      })
      // Fetch states
      .addCase(fetchStates.pending, (state) => {
        state.loading.states = true;
        state.error.states = null;
      })
      .addCase(fetchStates.fulfilled, (state, action) => {
        state.loading.states = false;
        state.states = action.payload;
        state.error.states = null;
      })
      .addCase(fetchStates.rejected, (state, action) => {
        state.loading.states = false;
        state.error.states = action.payload || "Failed to fetch states";
        state.states = [];
        console.error("Fetch states failed:", action.payload);
      })
      // Fetch cities
      .addCase(fetchCities.pending, (state) => {
        state.loading.cities = true;
        state.error.cities = null;
      })
      .addCase(fetchCities.fulfilled, (state, action) => {
        state.loading.cities = false;
        state.cities = action.payload;
        state.error.cities = null;
      })
      .addCase(fetchCities.rejected, (state, action) => {
        state.loading.cities = false;
        state.error.cities = action.payload || "Failed to fetch cities";
        state.cities = [];
        console.error("Fetch cities failed:", action.payload);
      })
      // Fetch institute types
      .addCase(fetchInstituteTypes.pending, (state) => {
        state.loading.instituteTypes = true;
        state.error.instituteTypes = null;
      })
      .addCase(fetchInstituteTypes.fulfilled, (state, action) => {
        state.loading.instituteTypes = false;
        state.instituteTypes = action.payload;
        state.error.instituteTypes = null;
      })
      .addCase(fetchInstituteTypes.rejected, (state, action) => {
        state.loading.instituteTypes = false;
        state.error.instituteTypes = action.payload || "Failed to fetch institute types";
        state.instituteTypes = [];
        console.error("Fetch institute types failed:", action.payload);
      })
      // Create institute
      .addCase(createInstitute.pending, (state) => {
        state.loading.creating = true;
        state.error.creating = null;
      })
      .addCase(createInstitute.fulfilled, (state, action) => {
        state.loading.creating = false;
        state.error.creating = null;
      })
      .addCase(createInstitute.rejected, (state, action) => {
        state.loading.creating = false;
        state.error.creating = action.payload || "Failed to create institute";
        console.error("Create institute failed:", action.payload);
      })
      // Fetch school management summary
      .addCase(fetchSchoolManagementSummary.pending, (state) => {
        state.loading.summary = true;
        state.error.summary = null;
      })
      .addCase(fetchSchoolManagementSummary.fulfilled, (state, action) => {
        state.loading.summary = false;
        state.schoolManagementSummary = action.payload;
        state.error.summary = null;
        console.log("✅ [SchoolSlice Reducer] schoolManagementSummary updated. Count:", action.payload?.length || 0);
      })
      .addCase(fetchSchoolManagementSummary.rejected, (state, action) => {
        state.loading.summary = false;
        state.error.summary = action.payload || "Failed to fetch school management summary";
        state.schoolManagementSummary = [];
        console.error("Fetch school management summary failed:", action.payload);
      });
  },
});

export const { clearSchools } = schoolSlice.actions;
export default schoolSlice.reducer;

