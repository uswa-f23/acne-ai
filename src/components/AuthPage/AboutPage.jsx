import React from "react";
import { styles } from "./styles";

const AboutPage = () => {
  return (
    <div style={styles.aboutContainer}>
      <div style={styles.overlay}></div>

      <div style={styles.content}>
        <br />
        <h1 style={{ textAlign: "center" }}>About AcneAI</h1>
        <p>
          AcneAI is an AI-powered dermatological assistant designed to detect acne severity
          from user-uploaded images and provide early recommendations. <br />
          It uses advanced machine learning and computer vision to identify acne spots with high accuracy.
          The platform helps users understand their acne severity level without needing a dermatologist visit.
          AcneAI provides quick, reliable insights based on real-time image processing.
          The system is built to support users in taking early action toward better skin health. 
          It empowers individuals with personalized skin analysis from the comfort of their home. 
          AcneAI promotes awareness about different acne types and their early signs. 
          The tool is designed to be user-friendly, especially for beginners in skincare. 
          It aims to bridge the gap between users and expert dermatological guidance. 
          Overall, AcneAI is a step toward smarter, AI-driven skincare solutions for everyone. 
        </p>
          <h1>Contact Us</h1>
            <p>Email: <a href="mailto:contact@acneai.com">contact@acneai.com</a></p>
            <p>Phone: +92 300 1234567</p>
            <p>Website: <a href="https://www.acneai.com">www.acneai.com</a></p>
            <p>Address: AcneAI Support Center, Lahore, Pakistan</p>
            <p>Follow us on Instagram: <a href="https://www.instagram.com/acneai">@acneai</a></p>
      </div>
    </div>
          
  );
};

export default AboutPage;
