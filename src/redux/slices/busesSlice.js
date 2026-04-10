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

      const serviceIntervalValue = busData.serviceInterval || null;

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
        serviceInterval: serviceIntervalValue,
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

// Async thunk to update bus
export const updateBus = createAsyncThunk(
  "buses/updateBus",
  async ({ vehicleId, busData }, { rejectWithValue }) => {
    try {

      const serviceIntervalValue = busData.serviceInterval || null;

      // Handle undercarriageStorage - convert yes/no to number or keep as number
      let undercarriageStorageValue = null;
      if (busData.undercarriageStorage === 'yes' || busData.undercarriageStorage === 1) {
        undercarriageStorageValue = 1;
      } else if (busData.undercarriageStorage === 'no' || busData.undercarriageStorage === 0) {
        undercarriageStorageValue = 0;
      } else if (typeof busData.undercarriageStorage === 'number') {
        undercarriageStorageValue = busData.undercarriageStorage;
      }

      // Get driver ID
      let driverIdValue = null;
      if (busData.driver) {
        const parsed = parseInt(busData.driver, 10);
        if (!isNaN(parsed)) driverIdValue = parsed;
      }

      // Build payload matching API specification
      const payload = {
        vehicleId: vehicleId, // Use vehicleId as per API spec
        vehicleName: busData.vehicleName || null,
        busType: busData.busType || null,
        numberPlate: busData.numberPlate || null,
        modelYear: busData.modelYear ? parseInt(busData.modelYear, 10) : null,
        serviceInterval: serviceIntervalValue,
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
        undercarriageStorage: undercarriageStorageValue,
      };


      const response = await busService.updateBus(vehicleId, payload);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || error.message || "Failed to update bus");
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
    updating: false,
  },
  error: {
    drivers: null,
    fuelTypes: null,
    terminals: null,
    buses: null,
    creating: null,
    updating: null,
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
      })
      .addCase(fetchDrivers.fulfilled, (state, action) => {
        state.loading.drivers = false;
        state.drivers = action.payload;
        state.error.drivers = null;
      })
      .addCase(fetchDrivers.rejected, (state, action) => {
        state.loading.drivers = false;
        state.error.drivers = action.payload || "Failed to fetch drivers";
        state.drivers = [];
      })
      // Fetch fuel types
      .addCase(fetchFuelTypes.pending, (state) => {
        state.loading.fuelTypes = true;
        state.error.fuelTypes = null;
      })
      .addCase(fetchFuelTypes.fulfilled, (state, action) => {
        state.loading.fuelTypes = false;
        state.fuelTypes = action.payload;
        state.error.fuelTypes = null;
      })
      .addCase(fetchFuelTypes.rejected, (state, action) => {
        state.loading.fuelTypes = false;
        state.error.fuelTypes = action.payload || "Failed to fetch fuel types";
        state.fuelTypes = [];
      })
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
      })
      // Fetch buses
      .addCase(fetchBuses.pending, (state) => {
        state.loading.buses = true;
        state.error.buses = null;
      })
      .addCase(fetchBuses.fulfilled, (state, action) => {
        state.loading.buses = false;
        state.buses = action.payload;
        state.error.buses = null;
      })
      .addCase(fetchBuses.rejected, (state, action) => {
        state.loading.buses = false;
        state.error.buses = action.payload || "Failed to fetch buses";
        state.buses = [];
      })
      // Create bus
      .addCase(createBus.pending, (state) => {
        state.loading.creating = true;
        state.error.creating = null;
      })
      .addCase(createBus.fulfilled, (state, action) => {
        state.loading.creating = false;
        state.error.creating = null;
      })
      .addCase(createBus.rejected, (state, action) => {
        state.loading.creating = false;
        state.error.creating = action.payload || "Failed to create bus";
      })
      // Update bus
      .addCase(updateBus.pending, (state) => {
        state.loading.updating = true;
        state.error.updating = null;
      })
      .addCase(updateBus.fulfilled, (state, action) => {
        state.loading.updating = false;
        state.error.updating = null;
      })
      .addCase(updateBus.rejected, (state, action) => {
        state.loading.updating = false;
        state.error.updating = action.payload || "Failed to update bus";
      })
      // Create terminal
      .addCase(createTerminal.pending, (state) => {
        state.loading.creating = true;
        state.error.creating = null;
      })
      .addCase(createTerminal.fulfilled, (state, action) => {
        state.loading.creating = false;
        state.error.creating = null;
      })
      .addCase(createTerminal.rejected, (state, action) => {
        state.loading.creating = false;
        state.error.creating = action.payload || "Failed to create terminal";
      });
  },
});

export const { clearBuses } = busesSlice.actions;
export default busesSlice.reducer;

