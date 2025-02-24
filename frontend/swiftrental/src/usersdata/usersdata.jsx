import React, { useEffect, useState } from "react";
import "./usersdata.css";
import { useNavigate } from "react-router-dom";

const UsersDataComponent = () => {
  const navigate = useNavigate();
  let [users, setusers] = useState([]);
  let [status1, setstatus1] = useState(0);

  const handleClose = () => {
    navigate("/cars");
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response7 = await fetch(`https://swiftdrive.onrender.com/userdata`);
        if (!response7.ok) {
          throw new Error("Failed to fetch data");
        }
        const data7 = await response7.json();
        console.log(data7);
        setusers(data7.message);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };
    fetchData();
  }, [status1]);

  const removeuser = (user) => {
    const deletedata = async () => {
      let response2 = await fetch("https://swiftdrive.onrender.com/updateuserstatus", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          updateuserstatus: user
        }),
      });

      let datauser = await response2.json();
      console.log(datauser);
      if (datauser.message) {
        console.log(datauser.message);
        setstatus1(status1 + 1);
      }
    };
    deletedata();
  };

  return (
    <div className="users-data-container1">
      <button className="close-btns-add" onClick={handleClose}>
        Back
      </button>

      <h2>User Data</h2>
      
      <div className="users-data-table-container">
        <table className="users-data-table">
          <thead>
            <tr>
              <th>ID</th>
              <th>Email</th>
              <th>Full Name</th>
              <th>Phone Number</th>
              <th>Address</th>
              <th>Password</th>
              <th>Manage Access</th>
            </tr>
          </thead>
          <tbody>
            {users.map((user) => (
              <tr key={user.id}>
                <td>{user.id}</td>
                <td>{user.email}</td>
                <td>{user.fullname}</td>
                <td>{user.phonenumber}</td>
                <td>{user.address}</td>
                <td>{user.password}</td>
                <td>
                  <button
                    style={{
                      backgroundColor: user.status === "active" ? "red" : "green",
                    }}
                    className="buttonremove"
                    onClick={() => removeuser(user)}
                  >
                    {user.status === "active" ? "Deactivate" : "Activate"}
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default UsersDataComponent;
