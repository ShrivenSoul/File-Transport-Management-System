import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  signUp,
  confirmSignUp,
  signIn,
  signOut,
  resetPassword,
  confirmResetPassword,
  fetchAuthSession
} from "aws-amplify/auth";

function Signup() {
  const [mode, setMode] = useState("signup");
  let navigate = useNavigate();

  const [formData, setFormData] = useState({
    email: "",
    password: "",
    confirmPassword: "",
    forgotPasswordEmail: "",
    verificationCode: "",
    newPassword: "",
  });

  const [error, setError] = useState("");

  const requirements = [
    "At least 8 characters",
    "One uppercase letter",
    "One number",
    "One special character",
  ];

  /**
   * confirms user password has correct requirements
   * @param {string} password
   * @returns {Array} list of unmet requirements
   */
  const validatePassword = (password) => {
    const errors = [];

    if (password.length < 8) errors.push("At least 8 characters");
    if (!/(?=.*[A-Z])/.test(password)) errors.push("One uppercase letter");
    if (!/(?=.*[0-9])/.test(password)) errors.push("One number");
    if (!/(?=.*[!@#$%^&*])/.test(password))
      errors.push("One special character");

    return errors;
  };

  const passwordErrors = validatePassword(formData.password);

  /**
   * Handles any user input changes and updates state
   * @param {object} e - event object
   */
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  /**
   * Handles user signup using AWS Cognito
   * Validates password and sends signup request to AWS
   * @param {object} e - event object
   */
  const handleSignup = async (e) => {
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

    try {
      await signUp({
        username: formData.email,
        password: formData.password,
        options: {
          userAttributes: {
            email: formData.email,
          },
        },
      });

      setMode("confirmSignup");
    } catch (err) {
      setError(err.message || "Signup failed");
    }
  };

  /**
   * Confirms user signup using verification code
   * Verification code is sent to the user's email
   * @param {object} e - event object
   */
  const handleConfirmSignup = async (e) => {
    e.preventDefault();
    setError("");

    try {
      await confirmSignUp({
        username: formData.email,
        confirmationCode: formData.verificationCode,
      });

      alert("Account verified! You can now log in.");
      setMode("login");
    } catch (err) {
      setError(err.message || "Invalid verification code");
    }
  };

  /**
   * Handles user login using AWS Cognito
   * Signs out any existing user first to avoid session conflicts
   * Redirects to home page on success
   * @param {object} e - event object
   */
  const handleLogin = async (e) => {
  e.preventDefault();
  setError("");

  try {
    await signOut();

    const signInResult = await signIn({
      username: formData.email,
      password: formData.password,
    });

    console.log("SignIn result:", signInResult); 

    const session = await fetchAuthSession();
    console.log("Session after login:", session); 

    navigate("/home");
  } catch (err) {
    console.log("Login error:", err);
    setError(err.message || "Login failed");
  }
};

  /**
   * Sends password reset code to user's email
   * @param {object} e - event object
   */
  const handleForgotPassword = async (e) => {
    e.preventDefault();
    setError("");

    try {
      await resetPassword({
        username: formData.forgotPasswordEmail,
      });

      setMode("resetPassword");
    } catch (err) {
      setError(err.message || "Failed to send reset code");
    }
  };

  /**
   * Confirms password reset with verification code
   * @param {object} e - event object
   */
  const handleResetPassword = async (e) => {
    e.preventDefault();
    setError("");

    try {
      await confirmResetPassword({
        username: formData.forgotPasswordEmail,
        confirmationCode: formData.verificationCode,
        newPassword: formData.newPassword,
      });

      alert("Password reset successful!");
      setMode("login");
    } catch (err) {
      setError(err.message || "Password reset failed");
    }
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
          <input style={inputStyle} name="email" type="email" placeholder="Email" onChange={handleChange} required />
          <input style={inputStyle} name="password" type="password" placeholder="Password" value={formData.password} onChange={handleChange} required />
          <input style={inputStyle} name="confirmPassword" type="password" placeholder="Confirm Password" value={formData.confirmPassword} onChange={handleChange} required />

          <div style={{ fontSize: "12px", textAlign: "left" }}>
            {requirements.map((req) => {
              const isMet =
                formData.password.length > 0 &&
                !passwordErrors.includes(req);

              return (
                <div key={req} style={{ color: isMet ? "green" : "red" }}>
                  {req}
                </div>
              );
            })}
          </div>

          <button style={buttonStyle} type="submit">Sign Up</button>
          {error && <p style={{ color: "red" }}>{error}</p>}
        </form>
      )}

      {mode === "confirmSignup" && (
        <form onSubmit={handleConfirmSignup}>
          <input style={inputStyle} name="verificationCode" placeholder="Verification Code" onChange={handleChange} required />
          <button style={buttonStyle} type="submit">Verify Account</button>
          {error && <p style={{ color: "red" }}>{error}</p>}
        </form>
      )}

      {mode === "login" && (
        <>
          <form onSubmit={handleLogin}>
            <input style={inputStyle} name="email" type="email" placeholder="Email" onChange={handleChange} required />
            <input style={inputStyle} name="password" type="password" placeholder="Password" onChange={handleChange} required />
            <button style={buttonStyle} type="submit">Login</button>
          </form>

          <button
            style={{ marginTop: "10px", background: "none", border: "none", color: "blue", cursor: "pointer" }}
            onClick={() => setMode("forgotPassword")}
          >
            Forgot Password?
          </button>

          {error && <p style={{ color: "red" }}>{error}</p>}
        </>
      )}

      {mode === "forgotPassword" && (
        <form onSubmit={handleForgotPassword}>
          <input style={inputStyle} name="forgotPasswordEmail" type="email" placeholder="Enter your email" onChange={handleChange} required />
          <button style={buttonStyle} type="submit">Send Reset Code</button>
          {error && <p style={{ color: "red" }}>{error}</p>}
        </form>
      )}

      {mode === "resetPassword" && (
        <form onSubmit={handleResetPassword}>
          <input style={inputStyle} name="verificationCode" placeholder="Verification Code" onChange={handleChange} required />
          <input style={inputStyle} name="newPassword" type="password" placeholder="New Password" onChange={handleChange} required />
          <button style={buttonStyle} type="submit">Reset Password</button>
          {error && <p style={{ color: "red" }}>{error}</p>}
        </form>
      )}
    </div>
  );
}

export default Signup;