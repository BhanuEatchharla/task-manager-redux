
import { configureStore } from "@reduxjs/toolkit";

import tasksReducer from "../features/tasks/tasksSlice";

export const makeStore = () => {
  return configureStore({
    reducer: {
      tasks: tasksReducer,
    },

    // Disable Redux DevTools integration
    devTools: false,
  });
};

// TypeScript types
export type AppStore = ReturnType<typeof makeStore>;

export type RootState = ReturnType<AppStore["getState"]>;

export type AppDispatch = AppStore["dispatch"];
