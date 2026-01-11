import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { styles } from "./styles";

import axios from "axios";

const ResetPassword = () => {
  const { token } = useParams();
  const navigate = useNavigate();
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [message, setMessage] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (password !== confirm) {
      setMessage("Passwords do not match");
      return;
    }

    try {
      await axios.post(`http://localhost:5000/reset-password/${token}`, { password });
      setMessage("Password reset successful!");
      setTimeout(() => navigate("/login"), 2000);
    } catch (err) {
      setMessage(err.response.data.message || "Error resetting password");
    }
  };

  return (
    <div style={styles.forgotContainerPage}>
  <form style={styles.forgotForm} onSubmit={handleSubmit}>
    <h2 style={styles.forgotTitle}>Reset Password</h2>
    <input
      type="password"
      placeholder="New password"
      value={password}
      onChange={(e) => setPassword(e.target.value)}
      style={styles.forgotInput}
      required
    />
    <input
      type="password"
      placeholder="Confirm new password"
      value={confirm}
      onChange={(e) => setConfirm(e.target.value)}
      style={styles.forgotInput}
      required
    />
    <button type="submit" style={styles.forgotButton}>Reset Password</button>
  </form>
</div>

  );
};

export default ResetPassword;
