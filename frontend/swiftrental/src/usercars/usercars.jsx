import React, { useState, useEffect } from "react";
import "./usecars.css";
import { useNavigate , useLocation } from "react-router-dom";

const CarCard1 = ({ car, moveTo }) => (
  <div className="car-card12">
    <h3 className="carname12">{car.carName}</h3>
    <p className="cartype12">{car.carModel}</p>
    <div className="car-image12">
      <img src={car.path} alt={car.brand} />
    </div>
    <div className="car-details12">
      <div className="car-info12">
      <p>{car.fuelType === "Electric" ? ( <img
              className="petrol13"
              width="20"
              height="20"
              src="https://res.cloudinary.com/ds1ysygvb/image/upload/v1740236486/battery-battery-level-charge-19-svgrepo-com_fus8ne.svg"
              alt="gas-station"
            />):( <img
              className="petrol13"
              width="20"
              height="20"
              src="https://img.icons8.com/ios-filled/50/gas-station.png"
              alt="gas-station"
            />)}
            {car.fuelCapacity}{car.fuelType==="Electric"?("kWh"):("L")} |{" "}
          <img
            className="petrol12"
            width="20"
            height="20"
            src="https://res.cloudinary.com/ds1ysygvb/image/upload/v1738831384/person-svgrepo-com_r4zyjh.svg"
            alt="gas-station"
          />
          {car.capacity}P |
          {car.fuelType === "Electric" ? (
              <img
                className="electric-svg"
                width="20"
                height="20"
                src="https://res.cloudinary.com/ds1ysygvb/image/upload/v1740232113/electric-car-illustration-1-svgrepo-com_vicnsp.svg"
                alt="electric-car"
              />
            ) : car.fuelType === "Diesel" ? (
              <img
                className="diesel-svg"
                width="20"
                height="20"
                src="https://res.cloudinary.com/ds1ysygvb/image/upload/v1738833949/gasoline-petrol-svgrepo-com_rlvaw1.svg" // Replace with your diesel SVG URL
                alt="diesel-car"
              />
            ) : (
              <img
                className="petrol-svg"
                width="20"
                height="20"
                src="https://res.cloudinary.com/ds1ysygvb/image/upload/v1738833949/gasoline-petrol-svgrepo-com_rlvaw1.svg"
                alt="petrol-car"
              />
            )}
            {car.fuelType} | ⭐ 4.0
        </p>
        <br />
        <p>
          <img
            className="petrol12"
            width="20"
            height="20"
            src="https://res.cloudinary.com/ds1ysygvb/image/upload/v1738833249/car-steering-wheel-svgrepo-com_ixgryx.svg"
            alt="gas-station"
          />
          {car.transmission}
        </p>
      </div>
      <div className="car-price12">
        <p className="price">💲{car.carPrice}/day</p>
        <button className="rent-button12" onClick={() => moveTo(car)}>
          Rent Now
        </button>
      </div>
    </div>
  </div>
);

const CarList = () => {
  const [carsdata, setcarsdata] = useState([]);
  const [usersdata1,setuserdata1] = useState()
  const navigate = useNavigate();
  const location = useLocation()
  const {state} = location
 
 

  console.log(usersdata1)


  const moveTo = (car) => {
    console.log(car);
    navigate("/userbookings", { state: { car } });
  };

  const gotocars = ()=>{
    navigate("/bookings")
  }

  const logout = ()=>{
    localStorage.clear();
    navigate("/")
  }

  useEffect(() => {
    const handleSubmit = async () => {
      let response2 = await fetch(`${process.env.REACT_APP_BACKEND_URL}/cars`, {
        method: "GET",
      });

      const data2 = await response2.json();
      console.log(data2.message);
      setcarsdata(data2.message);
    };

    handleSubmit();
  }, []);

  return (
    <div className="app-container12">
      <div className="header12">
        <div className="app-name12">Swift Drive</div>
        <div className="user-actions12">
          <button className="bookings" onClick={gotocars}>My Bookings</button>
          <button className="logout" onClick={logout}>Log Out</button>
        </div>
      </div>
      <div className="car-list12">
        {carsdata.map((car, index) => (
          <CarCard1 key={index} car={car} moveTo={moveTo} />
        ))}
      </div>
    </div>
  );
};

export default CarList;
