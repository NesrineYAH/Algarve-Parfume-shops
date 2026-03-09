import React, { useState, useEffect } from "react";
import Cookies from "js-cookie";
import { Link } from "react-router-dom";
import "./CookieModel.scss";
import PolitiqueCookies from "../../pages/PolitiqueCookies/PolitiqueCookies";
import Confientilaite from "../../pages/FAQ/FAQ";
import { useTranslation } from "react-i18next";

const CookieModel = () => {
  const { t } = useTranslation();
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
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

      <h1>{t("CookieModel.title")}</h1>

      <div className="cookieBlock__div">
        <p>{t("CookieModel.cookieBlockI")}   </p>
          <p>{t("CookieModel.cookieBlockII")}   </p>
          <br/> 

        <Link to="/PolitiqueCookies" rel="noopener noreferrer">
       {t("CookieModel.cookieLinkI")}
        </Link>
    
              <br />
        <Link to="/Confientilaite" rel="noopener noreferrer">
          {t("CookieModel.cookieLinkII")}
        </Link>
        

      </div>

      <div className="cookieBlock__Bouttons">
        <button className="cookieBlock__button accept" onClick={handleAccept}>
        {t("CookieModel.cookieAcceptBoutton")}
        </button>
        <button className="cookieBlock__button reject" onClick={handleReject}>
          {t("CookieModel.cookieRefuseBoutton")}
        </button>
      </div>
    </div>
  );
};

export default CookieModel;
