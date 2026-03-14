// Frontend/helpers/AdminRoute.jsx
import { Navigate, Outlet } from "react-router-dom";
import { useContext } from "react";
import { UserContext } from "../context/UserContext";

const AdminRoute = () => {
  const { user, loadingUser } = useContext(UserContext);

  if (loadingUser) return <p>Chargement...</p>;

  if (!user) {
    return <Navigate to="/Authentification" replace />;
  }

  if (user.role !== "admin" && user.role !== "vendeur") {
    return <Navigate to="/Home" replace />;
  }

  return <Outlet />;
};

export default AdminRoute;

