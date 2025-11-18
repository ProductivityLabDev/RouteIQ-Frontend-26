import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import { BASE_URL, getAxiosConfig } from "@/configs/api";

// Async thunk to fetch users
export const fetchUsers = createAsyncThunk(
  "users/fetchUsers",
  async (_, { rejectWithValue }) => {
    try {
      console.log("🔄 [Redux] Fetching users...");
      const res = await axios.get(
        `${BASE_URL}/institute/GetUserCridentials`,
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
  "users/createUser",
  async (userData, { rejectWithValue, dispatch }) => {
    try {
      console.log("🔄 [Redux] Creating user...", userData);
      
      // Map permission to control
      const control = userData.permission === "Read & Write" ? "READ_WRITE" : "READ_ONLY";
      
      const payload = {
        username: userData.username,
        password: userData.password,
        roleCode: userData.roleCode,
        email: userData.email,
        phoneNumber: userData.phoneNumber,
        control: control,
        modules: userData.modules || [],
        terminalCodes: userData.terminalCodes || [],
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
      
      // Map permission to control
      const control = userData.permission === "Read & Write" ? "READ_WRITE" : "READ_ONLY";
      
      const payload = {
        username: userData.username,
        password: userData.password,
        roleCode: userData.roleCode,
        email: userData.email,
        phoneNumber: userData.phoneNumber,
        control: control,
        modules: userData.modules || [],
        terminalCodes: userData.terminalCodes || [],
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

