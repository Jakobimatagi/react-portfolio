import { useSelector } from "react-redux";
import { RootState } from "./index";
import { isOnboardingComplete } from "../utils/task-generator";

export function useCategoryStats(category: "onboarding" | "frontend" | "backend" | "devops") {
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
      ...state.tasks.onboarding,
      ...state.tasks.frontend,
      ...state.tasks.backend,
      ...state.tasks.devops,
    ];
    const completed = allTasks.filter((t) => t.completed).length;
    const total = allTasks.length;
    return { completed, total };
  });
}

export function useIsOnboardingComplete() {
  return useSelector((state: RootState) => {
    return isOnboardingComplete(state.tasks.onboarding);
  });
}