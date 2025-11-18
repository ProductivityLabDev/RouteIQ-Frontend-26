import { configureStore, combineReducers } from "@reduxjs/toolkit";
import { persistStore, persistReducer } from "redux-persist";
import storage from "redux-persist/lib/storage"; // localStorage
import userReducer from "./slices/userSlice";
import usersReducer from "./slices/usersSlice";

const persistConfig = {
  key: "root",
  storage,
  whitelist: ["user"], // Only persist auth user, not users list
};

const rootReducer = combineReducers({
  user: userReducer,
  users: usersReducer, // Add users slice for user management
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
