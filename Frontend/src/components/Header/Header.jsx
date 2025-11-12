import React from "react";
import Logo from "../../assets/logo/Logo-Parfumerie Algrave.JPG";
import { User, ShoppingCart, Heart, Home, Bell } from "lucide-react";
import { Link } from "react-router-dom";
import "./Header.scss";
import Favorites from "../../pages/Favorites/Favorites";
import Product from "../../pages/Product/Product"

const Header = () => {
  return (
    <header className="flex items-center justify-between p-4 bg-white shadow-md">
      {/* Logo */}
      <div className="flex items-center gap-4">
        <img
          src={Logo}
          className="logo"
          alt="Logo Parfume Algarve"
        />
      </div>

      {/* Menu Navigation */}
      <ul className="flex gap-6 font-medium text-gray-700">
        <li className="cursor-pointer hover:text-pink-500">CALENDRIERS DE L&apos;AVENT</li>
        <li className="cursor-pointer hover:text-pink-500">
          <Link to="/Home">Accueil</Link>
        </li>
        <li className="cursor-pointer hover:text-pink-500">
                <Link to="/Product"></Link>
          Parfum</li>
            
        <li className="cursor-pointer hover:text-pink-500">Maquillage</li>
        <li className="cursor-pointer hover:text-pink-500">Soin visage</li>
        <li className="cursor-pointer hover:text-pink-500">Cheveux</li>

      </ul>

      {/* Icônes */}
      <div className="flex items-center gap-4 icons">
        <Home className="w-6 h-6 cursor-pointer hover:text-pink-500 icone" />
        <Link to="Favorites">
        <Heart className="icone" />
        </Link>
        <ShoppingCart className="w-6 h-6 cursor-pointer hover:text-pink-500 icone" />
        
        {/* Lien vers Auth */}
        <Link to="register">
          <User className="icone" />
        </Link>
         <Link to="/login">Connexion</Link>
      <Link to="/register">Inscription</Link>
        
        <Bell className="w-6 h-6 cursor-pointer hover:text-pink-500 icone" />
      </div>
    </header>
  );
};

export default Header;
