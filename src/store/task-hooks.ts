import { useSelector } from "react-redux";
import { RootState } from "./index";
import { isInitialTasksComplete } from "../utils/task-generator";

export function useCategoryStats(category: "initialTasks" | "sfr" | "commercial" | "specialty") {
  return useSelector((state: RootState) => {
    const tasks = state.tasks[category];
    const completed = tasks.filter((t) => t.completed).length;
    const total = tasks.length;
    return { completed, total };
  });
}

export function useTaskStats() {
  return useSelector((state: RootState) => {
    const allTasks = [
      ...state.tasks.initialTasks,
      ...state.tasks.sfr,
      ...state.tasks.commercial,
      ...state.tasks.specialty,
    ];
    const completed = allTasks.filter((t) => t.completed).length;
    const total = allTasks.length;
    return { completed, total };
  });
}

export function useIsInitialTasksComplete() {
  return useSelector((state: RootState) => {
    return isInitialTasksComplete(state.tasks.initialTasks);
  });
}