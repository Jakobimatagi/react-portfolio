import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  Box,
  Typography,
  Card,
  Chip,
  Button,
  useMediaQuery,
  useTheme,
} from "@mui/material";
import { PieChart, Pie, Cell, Label } from "recharts";
import {
  useCategoryStats,
  useTaskStats,
  useIsInitialTasksComplete,
} from "../../store/task-hooks";
import { useSelector } from "react-redux";
import { RootState } from "../../store/index";
import HelpOutlineIcon from "@mui/icons-material/HelpOutline";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import CancelIcon from "@mui/icons-material/Cancel";
import OnboardingTour from "../onboarding/onboarding-tour";
import LockIcon from "@mui/icons-material/Lock";

interface LabelPosition {
  x: number;
  y: number;
}

const categoryColors: Record<
  string,
  { bg: string; color: string; glow: string }
> = {
  initialTasks: {
    bg: "#2d2d2d",
    color: "#6b7280",
    glow: "rgba(107, 114, 128, 0.3)",
  },
  sfr: { bg: "#2d2d2d", color: "#3b82f6", glow: "rgba(59, 130, 246, 0.3)" },
  commercial: {
    bg: "#2d2d2d",
    color: "#10b981",
    glow: "rgba(16, 185, 129, 0.3)",
  },
  specialty: {
    bg: "#2d2d2d",
    color: "#8b5cf6",
    glow: "rgba(139, 92, 246, 0.3)",
  },
};

export default function UserDashboard() {
  const navigate = useNavigate();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const isTablet = useMediaQuery(theme.breakpoints.down("md"));

  const [activeIndex, setActiveIndex] = useState<number | null>(null);
  const [showPrompt, setShowPrompt] = useState(false);
  const [showOnboarding, setShowOnboarding] = useState(false);

  // Check if fund type is selected
  useEffect(() => {
    const selectedFund = localStorage.getItem("selectedFundType");
    if (!selectedFund) {
      navigate("/fund-selection");
      return;
    }
  }, [navigate]);

  // Get task data from Redux
  const tasks = useSelector((state: RootState) => state.tasks);
  const initialTasksStats = useCategoryStats("initialTasks");
  const sfrStats = useCategoryStats("sfr");
  const commercialStats = useCategoryStats("commercial");
  const specialtyStats = useCategoryStats("specialty");
  const totalStats = useTaskStats();
  const isInitialTasksComplete = useIsInitialTasksComplete();

  // Check if first visit
  useEffect(() => {
    const hasVisited = localStorage.getItem("hasVisitedDashboard");
    if (!hasVisited) {
      setShowPrompt(true);
    }
  }, []);

  const handleFirstTimeYes = () => {
    setShowPrompt(false);
    setShowOnboarding(true);
  };

  const handleFirstTimeNo = () => {
    localStorage.setItem("hasVisitedDashboard", "true");
    setShowPrompt(false);
  };

  const handleOnboardingComplete = () => {
    localStorage.setItem("hasVisitedDashboard", "true");
    setShowOnboarding(false);
  };

  const categories = [
    {
      name: "Initial Tasks",
      color: categoryColors.initialTasks.color,
      glow: categoryColors.initialTasks.glow,
      category: "initialTasks",
      taskData: tasks.initialTasks,
      value: initialTasksStats.completed,
      max: initialTasksStats.total,
      locked: false,
    },
    {
      name: "SFR Fund",
      color: categoryColors.sfr.color,
      glow: categoryColors.sfr.glow,
      category: "sfr",
      taskData: tasks.sfr,
      value: sfrStats.completed,
      max: sfrStats.total,
      locked: !isInitialTasksComplete,
    },
    {
      name: "Commercial Fund",
      color: categoryColors.commercial.color,
      glow: categoryColors.commercial.glow,
      category: "commercial",
      taskData: tasks.commercial,
      value: commercialStats.completed,
      max: commercialStats.total,
      locked: !isInitialTasksComplete,
    },
    {
      name: "Specialty Fund",
      color: categoryColors.specialty.color,
      glow: categoryColors.specialty.glow,
      category: "specialty",
      taskData: tasks.specialty,
      value: specialtyStats.completed,
      max: specialtyStats.total,
      locked: !isInitialTasksComplete,
    },
  ];

  const pieData = categories.map((cat) => ({
    name: cat.name,
    value: cat.value || 1,
    color: cat.locked ? "#555" : cat.color,
    glow: cat.glow,
    locked: cat.locked,
  }));

  const score = totalStats.completed;
  const max = totalStats.total;

  const chartSize = isMobile ? 300 : isTablet ? 400 : 500;
  const innerRadius = isMobile ? 80 : isTablet ? 100 : 130;
  const outerRadius = isMobile ? 130 : isTablet ? 160 : 200;

  // Calculate label positions
  const getLabelPosition = (idx: number): LabelPosition => {
    const total = pieData.reduce((sum, d) => sum + d.value, 0) || 1;
    const startAngle = 90;
    const prevValues = pieData
      .slice(0, idx)
      .reduce((sum, d) => sum + d.value, 0);
    const midAngle =
      startAngle - ((prevValues + pieData[idx].value / 2) / total) * 360;
    const radius = isMobile ? 150 : isTablet ? 200 : 250;
    const rad = (midAngle * Math.PI) / 180;
    const x = chartSize / 2 + Math.cos(rad) * radius;
    const y = chartSize / 2 - Math.sin(rad) * radius;
    return { x, y };
  };

  const handleCategoryClick = (category: (typeof categories)[0]) => {
    if (category.locked) {
      return;
    }
    navigate("/skill-tree", {
      state: {
        taskData: category.taskData,
        category: category.category,
      },
    });
  };

  return (
    <>
      {/* First Time Prompt */}
      {showPrompt && (
        <Box
          sx={{
            position: "fixed",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            zIndex: 9999,
            background: "rgba(247, 247, 247, 0.98)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            p: { xs: 2, sm: 3 },
          }}
        >
          <Card
            sx={{
              maxWidth: 600,
              width: "100%",
              p: { xs: 3, sm: 4, md: 5 },
              position: "relative",
              zIndex: 1,
              background: "#ffffff",
              backdropFilter: "none",
              border: "2px solid #fbbf24",
              boxShadow: "0 4px 24px rgba(0, 0, 0, 0.1)",
              textAlign: "center",
            }}
          >
            <Box
              sx={{
                mb: { xs: 2, sm: 3 },
                display: "flex",
                justifyContent: "center",
              }}
            >
              <HelpOutlineIcon
                sx={{
                  fontSize: { xs: 60, sm: 70, md: 80 },
                  color: "#5b8ec4",
                  filter: "drop-shadow(0 0 10px rgba(91, 142, 196, 0.3))",
                }}
              />
            </Box>

            <Typography
              variant="h3"
              sx={{
                fontWeight: "bold",
                color: "#000000",
                mb: { xs: 1, sm: 2 },
                textShadow: "none",
                fontSize: { xs: "1.75rem", sm: "2.5rem", md: "3rem" },
              }}
            >
              Welcome!
            </Typography>

            <Typography
              variant="h5"
              sx={{
                color: "#666666",
                mb: { xs: 3, sm: 4 },
                lineHeight: 1.6,
                fontSize: { xs: "1rem", sm: "1.25rem", md: "1.5rem" },
              }}
            >
              Is this your first time using the Skill Dashboard?
            </Typography>

            <Box
              sx={{
                display: "flex",
                gap: { xs: 2, sm: 3 },
                justifyContent: "center",
                flexDirection: { xs: "column", sm: "row" },
              }}
            >
              <Button
                onClick={handleFirstTimeYes}
                variant="contained"
                startIcon={<CheckCircleIcon />}
                fullWidth={isMobile}
                sx={{
                  backgroundColor: "#6b9970",
                  color: "#ffffff",
                  textTransform: "none",
                  fontSize: { xs: "1rem", sm: "1.1rem", md: "1.2rem" },
                  fontWeight: "bold",
                  px: { xs: 3, sm: 4, md: 5 },
                  py: { xs: 1.5, sm: 2 },
                  boxShadow: "0 0 15px rgba(107, 153, 112, 0.4)",
                  "&:hover": {
                    backgroundColor: "#5a8560",
                    boxShadow: "0 0 20px rgba(107, 153, 112, 0.6)",
                    transform: "scale(1.05)",
                  },
                  transition: "all 0.3s ease",
                }}
              >
                Yes, Show Me Around
              </Button>

              <Button
                onClick={handleFirstTimeNo}
                variant="outlined"
                startIcon={<CancelIcon />}
                fullWidth={isMobile}
                sx={{
                  borderColor: "#fbbf24",
                  color: "#fbbf24",
                  textTransform: "none",
                  fontSize: { xs: "1rem", sm: "1.1rem", md: "1.2rem" },
                  fontWeight: "bold",
                  px: { xs: 3, sm: 4, md: 5 },
                  py: { xs: 1.5, sm: 2 },
                  borderWidth: 2,
                  "&:hover": {
                    borderColor: "#d9a021",
                    backgroundColor: "rgba(251, 191, 36, 0.15)",
                    borderWidth: 2,
                    transform: "scale(1.05)",
                  },
                  transition: "all 0.3s ease",
                }}
              >
                No, I'm Good
              </Button>
            </Box>
          </Card>
        </Box>
      )}

      {/* Onboarding Tour */}
      {showOnboarding && (
        <OnboardingTour onComplete={handleOnboardingComplete} />
      )}

      {/* Main Dashboard */}
      <Box
        sx={{
          minHeight: "100vh",
          background: "#f7f7f7",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "center",
          position: "relative",
          overflow: "hidden",
          p: { xs: 2, sm: 3 },
        }}
      >
        {/* Header */}
        <Box
          sx={{
            mb: { xs: 2, sm: 3, md: 4 },
            textAlign: "center",
            position: "relative",
            zIndex: 1,
          }}
        >
          <Typography
            variant="h2"
            sx={{
              fontWeight: "bold",
              color: "#000000",
              mb: { xs: 1, sm: 2 },
              textShadow: "none",
              letterSpacing: { xs: "1px", sm: "2px", md: "3px" },
              fontSize: { xs: "1.5rem", sm: "2.5rem", md: "3.75rem" },
            }}
          >
            FUND LAUNCH DASHBOARD
          </Typography>
          <Chip
            label={`Launch Progress: ${score} / ${max}`}
            sx={{
              backgroundColor: "#fbbf24",
              color: "#000",
              fontWeight: 700,
              fontSize: { xs: "0.875rem", sm: "1rem", md: "1.1rem" },
              padding: { xs: "6px 12px", sm: "8px 16px" },
              boxShadow: "0 0 15px rgba(251, 191, 36, 0.3)",
            }}
          />
          {!isInitialTasksComplete && (
            <Typography
              variant="body1"
              sx={{
                color: "#666666",
                mt: { xs: 1, sm: 2 },
                fontWeight: 600,
                textShadow: "none",
                fontSize: { xs: "0.875rem", sm: "1rem" },
                px: 2,
              }}
            >
              Complete Onboarding to unlock other categories
            </Typography>
          )}
        </Box>

        {/* Main Content */}
        <Box
          sx={{
            position: "relative",
            width: { xs: 300, sm: 400, md: 500 },
            height: { xs: 300, sm: 400, md: 500 },
            zIndex: 1,
            mb: { xs: 2, sm: 0 },
          }}
        >
          {activeIndex !== null && !categories[activeIndex].locked && (
            <Box
              sx={{
                position: "absolute",
                top: "50%",
                left: "50%",
                width: "calc(100% - 20px)",
                height: "calc(100% - 20px)",
                transform: "translate(-50%, -50%)",
                borderRadius: "50%",
                border: `3px solid ${pieData[activeIndex].color}`,
                opacity: 0.6,
                pointerEvents: "none",
                transition: "all 0.3s ease",
              }}
            />
          )}

          <PieChart width={chartSize} height={chartSize}>
            <Pie
              data={pieData}
              dataKey="value"
              cx="50%"
              cy="50%"
              innerRadius={innerRadius}
              outerRadius={outerRadius}
              startAngle={90}
              endAngle={-270}
              paddingAngle={3}
              onClick={(_, idx: number) => handleCategoryClick(categories[idx])}
              isAnimationActive={false}
              onMouseEnter={(_, idx: number) => setActiveIndex(idx)}
              onMouseLeave={() => setActiveIndex(null)}
            >
              {pieData.map((entry, idx) => (
                <Cell
                  key={`cell-${idx}`}
                  fill={entry.color}
                  style={{
                    cursor: entry.locked ? "not-allowed" : "pointer",
                    filter: entry.locked
                      ? "brightness(0.6) saturate(0.5)"
                      : activeIndex === idx
                        ? "brightness(1.15)"
                        : "brightness(0.95)",
                    transition: "all 0.3s ease-in-out",
                    opacity: entry.locked ? 0.3 : 1,
                  }}
                  stroke="#ffffff"
                  strokeWidth={3}
                />
              ))}
              <Label
                value={`${score} / ${max}`}
                position="center"
                style={{
                  fontSize: isMobile ? 32 : isTablet ? 40 : 48,
                  fontWeight: "bold",
                  fill: "#fff",
                  textShadow: "0 0 10px rgba(255,255,255,0.8)",
                }}
              />
            </Pie>
          </PieChart>

          {/* Category labels with cards */}
          {!isMobile &&
            pieData.map((cat, idx) => {
              const { x, y } = getLabelPosition(idx);
              const categoryInfo = categories[idx];
              return (
                <Card
                  key={cat.name}
                  onClick={() => handleCategoryClick(categoryInfo)}
                  sx={{
                    position: "absolute",
                    left: x - (isTablet ? 50 : 60),
                    top: y - 30,
                    width: isTablet ? 100 : 120,
                    p: { xs: 1, sm: 1.5 },
                    textAlign: "center",
                    background: categoryInfo.locked
                      ? "rgba(200, 200, 200, 0.9)"
                      : "rgba(0, 0, 0, 0.8)",
                    backdropFilter: "blur(10px)",
                    border: categoryInfo.locked
                      ? "2px solid #cccccc"
                      : `2px solid ${cat.color}`,
                    borderRadius: 2,
                    cursor: categoryInfo.locked ? "not-allowed" : "pointer",
                    transition: "all 0.3s ease",
                    boxShadow:
                      activeIndex === idx && !categoryInfo.locked
                        ? `0 8px 24px ${cat.glow}, 0 0 0 3px ${cat.color}20`
                        : categoryInfo.locked
                          ? "0 2px 8px rgba(0, 0, 0, 0.1)"
                          : `0 4px 12px rgba(0, 0, 0, 0.15)`,
                    transform:
                      activeIndex === idx && !categoryInfo.locked
                        ? "scale(1.1)"
                        : "scale(1)",
                    opacity: 1,
                    "&:hover": categoryInfo.locked
                      ? {}
                      : {
                          transform: "scale(1.15)",
                          boxShadow: `0 12px 32px ${cat.glow}, 0 0 0 3px ${cat.color}30`,
                          background: "rgba(0, 0, 0, 0.9)",
                        },
                  }}
                >
                  {categoryInfo.locked && (
                    <LockIcon
                      sx={{
                        position: "absolute",
                        top: -10,
                        right: -10,
                        fontSize: { xs: 16, sm: 20 },
                        color: "#666666",
                        backgroundColor: "#f0f0f0",
                        borderRadius: "50%",
                        p: 0.5,
                        border: "2px solid #cccccc",
                      }}
                    />
                  )}
                  <Typography
                    variant="h6"
                    sx={{
                      color: categoryInfo.locked ? "#999999" : cat.color,
                      fontWeight: "bold",
                      mb: 0.5,
                      textShadow: categoryInfo.locked
                        ? "none"
                        : `0 0 10px ${cat.glow}`,
                      fontSize: { xs: "0.875rem", sm: "1rem", md: "1.25rem" },
                    }}
                  >
                    {cat.name}
                  </Typography>
                  <Typography
                    variant="body2"
                    sx={{
                      color: "#ffffff",
                      fontWeight: 600,
                      fontSize: { xs: "0.7rem", sm: "0.875rem" },
                    }}
                  >
                    {categoryInfo.value} / {categoryInfo.max}
                  </Typography>
                </Card>
              );
            })}
        </Box>

        {/* Mobile Category List */}
        {isMobile && (
          <Box
            sx={{
              display: "flex",
              flexDirection: "column",
              gap: 2,
              width: "100%",
              maxWidth: 400,
              mt: 3,
              zIndex: 1,
            }}
          >
            {categories.map((cat, idx) => (
              <Card
                key={cat.name}
                onClick={() => handleCategoryClick(cat)}
                sx={{
                  p: 2,
                  background: cat.locked
                    ? "rgba(200, 200, 200, 0.9)"
                    : "rgba(0, 0, 0, 0.8)",
                  backdropFilter: "blur(10px)",
                  border: cat.locked
                    ? "2px solid #cccccc"
                    : `2px solid ${cat.color}`,
                  borderRadius: 2,
                  cursor: cat.locked ? "not-allowed" : "pointer",
                  opacity: 1,
                  position: "relative",
                  transition: "all 0.3s ease",
                  overflow: "visible",
                  boxShadow: cat.locked
                    ? "0 2px 8px rgba(0, 0, 0, 0.1)"
                    : `0 4px 12px rgba(0, 0, 0, 0.15)`,
                  "&:active": !cat.locked
                    ? {
                        transform: "scale(0.98)",
                        boxShadow: `0 8px 24px ${cat.glow}, 0 0 0 3px ${cat.color}20`,
                      }
                    : {},
                }}
              >
                {cat.locked && (
                  <LockIcon
                    sx={{
                      position: "absolute",
                      top: -12,
                      right: -12,
                      fontSize: 28,
                      color: "#666666",
                      backgroundColor: "#f0f0f0",
                      borderRadius: "50%",
                      p: 0.5,
                      border: "2px solid #cccccc",
                      zIndex: 2,
                    }}
                  />
                )}
                <Typography
                  variant="h6"
                  sx={{
                    color: cat.locked ? "#999999" : cat.color,
                    fontWeight: "bold",
                    mb: 1,
                    textShadow: cat.locked ? "none" : `0 0 10px ${cat.glow}`,
                    pr: cat.locked ? 1 : 0,
                  }}
                >
                  {cat.name}
                </Typography>
                <Typography
                  variant="body2"
                  sx={{
                    color: "#ffffff",
                    fontWeight: 600,
                  }}
                >
                  {cat.value} / {cat.max} Complete
                </Typography>
              </Card>
            ))}
          </Box>
        )}

        {/* Instructions */}
        <Box
          sx={{
            mt: { xs: 3, sm: 4, md: 6 },
            textAlign: "center",
            position: "relative",
            zIndex: 1,
            px: 2,
          }}
        >
          <Typography
            variant="body1"
            sx={{
              color: "#666666",
              fontSize: { xs: "0.875rem", sm: "1rem", md: "1.1rem" },
              animation: "pulse 2s ease-in-out infinite",
              "@keyframes pulse": {
                "0%, 100%": { opacity: 0.7 },
                "50%": { opacity: 1 },
              },
            }}
          >
            {isInitialTasksComplete
              ? "Click on a fund category to begin the launch process"
              : "Complete initial tasks to unlock fund categories"}
          </Typography>
        </Box>
      </Box>
    </>
  );
}
