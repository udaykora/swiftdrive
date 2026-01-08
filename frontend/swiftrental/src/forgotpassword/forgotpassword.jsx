import React, { useState } from "react";
import "./forgotpassword.css";
import { useNavigate, Link } from "react-router-dom";

const ForgotPassword = () => {
  const [email, setEmail] = useState("");
  const [emailexisted, setemailexisted] = useState(null);
  const [emailsent, setemailsent] = useState(null);
  const [isloading, setisloading] = useState(null);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setisloading(true);
    setemailexisted(false);
    setemailsent(false);

    try {
      const response = await fetch("https://swiftdrive.onrender.com/passwordverifylink", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: email,
        }),
      });

      const data = await response.json();
      console.log(data);

      if (data.status) {
        setisloading(false);
        setemailsent(true);

        let timer = setTimeout(() => {
          navigate("/");
        }, 10000);
      } else {
        setisloading(false);
        setemailexisted(true);
      }
    } catch (error) {
      console.error("Error uploading data:", error);
    }
  };

  return (
    <div className="forgot-password-container">
        <div className="header">
        <h1 className="app-name">SwiftDrive</h1>
      
      </div>
      <form onSubmit={handleSubmit}>

        
        <h2>Forgot Password</h2>

        <input
          type="email"
          placeholder="Enter your email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />

        <button type="submit">Send Verification Link</button>

        {isloading && <div className="loading">Loading...</div>}

        {emailexisted && (
          <div className="failed-message">Email does not Exist</div>
        )}

        {emailsent && (
          <div className="email-sent-container">
            <div className="emailtext">
              ✓ A verification link has been sent to your email
            </div>
            <div className="spam-reminder">
              ⚠️ Please check your spam/junk folder if you don't see the email
            </div>
          </div>
        )}

        <p className="existing-account">
          <Link to="/" className="login-link">
            Go Back
          </Link>
        </p>
      </form>
    </div>
  );
};

export default ForgotPassword;