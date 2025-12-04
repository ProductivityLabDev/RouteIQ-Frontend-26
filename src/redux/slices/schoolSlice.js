import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import { BASE_URL, getAxiosConfig, getAuthToken } from "@/configs/api";
import { decodeToken } from "@/redux/authHelper";

// Async thunk to fetch terminals (for school management)
export const fetchTerminals = createAsyncThunk(
  "schools/fetchTerminals",
  async (_, { rejectWithValue }) => {
    try {
      const res = await axios.get(
        `${BASE_URL}/terminals`,
        getAxiosConfig()
      );

      // Handle response structure: direct array or wrapped in `data`
      const terminalsArray = Array.isArray(res.data)
        ? res.data
        : Array.isArray(res.data.data)
          ? res.data.data
          : [];

      return terminalsArray;
    } catch (error) {
      console.error("Error fetching terminals:", error);
      return rejectWithValue(
        error.response?.data?.message || "Failed to fetch terminals"
      );
    }
  }
);

// Async thunk to fetch states
export const fetchStates = createAsyncThunk(
  "schools/fetchStates",
  async (_, { rejectWithValue }) => {
    try {
      const res = await axios.get(
        `${BASE_URL}/institute/GetStates`,
        getAxiosConfig()
      );

      // Handle response structure: direct array or wrapped in `{ok: true, data: [...]}`
      let statesArray = [];
      
      if (Array.isArray(res.data)) {
        statesArray = res.data;
      } else if (res.data?.ok && Array.isArray(res.data.data)) {
        statesArray = res.data.data;
      } else if (Array.isArray(res.data.data)) {
        statesArray = res.data.data;
      }

      return statesArray;
    } catch (error) {
      console.error("Error fetching states:", error);
      return rejectWithValue(
        error.response?.data?.message || "Failed to fetch states"
      );
    }
  }
);

// Async thunk to fetch cities
export const fetchCities = createAsyncThunk(
  "schools/fetchCities",
  async (_, { rejectWithValue }) => {
    try {
      const res = await axios.get(
        `${BASE_URL}/institute/GetCities`,
        getAxiosConfig()
      );

      // Handle response structure: direct array or wrapped in `data`
      let citiesArray = [];
      
      if (Array.isArray(res.data)) {
        citiesArray = res.data;
      } else if (res.data?.ok && Array.isArray(res.data.data)) {
        citiesArray = res.data.data;
      } else if (Array.isArray(res.data.data)) {
        citiesArray = res.data.data;
      }

      return citiesArray;
    } catch (error) {
      console.error("Error fetching cities:", error);
      return rejectWithValue(
        error.response?.data?.message || "Failed to fetch cities"
      );
    }
  }
);

// Async thunk to fetch institute types
export const fetchInstituteTypes = createAsyncThunk(
  "schools/fetchInstituteTypes",
  async (_, { rejectWithValue }) => {
    try {
      const res = await axios.get(
        `${BASE_URL}/institute/GetInstituteType`,
        getAxiosConfig()
      );

      // Handle response structure: direct array or wrapped in `data`
      let typesArray = [];
      
      if (Array.isArray(res.data)) {
        typesArray = res.data;
      } else if (res.data?.ok && Array.isArray(res.data.data)) {
        typesArray = res.data.data;
      } else if (Array.isArray(res.data.data)) {
        typesArray = res.data.data;
      }

      return typesArray;
    } catch (error) {
      console.error("Error fetching institute types:", error);
      return rejectWithValue(
        error.response?.data?.message || "Failed to fetch institute types"
      );
    }
  }
);

// Async thunk to fetch school management summary
export const fetchSchoolManagementSummary = createAsyncThunk(
  "schools/fetchSchoolManagementSummary",
  async (_, { rejectWithValue }) => {
    try {
      console.log("📡 [SchoolSlice] Calling GetSchoolManagementSummary...");
      console.log("📡 [SchoolSlice] BASE_URL:", BASE_URL);
      const res = await axios.get(
        `${BASE_URL}/institute/GetSchoolManagementSummary`,
        getAxiosConfig()
      );

      console.log("✅ [SchoolSlice] Raw summary response:", res.data);
      console.log("✅ [SchoolSlice] Response status:", res.status);

      // Handle response structure: direct array or wrapped in `data`
      let summaryArray = [];
      
      if (Array.isArray(res.data)) {
        summaryArray = res.data;
      } else if (res.data?.ok && Array.isArray(res.data.data)) {
        summaryArray = res.data.data;
      } else if (Array.isArray(res.data.data)) {
        summaryArray = res.data.data;
      }

      console.log("📊 [SchoolSlice] Parsed schoolManagementSummary length:", summaryArray.length);
      if (summaryArray.length > 0) {
        console.log("📊 [SchoolSlice] First summary item:", summaryArray[0]);
      }

      return summaryArray;
    } catch (error) {
      console.error("Error fetching school management summary:", error);
      return rejectWithValue(
        error.response?.data?.message || "Failed to fetch school management summary"
      );
    }
  }
);

// Async thunk to create institute
export const createInstitute = createAsyncThunk(
  "schools/createInstitute",
  async (instituteData, { rejectWithValue }) => {
    try {
      // Extract userId from token
      let userId = null;
      const token = getAuthToken();
      if (token) {
        const decoded = decodeToken(token);
        if (decoded) {
          userId = decoded.sub 
            || decoded.userId 
            || decoded.UserId 
            || decoded.id 
            || decoded.Id;
        }
      }

      // Map form data to stored procedure parameters
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

      const res = await axios.post(
        `${BASE_URL}/institute/createinstituteInfo`,
        payload,
        getAxiosConfig()
      );

      return res.data;
    } catch (error) {
      console.error("Error creating institute:", error);
      return rejectWithValue(
        error.response?.data?.message || "Failed to create institute"
      );
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

