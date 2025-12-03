import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import { BASE_URL, getAxiosConfig } from "@/configs/api";

// Async thunk to create student
export const createStudent = createAsyncThunk(
  "students/createStudent",
  async (studentData, { rejectWithValue }) => {
    try {
      console.log("🔄 [Redux] Creating student...", studentData);

      // Hardcode InstituteId to 9 (will be extracted from token later)
      const instituteId = 9;

      // Map form data to API payload (camelCase as expected by backend DTO)
      const payload = {
        firstName: studentData.firstName || "",
        lastName: studentData.lastName || "",
        pickupLocation: studentData.pickupLocation || "",
        dropLocation: studentData.dropLocation || "",
        grade: studentData.grade || "",
        emergencyContact: studentData.emergencyContact || "",
        enrollmentNo: studentData.enrollmentNo || "",
        address: studentData.address || "",
        guardian1: studentData.guardian1 || "",
        guardian2: studentData.guardian2 || "",
        guardianEmail: studentData.guardianEmail || "",
        busNo: studentData.busNo || "",
        instituteId: 9,
      };

      console.log("📤 [Redux] Submitting student data:", payload);

      const res = await axios.post(
        `${BASE_URL}/institute/create-student`,
        payload,
        getAxiosConfig()
      );

      console.log("✅ [Redux] Student created successfully:", res.data);
      return res.data;
    } catch (error) {
      console.error("❌ [Redux] Error creating student:", error);
      return rejectWithValue(
        error.response?.data?.message || "Failed to create student"
      );
    }
  }
);

const initialState = {
  loading: {
    creating: false,
  },
  error: {
    creating: null,
  },
};

const studentSlice = createSlice({
  name: "students",
  initialState,
  reducers: {
    clearStudentErrors: (state) => {
      state.error.creating = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Create student
      .addCase(createStudent.pending, (state) => {
        state.loading.creating = true;
        state.error.creating = null;
        console.log("⏳ [Redux] Creating student...");
      })
      .addCase(createStudent.fulfilled, (state, action) => {
        state.loading.creating = false;
        state.error.creating = null;
        console.log("✅ [Redux] Student created");
      })
      .addCase(createStudent.rejected, (state, action) => {
        state.loading.creating = false;
        state.error.creating = action.payload || "Failed to create student";
        console.error("❌ [Redux] Create student failed:", action.payload);
      });
  },
});

export const { clearStudentErrors } = studentSlice.actions;
export default studentSlice.reducer;

