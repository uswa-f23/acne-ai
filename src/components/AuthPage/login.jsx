import React, { useState } from "react";
import { styles } from "./styles";
import { Link, useNavigate } from "react-router-dom";

import FloatingLabel from "react-bootstrap/FloatingLabel";
import Form from "react-bootstrap/Form";

const Login = () => {
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!email || !password) {
      setError("Please enter both email and password.");
      return;
    }

    setIsLoading(true);
    setError("");

    setTimeout(() => {
      setIsLoading(false);
      navigate("/dashboard");
    }, 1500);
  };

  return (
    <div style={styles.container}>
      <form style={styles.form} onSubmit={handleSubmit}>
        <h2 style={styles.title}>Acne Detection System Login</h2>

        {error && <p style={styles.error}>{error}</p>}

        {/* EMAIL FIELD */}
        <FloatingLabel
          controlId="floatingEmail"
          label="Email Address"
          className="mb-3"
        >
          <Form.Control
            type="email"
            placeholder="Enter email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
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
            placeholder="Enter password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </FloatingLabel>

        <div style={styles.forgotContainer}>
          <a href="/ForgetPassword" style={styles.link}>Forgot Password?</a>
        </div>

        <button type="submit" style={styles.button} disabled={isLoading}>
          {isLoading ? "Logging in..." : "Login"}
        </button>

        <p style={styles.signup}>
          Don't have an account?{" "}
          <Link to="/signup" style={styles.link}>Sign Up</Link>
        </p>
      </form>
    </div>
  );
};

export default Login;
