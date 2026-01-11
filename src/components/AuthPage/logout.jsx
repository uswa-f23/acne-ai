import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

const Logout = () => {
  const navigate = useNavigate();

  useEffect(() => {
    // 1. Clear user session / tokens
    localStorage.removeItem("token"); // if you store a token
    localStorage.removeItem("user");  // if you store user info

    // 2. Redirect to login page after logout
    navigate("/login", { replace: true });
  }, [navigate]);

  return (
    <div
      style={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        minHeight: "100vh",
        flexDirection: "column",
      }}
    >
      <h2>Logging Out...</h2>
      <p>Please wait while we redirect you to the login page.</p>
    </div>
  );
};

export default Logout;
