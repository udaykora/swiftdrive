import React, { useEffect, useState } from "react";
import { Navigate, Outlet, useLocation } from "react-router-dom";

const TokenRouteAdmin = () => {
  const location = useLocation();
  const [isValid, setIsValid] = useState(null);
  useEffect(() => {
    const verifyToken = async () => {
      try {
        const queryParams = new URLSearchParams(location.search);
        const token = queryParams.get("token");

        if (!token) {
          setIsValid(false);
          return;
        }

        const response = await fetch("https://swiftdrive.onrender.com/tokenverify", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ token }), 
        });

        const data = await response.json();
        setIsValid(data.status); 
      } catch (error) {
        console.error("Error verifying token:", error);
        setIsValid(false);
      }
    };

    verifyToken();
  }, [location.search]);

  
  if (isValid === null) {
    return <p>Checking token...</p>;
  }

 
  if (isValid === false) {
    return <Navigate to="/" replace />;
  }

 
  return <Outlet />;
};

export default TokenRouteAdmin;
