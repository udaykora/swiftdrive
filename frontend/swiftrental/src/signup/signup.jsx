import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import './signup.css';

const SignUp = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const [userDetails, setUserDetails] = useState({
    fullname: '',
    email: '',
    phonenumber: '',
    address: '',
    password: '',
    confirmPassword: ''
  });

  const [temp, setTemp] = useState(false);
  const [isRegistered, setIsRegistered] = useState(false);
  const [isRegistered1, setIsRegistered1] = useState(false);
  const [passwordError, setPasswordError] = useState(false);
  const [passwordMatchError, setPasswordMatchError] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setUserDetails({ ...userDetails, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setTemp(true);
    setPasswordError(false);
    setPasswordMatchError(false);

    
    if (userDetails.password.length < 8) {
      setPasswordError(true);
      setTemp(false);
      return;
    }

    if (userDetails.password !== userDetails.confirmPassword) {
      setPasswordMatchError(true);
      setTemp(false);
      return;
    }

    try {
      const response = await fetch(`https://swiftdrive.onrender.com/signup`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(userDetails),
      });

      const data1 = await response.json();

      if (data1.status === 'success') {
        setTemp(false);
        setIsRegistered(true);
        setTimeout(() => navigate('/'), 3000);
      } else if (data1.status === 'failed') {
        setIsRegistered1(true);
        setTemp(false);
        setTimeout(() => setIsRegistered1(false), 3000);
      }
    } catch (error) {
      console.error('Error:', error);
      setTemp(false);
    }
  };

  useEffect(() => {
    const queryParams = new URLSearchParams(location.search);
    const tokenEmail = queryParams.get('email');
    if (tokenEmail) {
      setUserDetails(prev => ({ ...prev, email: tokenEmail }));
    }
  }, [location.search]);

  return (
    <>
      <div className={`signup-body ${temp ? 'signup-body1' : ''}`}>
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
                readOnly
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
            <div className="input-group">
              <input
                type="password"
                name="confirmPassword"
                value={userDetails.confirmPassword}
                onChange={handleChange}
                placeholder="Confirm Password"
                required
                className="input-field"
              />
            </div>
            <button type="submit" className="submit-btn">Sign Up</button>
          </form>

          {isRegistered && <h1 className="success-message">Registered successfully!</h1>}
          {isRegistered1 && <h1 className="failed-message">Email id Already exists</h1>}
          {passwordError && <h1 className="failed-message">Password must be at least 8 characters</h1>}
          {passwordMatchError && <h1 className="failed-message">Passwords do not match</h1>}
        </div>
      </div>
      {temp && (<div className="loader-sign"></div>)}
    </>
  );
};

export default SignUp;
