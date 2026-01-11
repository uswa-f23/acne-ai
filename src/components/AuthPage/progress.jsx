import React from "react";
import { styles } from "./styles";

const Progress = () => {
  return (
    <div style={styles.container}>
      <h2 style={styles.title}>Progress Tracking</h2>
      <p style={{ textAlign: "center", fontSize: "16px", color: "#4b5563" }}>
        Your progress will be displayed here.
      </p>
    </div>
  );
};

export default Progress;
