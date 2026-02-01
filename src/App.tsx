import React from "react";
import { Routes, Route, useNavigate, useLocation } from "react-router-dom";
import Counter from "./components/counter/counter";
import StepThrough from "./components/step-through/step-through";
import SkillTree from "./components/skill-tree/skill-tree";
import UserDashboard from "./components/user-dashboard/user-dashboard";

function App() {
  const navigate = useNavigate();
  const location = useLocation();

  return (
    <>
      <nav
        style={{
          width: "100%",
          padding: "1rem 0",
          background: "#282c34",
          color: "white",
          textAlign: "center",
          fontSize: "1.5rem",
          fontWeight: "bold",
          letterSpacing: "2px",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          position: "relative",
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
          }}
        >
          <button
            style={{
              background: "transparent",
              border: "1px solid #61dafb",
              color: "#61dafb",
              padding: "0.5rem 1rem",
              borderRadius: "4px",
              cursor: "pointer",
              fontSize: "1rem",
              fontWeight: "bold",
              marginRight: "1rem",
            }}
            onClick={() => navigate("/")}
          >
            Home
          </button>
          <button
            style={{
              background: "transparent",
              border: "1px solid #61dafb",
              color: "#61dafb",
              padding: "0.5rem 1rem",
              borderRadius: "4px",
              cursor: "pointer",
              fontSize: "1rem",
              fontWeight: "bold",
            }}
            onClick={() => navigate("/user-dashboard")}
          >
            User Dashboard
          </button>
        </div>
        <div>React Portfolio</div>
      </nav>
      {location.pathname === "/" && (
        <div
          style={{
            display: "flex",
            justifyContent: "center",
            margin: "2rem 0",
          }}
        >
          <button
            style={{
              padding: "0.75rem 2rem",
              fontSize: "1rem",
              borderRadius: "5px",
              border: "none",
              background: "#61dafb",
              color: "#282c34",
              cursor: "pointer",
              fontWeight: "bold",
            }}
            onClick={() => navigate("/counter")}
          >
            Counter
          </button>
        </div>
      )}
      {location.pathname === "/" && (
        <div
          style={{
            display: "flex",
            justifyContent: "center",
            margin: "2rem 0",
          }}
        >
          <button
            style={{
              padding: "0.75rem 2rem",
              fontSize: "1rem",
              borderRadius: "5px",
              border: "none",
              background: "#61dafb",
              color: "#282c34",
              cursor: "pointer",
              fontWeight: "bold",
            }}
            onClick={() => navigate("/step-through")}
          >
            Step Through
          </button>
        </div>
      )}
      <Routes>
        <Route path="/counter" element={<Counter />} />
        <Route path="/step-through" element={<StepThrough />} />
        <Route path="/user-dashboard" element={<UserDashboard />} />
        <Route path="/skill-tree" element={<SkillTree />} />
        {/* Add other routes here */}
      </Routes>
    </>
  );
}

export default App;