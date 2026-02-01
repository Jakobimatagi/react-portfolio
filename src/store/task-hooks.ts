// task-hooks.ts
import { useSelector, useDispatch } from "react-redux";
import { RootState, AppDispatch } from "./index";
import { completeTask, resetTasks } from "./tasks-slice";
import { getAllTasks, getCompletedCount, getTotalCount } from "../utils/task-generator";

export function useAllTasks() {
  return useSelector((state: RootState) => {
    const tasks = state.tasks;
    return getAllTasks(tasks);
  });
}

export function useCategoryTasks(category: "frontend" | "backend" | "devops") {
  return useSelector((state: RootState) => state.tasks[category]);
}

export function useTaskStats() {
  return useSelector((state: RootState) => {
    const allTasks = getAllTasks(state.tasks);
    return {
      completed: getCompletedCount(allTasks),
      total: getTotalCount(allTasks),
    };
  });
}

export function useCategoryStats(category: "frontend" | "backend" | "devops") {
  return useSelector((state: RootState) => {
    const tasks = state.tasks[category];
    return {
      completed: getCompletedCount(tasks),
      total: getTotalCount(tasks),
    };
  });
}

export function useTaskActions() {
  const dispatch = useDispatch<AppDispatch>();
  return {
    completeTask: (taskId: number) => dispatch(completeTask(taskId)),
    resetTasks: () => dispatch(resetTasks()),
  };
}
