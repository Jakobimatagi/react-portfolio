import React, { useState } from "react";
import { Box, Button, Typography, Card, Stepper, Step, StepLabel, useMediaQuery, useTheme } from "@mui/material";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import RocketLaunchIcon from "@mui/icons-material/RocketLaunch";

interface OnboardingTourProps {
  onComplete: () => void;
}

const steps = [
  {
    title: "Welcome to Your Skill Tree",
    description: "Track your progress and unlock new skills as you complete tasks in Frontend, Backend, and DevOps.",
    image: "🎮",
  },
  {
    title: "Navigate Your Dashboard",
    description: "The pie chart shows your progress across all categories. Click on any category to dive into its skill tree.",
    image: "📊",
  },
  {
    title: "Complete Tasks to Progress",
    description: "Each skill must be unlocked by completing previous tasks. Click on unlocked tasks to mark them complete.",
    image: "✅",
  },
  {
    title: "Track Your Journey",
    description: "Watch your progress grow as you complete more tasks. Reset anytime to start fresh!",
    image: "🚀",
  },
];

export default function OnboardingTour({ onComplete }: OnboardingTourProps) {
  const [activeStep, setActiveStep] = useState(0);
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
//   const isTablet = useMediaQuery(theme.breakpoints.down('md'));

  const handleNext = () => {
    if (activeStep === steps.length - 1) {
      onComplete();
    } else {
      setActiveStep((prev) => prev + 1);
    }
  };

  const handleBack = () => {
    setActiveStep((prev) => prev - 1);
  };

  const handleSkip = () => {
    onComplete();
  };

  return (
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
          maxWidth: 700,
          width: "100%",
          p: { xs: 2, sm: 3, md: 4 },
          position: "relative",
          zIndex: 1,
          background: "rgba(0, 0, 0, 0.9)",
          backdropFilter: "blur(20px)",
          border: "2px solid #fbbf24",
          boxShadow: "0 0 20px rgba(251, 191, 36, 0.2)",
        }}
      >
        {/* Skip Button */}
        <Button
          onClick={handleSkip}
          sx={{
            position: "absolute",
            top: { xs: 8, sm: 16 },
            right: { xs: 8, sm: 16 },
            color: "#999",
            textTransform: "none",
            fontSize: { xs: "0.875rem", sm: "1rem" },
            minWidth: "auto",
            p: { xs: 1, sm: 1.5 },
            "&:hover": {
              color: "#fbbf24",
            },
          }}
        >
          Skip
        </Button>

        {/* Stepper */}
        <Stepper 
          activeStep={activeStep} 
          sx={{ 
            mb: { xs: 2, sm: 3, md: 4 }, 
            mt: { xs: 4, sm: 2 },
            "& .MuiStepConnector-line": {
              display: { xs: "none", sm: "block" }
            }
          }}
          orientation={isMobile ? "vertical" : "horizontal"}
        >
          {steps.map((step, index) => (
            <Step key={index}>
              <StepLabel
                sx={{
                  "& .MuiStepLabel-label": {
                    color: "#999",
                    fontSize: { xs: "0.75rem", sm: "0.875rem" },
                    display: { xs: "none", sm: "block" }
                  },
                  "& .MuiStepLabel-label.Mui-active": {
                    color: "#fbbf24",
                  },
                  "& .MuiStepLabel-label.Mui-completed": {
                    color: "#6b9970",
                  },
                  "& .MuiStepIcon-root": {
                    color: "#333",
                    fontSize: { xs: "1.5rem", sm: "2rem" }
                  },
                  "& .MuiStepIcon-root.Mui-active": {
                    color: "#fbbf24",
                  },
                  "& .MuiStepIcon-root.Mui-completed": {
                    color: "#6b9970",
                  },
                }}
              />
            </Step>
          ))}
        </Stepper>

        {/* Content */}
        <Box sx={{ textAlign: "center", py: { xs: 2, sm: 3, md: 4 } }}>
          <Typography
            variant="h1"
            sx={{
              fontSize: { xs: "3rem", sm: "4rem", md: "5rem" },
              mb: { xs: 2, sm: 3 },
            }}
          >
            {steps[activeStep].image}
          </Typography>
          <Typography
            variant="h4"
            sx={{
              fontWeight: "bold",
              color: "#fbbf24",
              mb: { xs: 1, sm: 2 },
              textShadow: "0 0 10px rgba(251, 191, 36, 0.3)",
              fontSize: { xs: "1.25rem", sm: "1.75rem", md: "2.125rem" },
            }}
          >
            {steps[activeStep].title}
          </Typography>
          <Typography
            variant="body1"
            sx={{
              color: "#ccc",
              fontSize: { xs: "0.875rem", sm: "1rem", md: "1.1rem" },
              lineHeight: 1.8,
              maxWidth: 500,
              mx: "auto",
              px: { xs: 1, sm: 2 },
            }}
          >
            {steps[activeStep].description}
          </Typography>
        </Box>

        {/* Navigation Buttons */}
        <Box sx={{ 
          display: "flex", 
          justifyContent: "space-between", 
          mt: { xs: 2, sm: 3, md: 4 },
          flexDirection: { xs: "column", sm: "row" },
          gap: { xs: 2, sm: 0 }
        }}>
          <Button
            onClick={handleBack}
            disabled={activeStep === 0}
            startIcon={!isMobile && <ArrowBackIcon />}
            sx={{
              color: activeStep === 0 ? "#333" : "#fbbf24",
              textTransform: "none",
              fontSize: { xs: "0.875rem", sm: "1rem" },
              order: { xs: 2, sm: 1 },
              "&:hover": {
                backgroundColor: "rgba(251, 191, 36, 0.1)",
              },
            }}
          >
            Back
          </Button>

          <Button
            onClick={handleNext}
            endIcon={!isMobile && (activeStep === steps.length - 1 ? <RocketLaunchIcon /> : <ArrowForwardIcon />)}
            variant="contained"
            fullWidth={isMobile}
            sx={{
              backgroundColor: "#fbbf24",
              color: "#000",
              textTransform: "none",
              fontSize: { xs: "0.875rem", sm: "1rem" },
              fontWeight: "bold",
              px: { xs: 3, sm: 4 },
              py: { xs: 1.5, sm: 1 },
              boxShadow: "0 0 10px rgba(251, 191, 36, 0.3)",
              order: { xs: 1, sm: 2 },
              "&:hover": {
                backgroundColor: "#d9a021",
                boxShadow: "0 0 15px rgba(251, 191, 36, 0.4)",
              },
            }}
          >
            {activeStep === steps.length - 1 ? "Get Started" : "Next"}
          </Button>
        </Box>

        {/* Progress Indicator */}
        <Box sx={{ 
          display: "flex", 
          justifyContent: "center", 
          gap: 1, 
          mt: { xs: 2, sm: 3 },
          order: { xs: 3, sm: 3 }
        }}>
          {steps.map((_, index) => (
            <Box
              key={index}
              sx={{
                width: { xs: 6, sm: 8 },
                height: { xs: 6, sm: 8 },
                borderRadius: "50%",
                backgroundColor: index === activeStep ? "#fbbf24" : "#333",
                transition: "all 0.3s ease",
                boxShadow: index === activeStep ? "0 0 10px rgba(251, 191, 36, 0.5)" : "none",
              }}
            />
          ))}
        </Box>
      </Card>
    </Box>
  );
}