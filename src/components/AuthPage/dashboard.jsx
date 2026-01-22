import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { styles } from "./styles";
// import Progress from "./components/AuthPage/progress";
//codacy-test comment
const Dashboard = () => {
  const navigate = useNavigate();
  const [hovered, setHovered] = useState(null);

  // EXACTLY 3 CARDS
  const cardData = [
    {
      title: "Acne Detection",
      desc: "Upload an image to detect acne automatically.",
      link: "/detection",
    },
    {
      title: "Progress Tracking",
      desc: "Analyze progress based on provided data.",
      link: "/progress",
    },
    {
      title: "Treatment",
      desc: "Recommend Herbal and medicated treatments.",
      link: "/dataset-tools",
    },
  ];

  // Base card styling
  const baseCard = {
    backgroundColor: "#ffffff",
    borderRadius: "14px",
    padding: "25px",
    width: "280px",
    height: "230px",
    boxShadow: "0 3px 10px rgba(0,0,0,0.12)",
    transition: "all 0.3s ease-in-out",
    textAlign: "center",
    cursor: "pointer",
    transform: "scale(1)",
  };

  // Hover effect
  const hoverCard = {
    transform: "scale(1.07)",
    boxShadow: "0 12px 25px rgba(0,0,0,0.25)",
  };

  return (
    <div style={styles.container}>
      <h2 style={styles.title}>Acne AI Dashboard</h2>

      {/* Card Row */}
      <div
        style={{
          display: "flex",
          gap: "35px",
          marginTop: "40px",
          justifyContent: "center",
        }}
      >
        {cardData.map((card, index) => {
          const appliedStyle =
            hovered === index ? { ...baseCard, ...hoverCard } : baseCard;

          return (
            <div
              key={index}
              style={appliedStyle}
              onMouseEnter={() => setHovered(index)}
              onMouseLeave={() => setHovered(null)}
            >
              <h3 style={{ marginBottom: "10px", color: "#111827" }}>
                {card.title}
              </h3>

              <p style={{ color: "#4b5563", minHeight: "60px" }}>
                {card.desc}
              </p>

              <button
                onClick={() => navigate(card.link)}
                style={{
                  marginTop: "20px",
                  padding: "10px 20px",
                  backgroundColor: "#4f46e5",
                  color: "#ffffff",
                  border: "none",
                  borderRadius: "8px",
                  cursor: "pointer",
                  fontWeight: "600",
                  fontSize: "15px",
                }}
              >
                Open
              </button>
            </div>
          );
        })}
      </div>
        <button
        onClick={() => navigate("/logout")}
        style={{
            padding: "10px 20px",
            backgroundColor: "#ef4444",
            color: "#fff",
            border: "none",
            borderRadius: "8px",
            cursor: "pointer",
            fontWeight: "600",
            marginTop: "20px"
        }}
        >
        Logout
        </button>
    </div>
  );
};

export default Dashboard;