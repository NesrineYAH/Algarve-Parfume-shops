import React, { useState } from "react";
import Logo from "../../assets/logo/Logo-Parfumerie Algrave.JPG";
import { User, ShoppingCart, Heart, Home, Bell, LogOut } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import "./Header.scss";

const Header = () => {
  const navigate = useNavigate();
  const token = localStorage.getItem("token");
  const [dropdownVisible, setDropdownVisible] = useState(false);

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("role");
    navigate("/auth");
  };

  return (
    <header className="header">
      {/* Logo */}
      <div className="logo-container">
        <img src={Logo} className="logo" alt="Logo Parfume Algarve" />
      </div>

      {/* Menu */}
      <ul className="menu">
        <li>CALENDRIERS DE L&apos;AVENT</li>
        <li>
          <Link to="/Home">Accueil</Link>
        </li>
        <li>
          <Link to="/Product">Parfum</Link>
        </li>
        <li>Soin visage</li>
        <li>Cheveux</li>
      </ul>

      {/* Icons */}
      <div className="icons">
        <Home className="icone" />
        <Link to="/Favorites">
          <Heart className="icone" />
        </Link>
        <ShoppingCart className="icone" />
        <Bell className="icone" />

        {/* User Icon with dropdown */}
        {token ? (
          <div
            className="user-dropdown"
            onMouseEnter={() => setDropdownVisible(true)}
            onMouseLeave={() => setDropdownVisible(false)}
          >
            <User className="icone" style={{ cursor: "pointer" }} />

            {dropdownVisible && (
              <div className="dropdown-menu">
                <Link to="/profil">Personal Information</Link>
                <Link to="/orders">User's Orders</Link>
                <Link to="/history">Purchase History</Link>
                <button onClick={handleLogout}>
                  <LogOut size={16} /> Logout
                </button>
              </div>
            )}
          </div>
        ) : (
          <User
            className="icone"
            style={{ cursor: "pointer" }}
            onClick={() => navigate("/Authentification")}
          />
        )}
      </div>
    </header>
  );
};

export default Header;
