import logo from "./logo.svg";
import "./App.css";
import Login from "./login/login";
import SignUp from "./signup/signup";
import CarListComponent from "./cars/cars";
import UserDataTable from "./usersdata/usersdata";
import CarInfoForm from "./addcar/addcar";
import CarList from "./usercars/usercars";
import CarCard from "./carbooking/carbooking";
import ThankYou from "./thankyou/thankyou";
import Userbooking from "./userbookings/userbookings";
import Adminbooking from "./adminbookings/adminbookings";
// import UserDataTable from "./usersdata/usersdata";

import {
  BrowserRouter as Router,
  Route,
  Routes,
  Link,
  Switch,
} from "react-router-dom";

function App() {
  return (
    <>
      <Router>
        <Routes>
          <Route path="/" element={<Login />} />
          <Route path="/signup" element={<SignUp />} />
          <Route path="/cars" element={<CarListComponent />} />
          <Route path="/usersdata" element={<UserDataTable />} />
          <Route path="/addcar" element={<CarInfoForm />} />
          <Route path="/usercars" element={<CarList />} />
          <Route path="/userbookings" element={<CarCard />} />
          <Route path="/userbooked" element={<ThankYou />} />
          <Route path="/bookings" element={<Userbooking />} />
          <Route path="/adminbookings" element={<Adminbooking/>}/>
          
        </Routes>
      </Router>
    </>
  );
}

export default App;
