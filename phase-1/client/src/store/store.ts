import { configureStore } from "@reduxjs/toolkit";
import authReducer from "../features/auth/auth-slice";
import equipmentReducer from "../features/equipment/equipment-slice";

export const store = configureStore({
  reducer: {
    auth: authReducer,
    equipment: equipmentReducer,
  },
});

// TypeScript helper types
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
