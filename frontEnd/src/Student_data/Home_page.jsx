import React from "react";
import { Container, Button } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPlay, faPause } from "@fortawesome/free-solid-svg-icons";
import "../styles/neonButton.css";

const HomePage = () => {
  const navigate = useNavigate();

  // Button data structured as two columns to match the screenshot
  const buttons = [
    // Left column
    [
      {
        text: "ADD STUDENT DETAILS",
        route: "/addStudent",
        highlight: "yellow",
      },
      {
        text: "SHOW STUDENTS WITH UNALLOCATED SEATS",
        route: "/unallocatedStudentsSeats",
        highlight: "red",
      },
      {
        text: "SHOW STUDENTS WITH FEES DUES",
        route: "/studentsWithDues",
        highlight: "yellow",
      },
      {
        text: "SHOW STUDENTS WHOSE MONTH ENDED",
        route: "/studentsWithEndedMonth",
        highlight: "yellow",
      },
    ],
    // Right column
    [
      {
        text: "ADD STUDENT DETAILS",
        route: "/addStudent",
        highlight: "yellow",
      },
      {
        text: "SHOW STUDENTS WITH FEES DUES",
        route: "/studentsWithDues",
        highlight: "yellow",
      },
      {
        text: "SHOW STUDENTS WITH LOUIES",
        route: "/studentsWithLouies",
        highlight: "red",
      },
      {
        text: "SHOW STUDENTS WITH LOCKER",
        route: "/studentsWithLocker",
        highlight: "yellow",
      },
    ],
  ];

  return (
    <Container className="text-center mt-5" style={{ maxWidth: "600px" }}>
      {/* Header */}
      <div className="neon-header">HOME PAGE</div>

      {/* Two-column layout */}
      <div className="button-grid">
        {/* Left Column */}
        <div className="button-column">
          {buttons[0].map((btn, idx) => (
            <Button
              key={idx}
              className={`neon-button ${
                btn.highlight === "red" ? "neon-red" : "neon-yellow"
              }`}
              onClick={() => navigate(btn.route)}
            >
              <FontAwesomeIcon
                icon={btn.highlight === "red" ? faPause : faPlay}
                className="button-icon"
              />
              {btn.text}
            </Button>
          ))}
        </div>

        {/* Right Column */}
        <div className="button-column">
          {buttons[1].map((btn, idx) => (
            <Button
              key={idx}
              className={`neon-button ${
                btn.highlight === "red" ? "neon-red" : "neon-yellow"
              }`}
              onClick={() => navigate(btn.route)}
            >
              <FontAwesomeIcon
                icon={btn.highlight === "red" ? faPause : faPlay}
                className="button-icon"
              />
              {btn.text}
            </Button>
          ))}
        </div>
      </div>
    </Container>
  );
};

export default HomePage;
