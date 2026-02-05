import { Navigate } from "react-router-dom";
import { useContext } from "react";
import { UserContext } from "../context/UserContext";

const AdminRoute = ({ children }) => {
  const { user, loading } = useContext(UserContext);

  if (loading) return <p>Chargement...</p>;
  if (!user) return <Navigate to="/login" />;
  
  if (!user || (user.role !== "admin" && user.role !== "vendeur")) {
    return <Navigate to="/Home" replace />;
  }

  return children;
};

export default AdminRoute;
