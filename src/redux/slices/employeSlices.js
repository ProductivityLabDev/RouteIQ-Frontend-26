import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import { BASE_URL, getAxiosConfig } from "@/configs/api";

// Async thunk to fetch pay types
export const fetchPayTypes = createAsyncThunk(
  "employees/fetchPayTypes",
  async (_, { rejectWithValue }) => {
    try {
      console.log("🔄 [Redux] Fetching pay types...");
      const res = await axios.get(
        `${BASE_URL}/institute/paytypes`,
        getAxiosConfig()
      );

      console.log("Fetched pay types:", res.data);
      
      // Handle response structure: { ok: true, data: [...] }
      const payTypesArray = res.data?.data && Array.isArray(res.data.data)
        ? res.data.data
        : Array.isArray(res.data)
          ? res.data
          : [];

      console.log("✅ [Redux] Pay types fetched successfully:", payTypesArray.length);
      return payTypesArray;
    } catch (error) {
      console.error("❌ [Redux] Error fetching pay types:", error);
      return rejectWithValue(
        error.response?.data?.message || "Failed to fetch pay types"
      );
    }
  }
);

// Async thunk to fetch pay cycles
export const fetchPayCycles = createAsyncThunk(
  "employees/fetchPayCycles",
  async (_, { rejectWithValue }) => {
    try {
      console.log("🔄 [Redux] Fetching pay cycles...");
      const res = await axios.get(
        `${BASE_URL}/institute/paycycles`,
        getAxiosConfig()
      );

      console.log("Fetched pay cycles:", res.data);
      
      // Handle response structure: { ok: true, data: [...] }
      const payCyclesArray = res.data?.data && Array.isArray(res.data.data)
        ? res.data.data
        : Array.isArray(res.data)
          ? res.data
          : [];

      console.log("✅ [Redux] Pay cycles fetched successfully:", payCyclesArray.length);
      return payCyclesArray;
    } catch (error) {
      console.error("❌ [Redux] Error fetching pay cycles:", error);
      return rejectWithValue(
        error.response?.data?.message || "Failed to fetch pay cycles"
      );
    }
  }
);

// Async thunk to fetch terminals (reusable, can be shared with busesSlice if needed)
export const fetchTerminals = createAsyncThunk(
  "employees/fetchTerminals",
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

// Async thunk to fetch states
export const fetchStates = createAsyncThunk(
  "employees/fetchStates",
  async (_, { rejectWithValue }) => {
    try {
      console.log("🔄 [Redux] Fetching states...");
      const res = await axios.get(
        `${BASE_URL}/institute/GetStates`,
        getAxiosConfig()
      );

      console.log("Fetched states:", res.data);

      const statesArray = Array.isArray(res.data)
        ? res.data
        : Array.isArray(res.data.data)
          ? res.data.data
          : [];

      console.log("✅ [Redux] States fetched successfully:", statesArray.length);
      return statesArray;
    } catch (error) {
      console.error("❌ [Redux] Error fetching states:", error);
      return rejectWithValue(
        error.response?.data?.message || "Failed to fetch states"
      );
    }
  }
);

// Async thunk to create employee
export const createEmployee = createAsyncThunk(
  "employees/createEmployee",
  async (employeeData, { rejectWithValue }) => {
    try {
      console.log("🔄 [Redux] Creating employee...", employeeData);
      
      // Map form data to DTO structure
      const payload = {
        name: employeeData.name,
        adress: employeeData.adress,
        city: employeeData.city,
        state: employeeData.state,
        zipCode: employeeData.zipCode,
        dop: employeeData.dop,
        joiningDate: employeeData.joiningDate,
        positionType: employeeData.positionType || null,
        email: employeeData.email,
        payGrade: employeeData.payGrade || null,
        routeRate: employeeData.routeRate || null,
        payCycle: employeeData.payCycle,
        payType: employeeData.payTypeId || employeeData.payType,
        fuelCardCode: employeeData.fuelCardCode ? Number(employeeData.fuelCardCode) : null,
        terminalAssigmed: employeeData.terminalAssigmed,
        status: employeeData.status || "Active",
        filePath: employeeData.filePath || null,
        emergencyContactName: employeeData.emergencyContactName || null,
        emergencyContact: employeeData.emergencyContact ? Number(employeeData.emergencyContact) : null,
      };

      console.log("📤 [Redux] Submitting employee data:", payload);
      const res = await axios.post(
        `${BASE_URL}/institute/createEmployeeInfo`,
        payload,
        getAxiosConfig()
      );

      console.log("✅ [Redux] Employee created successfully:", res.data);
      return res.data;
    } catch (error) {
      console.error("❌ [Redux] Error creating employee:", error);
      return rejectWithValue(
        error.response?.data?.message || "Failed to create employee"
      );
    }
  }
);

const initialState = {
  payTypes: [],
  payCycles: [],
  terminals: [],
  states: [],
  loading: {
    payTypes: false,
    payCycles: false,
    terminals: false,
    states: false,
    creating: false,
  },
  error: {
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


