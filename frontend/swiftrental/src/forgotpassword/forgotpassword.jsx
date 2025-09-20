import React, { useState } from "react";
import "./forgotpassword.css";
import { useNavigate ,Link } from "react-router-dom";

const ForgotPassword = () => {
  const [email, setEmail] = useState("");
  const [emailexisted,setemailexisted ]= useState(null);
  const [emailsent ,setemailsent]=useState(null)
  const [isloading ,setisloading] = useState(null)
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
  e.preventDefault();
  setisloading(true)
  setemailexisted(false)
  setemailsent(false)


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

    const data = await response.json()

    console.log(data)

    if (data.status) {
        setisloading(false)
        setemailsent(true)

       let timer =  setTimeout(()=>{
        navigate("/");

        },3000)
      
    } else {
        setisloading(false)
        setemailexisted(true)
    }
  } catch (error) {
    console.error("Error uploading data:", error);
  }
};


  return (
    <div className="email-verify-container app-container12">
      
      <form onSubmit={handleSubmit}>
        <h2 className="emailtext" >Forgot Password</h2>
        <input
          type="email"
          placeholder="Enter your email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <button type="submit">Send Verification Link</button>
        {isloading && <p className="loading">Loading...</p>}
        {emailexisted && <p className="failed-message">Email does not Exist</p>}
        {emailsent && <p className="success-message" >A verification link has been sent to your email</p>}
         <div className="existing-account">
          <p style={{color:"black"}}>
          
            <Link to="/" className="login-link">
              Go Back
            </Link>
          </p>
        </div>
      </form>
      
     
    </div>
  );
};

export default ForgotPassword;

