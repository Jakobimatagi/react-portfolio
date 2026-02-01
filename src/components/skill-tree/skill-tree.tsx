import React from "react";
import { Box, Button, Typography, Card, LinearProgress, Chip } from "@mui/material";
import { useLocation } from "react-router-dom";
import TaskNode from "./task-node";
import { buildTree, isUnlocked } from "./skil-tree-interface";
import { useSelector, useDispatch } from "react-redux";
import { completeTask, resetTasks } from "../../store/tasks-slice";
import { RootState } from "../../store/index";
import { Task as GeneratedTask } from "../../utils/task-generator";
import LockIcon from "@mui/icons-material/Lock";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";

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
  level: number = 0,
  colors: { bg: string; color: string }
): React.ReactNode {
  const columns = 3; // Number of columns to display nodes horizontally
  
  return (
    <Box sx={{ display: "flex", flexDirection: "column", gap: 4, position: "relative" }}>
      {nodes.map((node, idx) => {
        const task = tasks.find((t) => t.id === node.id);
        const unlocked = isUnlocked(node, tasks);
        const completed = task?.completed || false;
        
        return (
          <Box key={node.id} sx={{ position: "relative" }}>
            {/* Connection line to parent */}
            {level > 0 && (
              <Box
                sx={{
                  position: "absolute",
                  top: "-32px",
                  left: "50%",
                  width: "2px",
                  height: "32px",
                  backgroundColor: completed ? colors.color : "#ddd",
                  transform: "translateX(-50%)",
                  transition: "all 0.3s ease",
                }}
              />
            )}

            {/* Task Node Card */}
            <Card
              onClick={() => unlocked && !completed && handleComplete(node.id)}
              sx={{
                position: "relative",
                p: 2,
                cursor: unlocked && !completed ? "pointer" : "default",
                background: completed
                  ? `linear-gradient(135deg, ${colors.color}20, ${colors.color}40)`
                  : unlocked
                  ? "white"
                  : "#f5f5f5",
                border: completed
                  ? `2px solid ${colors.color}`
                  : unlocked
                  ? "2px solid #e0e0e0"
                  : "2px dashed #ccc",
                borderRadius: 2,
                minWidth: 200,
                maxWidth: 300,
                transition: "all 0.3s ease",
                opacity: unlocked ? 1 : 0.5,
                transform: unlocked ? "scale(1)" : "scale(0.95)",
                "&:hover": unlocked && !completed
                  ? {
                      transform: "scale(1.05)",
                      boxShadow: `0 4px 20px ${colors.color}40`,
                      borderColor: colors.color,
                    }
                  : {},
              }}
            >
              {/* Status Icon */}
              <Box
                sx={{
                  position: "absolute",
                  top: -12,
                  right: -12,
                  width: 32,
                  height: 32,
                  borderRadius: "50%",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  backgroundColor: completed ? colors.color : unlocked ? "#fff" : "#ccc",
                  border: `2px solid ${completed ? colors.color : "#ddd"}`,
                  boxShadow: 2,
                }}
              >
                {completed ? (
                  <CheckCircleIcon sx={{ fontSize: 18, color: "white" }} />
                ) : !unlocked ? (
                  <LockIcon sx={{ fontSize: 18, color: "#999" }} />
                ) : null}
              </Box>

              <Typography
                variant="h6"
                sx={{
                  fontWeight: 600,
                  mb: 1,
                  color: completed ? colors.color : "#333",
                }}
              >
                {task?.name || "Unknown Task"}
              </Typography>
              <Typography
                variant="body2"
                sx={{
                  color: "#666",
                  fontSize: "0.85rem",
                }}
              >
                {task?.description || "No description"}
              </Typography>

              {!unlocked && (
                <Chip
                  label="Locked"
                  size="small"
                  sx={{ mt: 1, backgroundColor: "#eee", color: "#999" }}
                />
              )}
            </Card>

            {/* Children nodes */}
            {node.children && node.children.length > 0 && (
              <Box
                sx={{
                  display: "flex",
                  gap: 3,
                  justifyContent: "center",
                  mt: 4,
                  position: "relative",
                  flexWrap: "wrap",
                }}
              >
                {/* Connection lines to children */}
                {node.children.map((child, childIdx) => (
                  <Box
                    key={childIdx}
                    sx={{
                      position: "absolute",
                      top: -32,
                      left: `${(childIdx + 1) * (100 / (node.children!.length + 1))}%`,
                      width: "2px",
                      height: "32px",
                      backgroundColor: task?.completed ? colors.color : "#ddd",
                      transform: "translateX(-50%)",
                      transition: "all 0.3s ease",
                    }}
                  />
                ))}

                {renderTree(node.children, tasks, handleComplete, level + 1, colors)}
              </Box>
            )}
          </Box>
        );
      })}
    </Box>
  );
}

function getCompletedScore(tasks: GeneratedTask[]): number {
  return tasks.filter((t) => t.completed).length;
}

function getTotalScore(tasks: GeneratedTask[]): number {
  return tasks.length;
}

const categoryColors: Record<string, { bg: string; color: string }> = {
  frontend: { bg: "#1a1a2e", color: "#00d4ff" },
  backend: { bg: "#0f2027", color: "#00ff88" },
  devops: { bg: "#2c1810", color: "#ff8c00" },
};

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
  const progressPercentage = (completedScore / totalScore) * 100;
  const colors = categoryColors[category] || categoryColors.frontend;

  return (
    <Box
      sx={{
        minHeight: "100vh",
        background: `radial-gradient(ellipse at top, ${colors.bg}, #000000)`,
        py: 4,
        px: 2,
        position: "relative",
        overflow: "hidden",
        "&::before": {
          content: '""',
          position: "absolute",
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundImage: "radial-gradient(circle, rgba(255,255,255,0.1) 1px, transparent 1px)",
          backgroundSize: "50px 50px",
          opacity: 0.3,
        },
      }}
    >
      <Box sx={{ margin: "0 auto", maxWidth: "1200px", position: "relative", zIndex: 1 }}>
        {/* Header */}
        <Box sx={{ mb: 4 }}>
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              mb: 3,
            }}
          >
            <Box>
              <Typography
                variant="h3"
                sx={{
                  fontWeight: "bold",
                  color: colors.color,
                  mb: 1,
                  textShadow: `0 0 20px ${colors.color}80`,
                }}
              >
                {category.charAt(0).toUpperCase() + category.slice(1)} Skill Tree
              </Typography>
              <Chip
                label={`${completedScore} / ${totalScore} Complete`}
                sx={{
                  backgroundColor: colors.color,
                  color: "#000",
                  fontWeight: 600,
                }}
              />
            </Box>
            <Button
              variant="contained"
              onClick={handleReset}
              sx={{
                textTransform: "none",
                fontSize: "1rem",
                backgroundColor: "#ff4444",
                "&:hover": { backgroundColor: "#cc0000" },
              }}
            >
              Reset Progress
            </Button>
          </Box>

          {/* Progress Bar */}
          <Card sx={{ p: 2, boxShadow: 3, backgroundColor: "rgba(0,0,0,0.5)", backdropFilter: "blur(10px)" }}>
            <Box sx={{ display: "flex", justifyContent: "space-between", mb: 1 }}>
              <Typography variant="subtitle2" sx={{ fontWeight: 600, color: "#fff" }}>
                Progress
              </Typography>
              <Typography variant="subtitle2" sx={{ color: colors.color, fontWeight: 600 }}>
                {Math.round(progressPercentage)}%
              </Typography>
            </Box>
            <LinearProgress
              variant="determinate"
              value={progressPercentage}
              sx={{
                height: 10,
                borderRadius: 5,
                backgroundColor: "rgba(255,255,255,0.1)",
                "& .MuiLinearProgress-bar": {
                  borderRadius: 5,
                  background: `linear-gradient(90deg, ${colors.color}, ${colors.color}dd)`,
                  boxShadow: `0 0 10px ${colors.color}`,
                },
              }}
            />
          </Card>
        </Box>

        {/* Skill Tree */}
        <Box
          sx={{
            p: 4,
            display: "flex",
            justifyContent: "center",
          }}
        >
          {renderTree(tree, tasks, handleComplete, 0, colors)}
        </Box>
      </Box>
    </Box>
  );
}