// task-generator.ts
export interface Task {
  id: number;
  label: string;
  name: string;
  description: string;
  points: number;
  urgency: number;
  dependencies: number[];
  parentId: number | null;
  completed: boolean;
  category: string;
}

const ONBOARDING_SKILLS = [
  { name: "Welcome to Skill Tree", description: "Learn how to navigate the skill tree dashboard" },
  { name: "Understanding Categories", description: "Explore the three main skill categories: Frontend, Backend, and DevOps" },
  { name: "Completing Tasks", description: "Click on unlocked tasks to mark them as complete" },
  { name: "Task Dependencies", description: "Complete tasks in order - each task unlocks the next" },
  { name: "Tracking Progress", description: "Monitor your progress with the dashboard pie chart" },
];

const FRONTEND_SKILLS = [
  { name: "HTML Basics", description: "Learn the fundamentals of HTML structure and semantics" },
  { name: "CSS Fundamentals", description: "Master styling, layouts, and responsive design" },
  { name: "JavaScript Essentials", description: "Understand core JavaScript concepts and syntax" },
  { name: "React Basics", description: "Build interactive UIs with React components" },
  { name: "TypeScript", description: "Add type safety to your JavaScript code" },
  { name: "State Management", description: "Learn Redux and context API for state handling" },
  { name: "API Integration", description: "Fetch and manage data from external APIs" },
  { name: "Testing", description: "Write unit and integration tests with Jest" },
];

const BACKEND_SKILLS = [
  { name: "Node.js Intro", description: "Learn server-side JavaScript with Node.js" },
  { name: "Express.js Routing", description: "Create RESTful APIs with Express" },
  { name: "Database Integration", description: "Connect and query databases effectively" },
  { name: "API Authentication", description: "Implement JWT and OAuth authentication" },
  { name: "Middleware", description: "Handle requests with custom middleware" },
  { name: "Caching Strategies", description: "Optimize performance with Redis and caching" },
  { name: "Error Handling", description: "Implement robust error handling patterns" },
  { name: "Deployment", description: "Deploy Node.js apps to production servers" },
];

const DEVOPS_SKILLS = [
  { name: "Linux Basics", description: "Navigate and manage Linux systems" },
  { name: "Docker Fundamentals", description: "Containerize applications with Docker" },
  { name: "CI/CD Pipelines", description: "Automate builds and deployments" },
  { name: "Cloud Deployment", description: "Deploy apps to AWS, Azure, or GCP" },
  { name: "Monitoring", description: "Monitor application health and performance" },
  { name: "Load Balancing", description: "Distribute traffic across multiple servers" },
  { name: "Infrastructure as Code", description: "Manage infrastructure with Terraform" },
  { name: "Security Hardening", description: "Secure servers and applications" },
];

function generateCategoryTasks(
  skills: { name: string; description: string }[],
  startId: number,
  category: string,
  initialCompleted: boolean = false
): Task[] {
  return skills.map((skill, idx) => {
    const id = startId + idx;
    const completed = initialCompleted ? idx === 0 : false; // For onboarding, first task starts completed
    const dependencies = idx > 0 ? [id - 1] : [];
    const parentId = idx > 0 ? id - 1 : null;
    const basePoints = 10 + idx * 5;
    const points = basePoints + Math.floor(Math.random() * 6); // Add 0-5 random points

    return {
      id,
      label: skill.name,
      name: skill.name,
      description: skill.description,
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
  onboarding: Task[];
  frontend: Task[];
  backend: Task[];
  devops: Task[];
} {
  return {
    onboarding: generateCategoryTasks(ONBOARDING_SKILLS, 1, "onboarding", true),
    frontend: generateCategoryTasks(FRONTEND_SKILLS, 101, "frontend"),
    backend: generateCategoryTasks(BACKEND_SKILLS, 201, "backend"),
    devops: generateCategoryTasks(DEVOPS_SKILLS, 301, "devops"),
  };
}

export function getAllTasks(data: {
  onboarding: Task[];
  frontend: Task[];
  backend: Task[];
  devops: Task[];
}): Task[] {
  return [...data.onboarding, ...data.frontend, ...data.backend, ...data.devops];
}

export function getCompletedCount(tasks: Task[]): number {
  return tasks.filter((t) => t.completed).length;
}

export function getTotalCount(tasks: Task[]): number {
  return tasks.length;
}

export function isOnboardingComplete(tasks: Task[]): boolean {
  return tasks.every((t) => t.completed);
}