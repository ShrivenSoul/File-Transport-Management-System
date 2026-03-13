import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

function Signup() {
  const [mode, setMode] = useState("signup");
  let navigate = useNavigate();

  const [formData, setFormData] = useState({
    email: "",
    password: "",
    confirmPassword: "",
    forgotPasswordEmail: "",
  });

  const [error, setError] = useState("");

  // Start with ALL requirements unmet
  const requirements = [
    "At least 8 characters",
    "One uppercase letter",
    "One number",
    "One special character",
  ];

  const validatePassword = (password) => {
    const errors = [];

    if (password.length < 8) errors.push("At least 8 characters");
    if (!/(?=.*[A-Z])/.test(password)) errors.push("One uppercase letter");
    if (!/(?=.*[0-9])/.test(password)) errors.push("One number");
    if (!/(?=.*[!@#$%^&*])/.test(password)) errors.push("One special character");

    return errors;
  };

  const passwordErrors = validatePassword(formData.password);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSignup = (e) => {
    e.preventDefault();
    setError("");

    if (formData.password !== formData.confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    if (passwordErrors.length > 0) {
      setError("Password does not meet requirements");
      return;
    }

    alert("Signup successful (frontend test only)");
    setMode("login");
  };

  const handleLogin = (e) => {
    e.preventDefault();
    navigate("/home");
    //alert("Login successful (frontend test only)");
  };

  const handleForgotPassword = (e) => {
    e.preventDefault();
    alert("Password sent (frontend test only)");
    setMode("passwordSent");
  };

  const containerStyle = {
    maxWidth: "400px",
    margin: "80px auto",
    padding: "30px",
    border: "1px solid #ccc",
    background: "#ddd",
    borderRadius: "10px",
    textAlign: "center",
    fontFamily: "Arial",
  };

  const inputStyle = {
    width: "93%",
    padding: "10px",
    margin: "10px 0",
  };

  const buttonStyle = {
    width: "100%",
    padding: "10px",
    marginTop: "10px",
    cursor: "pointer",
  };

  return (
    <div style={containerStyle}>
      <h2>Simple Auth Page</h2>

      <div>
        <button onClick={() => setMode("signup")}>Sign Up</button>{" "}
        <button onClick={() => setMode("login")}>Login</button>
      </div>

      {mode === "signup" && (
        <form onSubmit={handleSignup}>
          <input
            style={inputStyle}
            name="email"
            type="email"
            placeholder="Email"
            onChange={handleChange}
            required
          />

          <input
            style={inputStyle}
            name="password"
            type="password"
            placeholder="Password"
            value={formData.password}
            onChange={handleChange}
            required
          />

          <input
            style={inputStyle}
            name="confirmPassword"
            type="password"
            placeholder="Confirm Password"
            value={formData.confirmPassword}
            onChange={handleChange}
            required
          />

          {/* Real-time Password Requirements */}
          <div style={{ fontSize: "12px", textAlign: "left" }}>
            {requirements.map((req) => {
              const isMet =
                formData.password.length > 0 &&
                !passwordErrors.includes(req);

              return (
                <div
                  key={req}
                  style={{
                    color: isMet ? "green" : "red",
                  }}
                >
                  {req}
                </div>
              );
            })}
          </div>

          <button style={buttonStyle} type="submit">
            Sign Up
          </button>

          {error && <p style={{ color: "red" }}>{error}</p>}
        </form>
      )}

      {mode === "login" && (
        <>
          <form onSubmit={handleLogin}>
            <input
              style={inputStyle}
              name="email"
              type="email"
              placeholder="Email"
              onChange={handleChange}
              required
            />

            <input
              style={inputStyle}
              name="password"
              type="password"
              placeholder="Password"
              onChange={handleChange}
              required
            />

            <button style={buttonStyle} type="submit">
              Login
            </button>
          </form>

          <button
            style={{
              marginTop: "10px",
              background: "none",
              border: "none",
              color: "blue",
              cursor: "pointer",
            }}
            onClick={() => setMode("forgotPassword")}
          >
            Forgot Password?
          </button>
        </>
      )}

      {mode === "forgotPassword" && (
        <form onSubmit={handleForgotPassword}>
          <input
            style={inputStyle}
            name="forgotPasswordEmail"
            type="email"
            placeholder="Enter your email"
            onChange={handleChange}
            required
          />
          <button style={buttonStyle} type="submit">
            Send Password
          </button>
        </form>
      )}

      {mode === "passwordSent" && (
        <div>
          <p>Password sent successfully (frontend demo).</p>
          <button style={buttonStyle} onClick={() => setMode("login")}>
            Back to Login
          </button>
        </div>
      )}
    </div>
  );
}

export default Signup;