import React from "react";
import { Routes, Route, useNavigate, useLocation } from "react-router-dom";
import Counter from "./components/counter/counter";
import StepThrough from "./components/step-through/step-through";

function App() {
  const navigate = useNavigate();
  const location = useLocation();

  return (
    <>
      <nav style={{
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
        justifyContent: "center",
        position: "relative"
      }}>
        <button
          style={{
            position: "absolute",
            left: "1rem",
            background: "transparent",
            border: "1px solid #61dafb",
            color: "#61dafb",
            padding: "0.5rem 1rem",
            borderRadius: "4px",
            cursor: "pointer",
            fontSize: "1rem",
            fontWeight: "bold"
          }}
          onClick={() => navigate("/")}
        >
          Home
        </button>
        React Portfolio
      </nav>
      {location.pathname === "/" && (
        <div style={{
          display: "flex",
          justifyContent: "center",
          margin: "2rem 0"
        }}>
          <button
            style={{
              padding: "0.75rem 2rem",
              fontSize: "1rem",
              borderRadius: "5px",
              border: "none",
              background: "#61dafb",
              color: "#282c34",
              cursor: "pointer",
              fontWeight: "bold"
            }}
            onClick={() => navigate("/counter")}
          >
            Counter
          </button>
        </div>
      )}
      {location.pathname === "/" && (
        <div style={{
          display: "flex",
          justifyContent: "center",
          margin: "2rem 0"
        }}>
          <button
            style={{
              padding: "0.75rem 2rem",
              fontSize: "1rem",
              borderRadius: "5px",
              border: "none",
              background: "#61dafb",
              color: "#282c34",
              cursor: "pointer",
              fontWeight: "bold"
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
        {/* Add other routes here */}
      </Routes>
    </>
  );
}

export default App;