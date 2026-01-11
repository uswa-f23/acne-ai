import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { styles } from "./styles";

import FloatingLabel from "react-bootstrap/FloatingLabel";
import Form from "react-bootstrap/Form";

const SignupPage = () => {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  const [error, setError] = useState("");

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSignup = (e) => {
    e.preventDefault();

    if (!formData.name || !formData.email || !formData.password) {
      return setError("All fields are required.");
    }
    if (formData.password.length < 6) {
      return setError("Password must be at least 6 characters.");
    }
    if (formData.password !== formData.confirmPassword) {
      return setError("Passwords do not match.");
    }

    setError("");
    navigate("/login");
  };

  return (
    <div style={styles.container}>
      <form style={styles.form} onSubmit={handleSignup}>
        <h2 style={styles.title}>Create Account</h2>

        {error && <p style={styles.error}>{error}</p>}

        {/* NAME FIELD */}
        <FloatingLabel
          controlId="floatingName"
          label="Full Name"
          className="mb-3"
        >
          <Form.Control
            type="text"
            name="name"
            placeholder="Enter your name"
            value={formData.name}
            onChange={handleChange}
          />
        </FloatingLabel>

        {/* EMAIL FIELD */}
        <FloatingLabel
          controlId="floatingEmail"
          label="Email Address"
          className="mb-3"
        >
          <Form.Control
            type="email"
            name="email"
            placeholder="Enter your email"
            value={formData.email}
            onChange={handleChange}
          />
        </FloatingLabel>

        {/* PASSWORD FIELD */}
        <FloatingLabel
          controlId="floatingPassword"
          label="Password"
          className="mb-3"
        >
          <Form.Control
            type="password"
            name="password"
            placeholder="Enter password"
            value={formData.password}
            onChange={handleChange}
          />
        </FloatingLabel>

        {/* CONFIRM PASSWORD FIELD */}
        <FloatingLabel
          controlId="floatingConfirmPassword"
          label="Confirm Password"
          className="mb-3"
        >
          <Form.Control
            type="password"
            name="confirmPassword"
            placeholder="Re-enter password"
            value={formData.confirmPassword}
            onChange={handleChange}
          />
        </FloatingLabel>

        <button type="submit" style={styles.button}>Sign Up</button>

        <p style={styles.signup}>
          Already have an account?{" "}
          <Link to="/login" style={styles.link}>Login</Link>
        </p>
      </form>
    </div>
  );
};

export default SignupPage;