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

const persistConfig = {
  key: "root",
  storage,
  whitelist: ["user"],
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


