import React from "react";
import Logo from "../../assets/logo/Logo-Parfumerie Algrave.JPG";
import { User, ShoppingCart, Heart, Home, Bell } from "lucide-react";
import { Link } from "react-router-dom";
import "./Header.scss";
import { useNavigate } from "react-router-dom";

const Header = () => {

  function UserIcon() {
    
  const navigate = useNavigate();
  const token = localStorage.getItem("token");

 

}

  return (
    <header>
      {/* Logo */}
      <div className="logo-container">
        <img
          src={Logo}
          className="logo"
          alt="Logo Parfume Algarve"
        />
      </div>

      <ul >
        <li >CALENDRIERS DE L&apos;AVENT</li>
        <li >
          <Link to="/Home">Accueil</Link>
        </li>
        <Link to="/Product">
        <li >Parfum</li></Link>
            
        
        <li className="">Soin visage</li>
        <li className="">Cheveux</li>

      </ul>

      {/* Icônes */}
      <div className="icons">
        <Home className="icone" />
        <Link to="Favorites">
        <Heart className="icone" />
        </Link>
        <ShoppingCart className="icone" />
        
        <Link to="./Authentification/Authentification.jsx">
          <User className="icone" onClick={() => navigate(token ? "/profil" : "/auth")} />
        </Link>
        <Bell className="icone" />
      </div>
    </header>
  );
};

export default Header;
