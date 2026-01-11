import { useState } from "react";
import { styles } from "./styles";

import axios from "axios";

const ForgetPassword = () => {
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post("http://localhost:5000/forgot-password", { email });
      setMessage(res.data.message);
    } catch (err) {
      setMessage(err.response.data.message || "Error sending reset email");
    }
  };

  return (
    <div style={styles.forgetContainerPage}>
  <form style={styles.forgetForm} onSubmit={handleSubmit}>
    <h2 style={styles.forgetTitle}>Forget Password</h2>
    <input
      type="email"
      placeholder="Enter your email"
      value={email}
      onChange={(e) => setEmail(e.target.value)}
      style={styles.forgetInput}
      required
    />
    <button type="submit" style={styles.forgetButton}>Send Reset Link</button>
  </form>
</div>

  );
};

export default ForgetPassword;
