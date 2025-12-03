import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import { BASE_URL, getAxiosConfig, getAuthToken } from "@/configs/api";
import { decodeToken } from "@/redux/authHelper";

// Async thunk to fetch terminals (for school management)
export const fetchTerminals = createAsyncThunk(
  "schools/fetchTerminals",
  async (_, { rejectWithValue }) => {
    try {
      console.log("🔄 [Redux] Fetching terminals for schools...");
      const res = await axios.get(
        `${BASE_URL}/terminals`,
        getAxiosConfig()
      );

      console.log("Fetched terminals:", res.data);

      // Handle response structure: direct array or wrapped in `data`
      const terminalsArray = Array.isArray(res.data)
        ? res.data
        : Array.isArray(res.data.data)
          ? res.data.data
          : [];

      console.log("✅ [Redux] Terminals fetched successfully:", terminalsArray.length);
      return terminalsArray;
    } catch (error) {
      console.error("❌ [Redux] Error fetching terminals:", error);
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
      console.log("🔄 [Redux] Fetching states for schools...");
      const res = await axios.get(
        `${BASE_URL}/institute/GetStates`,
        getAxiosConfig()
      );

     // console.log("Fetched states - Full response:", res.data);
     // console.log("Fetched states - res.data.data:", res.data?.data);

      // Handle response structure: direct array or wrapped in `{ok: true, data: [...]}`
      let statesArray = [];
      
      if (Array.isArray(res.data)) {
        // Direct array response
        statesArray = res.data;
      } else if (res.data?.ok && Array.isArray(res.data.data)) {
        // Wrapped in {ok: true, data: [...]}
        statesArray = res.data.data;
      } else if (Array.isArray(res.data.data)) {
        // Just wrapped in {data: [...]}
        statesArray = res.data.data;
      }

    //  console.log("✅ [Redux] States array:", statesArray);
     // console.log("✅ [Redux] States fetched successfully:", statesArray.length);
      return statesArray;
    } catch (error) {
      console.error("❌ [Redux] Error fetching states:", error);
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
      console.log("🔄 [Redux] Fetching cities...");
      const res = await axios.get(
        `${BASE_URL}/institute/GetCities`,
        getAxiosConfig()
      );

     // console.log("Fetched cities - Full response:", res.data);
      //console.log("Fetched cities - res.data.data:", res.data?.data);

      // Handle response structure: direct array or wrapped in `data`
      let citiesArray = [];
      
      if (Array.isArray(res.data)) {
        // Direct array response
        citiesArray = res.data;
      } else if (res.data?.ok && Array.isArray(res.data.data)) {
        // Wrapped in {ok: true, data: [...]}
        citiesArray = res.data.data;
      } else if (Array.isArray(res.data.data)) {
        // Just wrapped in {data: [...]}
        citiesArray = res.data.data;
      }

      console.log("✅ [Redux] Cities array:", citiesArray.length, "cities");
      return citiesArray;
    } catch (error) {
      console.error("❌ [Redux] Error fetching cities:", error);
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
      console.log("🔄 [Redux] Fetching institute types...");
      const res = await axios.get(
        `${BASE_URL}/institute/GetInstituteType`,
        getAxiosConfig()
      );

     // console.log("Fetched institute types - Full response:", res.data);
     // console.log("Fetched institute types - res.data.data:", res.data?.data);

      // Handle response structure: direct array or wrapped in `data`
      let typesArray = [];
      
      if (Array.isArray(res.data)) {
        // Direct array response
        typesArray = res.data;
      } else if (res.data?.ok && Array.isArray(res.data.data)) {
        // Wrapped in {ok: true, data: [...]}
        typesArray = res.data.data;
      } else if (Array.isArray(res.data.data)) {
        // Just wrapped in {data: [...]}
        typesArray = res.data.data;
      }

      //console.log("✅ [Redux] Institute types array:", typesArray);
      //console.log("✅ [Redux] Institute types fetched successfully:", typesArray.length);
      return typesArray;
    } catch (error) {
      console.error("❌ [Redux] Error fetching institute types:", error);
      return rejectWithValue(
        error.response?.data?.message || "Failed to fetch institute types"
      );
    }
  }
);

// Async thunk to create institute
export const createInstitute = createAsyncThunk(
  "schools/createInstitute",
  async (instituteData, { rejectWithValue }) => {
    try {
      // console.log("🔄 [Redux] Creating institute...", instituteData);

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
          console.log("📋 [Redux] Extracted userId from token:", userId);
        }
      }

      // Map form data to stored procedure parameters
      // Remember: @District, @Principle, @TerminalId, @InstituteType, @InstituteName, 
      // @TotalStudent, @TotalBus, @ContactPhone, @Address, @ContactEmail, @City, @StateId, @ZipCode, @UserId
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

      console.log("📤 [Redux] Submitting institute data:", payload);

      const res = await axios.post(
        `${BASE_URL}/institute/createinstituteInfo`,
        payload,
        getAxiosConfig()
      );

      console.log("✅ [Redux] Institute created successfully:", res.data);
      return res.data;
    } catch (error) {
      console.error("❌ [Redux] Error creating institute:", error);
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
  loading: {
    terminals: false,
    states: false,
    cities: false,
    instituteTypes: false,
    creating: false,
  },
  error: {
    terminals: null,
    states: null,
    cities: null,
    instituteTypes: null,
    creating: null,
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
        console.log("⏳ [Redux] Fetching terminals...");
      })
      .addCase(fetchTerminals.fulfilled, (state, action) => {
        state.loading.terminals = false;
        state.terminals = action.payload;
        state.error.terminals = null;
        console.log("✅ [Redux] Terminals loaded:", action.payload.length);
      })
      .addCase(fetchTerminals.rejected, (state, action) => {
        state.loading.terminals = false;
        state.error.terminals = action.payload || "Failed to fetch terminals";
        state.terminals = [];
        console.error("❌ [Redux] Fetch terminals failed:", action.payload);
      })
      // Fetch states
      .addCase(fetchStates.pending, (state) => {
        state.loading.states = true;
        state.error.states = null;
        console.log("⏳ [Redux] Fetching states...");
      })
      .addCase(fetchStates.fulfilled, (state, action) => {
        state.loading.states = false;
        state.states = action.payload;
        state.error.states = null;
        console.log("✅ [Redux] States loaded:", action.payload.length);
      })
      .addCase(fetchStates.rejected, (state, action) => {
        state.loading.states = false;
        state.error.states = action.payload || "Failed to fetch states";
        state.states = [];
        console.error("❌ [Redux] Fetch states failed:", action.payload);
      })
      // Fetch cities
      .addCase(fetchCities.pending, (state) => {
        state.loading.cities = true;
        state.error.cities = null;
        console.log("⏳ [Redux] Fetching cities...");
      })
      .addCase(fetchCities.fulfilled, (state, action) => {
        state.loading.cities = false;
        state.cities = action.payload;
        state.error.cities = null;
        console.log("✅ [Redux] Cities loaded:", action.payload);
        console.log("✅ [Redux] Cities count:", action.payload.length);
      })
      .addCase(fetchCities.rejected, (state, action) => {
        state.loading.cities = false;
        state.error.cities = action.payload || "Failed to fetch cities";
        state.cities = [];
        console.error("❌ [Redux] Fetch cities failed:", action.payload);
      })
      // Fetch institute types
      .addCase(fetchInstituteTypes.pending, (state) => {
        state.loading.instituteTypes = true;
        state.error.instituteTypes = null;
        console.log("⏳ [Redux] Fetching institute types...");
      })
      .addCase(fetchInstituteTypes.fulfilled, (state, action) => {
        state.loading.instituteTypes = false;
        state.instituteTypes = action.payload;
        state.error.instituteTypes = null;
        console.log("✅ [Redux] Institute types loaded:", action.payload);
        console.log("✅ [Redux] Institute types count:", action.payload.length);
      })
      .addCase(fetchInstituteTypes.rejected, (state, action) => {
        state.loading.instituteTypes = false;
        state.error.instituteTypes = action.payload || "Failed to fetch institute types";
        state.instituteTypes = [];
        console.error("❌ [Redux] Fetch institute types failed:", action.payload);
      })
      // Create institute
      .addCase(createInstitute.pending, (state) => {
        state.loading.creating = true;
        state.error.creating = null;
        console.log("⏳ [Redux] Creating institute...");
      })
      .addCase(createInstitute.fulfilled, (state, action) => {
        state.loading.creating = false;
        state.error.creating = null;
        console.log("✅ [Redux] Institute created");
      })
      .addCase(createInstitute.rejected, (state, action) => {
        state.loading.creating = false;
        state.error.creating = action.payload || "Failed to create institute";
        console.error("❌ [Redux] Create institute failed:", action.payload);
      });
  },
});

export const { clearSchools } = schoolSlice.actions;
export default schoolSlice.reducer;

