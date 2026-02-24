import React from "react";
import i18n from "i18next";
import "./Language.scss";
import "../../i18n";

function LanguageSwitcher() {
  const changeLanguage = (e) => {
    const lng = e.target.value;
    i18n.changeLanguage(lng);
    localStorage.setItem("i18nextLng", lng);
  };

  return (
    <label className="languageSwitcher">
      <select value={i18n.language} onChange={changeLanguage}>
        <option value="fr">🇫🇷 Fr</option>
        <option value="en">🇬🇧 En</option>
        <option value="es">🇪🇸 Es</option>
        <option value="pt">🇵🇹 Pt</option>
      </select>
    </label>
  );
}

export default LanguageSwitcher;
