import React from "react";
import { Navigate, Outlet } from "react-router-dom";

const ProtectedRouteAdmin = () => {
  let storedDatap = localStorage.getItem("admindata");

  storedDatap = JSON.parse(storedDatap);

  if (!storedDatap) {
    window.history.back();
  }

  if (storedDatap.email === "udaykora777@gmail.com") {
    return <Outlet />;
  }
};

export default ProtectedRouteAdmin;
