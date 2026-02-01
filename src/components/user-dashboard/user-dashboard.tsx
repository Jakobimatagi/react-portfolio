import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Box, Typography, Card, Chip, Button, useMediaQuery, useTheme } from "@mui/material";
import { PieChart, Pie, Cell, Label } from "recharts";
import { useCategoryStats, useTaskStats, useIsOnboardingComplete } from "../../store/task-hooks";
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

const categoryColors: Record<string, { bg: string; color: string; glow: string }> = {
  onboarding: { bg: "#2e1a47", color: "#b794f6", glow: "rgba(183, 148, 246, 0.4)" },
  frontend: { bg: "#1a1a2e", color: "#00d4ff", glow: "rgba(0, 212, 255, 0.4)" },
  backend: { bg: "#0f2027", color: "#00ff88", glow: "rgba(0, 255, 136, 0.4)" },
  devops: { bg: "#2c1810", color: "#ff8c00", glow: "rgba(255, 140, 0, 0.4)" },
};

export default function UserDashboard() {
  const navigate = useNavigate();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const isTablet = useMediaQuery(theme.breakpoints.down('md'));
  
  const [activeIndex, setActiveIndex] = useState<number | null>(null);
  const [showPrompt, setShowPrompt] = useState(false);
  const [showOnboarding, setShowOnboarding] = useState(false);
  
  // Get task data from Redux
  const tasks = useSelector((state: RootState) => state.tasks);
  const onboardingStats = useCategoryStats("onboarding");
  const frontendStats = useCategoryStats("frontend");
  const backendStats = useCategoryStats("backend");
  const devopsStats = useCategoryStats("devops");
  const totalStats = useTaskStats();
  const isOnboardingComplete = useIsOnboardingComplete();

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
      name: "Onboarding",
      color: categoryColors.onboarding.color,
      glow: categoryColors.onboarding.glow,
      category: "onboarding",
      taskData: tasks.onboarding,
      value: onboardingStats.completed,
      max: onboardingStats.total,
      locked: false,
    },
    {
      name: "Frontend",
      color: categoryColors.frontend.color,
      glow: categoryColors.frontend.glow,
      category: "frontend",
      taskData: tasks.frontend,
      value: frontendStats.completed,
      max: frontendStats.total,
      locked: !isOnboardingComplete,
    },
    {
      name: "Backend",
      color: categoryColors.backend.color,
      glow: categoryColors.backend.glow,
      category: "backend",
      taskData: tasks.backend,
      value: backendStats.completed,
      max: backendStats.total,
      locked: !isOnboardingComplete,
    },
    {
      name: "DevOps",
      color: categoryColors.devops.color,
      glow: categoryColors.devops.glow,
      category: "devops",
      taskData: tasks.devops,
      value: devopsStats.completed,
      max: devopsStats.total,
      locked: !isOnboardingComplete,
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

  const handleCategoryClick = (category: typeof categories[0]) => {
    if (category.locked) {
      return;
    }
    navigate("/skill-tree", {
      state: { 
        taskData: category.taskData,
        category: category.category
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
            background: "radial-gradient(ellipse at top, #1a1a2e, #000000)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            p: { xs: 2, sm: 3 },
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
          <Card
            sx={{
              maxWidth: 600,
              width: "100%",
              p: { xs: 3, sm: 4, md: 5 },
              position: "relative",
              zIndex: 1,
              background: "rgba(0, 0, 0, 0.9)",
              backdropFilter: "blur(20px)",
              border: "2px solid #00d4ff",
              boxShadow: "0 0 40px rgba(0, 212, 255, 0.3)",
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
                  color: "#00d4ff",
                  filter: "drop-shadow(0 0 20px rgba(0, 212, 255, 0.8))",
                }}
              />
            </Box>

            <Typography
              variant="h3"
              sx={{
                fontWeight: "bold",
                color: "#00d4ff",
                mb: { xs: 1, sm: 2 },
                textShadow: "0 0 20px rgba(0, 212, 255, 0.6)",
                fontSize: { xs: "1.75rem", sm: "2.5rem", md: "3rem" },
              }}
            >
              Welcome!
            </Typography>

            <Typography
              variant="h5"
              sx={{
                color: "#ccc",
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
                  backgroundColor: "#00ff88",
                  color: "#000",
                  textTransform: "none",
                  fontSize: { xs: "1rem", sm: "1.1rem", md: "1.2rem" },
                  fontWeight: "bold",
                  px: { xs: 3, sm: 4, md: 5 },
                  py: { xs: 1.5, sm: 2 },
                  boxShadow: "0 0 20px rgba(0, 255, 136, 0.5)",
                  "&:hover": {
                    backgroundColor: "#00cc6a",
                    boxShadow: "0 0 30px rgba(0, 255, 136, 0.7)",
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
                  borderColor: "#00d4ff",
                  color: "#00d4ff",
                  textTransform: "none",
                  fontSize: { xs: "1rem", sm: "1.1rem", md: "1.2rem" },
                  fontWeight: "bold",
                  px: { xs: 3, sm: 4, md: 5 },
                  py: { xs: 1.5, sm: 2 },
                  borderWidth: 2,
                  "&:hover": {
                    borderColor: "#00b8e6",
                    backgroundColor: "rgba(0, 212, 255, 0.1)",
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
      {showOnboarding && <OnboardingTour onComplete={handleOnboardingComplete} />}

      {/* Main Dashboard */}
      <Box
        sx={{
          minHeight: "100vh",
          background: "radial-gradient(ellipse at top, #1a1a2e, #000000)",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "center",
          position: "relative",
          overflow: "hidden",
          p: { xs: 2, sm: 3 },
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
        {/* Header */}
        <Box sx={{ mb: { xs: 2, sm: 3, md: 4 }, textAlign: "center", position: "relative", zIndex: 1 }}>
          <Typography
            variant="h2"
            sx={{
              fontWeight: "bold",
              color: "#00d4ff",
              mb: { xs: 1, sm: 2 },
              textShadow: "0 0 20px rgba(0, 212, 255, 0.8)",
              letterSpacing: { xs: "1px", sm: "2px", md: "3px" },
              fontSize: { xs: "1.5rem", sm: "2.5rem", md: "3.75rem" },
            }}
          >
            SKILL DASHBOARD
          </Typography>
          <Chip
            label={`Total Progress: ${score} / ${max}`}
            sx={{
              backgroundColor: "#00d4ff",
              color: "#000",
              fontWeight: 700,
              fontSize: { xs: "0.875rem", sm: "1rem", md: "1.1rem" },
              padding: { xs: "6px 12px", sm: "8px 16px" },
              boxShadow: "0 0 20px rgba(0, 212, 255, 0.5)",
            }}
          />
          {!isOnboardingComplete && (
            <Typography
              variant="body1"
              sx={{
                color: "#b794f6",
                mt: { xs: 1, sm: 2 },
                fontWeight: 600,
                textShadow: "0 0 10px rgba(183, 148, 246, 0.6)",
                fontSize: { xs: "0.875rem", sm: "1rem" },
                px: 2,
              }}
            >
              Complete Onboarding to unlock other categories
            </Typography>
          )}
        </Box>

        {/* Main Content */}
        <Box sx={{ 
          position: "relative", 
          width: { xs: 300, sm: 400, md: 500 }, 
          height: { xs: 300, sm: 400, md: 500 }, 
          zIndex: 1,
          mb: { xs: 2, sm: 0 }
        }}>
          {/* Glow effect for active slice */}
          {activeIndex !== null && !categories[activeIndex].locked && (
            <Box
              sx={{
                position: "absolute",
                top: "50%",
                left: "50%",
                width: "100%",
                height: "100%",
                transform: "translate(-50%, -50%)",
                borderRadius: "50%",
                boxShadow: `0 0 ${isMobile ? "40px" : "60px"} ${pieData[activeIndex].glow}`,
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
                      ? "brightness(0.5)" 
                      : activeIndex === idx 
                      ? `drop-shadow(0 0 10px ${entry.color}) brightness(1.3)` 
                      : "brightness(1)",
                    transition: "all 0.3s ease-in-out",
                    opacity: entry.locked ? 0.4 : 1,
                  }}
                  stroke="#000"
                  strokeWidth={2}
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
          {!isMobile && pieData.map((cat, idx) => {
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
                  background: categoryInfo.locked ? "rgba(0, 0, 0, 0.6)" : "rgba(0, 0, 0, 0.8)",
                  backdropFilter: "blur(10px)",
                  border: `2px solid ${cat.color}`,
                  borderRadius: 2,
                  cursor: categoryInfo.locked ? "not-allowed" : "pointer",
                  transition: "all 0.3s ease",
                  boxShadow: activeIndex === idx && !categoryInfo.locked
                    ? `0 0 20px ${cat.glow}` 
                    : `0 0 10px ${cat.glow}`,
                  transform: activeIndex === idx && !categoryInfo.locked ? "scale(1.1)" : "scale(1)",
                  opacity: categoryInfo.locked ? 0.5 : 1,
                  "&:hover": categoryInfo.locked ? {} : {
                    transform: "scale(1.15)",
                    boxShadow: `0 0 30px ${cat.glow}`,
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
                      color: "#999",
                      backgroundColor: "#000",
                      borderRadius: "50%",
                      p: 0.5,
                    }}
                  />
                )}
                <Typography
                  variant="h6"
                  sx={{
                    color: cat.color,
                    fontWeight: "bold",
                    mb: 0.5,
                    textShadow: `0 0 10px ${cat.glow}`,
                    fontSize: { xs: "0.875rem", sm: "1rem", md: "1.25rem" },
                  }}
                >
                  {cat.name}
                </Typography>
                <Typography
                  variant="body2"
                  sx={{
                    color: "#fff",
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
          <Box sx={{ 
            display: "flex", 
            flexDirection: "column", 
            gap: 2, 
            width: "100%", 
            maxWidth: 400,
            mt: 3,
            zIndex: 1 
          }}>
            {categories.map((cat, idx) => (
              <Card
                key={cat.name}
                onClick={() => handleCategoryClick(cat)}
                sx={{
                  p: 2,
                  background: cat.locked ? "rgba(0, 0, 0, 0.6)" : "rgba(0, 0, 0, 0.8)",
                  backdropFilter: "blur(10px)",
                  border: `2px solid ${cat.color}`,
                  borderRadius: 2,
                  cursor: cat.locked ? "not-allowed" : "pointer",
                  opacity: cat.locked ? 0.5 : 1,
                  position: "relative",
                  transition: "all 0.3s ease",
                  "&:active": !cat.locked ? {
                    transform: "scale(0.98)",
                    boxShadow: `0 0 20px ${cat.glow}`,
                  } : {},
                }}
              >
                {cat.locked && (
                  <LockIcon
                    sx={{
                      position: "absolute",
                      top: 8,
                      right: 8,
                      fontSize: 20,
                      color: "#999",
                    }}
                  />
                )}
                <Typography
                  variant="h6"
                  sx={{
                    color: cat.color,
                    fontWeight: "bold",
                    mb: 0.5,
                    textShadow: `0 0 10px ${cat.glow}`,
                  }}
                >
                  {cat.name}
                </Typography>
                <Typography
                  variant="body2"
                  sx={{
                    color: "#fff",
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
        <Box sx={{ mt: { xs: 3, sm: 4, md: 6 }, textAlign: "center", position: "relative", zIndex: 1, px: 2 }}>
          <Typography
            variant="body1"
            sx={{
              color: "rgba(255, 255, 255, 0.7)",
              fontSize: { xs: "0.875rem", sm: "1rem", md: "1.1rem" },
              animation: "pulse 2s ease-in-out infinite",
              "@keyframes pulse": {
                "0%, 100%": { opacity: 0.7 },
                "50%": { opacity: 1 },
              },
            }}
          >
            {isOnboardingComplete ? "Click on a category to view skill tree" : "Start with Onboarding to unlock other categories"}
          </Typography>
        </Box>
      </Box>
    </>
  );
}