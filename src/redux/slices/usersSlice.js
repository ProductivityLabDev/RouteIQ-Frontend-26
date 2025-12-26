import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { userService } from "@/services/userService";
import { getAuthToken } from "@/configs/api";
import { decodeToken } from "@/redux/authHelper";

// Mapping from module names to module IDs
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
    if (typeof module === 'number') return module;
    const moduleName = typeof module === 'string' ? module.toUpperCase().trim() : null;
    if (moduleName && MODULE_NAME_TO_ID[moduleName]) {
      return MODULE_NAME_TO_ID[moduleName];
    }
    if (typeof module === 'string') {
      const numId = parseInt(module, 10);
      if (!isNaN(numId)) return numId;
    }
    return null;
  }).filter(id => id !== null && !isNaN(id));
};

// Helper to extract vendorId from token
const getVendorIdFromToken = () => {
  const token = getAuthToken();
  if (!token) return null;
  const decoded = decodeToken(token);
  if (!decoded) return null;
  
  return decoded.sub 
    || decoded.VendorSignupId 
    || decoded.vendorSignupId 
    || decoded.vendorSignupID 
    || decoded.VendorSignupID
    || decoded.id
    || decoded.userId
    || decoded.UserId;
};

// Async thunk to fetch users
export const fetchUsers = createAsyncThunk(
  "users/fetchUsers",
  async (_, { rejectWithValue }) => {
    try {
      const vendorId = getVendorIdFromToken();
      if (!vendorId) return rejectWithValue("Vendor ID not found in token");
      
      const response = await userService.getUsersByVendor(vendorId);
      const list = response.data;

      // Sort users (newest first)
      const sortedList = [...list].sort((a, b) => {
        const aDate = a.createdAt ? new Date(a.createdAt).getTime() : 0;
        const bDate = b.createdAt ? new Date(b.createdAt).getTime() : 0;
        if (aDate && bDate) return bDate - aDate;
        return (b.id || b.UserId || 0) - (a.id || a.UserId || 0);
      });

      return sortedList;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || "Failed to fetch users");
    }
  }
);

// Async thunk to create user
export const createUser = createAsyncThunk(
  "/vendor/users",
  async (userData, { rejectWithValue, dispatch }) => {
    try {
      let vendorSignupId = userData.VendorSignupId || userData.vendorSignupId || getVendorIdFromToken();
      
      const control = userData.control || (userData.permission === "Read & Write" || userData.permission === "MANAGER" ? "READ_WRITE" : "READ_ONLY");
      
      const terminalIds = (userData.terminalIds || userData.terminalCodes || []).map(id => {
        const numId = typeof id === 'string' ? parseInt(id, 10) : id;
        return isNaN(numId) ? null : numId;
      }).filter(id => id !== null);
      
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

      const response = await userService.createUser(payload);
      dispatch(fetchUsers());
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || "Failed to create user");
    }
  }
);

// Async thunk to update user
export const updateUser = createAsyncThunk(
  "users/updateUser",
  async ({ userId, userData }, { rejectWithValue, dispatch }) => {
    try {
      let vendorSignupId = userData.VendorSignupId || userData.vendorSignupId || getVendorIdFromToken();
      const control = userData.control || (userData.permission === "Read & Write" || userData.permission === "MANAGER" ? "READ_WRITE" : "READ_ONLY");
      
      const terminalIds = (userData.terminalIds || userData.terminalCodes || []).map(id => {
        const numId = typeof id === 'string' ? parseInt(id, 10) : id;
        return isNaN(numId) ? null : numId;
      }).filter(id => id !== null);
      
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

      const response = await userService.updateUser(userId, payload);
      dispatch(fetchUsers());
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || "Failed to update user");
    }
  }
);

// Async thunk to delete user
export const deleteUser = createAsyncThunk(
  "users/deleteUser",
  async (userId, { rejectWithValue, dispatch }) => {
    try {
      const response = await userService.deleteUser(userId);
      dispatch(fetchUsers());
      return { userId, data: response.data };
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || "Failed to delete user");
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

