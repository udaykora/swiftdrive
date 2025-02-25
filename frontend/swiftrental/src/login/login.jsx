import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import './login.css';

const Login = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [userMessage, setUserMessage] = useState("");
  const [assign, setAssign] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();

    let response = await fetch(`https://swiftdrive.onrender.com/login`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        email,
        password
      }),
    });

    const data = await response.json();
    console.log(data);
    if (data.status === "adminsuccess") {
      localStorage.setItem('userdatas', JSON.stringify(data.message));
      navigate("/cars", {
        state: {
          userdatas: data.message,
        }
      });
    }

    if (data.status === "failed") {
      setUserMessage(data.message);
      setAssign(true);
      setTimeout(() => {
        setAssign(false);
      }, 3000);
    }

    if (data.message.status === "deactive") {
      setUserMessage("Your Account Has been deactivated contact Admin");
      setAssign(true);
      setTimeout(() => {
        setAssign(false);
      }, 3000);
      return
    }

    if (data.status === "success") {
      console.log("hiii")
      localStorage.setItem('userdatas', JSON.stringify(data.message));
      navigate("/usercars")
    }
  };

  return (
    <div className="login-body">
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
            New to account?{' '}
            <Link to="/signup" className="signup-link">
              Sign Up
            </Link>
          </p>
          {assign && <h1 className="failed-message">{userMessage}</h1>}
        </div>

        {/* Admin credentials section */}
        <div className="admin-credentials">
          <h3 className="editing"> Admin Login Credentials </h3>
          <p><strong>Email:</strong> udaykora777@gmail.com</p>
          <p><strong>Password:</strong> Udaykora@2002</p>
        </div>
      </div>
    </div>
  );
};

export default Login;
