import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { generateMockData, Task } from "../utils/task-generator";

interface TasksState {
  initialTasks: Task[];
  sfr: Task[];
  commercial: Task[];
  specialty: Task[];
}

// Get the selected fund type from localStorage
const getSelectedFundType = (): "sfr" | "commercial" | "specialty" | undefined => {
  const fundType = localStorage.getItem("selectedFundType");
  return fundType as "sfr" | "commercial" | "specialty" | undefined;
};

// Load tasks from localStorage or generate new ones
const loadInitialState = (): TasksState => {
  const savedTasks = localStorage.getItem("taskProgress");
  if (savedTasks) {
    try {
      return JSON.parse(savedTasks);
    } catch (error) {
      console.error("Error loading saved tasks:", error);
    }
  }
  return generateMockData(getSelectedFundType());
};

// Save tasks to localStorage
const saveTasksToStorage = (state: TasksState) => {
  try {
    localStorage.setItem("taskProgress", JSON.stringify(state));
  } catch (error) {
    console.error("Error saving tasks:", error);
  }
};

const initialState: TasksState = loadInitialState();

const tasksSlice = createSlice({
  name: "tasks",
  initialState,
  reducers: {
    completeTask: (state, action: PayloadAction<number>) => {
      const taskId = action.payload;
      
      // Find and complete the task in any category
      for (const category of ["initialTasks", "sfr", "commercial", "specialty"] as const) {
        const task = state[category].find((t) => t.id === taskId);
        if (task) {
          task.completed = true;
          break;
        }
      }
      
      // Save to localStorage
      saveTasksToStorage(state);
    },
    resetTasks: (state, action: PayloadAction<string | undefined>) => {
      const category = action.payload;
      const fundType = getSelectedFundType();
      const mockData = generateMockData(fundType);
      
      if (category && category in state) {
        state[category as keyof TasksState] = mockData[category as keyof TasksState];
      } else {
        state = mockData;
      }
      
      // Save to localStorage
      saveTasksToStorage(state);
      
      if (!category) {
        return mockData;
      }
    },
    initializeTasksForFund: (state, action: PayloadAction<"sfr" | "commercial" | "specialty">) => {
      const fundType = action.payload;
      const mockData = generateMockData(fundType);
      
      // Save to localStorage
      saveTasksToStorage(mockData);
      
      return mockData;
    },
  },
});

export const { completeTask, resetTasks, initializeTasksForFund } = tasksSlice.actions;
export default tasksSlice.reducer;