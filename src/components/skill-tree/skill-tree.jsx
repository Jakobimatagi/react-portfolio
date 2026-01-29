import React, { useState } from "react";
import { Box, Button, Typography } from "@mui/material";
import TaskNode from "./task-node";
import { buildTree, isUnlocked } from "./skil-tree-interface";

const tasksData = [
  {
    id: 1,
    label: "Root",
    points: 10,
    urgency: 2,
    dependencies: [],
    parentId: null,
    completed: false,
  },
  {
    id: 2,
    label: "Branch A",
    points: 20,
    urgency: 2,
    dependencies: [1],
    parentId: 1,
    completed: false,
  },
  {
    id: 3,
    label: "Leaf A1",
    points: 30,
    urgency: 1,
    dependencies: [2],
    parentId: 2,
    completed: false,
  },
  {
    id: 4,
    label: "Leaf A2",
    points: 30,
    urgency: 1,
    dependencies: [2],
    parentId: 2,
    completed: false,
  },
  {
    id: 5,
    label: "Urgent A5",
    points: 50,
    urgency: 10,
    dependencies: [2],
    parentId: 2,
    completed: false,
  },
];

function renderTree(nodes, tasks, handleComplete, level = 0) {
  return nodes.map((node) => (
    <Box key={node.id} sx={{ ml: level * 4 }}>
      <TaskNode
        task={tasks.find((t) => t.id === node.id)}
        unlocked={isUnlocked(node, tasks)}
        onComplete={handleComplete}
      />

      {node.children?.length > 0 &&
        renderTree(node.children, tasks, handleComplete, level + 1)}
    </Box>
  ));
}

export default function SkillTree() {
  const [tasks, setTasks] = useState(tasksData);

  const handleComplete = (id) => {
    setTasks((prev) =>
      prev.map((t) => (t.id === id ? { ...t, completed: true } : t))
    );
  };

  const tree = buildTree(tasks);

  return (
    <Box sx={{ margin: "0 auto", width: "75%" }}>
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          mb: 2,
        }}
      >
        <Typography variant="h4">Skill Tree</Typography>
        <Button
          variant="outlined"
          color="secondary"
          onClick={() =>
            setTasks(tasks.map((t) => ({ ...t, completed: false })))
          }
        >
          Reset
        </Button>
      </Box>
      {renderTree(tree, tasks, handleComplete)}
    </Box>
  );
}
