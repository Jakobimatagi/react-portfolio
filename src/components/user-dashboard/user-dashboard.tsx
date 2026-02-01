import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Box, Typography } from "@mui/material";
import { PieChart, Pie, Cell, Label } from "recharts";
import { useCategoryStats, useTaskStats } from "../../store/task-hooks";
import { useSelector } from "react-redux";
import { RootState } from "../../store/index";

interface LabelPosition {
  x: number;
  y: number;
}

export default function UserDashboard() {
  const navigate = useNavigate();
  const [activeIndex, setActiveIndex] = useState<number | null>(null);
  
  // Get task data from Redux
  const tasks = useSelector((state: RootState) => state.tasks);
  const frontendStats = useCategoryStats("frontend");
  const backendStats = useCategoryStats("backend");
  const devopsStats = useCategoryStats("devops");
  const totalStats = useTaskStats();

  const categories = [
    {
      name: "Frontend",
      color: "#8884d8",
      category: "frontend",
      taskData: tasks.frontend,
      value: frontendStats.completed,
      max: frontendStats.total,
    },
    {
      name: "Backend",
      color: "#82ca9d",
      category: "backend",
      taskData: tasks.backend,
      value: backendStats.completed,
      max: backendStats.total,
    },
    {
      name: "DevOps",
      color: "#ffc658",
      category: "devops",
      taskData: tasks.devops,
      value: devopsStats.completed,
      max: devopsStats.total,
    },
  ];

  const pieData = categories.map((cat) => ({
    name: cat.name,
    value: cat.value,
    color: cat.color,
  }));

  const score = totalStats.completed;
  const max = totalStats.total;

  // Calculate label positions
  const getLabelPosition = (idx: number): LabelPosition => {
    const total = pieData.reduce((sum, d) => sum + d.value, 0);
    const startAngle = 90;
    const prevValues = pieData
      .slice(0, idx)
      .reduce((sum, d) => sum + d.value, 0);
    const midAngle =
      startAngle - ((prevValues + pieData[idx].value / 2) / total) * 360;
    const radius = 185;
    const rad = (midAngle * Math.PI) / 180;
    const x = 200 + Math.cos(rad) * radius;
    const y = 200 - Math.sin(rad) * radius;
    return { x, y };
  };

  return (
    <Box
      sx={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        height: "90vh",
      }}
    >
      <Box sx={{ position: "relative", width: 400, height: 400 }}>
        <PieChart width={400} height={400}>
          <Pie
            data={pieData}
            dataKey="value"
            cx="50%"
            cy="50%"
            innerRadius={110}
            outerRadius={170}
            startAngle={90}
            endAngle={-270}
            paddingAngle={2}
            onClick={(_, idx: number) =>
              navigate("/skill-tree", {
                state: { 
                  taskData: categories[idx].taskData,
                  category: categories[idx].category
                },
              })
            }
            isAnimationActive={false}
            onMouseEnter={(_, idx: number) => setActiveIndex(idx)}
            onMouseLeave={() => setActiveIndex(null)}
          >
            {pieData.map((entry, idx) => (
              <Cell
                key={`cell-${idx}`}
                fill={entry.color}
                style={{
                  cursor: "pointer",
                  filter: activeIndex === idx ? "brightness(1.15)" : "brightness(1)",
                  transition: "filter 0.2s ease-in-out",
                }}
              />
            ))}
            <Label
              value={`${score} / ${max}`}
              position="center"
              style={{ fontSize: 32, fontWeight: "bold", fill: "#333" }}
            />
          </Pie>
        </PieChart>
        {/* Pie labels around the chart */}
        {pieData.map((cat, idx) => {
          const { x, y } = getLabelPosition(idx);
          return (
            <Typography
              key={cat.name}
              sx={{
                position: "absolute",
                left: x - 40,
                top: y - 16,
                width: 80,
                textAlign: "center",
                color: cat.color,
                fontWeight: "bold",
                pointerEvents: "none",
                userSelect: "none",
                background: "rgba(255,255,255,0.85)",
                borderRadius: 2,
                px: 1,
                fontSize: 16,
                boxShadow: 1,
              }}
            >
              {cat.name}
            </Typography>
          );
        })}
      </Box>
    </Box>
  );
}