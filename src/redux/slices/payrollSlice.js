import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { payrollService } from "@/services/payrollService";

// ─── Thunks ───────────────────────────────────────────────────────────────────

export const fetchTerminals = createAsyncThunk(
  "payroll/fetchTerminals",
  async (_, { rejectWithValue }) => {
    try {
      const res = await payrollService.getTerminals();
      return res.data;
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || "Failed to fetch terminals");
    }
  }
);

export const fetchTerminalDetail = createAsyncThunk(
  "payroll/fetchTerminalDetail",
  async ({ terminalId, month, year, limit, offset }, { rejectWithValue }) => {
    try {
      const res = await payrollService.getTerminalDetail(terminalId, month, year, limit, offset);
      return res.data;
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || "Failed to fetch terminal detail");
    }
  }
);

export const updateTerminalRates = createAsyncThunk(
  "payroll/updateTerminalRates",
  async ({ terminalId, routeRate, tripRate }, { rejectWithValue }) => {
    try {
      const res = await payrollService.updateTerminalRates(terminalId, { routeRate, tripRate });
      return { terminalId, ...res.data };
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || "Failed to update terminal rates");
    }
  }
);

export const bulkGenerateTerminalPayroll = createAsyncThunk(
  "payroll/bulkGenerateTerminalPayroll",
  async ({ terminalId, ...data }, { rejectWithValue }) => {
    try {
      const res = await payrollService.bulkGeneratePayroll(terminalId, data);
      return res.data;
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || "Failed to bulk generate payroll");
    }
  }
);

export const updateTerminalSettings = createAsyncThunk(
  "payroll/updateTerminalSettings",
  async ({ terminalId, ...data }, { rejectWithValue }) => {
    try {
      const res = await payrollService.updateTerminalSettings(terminalId, data);
      return res.data;
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || "Failed to update terminal settings");
    }
  }
);

export const fetchDriverShifts = createAsyncThunk(
  "payroll/fetchDriverShifts",
  async ({ employeeId, month, year }, { rejectWithValue }) => {
    try {
      const res = await payrollService.getDriverShifts(employeeId, month, year);
      return res.data;
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || "Failed to fetch driver shifts");
    }
  }
);

export const fetchPayrollSummary = createAsyncThunk(
  "payroll/fetchPayrollSummary",
  async ({ month, year } = {}, { rejectWithValue }) => {
    try {
      const res = await payrollService.getPayrollSummary(month, year);
      return res.data;
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || "Failed to fetch payroll summary");
    }
  }
);

export const generateDriverPayroll = createAsyncThunk(
  "payroll/generateDriverPayroll",
  async (data, { rejectWithValue }) => {
    try {
      const res = await payrollService.generatePayroll(data);
      return res.data;
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || "Failed to generate payroll");
    }
  }
);

export const updatePayrollStatus = createAsyncThunk(
  "payroll/updatePayrollStatus",
  async ({ payrollId, status }, { rejectWithValue }) => {
    try {
      const res = await payrollService.updatePayrollStatus(payrollId, status);
      return res.data;
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || "Failed to update payroll status");
    }
  }
);

export const fetchDriverPaystub = createAsyncThunk(
  "payroll/fetchDriverPaystub",
  async ({ employeeId, payrollId }, { rejectWithValue }) => {
    try {
      const res = await payrollService.getDriverPaystub(employeeId, payrollId);
      return res.data;
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || "Failed to fetch paystub");
    }
  }
);

export const saveDriverDetails = createAsyncThunk(
  "payroll/saveDriverDetails",
  async ({ employeeId, data }, { rejectWithValue }) => {
    try {
      const res = await payrollService.updateDriverDetails(employeeId, data);
      return res.data;
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || "Failed to save driver details");
    }
  }
);

export const fetchDriverBenefits = createAsyncThunk(
  "payroll/fetchDriverBenefits",
  async (employeeId, { rejectWithValue }) => {
    try {
      const res = await payrollService.getDriverBenefits(employeeId);
      return res.data;
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || "Failed to fetch benefits");
    }
  }
);

export const saveDriverBenefits = createAsyncThunk(
  "payroll/saveDriverBenefits",
  async ({ employeeId, data }, { rejectWithValue }) => {
    try {
      const res = await payrollService.setDriverBenefits(employeeId, data);
      return res.data;
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || "Failed to save benefits");
    }
  }
);

export const fetchDriverTimeOff = createAsyncThunk(
  "payroll/fetchDriverTimeOff",
  async (employeeId, { rejectWithValue }) => {
    try {
      const res = await payrollService.getDriverTimeOff(employeeId);
      return res.data;
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || "Failed to fetch time off");
    }
  }
);

export const approveTimeOffRequest = createAsyncThunk(
  "payroll/approveTimeOffRequest",
  async ({ requestId, note }, { rejectWithValue }) => {
    try {
      const res = await payrollService.approveTimeOff(requestId, note);
      return { requestId, ...res.data };
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || "Failed to approve time off");
    }
  }
);

export const rejectTimeOffRequest = createAsyncThunk(
  "payroll/rejectTimeOffRequest",
  async ({ requestId, note }, { rejectWithValue }) => {
    try {
      const res = await payrollService.rejectTimeOff(requestId, note);
      return { requestId, ...res.data };
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || "Failed to reject time off");
    }
  }
);

// ─── Slice ────────────────────────────────────────────────────────────────────

const payrollSlice = createSlice({
  name: "payroll",
  initialState: {
    terminals: [],
    terminalDetail: null,
    payrollSummary: null,
    generatedPayroll: null,
    driverShifts: [],
    driverPaystub: null,
    driverBenefits: null,
    driverTimeOff: null,
    loading: {
      terminals: false,
      terminalDetail: false,
      payrollSummary: false,
      generatePayroll: false,
      bulkGenerate: false,
      terminalSettings: false,
      driverShifts: false,
      updateStatus: false,
      paystub: false,
      driverDetails: false,
      benefits: false,
      timeOff: false,
      approveReject: false,
    },
    error: {
      terminals: null,
      terminalDetail: null,
      payrollSummary: null,
      generatePayroll: null,
      bulkGenerate: null,
      terminalSettings: null,
      driverShifts: null,
      updateStatus: null,
      paystub: null,
      driverDetails: null,
      benefits: null,
      timeOff: null,
      approveReject: null,
    },
  },
  reducers: {
    clearDriverTimeOff: (state) => {
      state.driverTimeOff = null;
    },
    clearDriverPaystub: (state) => {
      state.driverPaystub = null;
    },
    clearDriverBenefits: (state) => {
      state.driverBenefits = null;
    },
    clearTerminalDetail: (state) => {
      state.terminalDetail = null;
    },
    clearDriverShifts: (state) => {
      state.driverShifts = [];
    },
  },
  extraReducers: (builder) => {
    // fetchTerminals
    builder
      .addCase(fetchTerminals.pending, (state) => { state.loading.terminals = true; state.error.terminals = null; })
      .addCase(fetchTerminals.fulfilled, (state, action) => { state.loading.terminals = false; state.terminals = action.payload || []; })
      .addCase(fetchTerminals.rejected, (state, action) => { state.loading.terminals = false; state.error.terminals = action.payload; });

    // fetchTerminalDetail
    builder
      .addCase(fetchTerminalDetail.pending, (state) => { state.loading.terminalDetail = true; state.error.terminalDetail = null; })
      .addCase(fetchTerminalDetail.fulfilled, (state, action) => { state.loading.terminalDetail = false; state.terminalDetail = action.payload; })
      .addCase(fetchTerminalDetail.rejected, (state, action) => { state.loading.terminalDetail = false; state.error.terminalDetail = action.payload; });

    // updateTerminalRates
    builder
      .addCase(updateTerminalRates.pending, (state) => { state.loading.terminalDetail = true; })
      .addCase(updateTerminalRates.fulfilled, (state) => { state.loading.terminalDetail = false; })
      .addCase(updateTerminalRates.rejected, (state) => { state.loading.terminalDetail = false; });

    // fetchPayrollSummary
    builder
      .addCase(fetchPayrollSummary.pending, (state) => { state.loading.payrollSummary = true; state.error.payrollSummary = null; })
      .addCase(fetchPayrollSummary.fulfilled, (state, action) => { state.loading.payrollSummary = false; state.payrollSummary = action.payload; })
      .addCase(fetchPayrollSummary.rejected, (state, action) => { state.loading.payrollSummary = false; state.error.payrollSummary = action.payload; });

    // generateDriverPayroll
    builder
      .addCase(generateDriverPayroll.pending, (state) => { state.loading.generatePayroll = true; state.error.generatePayroll = null; })
      .addCase(generateDriverPayroll.fulfilled, (state, action) => { state.loading.generatePayroll = false; state.generatedPayroll = action.payload; })
      .addCase(generateDriverPayroll.rejected, (state, action) => { state.loading.generatePayroll = false; state.error.generatePayroll = action.payload; });

    // bulkGenerateTerminalPayroll
    builder
      .addCase(bulkGenerateTerminalPayroll.pending, (state) => { state.loading.bulkGenerate = true; state.error.bulkGenerate = null; })
      .addCase(bulkGenerateTerminalPayroll.fulfilled, (state) => { state.loading.bulkGenerate = false; })
      .addCase(bulkGenerateTerminalPayroll.rejected, (state, action) => { state.loading.bulkGenerate = false; state.error.bulkGenerate = action.payload; });

    // updateTerminalSettings
    builder
      .addCase(updateTerminalSettings.pending, (state) => { state.loading.terminalSettings = true; state.error.terminalSettings = null; })
      .addCase(updateTerminalSettings.fulfilled, (state) => { state.loading.terminalSettings = false; })
      .addCase(updateTerminalSettings.rejected, (state, action) => { state.loading.terminalSettings = false; state.error.terminalSettings = action.payload; });

    // fetchDriverShifts
    builder
      .addCase(fetchDriverShifts.pending, (state) => { state.loading.driverShifts = true; state.error.driverShifts = null; })
      .addCase(fetchDriverShifts.fulfilled, (state, action) => { state.loading.driverShifts = false; state.driverShifts = action.payload || []; })
      .addCase(fetchDriverShifts.rejected, (state, action) => { state.loading.driverShifts = false; state.error.driverShifts = action.payload; });

    // updatePayrollStatus
    builder
      .addCase(updatePayrollStatus.pending, (state) => { state.loading.updateStatus = true; state.error.updateStatus = null; })
      .addCase(updatePayrollStatus.fulfilled, (state) => { state.loading.updateStatus = false; })
      .addCase(updatePayrollStatus.rejected, (state, action) => { state.loading.updateStatus = false; state.error.updateStatus = action.payload; });

    // fetchDriverPaystub
    builder
      .addCase(fetchDriverPaystub.pending, (state) => { state.loading.paystub = true; state.error.paystub = null; })
      .addCase(fetchDriverPaystub.fulfilled, (state, action) => { state.loading.paystub = false; state.driverPaystub = action.payload; })
      .addCase(fetchDriverPaystub.rejected, (state, action) => { state.loading.paystub = false; state.error.paystub = action.payload; });

    // saveDriverDetails
    builder
      .addCase(saveDriverDetails.pending, (state) => { state.loading.driverDetails = true; state.error.driverDetails = null; })
      .addCase(saveDriverDetails.fulfilled, (state) => { state.loading.driverDetails = false; })
      .addCase(saveDriverDetails.rejected, (state, action) => { state.loading.driverDetails = false; state.error.driverDetails = action.payload; });

    // fetchDriverBenefits
    builder
      .addCase(fetchDriverBenefits.pending, (state) => { state.loading.benefits = true; state.error.benefits = null; })
      .addCase(fetchDriverBenefits.fulfilled, (state, action) => { state.loading.benefits = false; state.driverBenefits = action.payload; })
      .addCase(fetchDriverBenefits.rejected, (state, action) => { state.loading.benefits = false; state.error.benefits = action.payload; });

    // saveDriverBenefits
    builder
      .addCase(saveDriverBenefits.pending, (state) => { state.loading.benefits = true; })
      .addCase(saveDriverBenefits.fulfilled, (state) => { state.loading.benefits = false; })
      .addCase(saveDriverBenefits.rejected, (state, action) => { state.loading.benefits = false; state.error.benefits = action.payload; });

    // fetchDriverTimeOff
    builder
      .addCase(fetchDriverTimeOff.pending, (state) => { state.loading.timeOff = true; state.error.timeOff = null; })
      .addCase(fetchDriverTimeOff.fulfilled, (state, action) => { state.loading.timeOff = false; state.driverTimeOff = action.payload; })
      .addCase(fetchDriverTimeOff.rejected, (state, action) => { state.loading.timeOff = false; state.error.timeOff = action.payload; });

    // approveTimeOffRequest
    builder
      .addCase(approveTimeOffRequest.pending, (state) => { state.loading.approveReject = true; state.error.approveReject = null; })
      .addCase(approveTimeOffRequest.fulfilled, (state, action) => {
        state.loading.approveReject = false;
        if (state.driverTimeOff?.pending) {
          state.driverTimeOff.pending = state.driverTimeOff.pending.filter(
            (r) => r.requestId !== action.payload.requestId
          );
        }
      })
      .addCase(approveTimeOffRequest.rejected, (state, action) => { state.loading.approveReject = false; state.error.approveReject = action.payload; });

    // rejectTimeOffRequest
    builder
      .addCase(rejectTimeOffRequest.pending, (state) => { state.loading.approveReject = true; state.error.approveReject = null; })
      .addCase(rejectTimeOffRequest.fulfilled, (state, action) => {
        state.loading.approveReject = false;
        if (state.driverTimeOff?.pending) {
          state.driverTimeOff.pending = state.driverTimeOff.pending.filter(
            (r) => r.requestId !== action.payload.requestId
          );
        }
      })
      .addCase(rejectTimeOffRequest.rejected, (state, action) => { state.loading.approveReject = false; state.error.approveReject = action.payload; });
  },
});

export const { clearDriverTimeOff, clearDriverPaystub, clearDriverBenefits, clearTerminalDetail, clearDriverShifts } = payrollSlice.actions;
export default payrollSlice.reducer;
