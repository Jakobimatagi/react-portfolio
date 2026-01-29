import React from "react";
import {
  Card,
  CardContent,
  Typography,
  Button,
  Chip,
  Stack
} from "@mui/material";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import LockIcon from "@mui/icons-material/Lock";
import BoltIcon from "@mui/icons-material/Bolt";

export default function TaskNode({ task, unlocked, onComplete }) {
  const isCompleted = task.completed;

  const statusChip = () => {
    if (isCompleted) {
      return (
        <Chip
          icon={<CheckCircleIcon />}
          label="Completed"
          color="success"
          size="small"
        />
      );
    }

    if (!unlocked) {
      return (
        <Chip
          icon={<LockIcon />}
          label="Locked"
          size="small"
          variant="outlined"
        />
      );
    }

    return (
      <Chip
        icon={<BoltIcon />}
        label="Unlocked"
        color="primary"
        size="small"
      />
    );
  };

  return (
    <Card
      sx={{
        mb: 1.5,
        borderLeft: isCompleted ? "6px solid #2e7d32" : "6px solid transparent",
        opacity: unlocked || isCompleted ? 1 : 0.45,
        backgroundColor: isCompleted ? "rgba(46,125,50,0.05)" : "background.paper",
        transition: "all 0.2s ease"
      }}
    >
      <CardContent>
        <Stack spacing={1}>
          <Stack direction="row" justifyContent="space-between" alignItems="center">
            <Typography fontWeight={600}>
              {task.label}
            </Typography>
            {statusChip()}
          </Stack>

          <Typography variant="body2" color="text.secondary">
            {task.description ?? "Complete this node to unlock further progress."}
          </Typography>

          <Stack direction="row" spacing={1}>
            <Chip label={`+${task.points} XP`} size="small" />
            <Chip label={`Urgency ${task.urgency}`} size="small" />
          </Stack>

          {unlocked && !isCompleted && (
            <Button
              size="small"
              variant="contained"
              onClick={() => onComplete(task.id)}
              sx={{ alignSelf: "flex-start", mt: 1 }}
            >
              Complete
            </Button>
          )}
        </Stack>
      </CardContent>
    </Card>
  );
}
