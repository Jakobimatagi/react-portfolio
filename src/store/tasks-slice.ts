import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { generateMockData, Task, isOnboardingComplete } from "../utils/task-generator";

interface TasksState {
  onboarding: Task[];
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
      for (const category of ["onboarding", "frontend", "backend", "devops"] as const) {
        const task = state[category].find((t) => t.id === taskId);
        if (task) {
          task.completed = true;
          break;
        }
      }
    },
    resetTasks: (state, action: PayloadAction<string | undefined>) => {
      const category = action.payload;
      const mockData = generateMockData();
      
      if (category && category in state) {
        state[category as keyof TasksState] = mockData[category as keyof TasksState];
      } else {
        return mockData;
      }
    },
  },
});

export const { completeTask, resetTasks } = tasksSlice.actions;
export default tasksSlice.reducer;