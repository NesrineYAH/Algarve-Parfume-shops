import { Navigate } from "react-router-dom";
import React from "react";
import { Link, useNavigate } from "react-router-dom";

const ProtectrdRoute = ({ user, children }) => {
    const navigate = useNavigate();
  useEffect(() => {
  if (!user && !loadingUser) {
    navigate("/Home");
  }
}, [user, loadingUser]);

  return children;
};
export default ProtectrdRoute;