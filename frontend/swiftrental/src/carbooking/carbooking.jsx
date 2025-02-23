import React, { useEffect, useState } from 'react';
import './carbooking.css';
import { useLocation , useNavigate } from 'react-router-dom';

const CarCard = () => {
  const [carDetails, setcarDetails] = useState([]);
  const [price, setPrice] = useState();
  const [assign, setAssign]= useState(false)
  const [message,setmessage]=useState(null)
  const location = useLocation();
  const navigate = useNavigate()
  const { state } = location;
  console.log(state)

  const [bookingData, setBookingData] = useState({
    pickupDate: '',
    dropDate: '',
  });

  useEffect(() => {
    setcarDetails(state.car);
  }, [state]);

  const handleChange = (e) => {
    setBookingData({ ...bookingData, [e.target.name]: e.target.value });
  };

  const calculateDateDifference = (startDate, endDate) => {
    const start = new Date(startDate);
    const end = new Date(endDate);
    const differenceInMilliseconds = end.getTime() - start.getTime();
    const differenceInDays = Math.ceil(differenceInMilliseconds / (1000 * 60 * 60 * 24));
    return differenceInDays;
  };

  const handleChange1 = (e) => {
    setBookingData({ ...bookingData, [e.target.name]: e.target.value });
    const c = calculateDateDifference(bookingData.pickupDate, e.target.value);
    setPrice(c * carDetails.carPrice); 
  };

  const handleBookNow = () => {
    if (bookingData.pickupDate===''){
      setAssign(true)
      setmessage("enter the pickup date")
      setTimeout(()=>{
        setAssign(false)
      },3000)
      return
    }
    if (bookingData.dropDate===''){
      setAssign(true)
      setmessage("enter the drop date")
      setTimeout(()=>{
        setAssign(false)
      },3000)
      return
    }
    if (price <=0 || price === undefined ){
      setAssign(true)
      setmessage("ENTER VALID DETAILS")
      setTimeout(()=>{
        setAssign(false)
      },3000)
      return
    }
    navigate("/userbooked",{state:{
      cardata: state.car,
      bookingdata:bookingData,
      carprice:price


    }})
  };

  return ( 
    <>
    
    <div className='bookcarh'>
    <div className="app-name1234">Swift Drive</div>
    <div className="quote1">Accelerate your journey, drive the future.</div>
    {/* <div className='app-name12345'>Booking Details</div> */}
    <div className="car-card">
      <img src={carDetails.path} alt={carDetails.name} className="car-image" />
      <div className="car-details">
        <div className="detail-item">
          <label className="detail-label">Car ID:</label>
          <span className="detail-value">{carDetails.carid}</span>
        </div>
        <div className="detail-item">
          <label className="detail-label">Car Name:</label>
          <span className="detail-value">{carDetails.carName}</span>
        </div>
        <div className="detail-item">
          <label className="detail-label">Car Model:</label>
          <span className="detail-value">{carDetails.carModel}</span>
        </div>
        <div className="input-container">
          <label htmlFor="pickupDate" className="detail-label">Pickup Date:</label>
          <input
            type="date"
            id="pickupDate"
            name="pickupDate"
            value={bookingData.pickupDate}
            onChange={handleChange}
            className="detail-input"
            required
          />
        </div>
        <div className="input-container">
          <label htmlFor="dropDate" className="detail-label">Drop-off Date:</label>
          <input
            type="date"
            id="dropDate"
            name="dropDate"
            value={bookingData.dropDate}
            onChange={handleChange1}
            className="detail-input"
            required
          />
        </div>
        <div className="detail-item">
          <label className="detail-label">Price:</label>
          <span className="detail-value"><img className="rupee"src='https://res.cloudinary.com/ds1ysygvb/image/upload/v1739178928/rupee-sign_idgmlo.svg' alt='imagss'></img><span className='moneyallign'>{price}</span></span>
        </div>
        <button className="book-button" onClick={handleBookNow}>Book Now</button>
        {assign && <h1 className="failed-message1">{message}</h1>}
      </div>
    </div>
    </div>
    </>
  );
};

export default CarCard;
