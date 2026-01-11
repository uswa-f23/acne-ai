// DetectionPage.js
import React, { useState } from "react";
import { styles } from "./styles";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";

function DetectionPage() {
  const [imageFile, setImageFile] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [showResult, setShowResult] = useState(false);

  const navigate = useNavigate();

  const handleFileSelect = (e) => {
    setImageFile(e.target.files[0]);
    setShowResult(false);
  };

  const handleAnalyze = () => {
    if (!imageFile) return;

    setIsLoading(true);

    setTimeout(() => {
      setIsLoading(false);
      setShowResult(true);
      navigate("/result/123"); // Placeholder scanId
    }, 3000);
  };

  return (
    <div className={styles.container}>
      <br />
      <br />
      <br />
      <h1 style={{ textAlign: "center" }}>Upload Image for Acne Detection</h1>

      {/* FILE UPLOAD AREA */}
      <div className={styles.uploadBox}>
      <input
        type="file"
        accept="image/*"
        onChange={handleFileSelect}
        style={styles.fileInput} />

        {imageFile && <p>Selected File: {imageFile.name}</p>}
       </div>


      {/* LOADING SPINNER */}
      {isLoading && (
        <div className={styles.loading}>
          <div className={styles.spinner}></div>
          <p>Analyzing Image... Please Wait.</p>
        </div>
      )}

      {/* RESULT PLACEHOLDER */}
      {!isLoading && showResult && (
        <div className={styles.resultBox}>
          <h2>Your Scan Result Will Appear Here</h2>
          <p>Severity: Moderate</p>
          <p>Confidence Score: 87%</p>
        </div>
      )}

      {/* ANALYZE BUTTON */}
      <div className="flex justify-center mt-6">
        <Button onClick={handleAnalyze} style={styles.button}>Analyze Image</Button>
      </div>
    </div>
  );
}

export default DetectionPage;