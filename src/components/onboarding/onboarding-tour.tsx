import React, { useState } from "react";
import { Box, Button, Typography, Card, Stepper, Step, StepLabel } from "@mui/material";
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
          width: "90%",
          p: 4,
          position: "relative",
          zIndex: 1,
          background: "rgba(0, 0, 0, 0.9)",
          backdropFilter: "blur(20px)",
          border: "2px solid #00d4ff",
          boxShadow: "0 0 40px rgba(0, 212, 255, 0.3)",
        }}
      >
        {/* Skip Button */}
        <Button
          onClick={handleSkip}
          sx={{
            position: "absolute",
            top: 16,
            right: 16,
            color: "#999",
            textTransform: "none",
            "&:hover": {
              color: "#00d4ff",
            },
          }}
        >
          Skip Tutorial
        </Button>

        {/* Stepper */}
        <Stepper activeStep={activeStep} sx={{ mb: 4, mt: 2 }}>
          {steps.map((step, index) => (
            <Step key={index}>
              <StepLabel
                sx={{
                  "& .MuiStepLabel-label": {
                    color: "#999",
                  },
                  "& .MuiStepLabel-label.Mui-active": {
                    color: "#00d4ff",
                  },
                  "& .MuiStepLabel-label.Mui-completed": {
                    color: "#00ff88",
                  },
                  "& .MuiStepIcon-root": {
                    color: "#333",
                  },
                  "& .MuiStepIcon-root.Mui-active": {
                    color: "#00d4ff",
                  },
                  "& .MuiStepIcon-root.Mui-completed": {
                    color: "#00ff88",
                  },
                }}
              />
            </Step>
          ))}
        </Stepper>

        {/* Content */}
        <Box sx={{ textAlign: "center", py: 4 }}>
          <Typography
            variant="h1"
            sx={{
              fontSize: "5rem",
              mb: 3,
            }}
          >
            {steps[activeStep].image}
          </Typography>
          <Typography
            variant="h4"
            sx={{
              fontWeight: "bold",
              color: "#00d4ff",
              mb: 2,
              textShadow: "0 0 20px rgba(0, 212, 255, 0.6)",
            }}
          >
            {steps[activeStep].title}
          </Typography>
          <Typography
            variant="body1"
            sx={{
              color: "#ccc",
              fontSize: "1.1rem",
              lineHeight: 1.8,
              maxWidth: 500,
              mx: "auto",
            }}
          >
            {steps[activeStep].description}
          </Typography>
        </Box>

        {/* Navigation Buttons */}
        <Box sx={{ display: "flex", justifyContent: "space-between", mt: 4 }}>
          <Button
            onClick={handleBack}
            disabled={activeStep === 0}
            startIcon={<ArrowBackIcon />}
            sx={{
              color: activeStep === 0 ? "#333" : "#00d4ff",
              textTransform: "none",
              fontSize: "1rem",
              "&:hover": {
                backgroundColor: "rgba(0, 212, 255, 0.1)",
              },
            }}
          >
            Back
          </Button>

          <Button
            onClick={handleNext}
            endIcon={activeStep === steps.length - 1 ? <RocketLaunchIcon /> : <ArrowForwardIcon />}
            variant="contained"
            sx={{
              backgroundColor: "#00d4ff",
              color: "#000",
              textTransform: "none",
              fontSize: "1rem",
              fontWeight: "bold",
              px: 4,
              boxShadow: "0 0 20px rgba(0, 212, 255, 0.5)",
              "&:hover": {
                backgroundColor: "#00b8e6",
                boxShadow: "0 0 30px rgba(0, 212, 255, 0.7)",
              },
            }}
          >
            {activeStep === steps.length - 1 ? "Get Started" : "Next"}
          </Button>
        </Box>

        {/* Progress Indicator */}
        <Box sx={{ display: "flex", justifyContent: "center", gap: 1, mt: 3 }}>
          {steps.map((_, index) => (
            <Box
              key={index}
              sx={{
                width: 8,
                height: 8,
                borderRadius: "50%",
                backgroundColor: index === activeStep ? "#00d4ff" : "#333",
                transition: "all 0.3s ease",
                boxShadow: index === activeStep ? "0 0 10px rgba(0, 212, 255, 0.8)" : "none",
              }}
            />
          ))}
        </Box>
      </Card>
    </Box>
  );
}