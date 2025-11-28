import { configureStore, combineReducers } from "@reduxjs/toolkit";
import { persistStore, persistReducer } from "redux-persist";
import storage from "redux-persist/lib/storage"; 
import userReducer from "./slices/userSlice";
import usersReducer from "./slices/usersSlice";
import busesReducer from "./slices/busesSlice";
import employeesReducer from "./slices/employeSlices";

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
