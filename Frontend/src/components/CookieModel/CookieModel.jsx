import React, { useState } from "react";
import Cookies from "js-cookies";
import './CookieModel.scss';

const CookieModel = ({ onAccept, onReject }) => {
  const [isVisible, setIsVisible] = useState(true);
  const handleAccept = () => {
    Cookies.set("cookiesAccepted", "true", { expires: 365, path: "/" });
    onAccept();  // Appelle la fonction pour cacher le bandeau
    setIsVisible(false)  // Cache le bandeau après acceptation
  };

  const handleReject = () => {
    Cookies.set("cookiesAccepted", "false", { expires: 365, path: "/" });
    onReject();  // Appelle la fonction pour cacher le bandeau
    setIsVisible(false);  // Cache le bandeau après refus
  };
  const handleClose = () => {
    setIsVisible(false);
  }
  if (!isVisible) return null;
  return (

    <div className="cookieBlock">
      <h1>MyPerfume respecte votre vie privée.</h1>
        <div className="cookieBlock__div">
      <p>
        Nous utilisons des cookies pour améliorer votre expérience. En
        poursuivant votre navigation, vous acceptez notre utilisation des
        cookies.  
      </p>
              <p>Données de géolocalisation précises et identification par analyse de l’appareil, Mesure d'audience, Publicités et contenu personnalisés, mesure de performance des publicités et du contenu, études d’audience et développement de services, Stocker et/ou accéder à des informations sur un appareil</p>

      <a href="" rel="noopener noreferrer">Politique de Cookies</a>

     </div>
      <div className="cookieBlock__Bouttons">
        <button className="cookieBlock__button" onClick={handleAccept}>Accepter</button>
        <button className="cookieBlock__button" onClick={handleReject}>Refuser</button>
 
      </div>
    </div>
  );
};

export default CookieModel;