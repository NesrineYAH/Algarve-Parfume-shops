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
  const token = localStorage.getItem("token");
  const [bannerVisible, setBannerVisible] = useState(true); 
  const [dropdownVisible, setDropdownVisible] = useState(false);
  const prenom = localStorage.getItem("prenom");
  const { user, handleLogout } = useContext(UserContext);
    const [notifications, setNotifications] = useState([]);
  const unreadCount = notifications.filter(n => !n.isRead).length;
/* 18/12/2025
  const handleLogout = () => {
    localStorage.clear();
    localStorage.removeItem("cart");
    localStorage.removeItem("favorites");
    localStorage.removeItem("token");
    navigate("/Authentification");
  };
   */ 


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
            <Link to="/products?genre=femme">{t("header.titleII")}</Link>
          </li>
          <li>
            <Link to="/products?genre=homme">{t("header.titleIII")}</Link>
          </li>
          <li>{t("header.titleVI")}</li>
        </ul>
      </div>
      <h1>MyPerfume </h1>
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
          {unreadCount > 0 && (
          <span className="badge">{unreadCount}</span>
        )}
     </Link>
       
        {user  ? (
          <div
            className="user-dropdown"
            onMouseEnter={() => setDropdownVisible(true)}
            onMouseLeave={() => setDropdownVisible(false)}
          >
            <User
              className="icone"
              onClick={() => setDropdownVisible(!dropdownVisible)}
            />
            {/* {prenom ? `${t("user.greeting")} ${prenom}` : t("user.account")} */}
            {`Bonjour ${user.prenom}`}
            {dropdownVisible && (
              <div className="dropdown-menu">
                <Link to="/MonCompte">{t("user.account")}</Link>
                <Link to="/Orders">{t("user.orders")}</Link>
                <Link to="/history">{t("user.history")}</Link>
                <button onClick={handleLogout}>
                  <LogOut size={16} /> {t("user.logout")} 
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
      </section>
    </header>

  );
};

export default Header;


//18/12/2025

      {/*}
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
            {prenom ? `${t("user.greeting")} ${prenom}` : t("user.account")}
            {dropdownVisible && (
              <div className="dropdown-menu">
                <Link to="/MonCompte">{t("user.account")}</Link>
                <Link to="/Orders">{t("user.orders")}</Link>
                <Link to="/history">{t("user.history")}</Link>
                <button onClick={handleLogout}>
                  <LogOut size={16} /> {t("user.logout")}
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
        */}





/*

            {prenom ? `${t('user.greeting')} ${prenom}` : t('user.account')}
...
<Link to="/MonCompte">{t('user.account')}</Link>
<Link to="/Orders">{t('user.orders')}</Link>
<Link to="/history">{t('user.history')}</Link>
<button onClick={handleLogout}>
  <LogOut size={16} /> {t('user.logout')}
</button>
*/

