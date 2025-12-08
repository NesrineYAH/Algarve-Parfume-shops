import React from "react";
import Logo from "../../assets/logo/Logo-Parfumerie Algrave.JPG";
import { User, ShoppingCart, Heart, Home, Bell } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import "./Header.scss";

const Header = () => {
  const navigate = useNavigate();
  const token = localStorage.getItem("token");

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

      {/* Icônes */}
      <div className="icons">
        <Home className="icone" />
        <Link to="/Favorites">
          <Heart className="icone" />
        </Link>
        <ShoppingCart className="icone" />

        {/* Icône User avec redirection selon connexion */}
        <User
          className="icone"
          onClick={() => navigate(token ? "/profil" : "/Authentification")}
          style={{ cursor: "pointer" }}
        />

        <Bell className="icone" />
      </div>
    </header>
  );
       
};

export default Header;
