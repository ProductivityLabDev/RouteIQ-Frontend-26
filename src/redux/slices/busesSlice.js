import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import { BASE_URL, getAxiosConfig, getAuthToken } from "@/configs/api";
import { decodeToken } from "@/redux/authHelper";

// Async thunk to fetch drivers
export const fetchDrivers = createAsyncThunk(
  "buses/fetchDrivers",
  async (_, { rejectWithValue }) => {
    try {
      console.log("🔄 [Redux] Fetching drivers...");
      const res = await axios.get(
        `${BASE_URL}/institute/drivers`,
        getAxiosConfig()
      );

      console.log("Fetched Drivers:", res.data);
      
      // Handle response structure: { ok: true, data: [...] }
      const driversArray = res.data?.data && Array.isArray(res.data.data)
        ? res.data.data
        : Array.isArray(res.data)
          ? res.data
          : [];

      console.log("✅ [Redux] Drivers fetched successfully:", driversArray.length);
      return driversArray;
    } catch (error) {
      console.error("❌ [Redux] Error fetching drivers:", error);
      return rejectWithValue(
        error.response?.data?.message || "Failed to fetch drivers"
      );
    }
  }
);

// Async thunk to fetch fuel types
export const fetchFuelTypes = createAsyncThunk(
  "buses/fetchFuelTypes",
  async (_, { rejectWithValue }) => {
    try {
      console.log("🔄 [Redux] Fetching fuel types...");
      const res = await axios.get(
        `${BASE_URL}/institute/fueltypes`,
        getAxiosConfig()
      );

      console.log("Fetched Fuel Types:", res.data);
      
      // Handle response structure: { ok: true, data: [...] }
      const fuelTypesArray = res.data?.data && Array.isArray(res.data.data)
        ? res.data.data
        : Array.isArray(res.data)
          ? res.data
          : [];

      console.log("✅ [Redux] Fuel types fetched successfully:", fuelTypesArray.length);
      return fuelTypesArray;
    } catch (error) {
      console.error("❌ [Redux] Error fetching fuel types:", error);
      return rejectWithValue(
        error.response?.data?.message || "Failed to fetch fuel types"
      );
    }
  }
);

// Async thunk to fetch terminals
export const fetchTerminals = createAsyncThunk(
  "buses/fetchTerminals",
  async (_, { rejectWithValue }) => {
    try {
      console.log("🔄 [Redux] Fetching terminals...");
      const res = await axios.get(
        `${BASE_URL}/terminals`,
        getAxiosConfig()
      );

      console.log("Fetched terminals:", res.data);

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

// Async thunk to fetch buses by userId
export const fetchBuses = createAsyncThunk(
  "buses/fetchBuses",
  async (_, { rejectWithValue }) => {
    try {
      console.log("🔄 [Redux] Fetching buses...");
      
      const token = getAuthToken();
      if (!token) {
        console.error("❌ [Redux] No token found, cannot fetch buses.");
        return rejectWithValue("Authentication token not found");
      }

      // Decode token to extract user id
      let userId = null;
      try {
        const decoded = decodeToken(token);
        if (decoded) {
          userId =
            decoded.userId ||
            decoded.UserId ||
            decoded.user_id ||
            decoded.id ||
            decoded.Id ||
            decoded.sub ||
            null;
        }
      } catch (decodeError) {
        console.error("❌ [Redux] Failed to decode token:", decodeError);
        return rejectWithValue("Failed to decode authentication token");
      }

      if (!userId) {
        console.error("❌ [Redux] No userId found in token. GetBusInfo requires userId.");
        return rejectWithValue("User ID not found in token");
      }

      // Ensure we send only the numeric id as a path param: /GetBusInfo/54
      const numericUserId = Number(userId);
      if (!numericUserId || Number.isNaN(numericUserId)) {
        console.error("❌ [Redux] Invalid userId (must be a number):", userId);
        return rejectWithValue("Invalid user ID");
      }

      const apiUrl = `${BASE_URL}/institute/GetBusInfo/${numericUserId}`;
      console.log("📡 [Redux] Calling GetBusInfo with URL:", apiUrl);

      const res = await axios.get(apiUrl, getAxiosConfig());

      console.log("✅ [Redux] Buses raw response:", res.data);

      // Handle response structure: direct array or wrapped in `data`
      const busesArray = Array.isArray(res.data)
        ? res.data
        : Array.isArray(res.data.data)
          ? res.data.data
          : [];

      console.log("🚍 [Redux] All Bus IDs:", busesArray.map(b => b.BusId));
      console.log("✅ [Redux] Buses fetched successfully:", busesArray.length);
      return busesArray;
    } catch (error) {
      console.error("❌ [Redux] Error fetching buses:", error);
      return rejectWithValue(
        error.response?.data?.message || "Failed to fetch buses"
      );
    }
  }
);

// Async thunk to create bus
export const createBus = createAsyncThunk(
  "buses/createBus",
  async (busData, { rejectWithValue }) => {
    try {
      console.log("🔄 [Redux] Creating bus...", busData);
      
      // Extract userId from token if available
      let userId = null;
      const token = getAuthToken();
      if (token) {
        const decoded = decodeToken(token);
        if (decoded) {
          userId = decoded.sub || decoded.id || decoded.userId || decoded.UserId;
        }
      }

      // Calculate serviceInterval as number of days from today to the selected date
      let serviceIntervalDays = null;
      if (busData.serviceInterval) {
        const serviceDate = new Date(busData.serviceInterval);
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        serviceDate.setHours(0, 0, 0, 0);
        const diffTime = serviceDate.getTime() - today.getTime();
        serviceIntervalDays = Math.round(diffTime / (1000 * 60 * 60 * 24));
      }

      // Convert undercarriageStorage from "yes"/"no" to number (1 for yes, 0 for no)
      const undercarriageStorageNum = busData.undercarriageStorage === 'yes' 
        ? 1 
        : busData.undercarriageStorage === 'no' 
          ? 0 
          : null;

      // Ensure driverId is always set (default to 1 for testing since drivers API is not working)
      let driverIdValue = 1; // Default to 1
      if (busData.driver && busData.driver !== "" && busData.driver !== null && busData.driver !== undefined) {
        const parsed = parseInt(busData.driver, 10);
        if (!isNaN(parsed)) {
          driverIdValue = parsed;
        }
      }
      
      console.log("🔍 [Redux] Driver value from form:", busData.driver, "→ driverId:", driverIdValue);

      // Map form data to DTO structure
      const payload = {
        vehicleName: busData.vehicleName || null,
        busType: busData.busType || null,
        numberPlate: busData.numberPlate || null,
        modelYear: busData.modelYear ? parseInt(busData.modelYear, 10) : null,
        serviceInterval: serviceIntervalDays,
        fuelTankSize: busData.fuelTankSize ? parseFloat(busData.fuelTankSize) : null,
        assignedTerminalId: busData.assignedTerminal ? parseInt(busData.assignedTerminal, 10) : null,
        expiredDate: busData.expiredDate || null,
        vehicleMake: busData.vehicleMake || null,
        noOfPassenger: busData.noOfPassenger ? parseInt(busData.noOfPassenger, 10) : null,
        vinNo: busData.vinNo || null,
        mileage: busData.mileage ? parseFloat(busData.mileage) : null,
        driverId: driverIdValue,
        fuelTypeId: busData.fuelType ? parseInt(busData.fuelType, 10) : null,
        insuranceExpiration: busData.insuranceExpiration || null,
        undercarriageStorage: undercarriageStorageNum,
        userId: userId,
      };

      console.log("📤 [Redux] Submitting bus data:", payload);
      const res = await axios.post(
        `${BASE_URL}/institute/createbuses`,
        payload,
        getAxiosConfig()
      );

      console.log("✅ [Redux] Bus created successfully:", res.data);
      return res.data;
    } catch (error) {
      console.error("❌ [Redux] Error creating bus:", error);
      console.error("❌ [Redux] Error response:", error.response?.data);
      console.error("❌ [Redux] Error status:", error.response?.status);
      console.error("❌ [Redux] Full error:", error);
      
      const errorMessage = error.response?.data?.message 
        || error.response?.data?.error 
        || error.message 
        || "Failed to create bus";
      
      return rejectWithValue(errorMessage);
    }
  }
);

const initialState = {
  drivers: [],
  fuelTypes: [],
  terminals: [],
  buses: [],
  loading: {
    drivers: false,
    fuelTypes: false,
    terminals: false,
    buses: false,
    creating: false,
  },
  error: {
    drivers: null,
    fuelTypes: null,
    terminals: null,
    buses: null,
    creating: null,
  },
};

const busesSlice = createSlice({
  name: "buses",
  initialState,
  reducers: {
    clearBuses: (state) => {
      state.drivers = [];
      state.fuelTypes = [];
      state.terminals = [];
      state.buses = [];
      state.error = {
        drivers: null,
        fuelTypes: null,
        terminals: null,
        buses: null,
        creating: null,
      };
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch drivers
      .addCase(fetchDrivers.pending, (state) => {
        state.loading.drivers = true;
        state.error.drivers = null;
        console.log("⏳ [Redux] Fetching drivers...");
      })
      .addCase(fetchDrivers.fulfilled, (state, action) => {
        state.loading.drivers = false;
        state.drivers = action.payload;
        state.error.drivers = null;
        console.log("✅ [Redux] Drivers loaded:", action.payload.length);
      })
      .addCase(fetchDrivers.rejected, (state, action) => {
        state.loading.drivers = false;
        state.error.drivers = action.payload || "Failed to fetch drivers";
        state.drivers = [];
        console.error("❌ [Redux] Fetch drivers failed:", action.payload);
      })
      // Fetch fuel types
      .addCase(fetchFuelTypes.pending, (state) => {
        state.loading.fuelTypes = true;
        state.error.fuelTypes = null;
        console.log("⏳ [Redux] Fetching fuel types...");
      })
      .addCase(fetchFuelTypes.fulfilled, (state, action) => {
        state.loading.fuelTypes = false;
        state.fuelTypes = action.payload;
        state.error.fuelTypes = null;
        console.log("✅ [Redux] Fuel types loaded:", action.payload.length);
      })
      .addCase(fetchFuelTypes.rejected, (state, action) => {
        state.loading.fuelTypes = false;
        state.error.fuelTypes = action.payload || "Failed to fetch fuel types";
        state.fuelTypes = [];
        console.error("❌ [Redux] Fetch fuel types failed:", action.payload);
      })
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
      // Fetch buses
      .addCase(fetchBuses.pending, (state) => {
        state.loading.buses = true;
        state.error.buses = null;
        console.log("⏳ [Redux] Fetching buses...");
      })
      .addCase(fetchBuses.fulfilled, (state, action) => {
        state.loading.buses = false;
        state.buses = action.payload;
        state.error.buses = null;
        console.log("✅ [Redux] Buses loaded:", action.payload.length);
      })
      .addCase(fetchBuses.rejected, (state, action) => {
        state.loading.buses = false;
        state.error.buses = action.payload || "Failed to fetch buses";
        state.buses = [];
        console.error("❌ [Redux] Fetch buses failed:", action.payload);
      })
      // Create bus
      .addCase(createBus.pending, (state) => {
        state.loading.creating = true;
        state.error.creating = null;
        console.log("⏳ [Redux] Creating bus...");
      })
      .addCase(createBus.fulfilled, (state, action) => {
        state.loading.creating = false;
        state.error.creating = null;
        console.log("✅ [Redux] Bus created");
      })
      .addCase(createBus.rejected, (state, action) => {
        state.loading.creating = false;
        state.error.creating = action.payload || "Failed to create bus";
        console.error("❌ [Redux] Create bus failed:", action.payload);
      });
  },
});

export const { clearBuses } = busesSlice.actions;
export default busesSlice.reducer;

