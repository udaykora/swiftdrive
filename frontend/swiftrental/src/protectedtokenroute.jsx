import React, { useEffect, useState } from "react";
import { Navigate, Outlet, useLocation } from "react-router-dom";

const TokenRouteAdmin = () => {
  const location = useLocation();
  const [isValid, setIsValid] = useState(null); // null = loading, true = valid, false = invalid

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
          body: JSON.stringify({ token }), // send as object
        });

        const data = await response.json();
        setIsValid(data.status); // backend should return {status: true/false}
      } catch (error) {
        console.error("Error verifying token:", error);
        setIsValid(false);
      }
    };

    verifyToken();
  }, [location.search]);

  // While loading
  if (isValid === null) {
    return <p>Checking token...</p>;
  }

  // If invalid → go home
  if (isValid === false) {
    return <Navigate to="/" replace />;
  }

  // If valid → show protected route
  return <Outlet />;
};

export default TokenRouteAdmin;
