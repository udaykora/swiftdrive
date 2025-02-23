import React, { useState, useEffect } from "react";
import "./adminbookings.css";
import { useNavigate, useLocation } from "react-router-dom";

const CarCard1 = ({ car, moveTo }) => (
  <div className="car-card12">
    <h3 className="carname12">{car.carname}</h3>
    <p className="cartype12">{car.carmodel}</p>
    <div className="car-image12">
      <img src={car.carimagepath} alt={car.brand} />
    </div>
    <div className="car-details12">
      <div className="car-info">
        <h4 className="carid">
          Car ID: <span className="data">{car.carid}</span>
        </h4>

        <h4 className="return-date">
          User ID: <span className="data">{car.bookedbyid}</span>
        </h4>
        <h4 className="return-date">
          User Name: <span className="data">{car.bookedbyname}</span>
        </h4>
        <h4 className="pickup-date">
          Pickup Date: <span className="data">{car.pickupdate}</span>
        </h4>

       

        <h4 className="return-date">
          Return Date: <span className="data">{car.dropdate}</span>
        </h4>
      </div>
      <div className="car-price12">
        <p className="price1">💰{car.bookingprice} Rs</p>
      </div>
    </div>
  </div>
);

const Adminbooking = () => {
  const [carsdata, setcarsdata] = useState([]);
  const [usersdata1, setuserdata1] = useState();
  const [usercardata, setusercardata] = useState([]);
  const navigate = useNavigate();
  const location = useLocation();
  const { state } = location;

  console.log(usersdata1);

  const moveTo = (car) => {
    console.log(car);
    navigate("/userbookings", { state: { car } });
  };

  useEffect(() => {
    const handleSubmit = async () => {
      let response2 = await fetch(`${process.env.REACT_APP_BACKEND_URL}/adminbookedcars`, {
        method: "GET",
      });

      const data2 = await response2.json();
      console.log(data2.data);
      setusercardata(data2.data);
    };

    handleSubmit();
  }, []);

  return (
    <div className="app-container12">
      <div className="header12">
        <div className="app-name123">Swift Drive</div>
        <div className="text">Booked Cars</div>
      </div>
      <div className="car-list12">
        {usercardata.map((car, index) => (
          <CarCard1 key={index} car={car} moveTo={moveTo} />
        ))}
      </div>
    </div>
  );
};

export default Adminbooking;
