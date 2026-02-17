// Header.jsx
import React, { useState, useContext, useEffect } from "react";
import Logo from "../../assets/logo/Logo-Parfumerie Algrave.JPG";
import {
  User,
  ShoppingCart,
  Heart,
  Home,
  Bell,
  LogOut,
  X,
  Menu
} from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import "./Header.scss";
import LanguageSwitcher from "../Language/Language";
import { useTranslation } from "react-i18next";
import { useTypewriter, Cursor } from "react-simple-typewriter";
import { UserContext } from "../../context/UserContext";

/* -------------------- Typing Animation -------------------- */
const TypingAnimation = () => {
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

/* -------------------- Header -------------------- */
const Header = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { user, handleLogout } = useContext(UserContext);
  const [bannerVisible, setBannerVisible] = useState(true);
  const [dropdownVisible, setDropdownVisible] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const [notifications] = useState([]);
  const unreadCount = notifications.filter(n => !n.isRead).length;

  /* -------- Mobile detection -------- */
  const [isMobile, setIsMobile] = useState(
    window.matchMedia("(max-width: 768px)").matches
  );

  useEffect(() => {
    const mediaQuery = window.matchMedia("(max-width: 768px)");
    const handleResize = () => setIsMobile(mediaQuery.matches);

    mediaQuery.addEventListener("change", handleResize);
    return () => mediaQuery.removeEventListener("change", handleResize);
  }, []);

  /* -------- Lock scroll when menu open -------- */
  useEffect(() => {
    document.body.style.overflow = isMenuOpen ? "hidden" : "auto";
  }, [isMenuOpen]);

const handleToggleMenu = (e) => {
  e.preventDefault();
  setIsMenuOpen(prev => !prev);
};



  return (
    <header className="header">

      {/* ---------------- Banner ---------------- */}
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

      {/* ---------------- Header main ---------------- */}
      <section className="header__section">

        {/* Logo */}
        <div className="logo-container">
          <img src={Logo} className="logo" alt="Logo Parfumerie Algarve" />
        </div>

        {/* ---------------- Desktop Menu ---------------- */}
        {!isMobile && (
          <nav className="desktop-menu">
            <ul>
              <li><Link to="/Home">{t("header.titleI")}</Link></li>
              <li><Link to="/home?genre=femme">{t("header.titleII")}</Link></li>
              <li><Link to="/home?genre=homme">{t("header.titleIII")}</Link></li>
              <li>{t("header.titleVI")}</li>
              <li><Link to="/QrCodePage">Notre App</Link></li>
            </ul>
          </nav>
        )}

        {/* ---------------- Burger (Mobile) ---------------- */}
        {isMobile && (
          <button className="burger" onClick={() => setIsMenuOpen(true)}>
            <Menu size={20} />
          </button>
        )}




   

        {/* ---------------- Icons ---------------- */}
        <div className="icons">
          <Link to="/Home"><Home className="icone" /></Link>
          <Link to="/Favorites"><Heart className="icone" /></Link>
          <Link to="/Cart"><ShoppingCart className="icone" /></Link>

          <Link to="/notifications" className="notification-icon">
            <Bell className="icone" />
            {unreadCount > 0 && <span className="badge">{unreadCount}</span>}
          </Link>

          {user ? (
            <div
              className="user-dropdown"
              onMouseEnter={() => setDropdownVisible(true)}
              onMouseLeave={() => setDropdownVisible(false)}
            >
              <User className="icone" />
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
                  >
                    {t("user.account")}
                  </button>

                  <Link to="/Orders">{t("user.orders")}</Link>
                  <Link to="/commande">{t("user.history")}</Link>

                  <button onClick={handleLogout}>
                    <LogOut size={16} /> {t("user.logout")}
                  </button>
                </div>
              )}
            </div>
          ) : (
            <div className="user-dropdown">
              <User
                className="icone"
                onClick={() => navigate("/Authentification")}
              />
              <span className="user-name">Mon compte</span>
            </div>
          )}
        </div>

        <LanguageSwitcher />
      </section>

           <h1>MyPerfume</h1>

      {/* ---------------- Mobile Menu Rideau ---------------- */}
      {isMobile && (
        <div className={`mobile-menu ${isMenuOpen ? "open" : ""}`}>
   {/*  <button className="burger" onClick={handleToggleMenu}>
  <Menu size={20} />
</button>
*/}
<button className="close-btn" onClick={handleToggleMenu}>
  <X size={20} />
</button>

          <ul>
            <li><Link to="/Home" onClick={() => setIsMenuOpen(false)}>{t("header.titleI")}</Link></li>
            <li><Link to="/home?genre=femme" onClick={() => setIsMenuOpen(false)}>{t("header.titleII")}</Link></li>
            <li><Link to="/home?genre=homme" onClick={() => setIsMenuOpen(false)}>{t("header.titleIII")}</Link></li>
            <li>{t("header.titleVI")}</li>
            <li><Link to="/QrCodePage" onClick={() => setIsMenuOpen(false)}>Notre App</Link></li>
          </ul>
        </div>
      )}

    </header>
  );
};

export default Header;


















/*
import React, { useState, useContext, useEffect  } from "react";
import Logo from "../../assets/logo/Logo-Parfumerie Algrave.JPG";
import { User, ShoppingCart, Heart, Home, Bell, LogOut, X, Menu } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import "./Header.scss";
import LanguageSwitcher from "../Language/Language";
import { useTranslation } from "react-i18next";
import { useTypewriter, Cursor } from "react-simple-typewriter";
import { UserContext } from "../../context/UserContext";



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
  const { user, handleLogout } = useContext(UserContext);
  const [notifications, setNotifications] = useState([]);
  const unreadCount = notifications.filter((n) => !n.isRead).length;
  const [isMenuOpen, setIsMenuOpen] = useState(false);
const [isMobile, setIsMobile] = useState(window.matchMedia("(max-width: 768px)").matches);

React.useEffect(() => {
  const mediaQuery = window.matchMedia("(max-width: 768px)");

  const handleResize = () => {
    setIsMobile(mediaQuery.matches);
  };

  mediaQuery.addEventListener("change", handleResize);

  return () => mediaQuery.removeEventListener("change", handleResize);
}, []);



  return (
    <header className="header">

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

        <div className="logo-container">
          <img src={Logo} className="logo" alt="Logo Parfume Algarve" />
        </div>


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

      
          <Link to="/notifications" className="notification-icon">
            <Bell className="icone" />
            {unreadCount > 0 && <span className="badge">{unreadCount}</span>}
          </Link>

   
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
    <Link to="/commande">{t("user.history")}</Link>



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


{isMobile && (
  <button className="burger" onClick={() => setIsMenuOpen(true)}>
    <Menu size={26} />
  </button>
)}

{isMobile && (
  <div className={`mobile-menu ${isMenuOpen ? "open" : ""}`}>
    <button className="close-btn" onClick={() => setIsMenuOpen(false)}>
      <X size={26} />
    </button>

    <ul>
      <li><Link to="/Home" onClick={() => setIsMenuOpen(false)}>{t("header.titleI")}</Link></li>
      <li><Link to="/home?genre=femme" onClick={() => setIsMenuOpen(false)}>{t("header.titleII")}</Link></li>
      <li><Link to="/home?genre=homme" onClick={() => setIsMenuOpen(false)}>{t("header.titleIII")}</Link></li>
      <li>{t("header.titleVI")}</li>
      <li><Link to="/QrCodePage" onClick={() => setIsMenuOpen(false)}>Notre App</Link></li>
    </ul>
  </div>
)}


    </header>
  );
};

export default Header;
*/






















