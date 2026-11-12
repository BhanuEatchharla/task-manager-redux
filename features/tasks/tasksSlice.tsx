
import {
  createSlice,
  createAsyncThunk,
  createSelector,
} from "@reduxjs/toolkit";

import type { RootState } from "../../lib/store";

// 1. Task interface
export interface Task {
  id: number;
  title: string;
  completed: boolean;
}

// 2. Filter type
export type FilterType = "all" | "active" | "completed";

// 3. State interface
interface TasksState {
  tasks: Task[];
  status: "idle" | "loading" | "succeeded" | "failed";
  error: string | null;
  filter: FilterType;
}

// 4. API response interface
interface ApiTask {
  id: number;
  title: string;
  completed: boolean;
}

// 5. Initial state
const initialState: TasksState = {
  tasks: [],
  status: "idle",
  error: null,
  filter: "all",
};

// 6. Async Thunk
export const fetchTasks = createAsyncThunk<
  Task[],
  void,
  { rejectValue: string }
>(
  "tasks/fetchTasks",
  async (_, { rejectWithValue }) => {
    try {
      const response = await fetch(
        "https://jsonplaceholder.typicode.com/todos?_limit=10"
      );

      if (!response.ok) {
        throw new Error("Failed to fetch tasks");
      }

      const data: ApiTask[] = await response.json();

      return data.map((item): Task => ({
        id: item.id,
        title: item.title,
        completed: item.completed,
      }));

    } catch (error: unknown) {
      const message =
        error instanceof Error
          ? error.message
          : "Something went wrong";

      return rejectWithValue(message);
    }
  }
);

// 7. Create Slice
const tasksSlice = createSlice({
  name: "tasks",

  initialState,

  reducers: {

    // Add task
    addTask: (state, action: { payload: string }) => {
      state.tasks.unshift({
        id: Date.now(),
        title: action.payload,
        completed: false,
      });
    },

    // Toggle task
    toggleTask: (state, action: { payload: number }) => {
      const task = state.tasks.find(
        (task) => task.id === action.payload
      );

      if (task) {
        task.completed = !task.completed;
      }
    },

    // Delete task
    deleteTask: (state, action: { payload: number }) => {
      state.tasks = state.tasks.filter(
        (task) => task.id !== action.payload
      );
    },

    // Set filter
    setFilter: (
      state,
      action: { payload: FilterType }
    ) => {
      state.filter = action.payload;
    },
  },

  // 8. Async reducers
  extraReducers: (builder) => {

    builder

      .addCase(fetchTasks.pending, (state) => {
        state.status = "loading";
        state.error = null;
      })

      .addCase(fetchTasks.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.tasks = action.payload;
      })

      .addCase(fetchTasks.rejected, (state, action) => {
        state.status = "failed";

        state.error =
          action.payload ?? action.error.message ?? "Failed to fetch tasks";
      });
  },
});

// 9. Export actions
export const {
  addTask,
  toggleTask,
  deleteTask,
  setFilter,
} = tasksSlice.actions;

// 10. Selectors
const selectTasks = (state: RootState) => state.tasks.tasks;

const selectFilter = (state: RootState) => state.tasks.filter;

// Memoized visible tasks
export const selectVisibleTasks = createSelector(
  [selectTasks, selectFilter],
  (tasks, filter) => {

    if (filter === "active") {
      return tasks.filter((task) => !task.completed);
    }

    if (filter === "completed") {
      return tasks.filter((task) => task.completed);
    }

    return tasks;
  }
);

// Task statistics
export const selectTaskStats = createSelector(
  [selectTasks],
  (tasks) => ({
    total: tasks.length,

    completed: tasks.filter(
      (task) => task.completed
    ).length,

    active: tasks.filter(
      (task) => !task.completed
    ).length,
  })
);

// 11. Export reducer
export default tasksSlice.reducer;
