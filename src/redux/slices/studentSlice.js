import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { studentService } from "@/services/studentService";
import { getAuthToken } from "@/configs/api";
import { decodeToken } from "@/redux/authHelper";

// Async thunk to fetch students by institute ID
export const fetchStudentsByInstitute = createAsyncThunk(
  "students/fetchStudentsByInstitute",
  async (instituteId, { rejectWithValue }) => {
    try {
      let finalInstituteId = instituteId;
      if (!finalInstituteId) {
        const token = getAuthToken();
        const decoded = token ? decodeToken(token) : null;
        finalInstituteId = decoded?.instituteId || decoded?.InstituteId || decoded?.sub;
      }
      
      if (!finalInstituteId) return rejectWithValue("Institute ID is required");
      
      const response = await studentService.getStudentsByInstitute(finalInstituteId);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || error.message || "Failed to fetch students");
    }
  }
);

// Async thunk to create student
export const createStudent = createAsyncThunk(
  "students/createStudent",
  async (studentData, { rejectWithValue }) => {
    try {
      const token = getAuthToken();
      const decoded = token ? decodeToken(token) : null;
      let instituteId = decoded?.instituteId || decoded?.InstituteId || decoded?.sub;
      
      if (!instituteId) {
        const storedInstituteId = localStorage.getItem("instituteId");
        if (storedInstituteId) instituteId = parseInt(storedInstituteId, 10);
      }
      
      if (!instituteId || isNaN(instituteId)) instituteId = 9;

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
        instituteId: Number(instituteId),
      };

      const response = await studentService.createStudent(payload);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || "Failed to create student");
    }
  }
);

const initialState = {
  students: [],
  loading: {
    creating: false,
    fetching: false,
  },
  error: {
    creating: null,
    fetching: null,
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
      })
      .addCase(createStudent.fulfilled, (state, action) => {
        state.loading.creating = false;
        state.error.creating = null;
      })
      .addCase(createStudent.rejected, (state, action) => {
        state.loading.creating = false;
        state.error.creating = action.payload || "Failed to create student";
        console.error("Create student failed:", action.payload);
      })
      // Fetch students by institute
      .addCase(fetchStudentsByInstitute.pending, (state) => {
        state.loading.fetching = true;
        state.error.fetching = null;
      })
      .addCase(fetchStudentsByInstitute.fulfilled, (state, action) => {
        const payload = action.payload || [];
        console.log("✅ [Redux Reducer] fetchStudentsByInstitute fulfilled");
        console.log("✅ [Redux Reducer] Payload received:", payload);
        console.log("✅ [Redux Reducer] Payload length:", payload.length);
        state.loading.fetching = false;
        state.students = Array.isArray(payload) ? payload : [];
        state.error.fetching = null;
        console.log("✅ [Redux Reducer] State updated - students count:", state.students.length);
      })
      .addCase(fetchStudentsByInstitute.rejected, (state, action) => {
        state.loading.fetching = false;
        state.error.fetching = action.payload || "Failed to fetch students";
        state.students = [];
        console.error("Fetch students failed:", action.payload);
      });
  },
});

export const { clearStudentErrors } = studentSlice.actions;
export default studentSlice.reducer;

