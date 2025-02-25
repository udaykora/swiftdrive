import React, { useEffect, useState } from "react"; 
import { Link, useLocation } from "react-router-dom"; 
import "./thankyou.css"; 

const ThankYou = () => { 
  const location = useLocation(); 
  const { state } = location; 
  const [bookedcars, setbookedcars] = useState(null); 
  const [userdata, setuserdata] = useState(null);

  useEffect(() => { 
    const storedData = localStorage.getItem('userdatas');  // Directly access from localStorage
    console.log(storedData); 
    if (storedData) {
      setuserdata(JSON.parse(storedData)); // Parse the stored JSON data
    }
  }, []); // Empty dependency array ensures it runs once

  useEffect(() => { 
    if (userdata) {  
      setbookedcars(state); 
      console.log(userdata)
      console.log(state)
      const carid = location.state.cardata.carid; 
      const carname = location.state.cardata.carName; 
      const carmodel = location.state.cardata.carModel
      const bookedbyname = userdata.fullname; 
      const bookedbyid = userdata.id;
      const pickupdate = location.state.bookingdata.pickupDate; 
      const dropdate = location.state.bookingdata.dropDate; 
      const carimagepath = location.state.cardata.path; 
      const bookingprice = location.state.carprice;

      const submit = async () => { 
        let response2 = await fetch(`https://swiftdrive.onrender.com/bookedcars`, { 
          method: "POST", 
          headers: { 
            "Content-Type": "application/json", 
          }, 
          body: JSON.stringify({ 
            carid, 
            carname,
            carmodel,
            bookedbyname, 
            bookedbyid, 
            pickupdate, 
            dropdate, 
            carimagepath, 
            bookingprice 
          }), 
        }); 
      }
      submit();
    }
  }, [userdata, state]);  // Ensure this effect runs when userdata and state change

  return ( 
    <div className="thank-you-container22"> 
      <div className="thank-you-message22"> 
        <h1>Thank You for Your Booking!</h1> 
        <p>Your car booking has been confirmed. Below are your booking details:</p> 
      </div> 
      <div className="car-details22"> 
        <img 
          src={state.cardata.path} 
          alt={state.cardata.carModel} 
          className="car-image22" 
        /> 
        <div className="details22"> 
          <h2>{state.cardata.carName}</h2> 
          <p> 
            <strong>Model:</strong> {state.cardata.carModel} 
          </p> 
          <p> 
            <strong>Pickup Date:</strong> {state.bookingdata.pickupDate} 
          </p> 
          <p> 
            <strong>Drop Date:</strong> {state.bookingdata.dropDate} 
          </p> 
          <p> 
            <strong>Price:</strong> {state.carprice} RS
          </p> 
        </div> 
      </div> 
      <div className="home-link22"> 
        <Link to="/usercars">Back to Home</Link> 
      </div> 
    </div> 
  ); 
}; 

export default ThankYou;
