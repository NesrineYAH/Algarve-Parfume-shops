
import React, { useState, useContext } from "react";
import Logo from "../../assets/logo/Logo-Parfumerie Algrave.JPG";
import {
  User,
  ShoppingCart,
  Heart,
  Home,
  Bell,
  LogOut,
  X,
  Menu,
} from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import "./Header.scss";
import LanguageSwitcher from "../Language/Language";
import { useTranslation } from "react-i18next";
import { useTypewriter, Cursor } from "react-simple-typewriter";
import { UserContext } from "../../context/UserContext";

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

const Header = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { user, handleLogout } = useContext(UserContext);

  const [bannerVisible, setBannerVisible] = useState(true);
  const [dropdownVisible, setDropdownVisible] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [notifications] = useState([]);
  const unreadCount = notifications.filter((n) => !n.isRead).length;

  return (
    <header className="header">
      {bannerVisible && (
        <section className="header__Banner">
          <p>
            Nouvelle offre : Livraison offerte dès 25€ <TypingAnimation />
          </p>
          <button onClick={() => setBannerVisible(false)}>
            <X size={18} />
          </button>
        </section>
      )}

      <section className="header__section">
        {/* Burger mobile */}
        <button
          className="burger"
          onClick={() => setIsMenuOpen(true)}
        >
          <Menu size={26} />
        </button>

        {/* Logo */}
        <div className="logo-container">
          <img src={Logo} alt="Logo" />
        </div>

        <h1 className="title">MyPerfume</h1>

        {/* Icons */}
        <div className="icons">
          <Link to="/Favorites"><Heart /></Link>
          <Link to="/Cart"><ShoppingCart /></Link>

          <Link to="/notifications" className="notification-icon">
            <Bell />
            {unreadCount > 0 && <span className="badge">{unreadCount}</span>}
          </Link>

          {user ? (
            <div
              className="user-dropdown"
              onMouseEnter={() => setDropdownVisible(true)}
              onMouseLeave={() => setDropdownVisible(false)}
            >
              <User />
              {dropdownVisible && (
                <div className="dropdown-menu">
                  <button onClick={() => navigate("/MonCompte")}>
                    {t("user.account")}
                  </button>
                  <button onClick={handleLogout}>
                    <LogOut size={14} /> {t("user.logout")}
                  </button>
                </div>
              )}
            </div>
          ) : (
            <User onClick={() => navigate("/Authentification")} />
          )}
        </div>

        <LanguageSwitcher />
      </section>

      {/* MENU RIDEAU MOBILE */}
      {isMenuOpen && (
        <nav className="mobile-menu">
          <button
            className="close"
            onClick={() => setIsMenuOpen(false)}
          >
            <X size={28} />
          </button>

          <ul>
            <li><Link to="/Home">Accueil</Link></li>
            <li><Link to="/home?genre=femme">Femme</Link></li>
            <li><Link to="/home?genre=homme">Homme</Link></li>
            <li><Link to="/QrCodePage">Notre App</Link></li>
          </ul>
        </nav>
      )}
    </header>
  );
};

export default Header;



