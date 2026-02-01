// tasks-slice.ts
import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { generateMockData } from "../utils/task-generator";
import { Task } from "../utils/task-generator";

interface TasksState {
  frontend: Task[];
  backend: Task[];
  devops: Task[];
}

const initialState: TasksState = generateMockData();

const tasksSlice = createSlice({
  name: "tasks",
  initialState,
  reducers: {
    completeTask: (state, action: PayloadAction<number>) => {
      const taskId = action.payload;
      // Find and complete the task in any category
      Object.keys(state).forEach((category) => {
        const task = state[category as keyof TasksState].find(
          (t) => t.id === taskId
        );
        if (task) {
          task.completed = true;
        }
      });
    },
    resetTasks: (state) => {
      // Reset all tasks to incomplete (except first ones in each category)
      Object.keys(state).forEach((category) => {
        state[category as keyof TasksState].forEach((task) => {
          task.completed = false;
        });
      });
    },
    regenerateTasks: () => {
      return generateMockData();
    },
  },
});

export const { completeTask, resetTasks, regenerateTasks } = tasksSlice.actions;
export default tasksSlice.reducer;
