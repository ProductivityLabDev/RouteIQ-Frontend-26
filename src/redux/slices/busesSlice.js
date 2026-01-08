import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { busService } from "@/services/busService";
import { getAuthToken } from "@/configs/api";
import { decodeToken } from "@/redux/authHelper";

// Async thunk to fetch drivers
export const fetchDrivers = createAsyncThunk(
  "buses/fetchDrivers",
  async (_, { rejectWithValue }) => {
    try {
      const response = await busService.getDrivers();
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || "Failed to fetch drivers");
    }
  }
);

// Async thunk to fetch fuel types
export const fetchFuelTypes = createAsyncThunk(
  "buses/fetchFuelTypes",
  async (_, { rejectWithValue }) => {
    try {
      const response = await busService.getFuelTypes();
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || "Failed to fetch fuel types");
    }
  }
);

// Async thunk to fetch terminals
export const fetchTerminals = createAsyncThunk(
  "buses/fetchTerminals",
  async (_, { rejectWithValue }) => {
    try {
      const response = await busService.getTerminals();
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || "Failed to fetch terminals");
    }
  }
);

// Async thunk to create terminal
export const createTerminal = createAsyncThunk(
  "buses/createTerminal",
  async (terminalData, { rejectWithValue }) => {
    try {
      const response = await busService.createTerminal(terminalData);
      return response.data;
    } catch (error) {
      const msg = error?.response?.data?.message;
      // Nest often returns { message: string[] }
      const normalized =
        Array.isArray(msg) ? msg.join(", ") : msg || "Failed to create terminal";
      return rejectWithValue(normalized);
    }
  }
);

// Async thunk to fetch buses by userId
export const fetchBuses = createAsyncThunk(
  "buses/fetchBuses",
  async (_, { rejectWithValue }) => {
    try {
      const token = getAuthToken();
      if (!token) return rejectWithValue("Authentication token not found");

      const decoded = decodeToken(token);
      const userId = decoded?.userId || decoded?.UserId || decoded?.id || decoded?.sub;

      if (!userId) return rejectWithValue("User ID not found in token");

      const response = await busService.getBusesByUserId(Number(userId));
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || "Failed to fetch buses");
    }
  }
);

// Async thunk to create bus
export const createBus = createAsyncThunk(
  "buses/createBus",
  async (busData, { rejectWithValue }) => {
    try {
      const token = getAuthToken();
      const decoded = token ? decodeToken(token) : null;
      const userId = decoded?.sub || decoded?.id || decoded?.userId || decoded?.UserId;

      let serviceIntervalDays = null;
      if (busData.serviceInterval) {
        const serviceDate = new Date(busData.serviceInterval);
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        serviceDate.setHours(0, 0, 0, 0);
        const diffTime = serviceDate.getTime() - today.getTime();
        serviceIntervalDays = Math.round(diffTime / (1000 * 60 * 60 * 24));
      }

      const undercarriageStorageNum = busData.undercarriageStorage === 'yes' ? 1 : busData.undercarriageStorage === 'no' ? 0 : null;

      let driverIdValue = 1;
      if (busData.driver) {
        const parsed = parseInt(busData.driver, 10);
        if (!isNaN(parsed)) driverIdValue = parsed;
      }

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

      const response = await busService.createBus(payload);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || error.message || "Failed to create bus");
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
      })
      // Create terminal
      .addCase(createTerminal.pending, (state) => {
        state.loading.creating = true;
        state.error.creating = null;
      })
      .addCase(createTerminal.fulfilled, (state, action) => {
        state.loading.creating = false;
        state.error.creating = null;
        console.log("✅ [Redux] Terminal created");
      })
      .addCase(createTerminal.rejected, (state, action) => {
        state.loading.creating = false;
        state.error.creating = action.payload || "Failed to create terminal";
        console.error("❌ [Redux] Create terminal failed:", action.payload);
      });
  },
});

export const { clearBuses } = busesSlice.actions;
export default busesSlice.reducer;

