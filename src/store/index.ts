// index.ts
import { configureStore } from "@reduxjs/toolkit";
import userReducer from "./user-slice";
import tasksReducer from "./tasks-slice";

export const store = configureStore({
  reducer: {
    user: userReducer,
    tasks: tasksReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
