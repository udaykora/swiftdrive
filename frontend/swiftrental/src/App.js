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
import ProtectedRoute from "./protectedroute";
import ProtectedRouteAdmin from "./protectedadmin";
import EmailVerify from "./emailverify/emailverify";
import ForgotPassword from "./forgotpassword/forgotpassword";
import ForgotPasswordUI from "./resetpassword/resetpassword";
import TokenRouteAdmin from "./protectedtokenroute";

// import UserDataTable from "./usersdata/usersdata";

import {
  BrowserRouter as Router,
  Route,
  Routes,
  Link,
  Switch,
  Outlet
} from "react-router-dom";

function App() {
  return (
    <>
      <Router>
        <Routes>
         
          <Route path="/" element={<Login />} />
          <Route path="/signup" element={<SignUp />} />
          {/* <Route path="/cars" element={<CarListComponent />} /> */}
          {/* <Route path="/usersdata" element={<UserDataTable />} /> */}
          {/* <Route path="/addcar" element={<CarInfoForm />} /> */}

          {/* <Route path="/usercars" element={<CarList />} /> */}
          {/* <Route path="/userbookings" element={<CarCard />} /> */}
          {/* <Route path="/userbooked" element={<ThankYou />} /> */}
          {/* <Route path="/bookings" element={<Userbooking />} /> */}
          {/* <Route path="/adminbookings" element={<Adminbooking/>}/> */}


          <Route element={<ProtectedRouteAdmin />}>
          <Route path="/adminbookings" element={<Adminbooking/>}>
          </Route>
        </Route>



        <Route element={<ProtectedRouteAdmin />}>
          <Route path="/addcar" element={<CarInfoForm/>}>
          </Route>
        </Route>


        <Route element={<ProtectedRouteAdmin />}>
          <Route path="/cars" element={<CarListComponent/>}>
          </Route>
        </Route>


        <Route element={<ProtectedRouteAdmin />}>
          <Route path="/usersdata" element={<UserDataTable/>}>
          </Route>
        </Route>




          <Route element={<ProtectedRoute />}>
          <Route path="/usercars" element={<CarList/>}>
          </Route>
        </Route>



        <Route element={<ProtectedRoute />}>
          <Route path="/bookings" element={<Userbooking/>}>
          </Route>
        </Route>


        <Route element={<ProtectedRoute />}>
          <Route path="/userbookings" element={<CarCard/>}>
          </Route>
        </Route>


        <Route element={<ProtectedRoute />}>
          <Route path="/userbooked" element={<ThankYou/>}>
          </Route>
        </Route>

        
          <Route path="/emailverify" element={<EmailVerify/>}>
          </Route>
       <Route path="/forgotpasslink" element={<ForgotPassword/>}></Route>
       <Route element={<TokenRouteAdmin />}>

       <Route path="/forgotpasswordui" element={<ForgotPasswordUI/>}></Route>
       </Route>



          
        </Routes>
      </Router>
    </>
  );
}

export default App;
