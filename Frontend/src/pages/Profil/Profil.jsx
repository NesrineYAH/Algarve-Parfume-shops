import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "./Profil.scss";

export default function Profil() {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);

  useEffect(() => {
    // Check if user is logged in
    const token = localStorage.getItem("token");
    if (!token) {
      navigate("/auth");
      return;
    }

    // Fetch user info from localStorage or API
    const storedUser = {
      name: localStorage.getItem("name") || "John Doe",
      email: localStorage.getItem("email") || "johndoe@example.com",
      role: localStorage.getItem("role") || "client",
    };
    setUser(storedUser);
  }, [navigate]);

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("role");
    localStorage.removeItem("name");
    localStorage.removeItem("email");
    navigate("/auth");
  };

  if (!user) return null;

  return (
    <div className="profil-container">
      <h1>Welcome, {user.name}!</h1>
      <div className="user-info">
        <p><strong>Name:</strong> {user.name}</p>
        <p><strong>Email:</strong> {user.email}</p>
        <p><strong>Role:</strong> {user.role}</p>
      </div>

      <div className="profil-actions">
        <button onClick={() => navigate("/orders")}>My Orders</button>
        <button onClick={() => navigate("/history")}>Purchase History</button>
        <button onClick={handleLogout}>Logout</button>
      </div>
    </div>
  );
}
