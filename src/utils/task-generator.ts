// task-generator.ts
export interface Task {
  id: number;
  label: string;
  points: number;
  urgency: number;
  dependencies: number[];
  parentId: number | null;
  completed: boolean;
  category: string;
}

const FRONTEND_SKILLS = [
  "HTML Basics",
  "CSS Fundamentals",
  "JavaScript Essentials",
  "React Basics",
  "TypeScript",
  "State Management",
  "API Integration",
  "Testing",
];

const BACKEND_SKILLS = [
  "Node.js Intro",
  "Express.js Routing",
  "Database Integration",
  "API Authentication",
  "Middleware",
  "Caching Strategies",
  "Error Handling",
  "Deployment",
];

const DEVOPS_SKILLS = [
  "Linux Basics",
  "Docker Fundamentals",
  "CI/CD Pipelines",
  "Cloud Deployment",
  "Monitoring",
  "Load Balancing",
  "Infrastructure as Code",
  "Security Hardening",
];

function generateCategoryTasks(
  skills: string[],
  startId: number,
  category: string
): Task[] {
  return skills.map((label, idx) => {
    const id = startId + idx;
    const completed = idx === 0; // Only first task is completed
    const dependencies = idx > 0 ? [id - 1] : [];
    const parentId = idx > 0 ? id - 1 : null;
    const basePoints = 10 + idx * 5;
    const points = basePoints + Math.floor(Math.random() * 6); // Add 0-5 random points

    return {
      id,
      label,
      points,
      urgency: idx + 1,
      dependencies,
      parentId,
      completed,
      category,
    };
  });
}

export function generateMockData(): {
  frontend: Task[];
  backend: Task[];
  devops: Task[];
} {
  return {
    frontend: generateCategoryTasks(FRONTEND_SKILLS, 1, "frontend"),
    backend: generateCategoryTasks(BACKEND_SKILLS, 101, "backend"),
    devops: generateCategoryTasks(DEVOPS_SKILLS, 201, "devops"),
  };
}

export function getAllTasks(data: {
  frontend: Task[];
  backend: Task[];
  devops: Task[];
}): Task[] {
  return [...data.frontend, ...data.backend, ...data.devops];
}

export function getCompletedCount(tasks: Task[]): number {
  return tasks.filter((t) => t.completed).length;
}

export function getTotalCount(tasks: Task[]): number {
  return tasks.length;
}
