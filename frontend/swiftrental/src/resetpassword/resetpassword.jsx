import React, { useEffect, useState } from "react";
import "./resetpassword.css";
import { useNavigate ,Link } from "react-router-dom";
import { useLocation } from "react-router-dom";


const ForgotPasswordUI = () => {
  const [email, setEmail] = useState("");
  const [password,setPassword ]= useState(null);
  const [confirmPassword ,setconfirmPassword]=useState(null)
  const [isloading ,setisloading] = useState(null)
  const [passwordset ,setpasswordset] = useState(null)
  const [passwordmatch ,setpasswordmatch] = useState(null)
  const [passwordlength ,setpasswordlength] = useState(null)
  const navigate = useNavigate();
 const location = useLocation();

  useEffect(()=>{

    const queryParams = new URLSearchParams(location.search);
 
  const token = queryParams.get("email");

  setEmail(token)


  },[])

  const handleSubmit = async (e) => {
  e.preventDefault();
  setisloading(true)
  setpasswordset(false)
  setpasswordmatch(false)
  setpasswordlength(false)

  if (password !=confirmPassword){
    setpasswordmatch(true)
    setisloading(false)
    return

  }
  if (password.length <8){
    setpasswordlength(true)
    setisloading(false)
    return
}


  try {
    const response = await fetch("https://swiftdrive.onrender.com/forgotpassword", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",  
      },
      body: JSON.stringify({
        email: email,
        password:password
      }),
    });

    const data = await response.json()

    console.log(data)

    if (data.status) {
        setisloading(false)
        setpasswordset(true)

       let timer =  setTimeout(()=>{
        navigate("/");

        },3000)

      
    } else {
        setisloading(false)
        
    }
  } catch (error) {
    console.error("Error uploading data:", error);
  }
};


  return (
    <div className="email-verify-container app-container12">
      
      <form onSubmit={handleSubmit}>
        <h2 className="emailtext" >Password Reset Form</h2>

         <input
          type="email"
         
          value={email}
          readOnly
          required
        />
        <input
          type="password"
          placeholder="Enter New Password"
         
          onChange={(e) => setPassword(e.target.value)}
          required
        />

         <input
          type="password"
          placeholder="Re-enter Password"
          
          onChange={(e) => setconfirmPassword(e.target.value)}
          required
        />
        <button type="submit">Set Password</button>
        {isloading && <p className="loading">Loading...</p>}
        {passwordmatch && <p className="failed-message">Both Passwords Should Match</p>}
        {passwordset && <p className="success-message" >Password Set Successfully</p>}
        {passwordlength && <p className="success-message" >Password should Contain 6 Characters</p>}
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

export default ForgotPasswordUI;
