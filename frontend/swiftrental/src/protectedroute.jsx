
import React from "react";
import { Navigate, Outlet } from "react-router-dom";

const ProtectedRoute = () => {
    const storedDatap = localStorage.getItem('userdatas');
    console.log(storedDatap)

  if (!storedDatap) {
    return <Navigate to="/" />;
  }

  return <Outlet />;
};

export default ProtectedRoute;
