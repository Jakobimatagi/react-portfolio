import React from "react";
import { Box, Button, Typography } from "@mui/material";
import { useLocation } from "react-router-dom";
import TaskNode from "./task-node";
import { buildTree, isUnlocked } from "./skil-tree-interface";
import { useSelector, useDispatch } from "react-redux";
import { completeTask, resetTasks } from "../../store/tasks-slice";
import { RootState } from "../../store/index";
import { Task as GeneratedTask } from "../../utils/task-generator";

interface LocationState {
  category?: string;
}

interface TreeNode {
  id: string | number;
  children?: TreeNode[];
}

function renderTree(
  nodes: TreeNode[],
  tasks: GeneratedTask[],
  handleComplete: (id: string | number) => void,
  level: number = 0
): React.ReactNode {
  return nodes.map((node) => (
    <Box key={node.id} sx={{ ml: level * 4 }}>
      <TaskNode
        task={tasks.find((t) => t.id === node.id)}
        unlocked={isUnlocked(node, tasks)}
        onComplete={handleComplete}
      />
      {node.children && node.children.length > 0 &&
        renderTree(node.children, tasks, handleComplete, level + 1)}
    </Box>
  ));
}

function getCompletedScore(tasks: GeneratedTask[]): number {
  return tasks.filter((t) => t.completed).length;
}

function getTotalScore(tasks: GeneratedTask[]): number {
  return tasks.length;
}

export default function SkillTree() {
  const dispatch = useDispatch();
  const location = useLocation();
  const state = location.state as LocationState | null;
  const category = state?.category || "frontend";

  const tasks = useSelector((state: RootState) => state.tasks[category as keyof typeof state.tasks]) || [];

  const handleComplete = (id: string | number): void => {
    dispatch(completeTask(Number(id)));
  };

  const handleReset = (): void => {
    dispatch(resetTasks());
  };

  const tree = buildTree(tasks);
  const completedScore = getCompletedScore(tasks);
  const totalScore = getTotalScore(tasks);

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
        <Typography variant="h4">Skill Tree - {category.charAt(0).toUpperCase() + category.slice(1)}</Typography>
        <Button
          variant="outlined"
          color="secondary"
          onClick={handleReset}
        >
          Reset
        </Button>
      </Box>
      <Typography variant="subtitle1" sx={{ mb: 2 }}>
        Score: {completedScore} / {totalScore}
      </Typography>
      {renderTree(tree, tasks, handleComplete)}
    </Box>
  );
}