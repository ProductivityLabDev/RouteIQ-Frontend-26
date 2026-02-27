import { combineReducers, configureStore } from "@reduxjs/toolkit";
import { persistReducer, persistStore } from "redux-persist";
import storage from "redux-persist/lib/storage";

import userReducer from "./slices/userSlice";
import usersReducer from "./slices/usersSlice";
import busesReducer from "./slices/busesSlice";
import employeesReducer from "./slices/employeSlices";
import schoolsReducer from "./slices/schoolSlice";
import studentsReducer from "./slices/studentSlice";
import routesReducer from "./slices/routesSlice";
import repairScheduleReducer from "./slices/repairScheduleSlice";
import notificationsReducer from "./slices/notificationsSlice";
import chatReducer from "./slices/chatSlice";
import employeeDashboardReducer from "./slices/employeeDashboardSlice";
import vendorDashboardReducer from "./slices/vendorDashboardSlice";
import schoolDashboardReducer from "./slices/schoolDashboardSlice";

const persistConfig = {
  key: "root",
  storage,
  whitelist: ["user"],
};

// Employee dashboard ke liye alag persist config
// Sirf dashboardData aur lastPunchStatus save hoga — loading/error nahi
const employeeDashboardPersistConfig = {
  key: "employeeDashboard",
  storage,
  whitelist: ["dashboardData", "lastPunchStatus"],
};

const rootReducer = combineReducers({
  user: userReducer,
  users: usersReducer,
  buses: busesReducer,
  employees: employeesReducer,
  schools: schoolsReducer,
  students: studentsReducer,
  routes: routesReducer,
  repairSchedule: repairScheduleReducer,
  notifications: notificationsReducer,
  chat: chatReducer,
  employeeDashboard: persistReducer(employeeDashboardPersistConfig, employeeDashboardReducer),
  vendorDashboard: vendorDashboardReducer,
  schoolDashboard: schoolDashboardReducer,
});

const persistedReducer = persistReducer(persistConfig, rootReducer);

export const store = configureStore({
  reducer: persistedReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false,
    }),
});

export const persistor = persistStore(store);

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;


