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
        pickupLatitude: studentData.pickupLatitude !== null && studentData.pickupLatitude !== undefined ? Number(studentData.pickupLatitude) : null,
        pickupLongitude: studentData.pickupLongitude !== null && studentData.pickupLongitude !== undefined ? Number(studentData.pickupLongitude) : null,
        dropLocation: studentData.dropLocation || "",
        dropLatitude: studentData.dropLatitude !== null && studentData.dropLatitude !== undefined ? Number(studentData.dropLatitude) : null,
        dropLongitude: studentData.dropLongitude !== null && studentData.dropLongitude !== undefined ? Number(studentData.dropLongitude) : null,
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
      // response is backend envelope: { ok, message, data: { studentId, smartMatch, ... } }
      return response;
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
    clearStudents: (state) => {
      state.students = [];
      state.error.fetching = null;
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
        
        // Remove duplicates based on StudentId (keep first occurrence)
        const uniqueStudents = Array.isArray(payload) ? payload.filter((stu, index, self) => {
          const studentId = stu.StudentId || stu.studentId;
          if (!studentId) return true; // Keep students without ID
          return index === self.findIndex((s) => 
            (s.StudentId || s.studentId) === studentId
          );
        }) : [];
        
        state.students = uniqueStudents;
        state.error.fetching = null;
        console.log("✅ [Redux Reducer] State updated - unique students count:", state.students.length);
        if (payload.length !== uniqueStudents.length) {
          console.log(`⚠️ [Redux Reducer] Removed ${payload.length - uniqueStudents.length} duplicate students`);
        }
      })
      .addCase(fetchStudentsByInstitute.rejected, (state, action) => {
        state.loading.fetching = false;
        state.error.fetching = action.payload || "Failed to fetch students";
        state.students = [];
        console.error("Fetch students failed:", action.payload);
      });
  },
});

export const { clearStudentErrors, clearStudents } = studentSlice.actions;
export default studentSlice.reducer;

