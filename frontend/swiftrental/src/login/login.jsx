import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { message } from "antd";

import "./login.css";

const Login = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [userMessage, setUserMessage] = useState("");
  const [assign, setAssign] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setAssign(false);

    // Initial loading
    const hide = message.loading("Loading...", 0);

    // Server wake-up message
    const wakeTimer = setTimeout(() => {
      message.loading("Please wait, the server is waking up...", 0);
    }, 4000);

    try {
      const response = await fetch("https://swiftdrive.onrender.com/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      clearTimeout(wakeTimer);
      hide();
      message.destroy();

      if (data.status === "adminsuccess") {
        localStorage.setItem("admindata", JSON.stringify({ email, password }));
        navigate("/cars");
        return;
      }

      if (data.status === "failed") {
        setUserMessage(data.message);
        setAssign(true);
        return;
      }

      if (data.message?.status === "deactive") {
        setUserMessage("Your account has been deactivated. Contact admin.");
        setAssign(true);
        return;
      }

      if (data.status === "success") {
        localStorage.setItem("userdatas", JSON.stringify(data.message));
        navigate("/usercars");
      }
    } catch (err) {
      clearTimeout(wakeTimer);
      hide();
      message.destroy();
      message.error("Something went wrong. Please try again.");
    }
  };

  const autofillDemoUser = () => {
    setEmail("udaysaketh904@gmail.com");
    setPassword("uk20022002");
  };

  const autofillDemoAdmin = () => {
    setEmail("udaykora777@gmail.com");
    setPassword("Udaykora@2002");
  };

  return (
    <div className="login-body">
      {/* App Header */}
      <div className="header">
        <h1 className="app-name">SwiftDrive</h1>
      
      </div>

      {/* Login Card */}
      <div className="login-form-container">
        <h2>Login</h2>

        <form onSubmit={handleSubmit}>
          <input
            type="email"
            className="input-field"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />

          <input
            type="password"
            className="input-field"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />

          <button type="submit" className="submit-btn">
            Log In
          </button>
        </form>

        <div className="new-to-account">
          <p>
            New to account?{" "}
            <Link to="/emailverify" className="signup-link">
              Sign Up
            </Link>
          </p>

          <p>
            <Link to="/forgotpasslink" className="signup-link">
              Forgot Password?
            </Link>
          </p>

          {assign && <p className="failed-message">{userMessage}</p>}
        </div>

        <div className="demo-link-container">
          <p>
            Try demo as{" "}
            <span className="demo-link" onClick={autofillDemoUser}>
              User
            </span>
          </p>
          <p>
            Try demo as{" "}
            <span className="demo-link" onClick={autofillDemoAdmin}>
              Admin
            </span>
          </p>
        </div>

        <p className="about-link">
          Know more about{" "}
          <Link to="/about" className="signup-link">
            SwiftDrive
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Login;
