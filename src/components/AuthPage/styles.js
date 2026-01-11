import { color } from "framer-motion";
import { input } from "framer-motion/client";
// ---- FIX CHROME AUTOFILL GRAY BACKGROUND ---- //
const autofillFix = `
input:-webkit-autofill,
input:-webkit-autofill:hover,
input:-webkit-autofill:focus {
  -webkit-box-shadow: 0 0 0px 1000px white inset !important;
  box-shadow: 0 0 0px 1000px white inset !important;
  -webkit-text-fill-color: #000000 !important;
  color: #000000 !important;
}
`;

// Inject the CSS into the page
if (typeof document !== "undefined") {
  const styleTag = document.createElement("style");
  styleTag.innerHTML = autofillFix;
  document.head.appendChild(styleTag);
}

export const styles = {
  container: {
  display: "flex",
  flexDirection: "column",
  justifyContent: "flex-start",
  alignItems: "center",
  minHeight: "100vh",
  backgroundColor: "#f3f4f6",
  paddingTop: "100px",   // ⬅ Prevent heading from hiding behind navbar
  paddingLeft: "20px",
  paddingRight: "20px",
},


  form: {
    backgroundColor: "#ffffff",
    padding: "40px",
    borderRadius: "12px",
    boxShadow: "0 4px 20px rgba(0,0,0,0.1)",
    maxWidth: "400px",
    width: "100%",
    display: "flex",
    flexDirection: "column",
  },

  title: {
    marginBottom: "24px",
    textAlign: "center",
    color: "#1f2937",
    fontSize: "24px",
    fontWeight: "600",
  },

  label: {
    marginBottom: "8px",
    marginTop: "12px",
    fontSize: "14px",
    fontWeight: "500",
    color: "#000000",
  },

  input: {
    padding: "12px",
    borderRadius: "8px",
    border: "1px solid #d1d5db",
    fontSize: "14px",
    outline: "none",
    width: "100%",
    boxSizing: "border-box",
    backgroundColor: "#ffffff",
    color: "#000000",
  },

  button: {
    marginTop: "24px",
    padding: "12px",
    backgroundColor: "#4f46e5",
    color: "#ffffff",
    border: "none",
    borderRadius: "8px",
    cursor: "pointer",
    fontWeight: "600",
    fontSize: "16px",
    transition: "background-color 0.3s ease",
  },

  buttonDisabled: {
    backgroundColor: "#a5b4fc",
    cursor: "not-allowed",
  },

  forgotContainer: {
    marginTop: "8px",
    textAlign: "right",
  },

  link: {
    fontSize: "14px",
    color: "#4f46e5",
    textDecoration: "none",
  },

  signup: {
    marginTop: "16px",
    fontSize: "14px",
    textAlign: "center",
    color: "#6b7280",
  },

  error: {
    color: "#dc2626",
    fontSize: "14px",
    marginBottom: "12px",
    textAlign: "center",
  },

  uploadBox: {
  border: "2px dashed #bbb",
  padding: "2rem",
  margin: "2rem auto",
  width: "60%",
  borderRadius: "10px",

  // **Center items perfectly**
  display: "flex",
  flexDirection: "column",
  justifyContent: "center",
  alignItems: "center",
  textAlign: "center",
},

  fileInput: {
    display: "block",      // forces it to behave as a block element
    margin: "0 auto",      // horizontally centers it
    cursor: "pointer",
  },


  loading: {
    marginTop: "2rem",
  },

  spinner: {
    width: "40px",
    height: "40px",
    border: "4px solid #ddd",
    borderTopColor: "#4a90e2",
    borderRadius: "50%",
    margin: "0 auto 1rem",
    animation: "spin 1s linear infinite",
  },

  aboutContainer: {
    minHeight: "100vh",
    padding: "40px",
    backgroundImage: "url('/about-bg.jpg')",
    backgroundSize: "cover",
    backgroundPosition: "center",
    position: "relative",
  },

  overlay: {
    position: "absolute",
    top: 0,
    left: 0,
    width: "100%",
    height: "90%",
    backgroundColor: "rgba(253, 253, 253, 0.63)",
    zIndex: 1,
  },

  content: {
    position: "relative",
    zIndex: 1,
  },

  resultBox: {
    marginTop: "2rem",
    padding: "1.5rem",
    background: "#f7f7f7",
    borderRadius: "10px",
    width: "50%",
    marginLeft: "auto",
    marginRight: "auto",
  },
    forgetContainerPage :{
    display: "flex",
    flexDirection: "column",
    justifyContent: "flex-start",   // aligns content from top
    alignItems: "center",
    minHeight: "100vh",
    backgroundColor: "#f3f4f6",
    paddingTop: "100px",            // prevent overlap with navbar
    paddingLeft: "20px",
    paddingRight: "20px",
  },

  forgetForm :{
    backgroundColor: "#ffffff",
    padding: "40px",
    borderRadius: "12px",
    boxShadow: "0 4px 20px rgba(0,0,0,0.1)",
    maxWidth: "400px",
    width: "100%",
    display: "flex",
    flexDirection: "column",
  },

  forgetTitle: {
    marginBottom: "24px",
    textAlign: "center",
    color: "#1f2937",
    fontSize: "24px",
    fontWeight: "600",
  },

  forgetInput :{
    padding: "12px",
    borderRadius: "8px",
    border: "1px solid #d1d5db",
    fontSize: "14px",
    outline: "none",
    width: "100%",
    boxSizing: "border-box",
    backgroundColor: "#ffffff",
    color: "#000000",
    marginBottom: "12px",

    WebkitTextFillColor: "#000000",
    WebkitBoxShadow: "0 0 0 1000px #ffffff inset",
    MozBoxShadow: "0 0 0 1000px #ffffff inset",
  },
  forgetButton :{
    marginTop: "24px",
    padding: "12px",
    backgroundColor: "#4f46e5", // indigo
    color: "#ffffff",
    border: "none",
    borderRadius: "8px",
    cursor: "pointer",
    fontWeight: "600",
    fontSize: "16px",
    transition: "background-color 0.3s ease",
  }
};
