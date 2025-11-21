import React, { useState, useEffect } from "react";
import Cookies from "js-cookie";
import { Link } from "react-router-dom";
import "./CookieModel.scss";
import PolitiqueCookies from "../../pages/PolitiqueCookies/PolitiqueCookies";
import Confientilaite from "../../pages/CONFI/FAQ";

const CookieModel = () => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    // Vérifie si le cookie existe déjà
    const consent = Cookies.get("cookiesAccepted");
    if (!consent) {
      setIsVisible(true);
    }
  }, []);

  const handleAccept = () => {
    Cookies.set("cookiesAccepted", "true", { expires: 365, path: "/" });
    console.log("✅ Cookies acceptés");
    setIsVisible(false);
  };

  const handleReject = () => {
    Cookies.set("cookiesAccepted", "false", { expires: 365, path: "/" });
    console.log("❌ Cookies refusés");
    setIsVisible(false);
  };

  const handleClose = () => {
    setIsVisible(false);
  };

  if (!isVisible) return null;

  return (
    <div className="cookieBlock">
      <button className="cookieBlock__close" onClick={handleClose}>
        ✕
      </button>

      <h1>MyPerfume respecte votre vie privée</h1>

      <div className="cookieBlock__div">
        <p>
          Nous utilisons des cookies pour améliorer votre expérience. En
          poursuivant votre navigation, vous acceptez notre utilisation des
          cookies.
        </p>
        <p>
          Données de géolocalisation, mesure d’audience, contenu personnalisé et
          développement de services.
        </p>

        <Link to="/PolitiqueCookies" rel="noopener noreferrer">
          Politique de Cookies
        </Link>
        <br />
        <Link to="/Confientilaite" rel="noopener noreferrer">
          Coofidntialités
        </Link>
      </div>

      <div className="cookieBlock__Bouttons">
        <button className="cookieBlock__button accept" onClick={handleAccept}>
          Accepter
        </button>
        <button className="cookieBlock__button reject" onClick={handleReject}>
          Refuser
        </button>
      </div>
    </div>
  );
};

export default CookieModel;
