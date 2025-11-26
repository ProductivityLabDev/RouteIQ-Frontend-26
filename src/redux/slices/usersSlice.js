import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import { BASE_URL, getAxiosConfig, getAuthToken } from "@/configs/api";
import { decodeToken } from "@/redux/authHelper";

// Mapping from module names to module IDs
// TODO: Update these IDs based on your actual module IDs from the backend
const MODULE_NAME_TO_ID = {
  VEHICLE: 1,
  EMPLOYEE: 2,
  SCHOOL: 3,
  ROUTE: 4,
  TRACKING: 5,
  SCHEDULING: 6,
  CHATS: 7,
  ACCOUNTING: 8,
  STUDENT: 9,
  ACCESS: 10,
  FEEDBACK: 11,
  DOCUMENTS: 12,
};

// Helper function to convert module names/strings to numeric IDs
const convertModulesToIds = (modules) => {
  if (!Array.isArray(modules) || modules.length === 0) return [];
  
  return modules.map(module => {
    // If already a number, return it
    if (typeof module === 'number') return module;
    
    // If it's a string, try to find the ID in the mapping
    const moduleName = typeof module === 'string' ? module.toUpperCase().trim() : null;
    if (moduleName && MODULE_NAME_TO_ID[moduleName]) {
      return MODULE_NAME_TO_ID[moduleName];
    }
    
    // If it's a numeric string, try to parse it
    if (typeof module === 'string') {
      const numId = parseInt(module, 10);
      if (!isNaN(numId)) return numId;
    }
    
    // If we can't convert it, log a warning and return null (will be filtered out)
    console.warn(`⚠️ [Redux] Unknown module: ${module}. Please update MODULE_NAME_TO_ID mapping.`);
    return null;
  }).filter(id => id !== null && !isNaN(id));
};

// Async thunk to fetch users
export const fetchUsers = createAsyncThunk(
  "users/fetchUsers",
  async (_, { rejectWithValue }) => {
    try {
      console.log("🔄 [Redux] Fetching users...");
      
      // Extract vendor ID from token
      let vendorId = null;
      const token = getAuthToken();
      if (token) {
        const decoded = decodeToken(token);
        if (decoded) {
          vendorId = decoded.sub 
            || decoded.VendorSignupId 
            || decoded.vendorSignupId 
            || decoded.vendorSignupID 
            || decoded.VendorSignupID
            || decoded.id
            || decoded.userId
            || decoded.UserId;
          console.log("📋 [Redux] Extracted vendor ID from token:", vendorId);
        }
      }
      
      if (!vendorId) {
        console.warn("⚠️ [Redux] No vendor ID found in token. Cannot fetch users.");
        return rejectWithValue("Vendor ID not found in token");
      }
      
      const res = await axios.get(
        `${BASE_URL}/institute/GetUserCredentials/${vendorId}`,
        getAxiosConfig()
      );

      const list = Array.isArray(res.data)
        ? res.data
        : Array.isArray(res.data.data)
        ? res.data.data
        : [];

      // Sort users (newest first)
      const hasSortableFields = list.some(
        (item) => item.createdAt || item.id !== undefined || item.UserId
      );

      let sortedList;
      if (hasSortableFields) {
        sortedList = [...list].sort((a, b) => {
          if (a.createdAt && b.createdAt) {
            return new Date(b.createdAt) - new Date(a.createdAt);
          }
          if (a.id !== undefined && b.id !== undefined) {
            return b.id - a.id;
          }
          if (a.UserId && b.UserId) {
            return b.UserId - a.UserId;
          }
          return 0;
        });
      } else {
        sortedList = [...list].reverse();
      }

      console.log("✅ [Redux] Users fetched successfully:", sortedList.length);
      return sortedList;
    } catch (error) {
      console.error("❌ [Redux] Error fetching users:", error);
      return rejectWithValue(
        error.response?.data?.message || "Failed to fetch users"
      );
    }
  }
);

// Async thunk to create user
export const createUser = createAsyncThunk(
  "/vendor/users",
  async (userData, { rejectWithValue, dispatch }) => {
    try {
      console.log("🔄 [Redux] Creating user...", userData);
      
      // Extract VendorSignupId from token if not provided in userData
      let vendorSignupId = userData.VendorSignupId || userData.vendorSignupId;
      if (!vendorSignupId) {
        // First, try to get from token
        const token = getAuthToken();
        if (token) {
          const decoded = decodeToken(token);
          if (decoded) {
            // Log the entire decoded token to see what fields are available
            console.log("🔍 [Redux] Decoded token:", decoded);
            console.log("🔍 [Redux] All token keys:", Object.keys(decoded));
            
            // Try multiple possible field names (sub is standard JWT claim for subject/user ID)
            vendorSignupId = decoded.sub
              || decoded.VendorSignupId 
              || decoded.vendorSignupId 
              || decoded.vendorSignupID 
              || decoded.VendorSignupID
              || decoded.vendor_signup_id
              || decoded.Vendor_Signup_Id
              || decoded.vendorId
              || decoded.VendorId
              || decoded.id
              || decoded.userId
              || decoded.UserId;
            
            console.log("📋 [Redux] Extracted VendorSignupId from token:", vendorSignupId);
            
            // If still not found, log all numeric fields that might be the ID
            if (!vendorSignupId) {
              const numericFields = Object.entries(decoded)
                .filter(([key, value]) => typeof value === 'number')
                .map(([key, value]) => `${key}: ${value}`);
              console.log("⚠️ [Redux] No VendorSignupId found. Numeric fields in token:", numericFields);
            }
          } else {
            console.warn("⚠️ [Redux] Failed to decode token");
          }
        } else {
          console.warn("⚠️ [Redux] No token found in localStorage");
        }
        
        // If still not found, try localStorage "vendor" object
        if (!vendorSignupId) {
          try {
            const vendorData = localStorage.getItem("vendor");
            if (vendorData) {
              const vendor = JSON.parse(vendorData);
              vendorSignupId = vendor.vendorSignupId || vendor.VendorSignupId || vendor.id || vendor.vendorId;
              console.log("📋 [Redux] Extracted VendorSignupId from localStorage vendor:", vendorSignupId);
            }
          } catch (e) {
            console.warn("⚠️ [Redux] Error reading vendor from localStorage:", e);
          }
        }
      }
      
      // Map permission to control if needed
      const control = userData.control || (userData.permission === "Read & Write" || userData.permission === "MANAGER" ? "READ_WRITE" : "READ_ONLY");
      
      // Ensure terminalIds are numbers (convert from strings if needed)
      const terminalIds = (userData.terminalIds || userData.terminalCodes || []).map(id => {
        const numId = typeof id === 'string' ? parseInt(id, 10) : id;
        return isNaN(numId) ? null : numId;
      }).filter(id => id !== null);
      
      // Convert module names to numeric IDs
      const moduleIds = convertModulesToIds(userData.moduleIds || userData.modules || []);
      
      const payload = {
        username: userData.username,
        password: userData.password,
        roleCode: userData.roleCode,
        terminalIds: terminalIds,
        moduleIds: moduleIds,
        control: control,
        isActive: userData.isActive !== undefined ? userData.isActive : true,
        email: userData.email,
        phoneNumber: userData.phoneNumber,
        department: userData.department || "",
        permission: userData.permission || "",
        VendorSignupId: vendorSignupId || null,
      };

      const res = await axios.post(
        `${BASE_URL}/vendor/users`,
        payload,
        getAxiosConfig()
      );

      console.log("✅ [Redux] User created successfully:", res.data);
      
      // Refresh users list after creation
      dispatch(fetchUsers());
      
      return res.data;
    } catch (error) {
      console.error("❌ [Redux] Error creating user:", error);
      return rejectWithValue(
        error.response?.data?.message || "Failed to create user"
      );
    }
  }
);

// Async thunk to update user
export const updateUser = createAsyncThunk(
  "users/updateUser",
  async ({ userId, userData }, { rejectWithValue, dispatch }) => {
    try {
      console.log("🔄 [Redux] Updating user:", userId, userData);
      
      // Extract VendorSignupId from token if not provided in userData
      let vendorSignupId = userData.VendorSignupId || userData.vendorSignupId;
      if (!vendorSignupId) {
        // First, try to get from token
        const token = getAuthToken();
        if (token) {
          const decoded = decodeToken(token);
          if (decoded) {
            // Try multiple possible field names (sub is standard JWT claim for subject/user ID)
            vendorSignupId = decoded.sub
              || decoded.VendorSignupId 
              || decoded.vendorSignupId 
              || decoded.vendorSignupID 
              || decoded.VendorSignupID
              || decoded.vendor_signup_id
              || decoded.Vendor_Signup_Id
              || decoded.vendorId
              || decoded.VendorId
              || decoded.id
              || decoded.userId
              || decoded.UserId;
            
            console.log("📋 [Redux] Extracted VendorSignupId from token:", vendorSignupId);
          } else {
            console.warn("⚠️ [Redux] Failed to decode token");
          }
        } else {
          console.warn("⚠️ [Redux] No token found in localStorage");
        }
        
        // If still not found, try localStorage "vendor" object
        if (!vendorSignupId) {
          try {
            const vendorData = localStorage.getItem("vendor");
            if (vendorData) {
              const vendor = JSON.parse(vendorData);
              vendorSignupId = vendor.vendorSignupId || vendor.VendorSignupId || vendor.id || vendor.vendorId;
              console.log("📋 [Redux] Extracted VendorSignupId from localStorage vendor:", vendorSignupId);
            }
          } catch (e) {
            console.warn("⚠️ [Redux] Error reading vendor from localStorage:", e);
          }
        }
      }
      
      // Map permission to control if needed
      const control = userData.control || (userData.permission === "Read & Write" || userData.permission === "MANAGER" ? "READ_WRITE" : "READ_ONLY");
      
      // Ensure terminalIds are numbers (convert from strings if needed)
      const terminalIds = (userData.terminalIds || userData.terminalCodes || []).map(id => {
        const numId = typeof id === 'string' ? parseInt(id, 10) : id;
        return isNaN(numId) ? null : numId;
      }).filter(id => id !== null);
      
      // Convert module names to numeric IDs
      const moduleIds = convertModulesToIds(userData.moduleIds || userData.modules || []);
      
      const payload = {
        username: userData.username,
        password: userData.password,
        roleCode: userData.roleCode,
        terminalIds: terminalIds,
        moduleIds: moduleIds,
        control: control,
        isActive: userData.isActive !== undefined ? userData.isActive : true,
        email: userData.email,
        phoneNumber: userData.phoneNumber,
        department: userData.department || "",
        permission: userData.permission || "",
        VendorSignupId: vendorSignupId || null,
      };

      const res = await axios.patch(
        `${BASE_URL}/vendor/users/${userId}`,
        payload,
        getAxiosConfig()
      );

      console.log("✅ [Redux] User updated successfully:", res.data);
      
      // Refresh users list after update
      dispatch(fetchUsers());
      
      return res.data;
    } catch (error) {
      console.error("❌ [Redux] Error updating user:", error);
      return rejectWithValue(
        error.response?.data?.message || "Failed to update user"
      );
    }
  }
);

// Async thunk to delete user
export const deleteUser = createAsyncThunk(
  "users/deleteUser",
  async (userId, { rejectWithValue, dispatch }) => {
    try {
      console.log("🔄 [Redux] Deleting user:", userId);
      
      const res = await axios.delete(
        `${BASE_URL}/vendor/users/${userId}/soft-delete`,
        getAxiosConfig()
      );

      console.log("✅ [Redux] User deleted successfully:", res.data);
      
      // Refresh users list after deletion
      dispatch(fetchUsers());
      
      return { userId, data: res.data };
    } catch (error) {
      console.error("❌ [Redux] Error deleting user:", error);
      return rejectWithValue(
        error.response?.data?.message || "Failed to delete user"
      );
    }
  }
);

const initialState = {
  users: [],
  loading: false,
  error: null,
  creating: false,
  updating: false,
  deleting: false,
};

const usersSlice = createSlice({
  name: "users",
  initialState,
  reducers: {
    clearUsers: (state) => {
      state.users = [];
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch users
      .addCase(fetchUsers.pending, (state) => {
        state.loading = true;
        state.error = null;
        console.log("⏳ [Redux] Fetching users...");
      })
      .addCase(fetchUsers.fulfilled, (state, action) => {
        state.loading = false;
        state.users = action.payload;
        state.error = null;
        console.log("✅ [Redux] Users loaded:", action.payload.length);
      })
      .addCase(fetchUsers.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || "Failed to fetch users";
        state.users = [];
        console.error("❌ [Redux] Fetch failed:", action.payload);
      })
      // Create user
      .addCase(createUser.pending, (state) => {
        state.creating = true;
        state.error = null;
        console.log("⏳ [Redux] Creating user...");
      })
      .addCase(createUser.fulfilled, (state, action) => {
        state.creating = false;
        state.error = null;
        console.log("✅ [Redux] User created");
      })
      .addCase(createUser.rejected, (state, action) => {
        state.creating = false;
        state.error = action.payload || "Failed to create user";
        console.error("❌ [Redux] Create failed:", action.payload);
      })
      // Update user
      .addCase(updateUser.pending, (state) => {
        state.updating = true;
        state.error = null;
        console.log("⏳ [Redux] Updating user...");
      })
      .addCase(updateUser.fulfilled, (state, action) => {
        state.updating = false;
        state.error = null;
        console.log("✅ [Redux] User updated");
      })
      .addCase(updateUser.rejected, (state, action) => {
        state.updating = false;
        state.error = action.payload || "Failed to update user";
        console.error("❌ [Redux] Update failed:", action.payload);
      })
      // Delete user
      .addCase(deleteUser.pending, (state) => {
        state.deleting = true;
        state.error = null;
        console.log("⏳ [Redux] Deleting user...");
      })
      .addCase(deleteUser.fulfilled, (state, action) => {
        state.deleting = false;
        state.error = null;
        console.log("✅ [Redux] User deleted");
      })
      .addCase(deleteUser.rejected, (state, action) => {
        state.deleting = false;
        state.error = action.payload || "Failed to delete user";
        console.error("❌ [Redux] Delete failed:", action.payload);
      });
  },
});

export const { clearUsers } = usersSlice.actions;
export default usersSlice.reducer;

