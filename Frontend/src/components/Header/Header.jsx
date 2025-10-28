import React from "react";
import Logo from "../../assets/logo/Logo-Parfumerie Algrave.JPG";
import { User, ShoppingCart, Heart, Home, Bell } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Link } from "react-router-dom";
import "./Header.scss";


const Header = () => {
    const navigate = useNavigate();

    const handleClick = () => {
    navigate("/Auth");
  };

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
        <li className="cursor-pointer hover:text-pink-500">
          CALENDRIERS DE L&apos;AVENT
        </li>
          <a href="/Home"><li className="cursor-pointer hover:text-pink-500">Acceuil
       </li>
          </a>
        <li className="cursor-pointer hover:text-pink-500">Parfum</li>
        <li className="cursor-pointer hover:text-pink-500">Maquillage</li>
        <li className="cursor-pointer hover:text-pink-500">Soin visage</li>
        <li className="cursor-pointer hover:text-pink-500">Soin corps</li>
        <li className="cursor-pointer hover:text-pink-500">Cheveux</li>
        <li className="cursor-pointer hover:text-pink-500">COLLECTION Noël</li>
      </ul>

      {/* Icônes */}
      <div className="flex items-center gap-4 icons">
        <Home className="w-6 h-6 cursor-pointer hover:text-pink-500 icone" />
        <Heart className="w-6 h-6 cursor-pointer hover:text-pink-500 icone" />
        <ShoppingCart className="w-6 h-6 cursor-pointer hover:text-pink-500 icone" />
        <Link to="Auth" >
        <User  onClick={handleClick}  className="icone" />
        </Link>
        
        <Bell className="w-6 h-6 cursor-pointer hover:text-pink-500 icone" />
      </div>
    </header>
  );
};

export default Header;