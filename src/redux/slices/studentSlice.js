import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import { BASE_URL, getAxiosConfig, getAuthToken } from "@/configs/api";
import { decodeToken } from "@/redux/authHelper";

// Async thunk to fetch students by institute ID
export const fetchStudentsByInstitute = createAsyncThunk(
  "students/fetchStudentsByInstitute",
  async (instituteId, { rejectWithValue }) => {
    try {
      // If instituteId is not provided, try to get from token
      let finalInstituteId = instituteId;
      if (!finalInstituteId) {
        const token = getAuthToken();
        if (token) {
          const decoded = decodeToken(token);
          if (decoded) {
            finalInstituteId = decoded.instituteId 
              || decoded.InstituteId 
              || decoded.institute_id
              || decoded.instituteID
              || decoded.InstituteID
              || decoded.sub;
          }
        }
      }
      
      if (!finalInstituteId) {
        console.error("No instituteId found! Cannot fetch students.");
        return rejectWithValue("Institute ID is required");
      }
      
      const apiUrl = `${BASE_URL}/institute/GetStudentsByInstitute?InstituteId=${finalInstituteId}`;
      
      console.log("📤 [fetchStudentsByInstitute] API URL:", apiUrl);
      console.log("📤 [fetchStudentsByInstitute] Institute ID:", finalInstituteId);
      
      // Get token directly from localStorage
      const token = localStorage.getItem("token");
      
      if (!token) {
        console.error("No token found in localStorage!");
        return rejectWithValue("Authentication token not found. Please log in again.");
      }
      
      const res = await axios.get(apiUrl, {
        withCredentials: true,
        headers: { Authorization: `Bearer ${token}` },
      });

      console.log("✅ [fetchStudentsByInstitute] API Response:", res.data);
      console.log("✅ [fetchStudentsByInstitute] Response Status:", res.status);
      console.log("✅ [fetchStudentsByInstitute] Full Response:", res);

      // Handle response structure: direct array or wrapped in `data`
      let studentsArray = [];
      
      if (Array.isArray(res.data)) {
        studentsArray = res.data;
        console.log("✅ [fetchStudentsByInstitute] Using direct array response, count:", studentsArray.length);
      } else if (res.data && typeof res.data === 'object') {
        if (res.data.ok === true && Array.isArray(res.data.data)) {
          studentsArray = res.data.data;
          console.log("✅ [fetchStudentsByInstitute] Using wrapped response (ok=true), count:", studentsArray.length);
        } else if (Array.isArray(res.data.data)) {
          studentsArray = res.data.data;
          console.log("✅ [fetchStudentsByInstitute] Using wrapped response (data array), count:", studentsArray.length);
        } else if (res.data.students && Array.isArray(res.data.students)) {
          studentsArray = res.data.students;
          console.log("✅ [fetchStudentsByInstitute] Using students property, count:", studentsArray.length);
        } else {
          console.error("❌ [fetchStudentsByInstitute] Unexpected response structure:", res.data);
        }
      } else {
        console.error("❌ [fetchStudentsByInstitute] Response data is not an object or array:", res.data);
      }
      
      console.log("📊 [fetchStudentsByInstitute] Final students array:", studentsArray);
      console.log("📊 [fetchStudentsByInstitute] Students count:", studentsArray.length);
      if (studentsArray.length > 0) {
        console.log("📊 [fetchStudentsByInstitute] First student:", studentsArray[0]);
      }
      
      return studentsArray;
    } catch (error) {
      console.error("Error fetching students:", error.message);
      
      if (error.response?.status === 401 || error.response?.status === 403) {
        console.error("Authentication error - Token may be invalid or missing!");
      }
      
      return rejectWithValue(
        error.response?.data?.message || error.message || "Failed to fetch students"
      );
    }
  }
);

// Async thunk to create student
export const createStudent = createAsyncThunk(
  "students/createStudent",
  async (studentData, { rejectWithValue }) => {
    try {
      // Extract instituteId from token (for school login)
      let instituteId = null;
      const token = getAuthToken();
      
      if (token) {
        const decoded = decodeToken(token);
        if (decoded) {
          instituteId = decoded.instituteId 
            || decoded.InstituteId 
            || decoded.institute_id
            || decoded.instituteID
            || decoded.InstituteID;
        }
      }
      
      // Fallback: try to get from localStorage
      if (!instituteId) {
        const storedInstituteId = localStorage.getItem("instituteId");
        const storedUser = localStorage.getItem("user");
        
        if (storedInstituteId) {
          instituteId = parseInt(storedInstituteId, 10);
        } else if (storedUser) {
          try {
            const user = JSON.parse(storedUser);
            if (user.instituteId) {
              instituteId = user.instituteId;
            }
          } catch (e) {
            console.error("Error parsing user from localStorage:", e);
          }
        }
      }
      
      // Final fallback: use hardcoded value if still not found
      if (!instituteId || isNaN(instituteId)) {
        instituteId = 9;
      }

      // Map form data to API payload
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
        instituteId: instituteId ? Number(instituteId) : 9,
      };

      const res = await axios.post(
        `${BASE_URL}/institute/create-student`,
        payload,
        getAxiosConfig()
      );

      return res.data;
    } catch (error) {
      console.error("Error creating student:", error);
      return rejectWithValue(
        error.response?.data?.message || "Failed to create student"
      );
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

