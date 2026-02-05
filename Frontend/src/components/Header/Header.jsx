//header.jsx
import React, { useState, useContext  } from "react";
import Logo from "../../assets/logo/Logo-Parfumerie Algrave.JPG";
import { User, ShoppingCart, Heart, Home, Bell, LogOut, X } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import "./Header.scss";
import LanguageSwitcher from "../Language/Language";
import { useTranslation } from "react-i18next";
import { useTypewriter, Cursor } from "react-simple-typewriter";
import { UserContext } from "../../context/UserContext";


// ✅ Déclarer TypingAnimation en dehors de Header
const TypingAnimation = () => {
  const [isVisible, setIsVisible] = useState(false);
  const [text] = useTypewriter({
    words: ["parfum", "Luxe", "inspiration"],
    loop: 0,
    typeSpeed: 120,
    deleteSpeed: 80,
  });

  return (
    <>
      <span className="Loisir__text">{text}</span>
      <Cursor cursorColor="red" />
    </>
  );
};

const Header = () => {
  const { t } = useTranslation();
  const Lang = localStorage.getItem("i18nextLng") || "fr";
  const navigate = useNavigate();

  const [bannerVisible, setBannerVisible] = useState(true);
  const [dropdownVisible, setDropdownVisible] = useState(false);

  // 🔥 Le user vient UNIQUEMENT du UserContext
  const { user, handleLogout } = useContext(UserContext);

  // 🔔 Notifications (tu les gardes)
  const [notifications, setNotifications] = useState([]);
  const unreadCount = notifications.filter((n) => !n.isRead).length;

  return (
    <header className="header">
      {/* Bannière */}
      {bannerVisible && (
        <section className="header__Banner">
          <p>
            Nouvelle offre : Livraison à domicile offerte dès 25 euros.{" "}
            <TypingAnimation />
          </p>
          <button
            className="banner-close"
            onClick={() => setBannerVisible(false)}
          >
            <X size={20} />
          </button>
        </section>
      )}

      <section className="header__section">
        {/* Logo */}
        <div className="logo-container">
          <img src={Logo} className="logo" alt="Logo Parfume Algarve" />
        </div>

        {/* Menu */}
        <div className="menu">
          <ul>
            <li>
              <Link to="/Home">{t("header.titleI")}</Link>
            </li>
            <li>
              <Link to="/home?genre=femme">{t("header.titleII")}</Link>
            </li>
            <li>
              <Link to="/home?genre=homme">{t("header.titleIII")}</Link>
            </li>
            <li>{t("header.titleVI")}</li>
            <li>
              <Link to="/QrCodePage">Notre App</Link>
            </li>
          </ul>
        </div>

        <h1>MyPerfume</h1>

        {/* Icônes */}
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

          {/* 🔔 Notifications */}
          <Link to="/notifications" className="notification-icon">
            <Bell className="icone" />
            {unreadCount > 0 && <span className="badge">{unreadCount}</span>}
          </Link>

          {/* 👤 User */}
          {user ? (
            <div
              className="user-dropdown"
              onMouseEnter={() => setDropdownVisible(true)}
              onMouseLeave={() => setDropdownVisible(false)}
            >
              <User
                className="icone"
                onClick={() => setDropdownVisible(!dropdownVisible)}
              />

              <span className="user-name">Bonjour {user.prenom}</span>

            {dropdownVisible && (
  <div className="dropdown-menu">

    <button
      onClick={() => {
        if (user.role === "admin" || user.role === "vendeur") {
          navigate("/admin-dashboard");
        } else {
          navigate("/MonCompte");
        }
      }}
      className="dropdown-btn"
    >
      {t("user.account")}
    </button>

    <Link to="/Orders">{t("user.orders")}</Link>
    <Link to="/history">{t("user.history")}</Link>

{/*navigate("/Home"); */}

    <button onClick={() => { handleLogout();  }}>
      <LogOut size={16} /> {t("user.logout")}
    </button>
  </div>
)}

            </div>
          ) : (
            <div className="user-dropdown">
              <User
                className="icone"
                style={{ cursor: "pointer" }}
                onClick={() => navigate("/Authentification")}
              />
              <span className="user-name">Mon compte</span>
            </div>
          )}
        </div>

        <LanguageSwitcher />
      </section>
    </header>
  );
};

export default Header;


