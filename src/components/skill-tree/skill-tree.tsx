import React, { useState, useEffect } from "react";
import { Box, Button, Typography, Card, LinearProgress, Chip, useMediaQuery, useTheme } from "@mui/material";
import { useLocation, useNavigate } from "react-router-dom";
import { buildTree, isUnlocked } from "./skil-tree-interface";
import { useSelector, useDispatch } from "react-redux";
import { completeTask, resetTasks } from "../../store/tasks-slice";
import { RootState } from "../../store/index";
import { Task as GeneratedTask } from "../../utils/task-generator";
import LockIcon from "@mui/icons-material/Lock";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import TaskDialog from "../task-dialog";
import CelebrationIcon from "@mui/icons-material/Celebration";

interface LocationState {
  category?: string;
}

interface TreeNode {
  id: string | number;
  children?: TreeNode[];
}

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
  handleTaskClick: (task: GeneratedTask) => void,
  level: number = 0,
  colors: { bg: string; color: string },
  isMobile: boolean
): React.ReactNode {
  
  return (
    <Box sx={{ 
      display: "flex", 
      flexDirection: "column", 
      gap: { xs: 3, sm: 4, md: 5 }, 
      position: "relative",
      alignItems: "center",
    }}>
      {nodes.map((node, idx) => {
        const task = tasks.find((t) => t.id === node.id);
        const unlocked = isUnlocked(node, tasks);
        const completed = task?.completed || false;
        
        return (
          <Box key={node.id} sx={{ position: "relative", width: "100%", maxWidth: 400 }}>
            {/* Connection line to parent */}
            {level > 0 && !isMobile && (
              <Box
                sx={{
                  position: "absolute",
                  top: -24,
                  left: "50%",
                  width: "2px",
                  height: "24px",
                  backgroundColor: completed ? colors.color : "#555",
                  transform: "translateX(-50%)",
                  transition: "all 0.3s ease",
                  zIndex: 1,
                }}
              />
            )}

            {/* Task Node Card */}
            <Card
              onClick={() => unlocked && !completed && task && handleTaskClick(task)}
              sx={{
                position: "relative",
                p: { xs: 2.5, sm: 3 },
                cursor: unlocked && !completed ? "pointer" : "default",
                background: completed
                  ? "#ffffff"
                  : unlocked
                  ? "#ffffff"
                  : "rgba(200, 200, 200, 0.5)",
                border: completed
                  ? `3px solid ${colors.color}`
                  : unlocked
                  ? "2px solid #e5e7eb"
                  : "2px dashed #cccccc",
                borderRadius: 3,
                minHeight: 140,
                maxWidth: 400,
                width: "100%",
                transition: "all 0.3s ease",
                opacity: unlocked ? 1 : 0.6,
                transform: unlocked ? "scale(1)" : "scale(0.95)",
                backdropFilter: "blur(10px)",
                overflow: "visible",
                "&:hover": unlocked && !completed
                  ? {
                      transform: "scale(1.02)",
                      boxShadow: `0 8px 25px rgba(0, 0, 0, 0.15)`,
                      borderColor: colors.color,
                    }
                  : {},
              }}
            >
              {/* Status Icon */}
              <Box
                sx={{
                  position: "absolute",
                  top: { xs: -14, sm: -16 },
                  right: { xs: -14, sm: -16 },
                  width: { xs: 32, sm: 36 },
                  height: { xs: 32, sm: 36 },
                  borderRadius: "50%",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  backgroundColor: completed ? colors.color : unlocked ? "#fff" : "#666",
                  border: `3px solid ${completed ? colors.color : "#333"}`,
                  boxShadow: 3,
                  zIndex: 2,
                }}
              >
                {completed ? (
                  <CheckCircleIcon sx={{ fontSize: { xs: 18, sm: 20 }, color: "#000" }} />
                ) : !unlocked ? (
                  <LockIcon sx={{ fontSize: { xs: 18, sm: 20 }, color: "#999" }} />
                ) : null}
              </Box>

              <Typography
                variant="h6"
                sx={{
                  fontWeight: 600,
                  mb: 1.5,
                  color: completed ? colors.color : "#000000",
                  fontSize: { xs: "1rem", sm: "1.1rem" },
                  textAlign: "center",
                  lineHeight: 1.3,
                }}
              >
                {task?.name || "Unknown Task"}
              </Typography>
              <Typography
                variant="body2"
                sx={{
                  color: "#666666",
                  fontSize: { xs: "0.85rem", sm: "0.9rem" },
                  lineHeight: 1.4,
                  textAlign: "center",
                  mb: 2,
                }}
              >
                {task?.description || "No description"}
              </Typography>

              {!unlocked && (
                <Box sx={{ display: "flex", justifyContent: "center" }}>
                  <Chip
                    label="Locked"
                    size="small"
                    sx={{ 
                      backgroundColor: "#e5e7eb", 
                      color: "#666666",
                      fontSize: "0.75rem",
                      height: 24
                    }}
                  />
                </Box>
              )}

              {unlocked && !completed && task?.tooltip && (
                <Typography
                  variant="caption"
                  sx={{
                    color: colors.color,
                    fontSize: "0.75rem",
                    textAlign: "center",
                    display: "block",
                    mt: 1,
                    fontStyle: "italic",
                  }}
                >
                  💡 {task.tooltip}
                </Typography>
              )}
            </Card>

            {/* Children nodes */}
            {node.children && node.children.length > 0 && (
              <Box
                sx={{
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  mt: { xs: 3, sm: 4 },
                  position: "relative",
                  width: "100%",
                }}
              >
                {renderTree(node.children, tasks, handleTaskClick, level + 1, colors, isMobile)}
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
  initialTasks: { bg: "#2d2d2d", color: "#6b7280" },
  sfr: { bg: "#2d2d2d", color: "#3b82f6" },
  commercial: { bg: "#2d2d2d", color: "#10b981" },
  specialty: { bg: "#2d2d2d", color: "#8b5cf6" },
};

export default function SkillTree() {
  const dispatch = useDispatch();
  const location = useLocation();
  const navigate = useNavigate();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  const state = location.state as LocationState | null;
  const category = state?.category || "sfr";

  const tasks = useSelector((state: RootState) => state.tasks[category as keyof typeof state.tasks]) || [];

  const [showCompletion, setShowCompletion] = useState(false);
  const [currentTask, setCurrentTask] = useState<GeneratedTask | null>(null);
  const [dialogOpen, setDialogOpen] = useState(false);

  // Pendo guide for task completion
  useEffect(() => {
    if (typeof window !== 'undefined' && (window as any).pendo) {
      // Trigger Pendo guide for fund launching tasks
      (window as any).pendo.track('fund_launch_started', {
        fundType: category,
        taskCount: tasks.length
      });
    }
  }, [category, tasks.length]);

  // Pendo guide when tasks are completed
  useEffect(() => {
    if (showCompletion && typeof window !== 'undefined' && (window as any).pendo) {
      (window as any).pendo.track('fund_launch_completed', {
        fundType: category,
        completionTime: new Date().toISOString()
      });
    }
  }, [showCompletion, category]);

  const handleTaskClick = (task: GeneratedTask): void => {
    if (task.completed && task.actionType !== 'navigation') return;

    if (task.actionType === 'dialog' && task.dialogConfig) {
      setCurrentTask(task);
      setDialogOpen(true);
    } else if (task.actionType === 'navigation' && task.route) {
      navigate(task.route);
    } else {
      // Default action - just complete the task
      dispatch(completeTask(Number(task.id)));
      checkCompletion();
    }
  };

  const handleDialogSubmit = (data: Record<string, any>) => {
    if (currentTask) {
      dispatch(completeTask(Number(currentTask.id)));
      checkCompletion();
    }
  };

  const checkCompletion = () => {
    const allCompleted = tasks.every(task => task.completed);
    if (allCompleted) {
      setTimeout(() => {
        setShowCompletion(true);
      }, 500);
    }
  };

  const handleReset = (): void => {
    dispatch(resetTasks(category));
    setShowCompletion(false);
  };

  const handleReturnToDashboard = () => {
    navigate('/user-dashboard');
  };

  const tree = buildTree(tasks);
  const completedScore = getCompletedScore(tasks);
  const totalScore = getTotalScore(tasks);
  const progressPercentage = (completedScore / totalScore) * 100;
  const colors = categoryColors[category] || categoryColors.sfr;

  return (
    <Box
      sx={{
        minHeight: "100vh",
        background: "#f7f7f7",
        py: { xs: 2, sm: 3, md: 4 },
        px: { xs: 1, sm: 2 },
        position: "relative",
        overflow: "hidden",
      }}
    >
      <Box sx={{ 
        margin: "0 auto", 
        maxWidth: { xs: "100%", sm: "900px", md: "1200px" }, 
        position: "relative", 
        zIndex: 1 
      }}>
        {/* Header */}
        <Box sx={{ mb: { xs: 2, sm: 3, md: 4 } }}>
          <Box
            sx={{
              display: "flex",
              alignItems: { xs: "flex-start", sm: "center" },
              justifyContent: "space-between",
              mb: { xs: 2, sm: 3 },
              flexDirection: { xs: "column", sm: "row" },
              gap: { xs: 2, sm: 0 }
            }}
          >
            <Box>
              <Typography
                variant="h3"
                sx={{
                  fontWeight: "bold",
                  color: "#000000",
                  mb: 1,
                  textShadow: "none",
                  fontSize: { xs: "1.5rem", sm: "2rem", md: "3rem" },
                }}
              >
                {category.charAt(0).toUpperCase() + category.slice(1)} Skill Tree
              </Typography>
              <Chip
                label={`${completedScore} / ${totalScore} Complete`}
                sx={{
                  backgroundColor: "#fbbf24",
                  color: "#000",
                  fontWeight: 600,
                  fontSize: { xs: "0.75rem", sm: "0.875rem" },
                }}
              />
            </Box>
          </Box>

          {/* Progress Bar */}
          <Card sx={{ 
            p: { xs: 1.5, sm: 2 }, 
            boxShadow: 3, 
            backgroundColor: "#ffffff", 
            backdropFilter: "none" 
          }}>
            <Box sx={{ display: "flex", justifyContent: "space-between", mb: 1 }}>
              <Typography 
                variant="subtitle2" 
                sx={{ 
                  fontWeight: 600, 
                  color: "#000000",
                  fontSize: { xs: "0.75rem", sm: "0.875rem" }
                }}
              >
                Progress
              </Typography>
              <Typography 
                variant="subtitle2" 
                sx={{ 
                  color: "#fbbf24", 
                  fontWeight: 600,
                  fontSize: { xs: "0.75rem", sm: "0.875rem" }
                }}
              >
                {Math.round(progressPercentage)}%
              </Typography>
            </Box>
            <LinearProgress
              variant="determinate"
              value={progressPercentage}
              sx={{
                height: { xs: 6, sm: 8, md: 10 },
                borderRadius: 5,
                backgroundColor: "#e5e7eb",
                "& .MuiLinearProgress-bar": {
                  borderRadius: 5,
                  background: "#fbbf24",
                  boxShadow: "none",
                },
              }}
            />
          </Card>
        </Box>

        {/* Skill Tree */}
        <Box
          sx={{
            p: { xs: 1, sm: 2, md: 4 },
            display: "flex",
            justifyContent: "center",
          }}
        >
          {renderTree(tree, tasks, handleTaskClick, 0, colors, isMobile)}
        </Box>

        {/* Return to Dashboard Button */}
        <Box
          sx={{
            display: "flex",
            justifyContent: "center",
            mt: { xs: 3, sm: 4, md: 5 },
            mb: { xs: 2, sm: 3, md: 4 },
          }}
        >
          <Button
            onClick={handleReturnToDashboard}
            variant="contained"
            size="large"
            sx={{
              backgroundColor: "#fbbf24",
              color: "#000",
              textTransform: "none",
              fontSize: { xs: "1rem", sm: "1.1rem" },
              fontWeight: "bold",
              px: { xs: 3, sm: 4, md: 5 },
              py: { xs: 1.25, sm: 1.5 },
              boxShadow: "0 4px 12px rgba(0, 0, 0, 0.15)",
              "&:hover": {
                backgroundColor: "#d9a021",
                boxShadow: "0 8px 24px rgba(0, 0, 0, 0.2)",
              },
            }}
          >
            Return to Dashboard
          </Button>
        </Box>
      </Box>

      {/* Task Dialog */}
      {currentTask?.dialogConfig && (
        <TaskDialog
          open={dialogOpen}
          onClose={() => setDialogOpen(false)}
          onSubmit={handleDialogSubmit}
          title={currentTask.dialogConfig.title}
          fields={currentTask.dialogConfig.fields}
          submitLabel={currentTask.dialogConfig.submitLabel}
        />
      )}

      {/* Completion Animation */}
      {showCompletion && (
        <Box
          sx={{
            position: "fixed",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            zIndex: 9999,
            background: "rgba(0, 0, 0, 0.9)",
            backdropFilter: "blur(10px)",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            p: 3,
          }}
        >
          <Box
            sx={{
              textAlign: "center",
              animation: "celebration 2s ease-in-out",
              "@keyframes celebration": {
                "0%": { transform: "scale(0.5)", opacity: 0 },
                "50%": { transform: "scale(1.2)", opacity: 1 },
                "100%": { transform: "scale(1)", opacity: 1 },
              },
            }}
          >
            <CelebrationIcon
              sx={{
                fontSize: { xs: 80, sm: 100, md: 120 },
                color: colors.color,
                mb: 3,
                filter: `drop-shadow(0 0 20px ${colors.color})`,
              }}
            />
            <Typography
              variant="h3"
              sx={{
                color: colors.color,
                fontWeight: "bold",
                mb: 2,
                textShadow: `0 0 20px ${colors.color}80`,
                fontSize: { xs: "2rem", sm: "2.5rem", md: "3rem" },
              }}
            >
              Congratulations!
            </Typography>
            <Typography
              variant="h5"
              sx={{
                color: "#fff",
                mb: 4,
                fontSize: { xs: "1.25rem", sm: "1.5rem", md: "1.75rem" },
              }}
            >
              You've successfully completed all tasks in this fund category!
            </Typography>
            <Box sx={{ display: "flex", gap: 3, justifyContent: "center", flexWrap: "wrap" }}>
              <Button
                onClick={handleReturnToDashboard}
                variant="contained"
                size="large"
                sx={{
                  backgroundColor: colors.color,
                  color: "#000",
                  textTransform: "none",
                  fontSize: "1.1rem",
                  fontWeight: "bold",
                  px: 4,
                  py: 1.5,
                  "&:hover": {
                    backgroundColor: colors.color,
                    opacity: 0.9,
                  },
                }}
              >
                Return to Dashboard
              </Button>
              <Button
                onClick={handleReset}
                variant="outlined"
                size="large"
                sx={{
                  borderColor: "#fff",
                  color: "#fff",
                  textTransform: "none",
                  fontSize: "1.1rem",
                  px: 4,
                  py: 1.5,
                  "&:hover": {
                    borderColor: colors.color,
                    color: colors.color,
                    backgroundColor: "rgba(255, 255, 255, 0.1)",
                  },
                }}
              >
                Start Over
              </Button>
            </Box>
          </Box>
        </Box>
      )}
    </Box>
  );
}