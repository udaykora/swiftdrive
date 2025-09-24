import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import "./login.css";

const Login = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [userMessage, setUserMessage] = useState("");
  const [assign, setAssign] = useState(false);
  const [temp, setTemp] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setTemp(true);

    let response = await fetch("https://swiftdrive.onrender.com/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
    });

    const data = await response.json();
    console.log(data);

    if (data.status === "adminsuccess") {
      localStorage.setItem("admindata", JSON.stringify({ email, password }));
      navigate("/cars", { state: { userdatas: data.message } });
    }
    if (data.status === "failed") {
      setUserMessage(data.message);
      setAssign(true);
      setTemp(false);
      setTimeout(() => setAssign(false), 3000);
    }
    if (data.message?.status === "deactive") {
      setUserMessage("Your Account Has been deactivated. Contact Admin.");
      setAssign(true);
      setTemp(false);
      setTimeout(() => setAssign(false), 3000);
      return;
    }
    if (data.status === "success") {
      localStorage.setItem("userdatas", JSON.stringify(data.message));
      navigate("/usercars");
    }
  };

  const autofillDemoUser = () => {
  setEmail("udaysaketh904@gmail.com");
  setPassword(12345678);
};

const autofillDemoAdmin = () => {
  setEmail("udaykora777@gmail.com");
  setPassword("Udaykora@2002");
};


  return (
    <>
      <div className={`login-body ${temp ? "login-body1" : ""}`}>
        <div className="container">
          <div className="app-name">SwiftDrive</div>
          <div className="quote">Accelerate your journey, drive the future.</div>
        </div>

        <div className="login-form-container">
          <h2>Login</h2>
          <form onSubmit={handleSubmit}>
            <div className="input-group">
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Email"
                required
                className="input-field"
              />
            </div>

            <div className="input-group">
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Password"
                required
                className="input-field"
              />
            </div>

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
            <p style={{ marginTop: "2px" }}>
              <Link to="/forgotpasslink" className="signup-link">
                Forgot Password
              </Link>
            </p>

            {assign && <h1 className="failed-message">{userMessage}</h1>}
          </div>

          
         <div className="demo-link-container">
  <p className="demo-text">
    Try demo as <span className="demo-link" onClick={autofillDemoUser}>User</span>
  </p>
  <p className="demo-text">
    Try demo as <span className="demo-link" onClick={autofillDemoAdmin}>Admin</span>
  </p>
</div>

        </div>
      </div>

      {temp && <div className="loader"></div>}
    </>
  );
};

export default Login;
