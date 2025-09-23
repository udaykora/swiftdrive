import { React, useEffect, useState } from "react";
import "./cars.css";
import { Link, useNavigate } from "react-router-dom";

const CarListComponent = () => {
  const [carData, setCardata] = useState([]);
  const [trans, settrans] = useState(null);

  const navigate = useNavigate();

  let usersdata = () => {
    navigate("/usersdata");
  };

  let addcar = () => {
    navigate("/addcar");
  };

  let logout = () => {
    localStorage.clear();
    navigate("/");
  };

  let adminbooked = () => {
    navigate("/adminbookings");
  };

  useEffect(() => {
    const handleSubmit = async (e) => {
      let response2 = await fetch(`https://swiftdrive.onrender.com/cars`, {
        method: "GET",
      });

      const data2 = await response2.json();
      console.log(data2.message[0]);
      setCardata(data2.message);
    };

    handleSubmit();
  }, []);

  const CarCard1 = ({ car }) => (
    <div className="car-card13">
      <h3 className="carname13">{car.carName}</h3>
      <p className="cartype13">{car.carModel}</p>
      <div className="car-image13">
        <img src={car.path} alt={car.brand} />
      </div>
      <div className="car-details13">
        <div className="car-info13">
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
            {car.fuelCapacity}{car.fuelType==="Electric"?("kwh"):("L")} |{" "}
            <img
              className="petrol12"
              width="20"
              height="20"
              src="https://res.cloudinary.com/ds1ysygvb/image/upload/v1738831384/person-svgrepo-com_r4zyjh.svg"
              alt="passenger-icon"
            />
            {car.capacity}P |{" "}
           
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
              className="petrol13"
              width="20"
              height="20"
              src="https://res.cloudinary.com/ds1ysygvb/image/upload/v1738833249/car-steering-wheel-svgrepo-com_ixgryx.svg"
              alt="steering-wheel"
            />
            {car.transmission}
          </p>
        </div>
        <div className="car-price13">
          <p>💲{car.carPrice}/day</p>
        </div>
      </div>
    </div>
  );

  return (
    <div className="car-list-container">
      <div className="navbar">
        <h1 className="appname">SwiftDrive</h1>
        <h1 className="portal">Admin Portal</h1>
        <div className="carsus">
          <div className="user-info">
            <button className="user-data-btn" onClick={usersdata}>
              Users Data
            </button>
          </div>

          <div className="car-header">
            <button className="add-car-btn" onClick={addcar}>
              Add Car
            </button>
          </div>
          <div className="car-header">
            <button className="bookings-btn" onClick={adminbooked}>
              Bookings{" "}
            </button>
          </div>
          <div className="car-header">
            <button className="logout1" onClick={logout}>
              Logout
            </button>
          </div>
        </div>
      </div>

      <div className="car-grid3">
        <div className="car-list13">
          {carData.map((car, index) => (
            <CarCard1 key={index} car={car} />
          ))}
        </div>
      </div>
    </div>
  );
};

export default CarListComponent;
