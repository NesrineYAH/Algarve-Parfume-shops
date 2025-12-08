import React, { useState } from "react";
import Logo from "../../assets/logo/Logo-Parfumerie Algrave.JPG";
import { User, ShoppingCart, Heart, Home, Bell, LogOut } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import "./Header.scss";
 import LanguageSwitcher  from "../Language/Language";
import { useTranslation } from 'react-i18next';


const Header = () => {
  const { t } = useTranslation();
  const Lang = localStorage.getItem("i18nextLang");
  const navigate = useNavigate();
  const token = localStorage.getItem("token");
  const [dropdownVisible, setDropdownVisible] = useState(false);
  const prenom = localStorage.getItem("prenom");

  const handleLogout = () => {
    localStorage.clear();
    localStorage.removeItem("cart");
    localStorage.removeItem("favorites");
    localStorage.removeItem("token");
    navigate("/Authentification");
  };

  return (
    <header className="header">
      {/* Logo */}
      <div className="logo-container">
        <img src={Logo} className="logo" alt="Logo Parfume Algarve" />
      </div>

      {/* Menu */}
      <ul className="menu">
        <li>{t('header.titleI')}</li>
        <li>
          <Link to="/Home">{t("header.titleI")}</Link>
        </li>
        <li>
          <Link to="/Product">{t('header.titleIII')}</Link>
        </li>
        <li>{t('header.titlevI')}</li>
      </ul>

      {/* Icons */}
      <div className="icons">
        <Link to="/Home">
          <Home className="icone" />
        </Link>
        <Link to="/Favorites">
          <Heart className="icone" />
        </Link>
        <Link to="/Cart">
          <ShoppingCart className="icone" />
        </Link>

        <Bell className="icone" />

        {/* User Icon with dropdown */}
        {token ? (
          <div
            className="user-dropdown"
            onMouseEnter={() => setDropdownVisible(true)}
            onMouseLeave={() => setDropdownVisible(false)}
          >
            <User
              className="icone"
              onClick={() => setDropdownVisible(!dropdownVisible)}
            />
            {prenom ? `Bonjour ${prenom}` : "Mon compte"}
            {dropdownVisible && (
              <div className="dropdown-menu">
                <Link to="/MonCompte">Mon Compte</Link>
                <Link to="/Orders">Mes Commandes </Link>
                <Link to="/history">Historique d'achat </Link>
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
      <LanguageSwitcher />
    </header>
  );
};

export default Header;
