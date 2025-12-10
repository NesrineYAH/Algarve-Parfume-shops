import React from 'react';
import i18n from 'i18next';
import './Language.scss';
import "../../i18n";

function LanguageSwitcher() {
  const changeLanguage = (lng) => {
    i18n.changeLanguage(lng);
      localStorage.setItem("i18nextLng", lng); // sauvegarde
  };

  return (
    <label  className="languageSwitcher">
        <select> 
      <option  onClick={() => changeLanguage('fr')}>🇫🇷 Fr</option>
      <option  onClick={() => changeLanguage('en')}>🇬🇧 En </option>
      <option  onClick={() => changeLanguage('es')}>🇪🇸 Es</option>
      <option  onClick={() => changeLanguage('pt')}>🇵🇹 Pt</option>
    </select>  
    </label >
  );
}

export default LanguageSwitcher;
