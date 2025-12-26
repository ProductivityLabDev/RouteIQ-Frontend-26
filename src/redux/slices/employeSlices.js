import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { employeeService } from "@/services/employeeService";
import { busService } from "@/services/busService";
import { schoolService } from "@/services/schoolService";
import { getAuthToken } from "@/configs/api";
import { decodeToken } from "@/redux/authHelper";

// Async thunk to fetch pay types
export const fetchPayTypes = createAsyncThunk(
  "employees/fetchPayTypes",
  async (_, { rejectWithValue }) => {
    try {
      const response = await employeeService.getPayTypes();
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || "Failed to fetch pay types");
    }
  }
);

// Async thunk to fetch pay cycles
export const fetchPayCycles = createAsyncThunk(
  "employees/fetchPayCycles",
  async (_, { rejectWithValue }) => {
    try {
      const response = await employeeService.getPayCycles();
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || "Failed to fetch pay cycles");
    }
  }
);

// Async thunk to fetch terminals
export const fetchTerminals = createAsyncThunk(
  "employees/fetchTerminals",
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
  "employees/fetchStates",
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
  "employees/fetchCities",
  async (_, { rejectWithValue }) => {
    try {
      const response = await schoolService.getCities();
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || "Failed to fetch cities");
    }
  }
);

// Async thunk to fetch employees
export const fetchEmployees = createAsyncThunk(
  "employees/fetchEmployees",
  async (_, { rejectWithValue }) => {
    try {
      const token = getAuthToken();
      if (!token) return rejectWithValue("No token found");
      
      const decoded = decodeToken(token);
      const userId = decoded?.sub || decoded?.userId || decoded?.UserId || 1;
      
      const response = await employeeService.getEmployees(Number(userId));
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || "Failed to fetch employees");
    }
  }
);

// Async thunk to create employee
export const createEmployee = createAsyncThunk(
  "employees/createEmployee",
  async (formData, { rejectWithValue }) => {
    try {
      const token = getAuthToken();
      let userId = 1;
      if (token) {
        const decoded = decodeToken(token);
        if (decoded?.sub) userId = decoded.sub;
      }
      
      const data = new FormData();
      if (formData.filePath) data.append("file", formData.filePath);
      if (formData.drivingLicenses) data.append("drivingLicenses", formData.drivingLicenses);
      if (formData.certificates) data.append("certificates", formData.certificates);
      
      data.append("userId", userId);
      data.append("name", formData.name || "");
      data.append("adress", formData.adress || "");
      
      const cityValue = formData.city && !isNaN(Number(formData.city)) ? String(Math.floor(Number(formData.city))) : "0";
      data.append("city", cityValue);
      data.append("zipCode", formData.zipCode || "");
      
      const stateIdValue = formData.stateId ? String(Math.floor(Number(formData.stateId))) : "0";
      data.append("stateId", stateIdValue);
      data.append("dob", formData.dop || "");
      data.append("joiningDate", formData.joiningDate || "");
      data.append("status", formData.status || "Active");
      
      const positionTypeValue = formData.positionType ? String(Math.floor(Number(formData.positionType))) : "";
      data.append("positionType", positionTypeValue);
      data.append("email", formData.email || "");
      data.append("emergencyContact", formData.emergencyContact || "");
      data.append("payGrade", formData.payGrade || "");
      data.append("routeRate", formData.routeRate || "");
      data.append("terminalAssigmedId", formData.terminalAssigmed || "");
      
      const fuelCardCodeValue = formData.fuelCardCode && !isNaN(Number(formData.fuelCardCode)) ? String(Math.floor(Number(formData.fuelCardCode))) : "0";
      data.append("fuelCardCode", fuelCardCodeValue);
      data.append("payCycleId", formData.payCycle || "");
      
      let payTypeValue = formData.payTypeId || formData.payType || "";
      data.append("payType", String(payTypeValue));

      const response = await employeeService.createEmployee(data);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || "Failed to create employee");
    }
  }
);

const initialState = {
  employees: [], // Added for the list of drivers/employees
  payTypes: [],
  payCycles: [],
  terminals: [],
  states: [],
  cities: [],
  loading: {
    employees: false,
    payTypes: false,
    payCycles: false,
    terminals: false,
    states: false,
    creating: false,
  },
  error: {
    employees: null,
    payTypes: null,
    payCycles: null,
    terminals: null,
    states: null,
    creating: null,
  },
};

const employeeSlice = createSlice({
  name: "employees",
  initialState,
  reducers: {
    clearEmployees: (state) => {
      state.payTypes = [];
      state.payCycles = [];
      state.terminals = [];
      state.states = [];
      state.error = {
        payTypes: null,
        payCycles: null,
        terminals: null,
        states: null,
        creating: null,
      };
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch employees
      .addCase(fetchEmployees.pending, (state) => {
        state.loading.employees = true;
        state.error.employees = null;
      })
      .addCase(fetchEmployees.fulfilled, (state, action) => {
        state.loading.employees = false;
        state.employees = action.payload;
        state.error.employees = null;
      })
      .addCase(fetchEmployees.rejected, (state, action) => {
        state.loading.employees = false;
        state.error.employees = action.payload || "Failed to fetch employees";
        state.employees = [];
      })
      // Fetch pay types
      .addCase(fetchPayTypes.pending, (state) => {
        state.loading.payTypes = true;
        state.error.payTypes = null;
        console.log("⏳ [Redux] Fetching pay types...");
      })
      .addCase(fetchPayTypes.fulfilled, (state, action) => {
        state.loading.payTypes = false;
        state.payTypes = action.payload;
        state.error.payTypes = null;
        console.log("✅ [Redux] Pay types loaded:", action.payload.length);
      })
      .addCase(fetchPayTypes.rejected, (state, action) => {
        state.loading.payTypes = false;
        state.error.payTypes = action.payload || "Failed to fetch pay types";
        state.payTypes = [];
        console.error("❌ [Redux] Fetch pay types failed:", action.payload);
      })
      // Fetch pay cycles
      .addCase(fetchPayCycles.pending, (state) => {
        state.loading.payCycles = true;
        state.error.payCycles = null;
        console.log("⏳ [Redux] Fetching pay cycles...");
      })
      .addCase(fetchPayCycles.fulfilled, (state, action) => {
        state.loading.payCycles = false;
        state.payCycles = action.payload;
        state.error.payCycles = null;
        console.log("✅ [Redux] Pay cycles loaded:", action.payload.length);
      })
      .addCase(fetchPayCycles.rejected, (state, action) => {
        state.loading.payCycles = false;
        state.error.payCycles = action.payload || "Failed to fetch pay cycles";
        state.payCycles = [];
        console.error("❌ [Redux] Fetch pay cycles failed:", action.payload);
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
        console.log("✅ [Redux] Cities loaded:", action.payload.length);
      })
      .addCase(fetchCities.rejected, (state, action) => {
        state.loading.cities = false;
        state.error.cities = action.payload || "Failed to fetch cities";
        state.cities = [];
        console.error("❌ [Redux] Fetch cities failed:", action.payload);
      })
      // Create employee
      .addCase(createEmployee.pending, (state) => {
        state.loading.creating = true;
        state.error.creating = null;
        console.log("⏳ [Redux] Creating employee...");
      })
      .addCase(createEmployee.fulfilled, (state, action) => {
        state.loading.creating = false;
        state.error.creating = null;
        console.log("✅ [Redux] Employee created");
      })
      .addCase(createEmployee.rejected, (state, action) => {
        state.loading.creating = false;
        state.error.creating = action.payload || "Failed to create employee";
        console.error("❌ [Redux] Create employee failed:", action.payload);
      });
  },
});

export const { clearEmployees } = employeeSlice.actions;
export default employeeSlice.reducer;


