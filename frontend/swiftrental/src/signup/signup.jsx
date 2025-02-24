import React, { useState , useEffect } from 'react';
import { Link ,useNavigate} from 'react-router-dom';
import './signup.css';

const SignUp = () => {
    const navigate = useNavigate()
  const [userDetails, setUserDetails] = useState({

    fullname: '',
    email:'',
    phonenumber: '',
    address: '',
    password: ''
  });

  const [isRegistered, setit] = useState(false);
  const [isRegistered1, setit1] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setUserDetails({
      ...userDetails,
      [name]: value,
    });
  };

  const handleSubmit = async(e) => {
    e.preventDefault();
    const response = await fetch(`https://swiftdrive.onrender.com/signup`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(userDetails),
      });

      const data1 = await response.json();
      if (data1.status === "success") {
        setit(true);
        setTimeout(() => {
          navigate("/");
        }, 3000);
      }
  
      if (data1.status === "failed") {
          setit1(true);
          setTimeout(() => {
              setit1(false);
          }, 3000);
        }
  };


  useEffect(() => {
    // This is the setup code when the component is mounted
  
    return () => {
      // This is the cleanup code that runs when the component unmounts
      console.log('Component unmounted');
    };
  }, []);  // The empty dependency array ensures it runs once when mounted and unmounted
  

  return (
    <div className="signup-body">
      <div className="signup-form-container">
        <h2 className='create'>Create an Account</h2>
        <form onSubmit={handleSubmit}>
          <div className="input-group">
            <input
              type="text"
              name="fullname"
              value={userDetails.fullname}
              onChange={handleChange}
              placeholder="Full Name"
              required
              className="input-field"
            />
          </div>

          <div className="input-group">
            <input
              type="text"
              name="email"
              value={userDetails.email}
              onChange={handleChange}
              placeholder="Email"
              required
              className="input-field"
            />
          </div>

          <div className="input-group">
            <input
              type="text"
              name="phonenumber"
              value={userDetails.phonenumber}
              onChange={handleChange}
              placeholder="Phone Number"
              required
              className="input-field"
            />
          </div>

          <div className="input-group">
            <input
              type="text"
              name="address"
              value={userDetails.address}
              onChange={handleChange}
              placeholder="Address"
              required
              className="input-field"
            />
          </div>

          <div className="input-group">
            <input
              type="password"
              name="password"
              value={userDetails.password}
              onChange={handleChange}
              placeholder="Password"
              required
              className="input-field"
            />
          </div>

          <button type="submit" className="submit-btn">
            Sign Up
          </button>
        </form>
        <div className="existing-account">
          <p style={{color:"black"}}>
            Already have an account?{' '}
            <Link to="/" className="login-link">
              Log In
            </Link>
          </p>
        </div>
        {isRegistered && (
          <h1 className="success-message">Registered successfully!</h1>
        )}
        {isRegistered1 && (
          <h1 className="failed-message">Email id Already exists</h1>
        )}
      </div>
    </div>
  );
};

export default SignUp;
