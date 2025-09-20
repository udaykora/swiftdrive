import React, { useState } from "react";
import "./addcar.css";
import { useNavigate } from "react-router-dom";

const CarInfoForm = () => {
  let navigate = useNavigate();

  const [carInfo, setCarInfo] = useState({
    carName: "",
    carModel: "",
    fuelCapacity: "",
    capacity: "",
    transmission: "",
    fuelType: "", 
    carPrice: "",
    carImage: null,
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setCarInfo({
      ...carInfo,
      [name]: value,
    });
  };

  const handleFileChange = (e) => {
    setCarInfo({
      ...carInfo,
      carImage: e.target.files[0],
    });
  };

  const backs = () => {
    navigate("/cars");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const formData = new FormData();

    formData.append("carName", carInfo.carName);
    formData.append("carModel", carInfo.carModel);
    formData.append("fuelCapacity", carInfo.fuelCapacity);
    formData.append("capacity", carInfo.capacity);
    formData.append("transmission", carInfo.transmission);
    formData.append("fuelType", carInfo.fuelType); // Added
    formData.append("carPrice", carInfo.carPrice);

    if (carInfo.carImage) {
      formData.append("carImage", carInfo.carImage);
    }

    try {
      const response = await fetch(`https://swiftdrive.onrender.com/carupload`, {
        method: "POST",
        body: formData,
      });

      const data = await response.json();
      console.log(data);
      navigate("/cars");
    } catch (error) {
      console.error("Error uploading data:", error);
    }
  };

  return (
    <div className="form-container">
      <form onSubmit={handleSubmit} className="formdeco" encType="multipart/form-data">
        <button className="close-btn" onClick={backs}>
          &times;
        </button>
        <div className="form-group">
          <h2 className="caradd"style={{ marginLeft: "34px" }}>Car Information Form</h2>
          <label htmlFor="carName">Car Name</label>
          <input
            type="text"
            id="carName"
            name="carName"
            value={carInfo.carName}
            onChange={handleInputChange}
            required
          />
        </div>

        <div className="form-group">
          <label htmlFor="carModel">Car Model</label>
          <input
            type="text"
            id="carModel"
            name="carModel"
            value={carInfo.carModel}
            onChange={handleInputChange}
            required
          />
        </div>

        <div className="form-group">
          <label htmlFor="fuelType">Fuel Type</label> 
          <select
            id="fuelType"
            name="fuelType"
            value={carInfo.fuelType}
            onChange={handleInputChange}
            required
          >
            <option value="">Select Fuel Type</option>
            <option value="Petrol">Petrol</option>
            <option value="Diesel">Diesel</option>
            <option value="Electric">Electric</option>
            
          </select>
        </div>

        <div className="form-group">
          <label htmlFor="fuelCapacity">Fuel Capacity (L) / Battery Capacity(kWh)</label>
          <input
            type="number"
            id="fuelCapacity"
            name="fuelCapacity"
            value={carInfo.fuelCapacity}
            onChange={handleInputChange}
            required
          />
        </div>

        <div className="form-group">
          <label htmlFor="capacity">Seating Capacity</label>
          <input
            type="number"
            id="capacity"
            name="capacity"
            value={carInfo.capacity}
            onChange={handleInputChange}
            required
          />
        </div>

        <div className="form-group">
          <label htmlFor="transmission">Transmission</label>
          <select
            id="transmission"
            name="transmission"
            value={carInfo.transmission}
            onChange={handleInputChange}
            required
          >
            <option value="">Select Transmission</option>
            <option value="Automatic">Automatic</option>
            <option value="Manual">Manual</option>
            <option value="Both">Both</option>
          </select>
        </div>

        

        <div className="form-group">
          <label htmlFor="carPrice">Car Price</label>
          <input
            type="number"
            id="carPrice"
            name="carPrice"
            value={carInfo.carPrice}
            onChange={handleInputChange}
            required
          />
        </div>

        <div className="form-group">
          <label htmlFor="carImage">Car Image</label>
          <input
            type="file"
            id="carImage"
            name="carImage"
            onChange={handleFileChange}
            required
          />
        </div>

        <button type="submit" className="submit-btn">
          Submit
        </button>
      </form>
    </div>
  );
};

export default CarInfoForm;