import React from "react";
import { Navigate } from "react-router-dom";

const PublicRoute = ({ element }) => {
  const isLoggedIn = localStorage.getItem("isLoggedIn");
  console.log("isLoggedIn", isLoggedIn);

  return isLoggedIn ? <Navigate to="/home" /> : element;
};

export default PublicRoute;
