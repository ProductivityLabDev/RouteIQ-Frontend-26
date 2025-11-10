import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  user: null,         // full user object from backend
  token: null,        // auth token
  permission: null,   // "READ_ONLY" or "READ_WRITE"
  modules: [],        // e.g. ["VEHICLE", "ROUTE"]
};

const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    setUser: (state, action) => {
      const { user, token } = action.payload;
      state.user = user;
      state.token = token;
      state.permission = user?.control || "READ_ONLY";
      state.modules = user?.modules || [];
    },
    updatePermission: (state, action) => {
      state.permission = action.payload;
    },
    logoutUser: (state) => {
      state.user = null;
      state.token = null;
      state.permission = null;
      state.modules = [];
    },
  },
});

export const { setUser, logoutUser, updatePermission } = userSlice.actions;
export default userSlice.reducer;
