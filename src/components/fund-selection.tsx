import React, { useState } from "react";
import { Box, Button, Typography, Card } from "@mui/material";
import { useNavigate } from "react-router-dom";
import BusinessIcon from "@mui/icons-material/Business";
import ApartmentIcon from "@mui/icons-material/Apartment";
import WarehouseIcon from "@mui/icons-material/Warehouse";

export type FundType = "sfr" | "commercial" | "specialty";

interface FundOption {
  type: FundType;
  title: string;
  description: string;
  icon: React.ReactNode;
  color: string;
  features: string[];
}

const fundOptions: FundOption[] = [
  {
    type: "sfr",
    title: "Single-Family Rental Fund",
    description: "Invest in residential properties for steady rental income",
    icon: <ApartmentIcon sx={{ fontSize: 48 }} />,
    color: "#3b82f6",
    features: [
      "Individual property management",
      "Stable residential market",
      "Lower entry barriers",
      "Tax advantages",
      "Portfolio diversification"
    ]
  },
  {
    type: "commercial",
    title: "Commercial Office / Retail Fund",
    description: "Focus on commercial properties with longer-term leases",
    icon: <BusinessIcon sx={{ fontSize: 48 }} />,
    color: "#10b981",
    features: [
      "Long-term lease agreements",
      "Higher rental rates",
      "Professional tenant base",
      "Appreciation potential",
      "Income stability"
    ]
  },
  {
    type: "specialty",
    title: "Specialty / Niche Asset Fund",
    description: "Target unique real estate sectors with specialized expertise",
    icon: <WarehouseIcon sx={{ fontSize: 48 }} />,
    color: "#8b5cf6",
    features: [
      "Niche market expertise",
      "Unique value propositions",
      "Specialized management",
      "Innovation opportunities",
      "Higher return potential"
    ]
  }
];

interface FundSelectionProps {
  onSelectFund: (fundType: FundType) => void;
}

export default function FundSelection({ onSelectFund }: FundSelectionProps) {
  const navigate = useNavigate();
  const [selectedFund, setSelectedFund] = useState<FundType | null>(null);

  const handleFundSelect = (fundType: FundType) => {
    setSelectedFund(fundType);
  };

  const handleContinue = () => {
    if (selectedFund) {
      localStorage.setItem("selectedFundType", selectedFund);
      onSelectFund(selectedFund);
      navigate("/user-dashboard");
    }
  };

  return (
    <Box
      sx={{
        minHeight: "100vh",
        background: "white",
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
        p: { xs: 2, sm: 3, md: 4 },
        position: "relative",
        overflow: "hidden",
        "&::before": {
          content: '""',
          position: "absolute",
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundImage: "radial-gradient(circle, rgba(255,255,255,0.05) 1px, transparent 1px)",
          backgroundSize: "40px 40px",
          opacity: 0.3,
        },
      }}
    >
      {/* Header */}
      <Box sx={{ mb: { xs: 4, sm: 6, md: 8 }, textAlign: "center", position: "relative", zIndex: 1 }}>
        <Typography
          variant="h2"
          sx={{
            fontWeight: "bold",
            color: "#fbbf24",
            mb: { xs: 2, sm: 3 },
            textShadow: "0 0 10px rgba(251, 191, 36, 0.3)",
            letterSpacing: { xs: "1px", sm: "2px", md: "3px" },
            fontSize: { xs: "2rem", sm: "3rem", md: "4rem" },
          }}
        >
          FUND LAUNCH PLATFORM
        </Typography>
        <Typography
          variant="h5"
          sx={{
            color: "rgba(255, 255, 255, 0.8)",
            maxWidth: 600,
            mx: "auto",
            lineHeight: 1.6,
            fontSize: { xs: "1.1rem", sm: "1.3rem", md: "1.5rem" },
          }}
        >
          Choose your fund type to begin the launch process
        </Typography>
      </Box>

      {/* Fund Options */}
      <Box
        sx={{
          display: "grid",
          gridTemplateColumns: {
            xs: "1fr",
            sm: "repeat(2, 1fr)",
            lg: "repeat(3, 1fr)"
          },
          gap: { xs: 3, sm: 4, md: 5 },
          maxWidth: 1200,
          width: "100%",
          position: "relative",
          zIndex: 1,
          mb: { xs: 4, sm: 6 },
        }}
      >
        {fundOptions.map((fund) => (
          <Card
            key={fund.type}
            onClick={() => handleFundSelect(fund.type)}
            sx={{
              p: { xs: 3, sm: 4 },
              cursor: "pointer",
              background: selectedFund === fund.type
                ? `linear-gradient(135deg, rgba(0, 0, 0, 0.9), rgba(0, 0, 0, 0.7))`
                : "rgba(0, 0, 0, 0.6)",
              backdropFilter: "blur(20px)",
              border: selectedFund === fund.type
                ? `3px solid ${fund.color}`
                : "2px solid rgba(255, 255, 255, 0.1)",
              borderRadius: 3,
              transition: "transform 0.3s ease, box-shadow 0.3s ease",
              position: "relative",
              overflow: "hidden",
              minHeight: { xs: 280, sm: 320, md: 360 },
              "&:hover": selectedFund !== fund.type ? {
                transform: "translateY(-8px)",
                boxShadow: `0 20px 40px rgba(0, 0, 0, 0.3), 0 0 30px ${fund.color}40`,
                borderColor: fund.color,
              } : {},
              "&:active": {
                transform: "translateY(-4px)",
              },
              "&::before": selectedFund === fund.type ? {
                content: '""',
                position: "absolute",
                top: 0,
                left: 0,
                right: 0,
                bottom: 0,
                background: `linear-gradient(135deg, ${fund.color}20, ${fund.color}10)`,
                borderRadius: "inherit",
              } : {},
            }}
          >
            {/* Icon */}
            <Box
              sx={{
                display: "flex",
                justifyContent: "center",
                mb: 3,
                color: selectedFund === fund.type ? fund.color : "rgba(255, 255, 255, 0.7)",
              }}
            >
              {fund.icon}
            </Box>

            {/* Title */}
            <Typography
              variant="h5"
              sx={{
                fontWeight: "bold",
                color: selectedFund === fund.type ? fund.color : "#fff",
                mb: 2,
                textAlign: "center",
                fontSize: { xs: "1.25rem", sm: "1.5rem" },
                transition: "all 0.3s ease",
              }}
            >
              {fund.title}
            </Typography>

            {/* Description */}
            <Typography
              variant="body1"
              sx={{
                color: "rgba(255, 255, 255, 0.8)",
                mb: 3,
                textAlign: "center",
                lineHeight: 1.5,
                fontSize: { xs: "0.9rem", sm: "1rem" },
              }}
            >
              {fund.description}
            </Typography>

            {/* Features */}
            <Box sx={{ mt: "auto" }}>
              {fund.features.slice(0, 3).map((feature, idx) => (
                <Typography
                  key={idx}
                  variant="body2"
                  sx={{
                    color: "rgba(255, 255, 255, 0.6)",
                    fontSize: "0.85rem",
                    mb: 0.5,
                    display: "flex",
                    alignItems: "center",
                    "&::before": {
                      content: '"•"',
                      color: fund.color,
                      fontWeight: "bold",
                      mr: 1,
                    },
                  }}
                >
                  {feature}
                </Typography>
              ))}
            </Box>
          </Card>
        ))}
      </Box>

      {/* Continue Button */}
      {selectedFund && (
        <Box sx={{ textAlign: "center", position: "relative", zIndex: 1 }}>
          <Button
            onClick={handleContinue}
            variant="contained"
            size="large"
            sx={{
              backgroundColor: fundOptions.find(f => f.type === selectedFund)?.color,
              color: "#000",
              textTransform: "none",
              fontSize: { xs: "1.1rem", sm: "1.3rem" },
              fontWeight: "bold",
              px: { xs: 4, sm: 6, md: 8 },
              py: { xs: 1.5, sm: 2 },
              borderRadius: 2,
              boxShadow: `0 0 30px ${fundOptions.find(f => f.type === selectedFund)?.color}60`,
              "&:hover": {
                backgroundColor: fundOptions.find(f => f.type === selectedFund)?.color,
                opacity: 0.9,
                transform: "scale(1.05)",
                boxShadow: `0 0 40px ${fundOptions.find(f => f.type === selectedFund)?.color}80`,
              },
              transition: "all 0.3s ease",
            }}
          >
            Launch {fundOptions.find(f => f.type === selectedFund)?.title}
          </Button>
        </Box>
      )}
    </Box>
  );
}