import React, { useEffect, useState } from "react";
import { Routes, Route, useNavigate, useLocation } from "react-router-dom";
import { useDispatch } from "react-redux";
import SkillTree from "./components/skill-tree/skill-tree";
import UserDashboard from "./components/user-dashboard/user-dashboard";
import FundSelection from "./components/fund-selection";
import { FundType } from "./components/fund-selection";
import { initializeTasksForFund } from "./store/tasks-slice";

function App() {
  const navigate = useNavigate();
  const location = useLocation();
  const dispatch = useDispatch();
  const [hasSelectedFund, setHasSelectedFund] = useState(false);
  const [isMobile, setIsMobile] = useState(window.innerWidth < 640);
  const [hasTasks, setHasTasks] = useState(false);

  // Track window resize for mobile detection
  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 640);
    };
    
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Check if user has selected a fund type and if tasks exist
  useEffect(() => {
    const selectedFund = localStorage.getItem("selectedFundType");
    const fundSelected = !!selectedFund;
    const taskProgress = localStorage.getItem("taskProgress");
    const tasksExist = !!taskProgress;
    
    setHasSelectedFund(fundSelected);
    setHasTasks(tasksExist);
    
    if (!fundSelected && location.pathname !== "/fund-selection") {
      navigate("/fund-selection");
    }
  }, [navigate, location.pathname]);

  const handleFundSelect = (fundType: FundType) => {
    // Initialize tasks for the selected fund type
    dispatch(initializeTasksForFund(fundType));
    // Update state and navigate to dashboard after fund selection
    setHasSelectedFund(true);
    navigate("/user-dashboard");
  };

  return (
    <>
      <nav
        style={{
          width: "100%",
          padding: "1rem 0",
          background: "#ffffff",
          color: "#000000",
          textAlign: "center",
          fontSize: "1.5rem",
          fontWeight: "bold",
          letterSpacing: "2px",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          position: "relative",
          borderBottom: "2px solid black",
          boxShadow: "0 2px 4px rgba(0, 0, 0, 0.1)",
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            marginLeft: "1rem",
          }}
        >
          {!hasTasks && (
            <button
              style={{
                background: "transparent",
                border: "1px solid black",
                color: "black",
                padding: "0.5rem 1rem",
                borderRadius: "4px",
                cursor: "pointer",
                fontSize: "1rem",
                fontWeight: "bold",
                marginRight: "1rem",
              }}
              onClick={() => navigate("/fund-selection")}
            >
              Fund Launch
            </button>
          )}
          {hasSelectedFund && (
            <button
              style={{
                background: "transparent",
                border: "1px solid black",
                color: "black",
                padding: "0.5rem 1rem",
                borderRadius: "4px",
                cursor: "pointer",
                fontSize: "1rem",
                fontWeight: "bold",
              }}
              onClick={() => navigate("/user-dashboard")}
            >
              Dashboard
            </button>
          )}
        </div>
        {!isMobile && (
          <div style={{ color: "#fbbf24", fontSize: "1.2rem", margin: "1rem" }}>
            Fund Launch Platform
          </div>
        )}
      </nav>

      <Routes>
        <Route path="/" element={<FundSelection onSelectFund={handleFundSelect} />} />
        <Route path="/fund-selection" element={<FundSelection onSelectFund={handleFundSelect} />} />
        <Route path="/user-dashboard" element={<UserDashboard />} />
        <Route path="/skill-tree" element={<SkillTree />} />
      </Routes>
    </>
  );
}

export default App;