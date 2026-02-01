const frontend = [
  {
    id: 1,
    label: "HTML Basics",
    points: 10,
    urgency: 2,
    dependencies: [],
    parentId: null,
    completed: true,
  }, // changed
  {
    id: 2,
    label: "CSS Fundamentals",
    points: 15,
    urgency: 3,
    dependencies: [1],
    parentId: 1,
    completed: false,
  },
  {
    id: 3,
    label: "JavaScript Essentials",
    points: 20,
    urgency: 4,
    dependencies: [2],
    parentId: 2,
    completed: false,
  },
  {
    id: 4,
    label: "React Basics",
    points: 25,
    urgency: 5,
    dependencies: [3],
    parentId: 3,
    completed: false,
  },
];

const backend = [
  {
    id: 101,
    label: "Node.js Intro",
    points: 10,
    urgency: 2,
    dependencies: [],
    parentId: null,
    completed: true,
  }, // changed
  {
    id: 102,
    label: "Express.js Routing",
    points: 15,
    urgency: 3,
    dependencies: [101],
    parentId: 101,
    completed: false,
  },
  {
    id: 103,
    label: "Database Integration",
    points: 20,
    urgency: 4,
    dependencies: [102],
    parentId: 102,
    completed: false,
  },
  {
    id: 104,
    label: "API Authentication",
    points: 25,
    urgency: 5,
    dependencies: [103],
    parentId: 103,
    completed: false,
  },
];

const devops = [
  {
    id: 201,
    label: "Linux Basics",
    points: 10,
    urgency: 2,
    dependencies: [],
    parentId: null,
    completed: true,
  }, // changed
  {
    id: 202,
    label: "Docker Fundamentals",
    points: 15,
    urgency: 3,
    dependencies: [201],
    parentId: 201,
    completed: false,
  },
  {
    id: 203,
    label: "CI/CD Pipelines",
    points: 20,
    urgency: 4,
    dependencies: [202],
    parentId: 202,
    completed: false,
  },
  {
    id: 204,
    label: "Cloud Deployment",
    points: 25,
    urgency: 5,
    dependencies: [203],
    parentId: 203,
    completed: false,
  },
];

export default { frontend, backend, devops };
