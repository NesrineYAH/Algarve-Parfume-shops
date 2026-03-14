import React, { useState, useRef, useEffect } from "react";
import { useTranslation } from "react-i18next";
import "./Language.scss";
import "../../i18n";
import fr from "../../assets/images/flagsFr.jpg";
import en from "../../assets/images/flagsEn.jpg";
import es from "../../assets/images/flagsEs.jpg";
import pt from "../../assets/images/flagsPt.jpg";

const languages = [
  { value: "pt", label: "PT", flag: pt },
  { value: "en", label: "EN", flag: en },
  { value: "es", label: "ES", flag: es },
  { value: "fr", label: "FR", flag: fr },

];

export default function LanguageSwitcher() {
  const { i18n } = useTranslation();
  const [open, setOpen] = useState(false);

  const current =
    languages.find((l) => l.value === i18n.language.substring(0, 2)) ||
    languages[0];

  const ref = useRef();

  // Fermer si clic en dehors
  useEffect(() => {
    const handleClick = (e) => {
      if (ref.current && !ref.current.contains(e.target)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);

  const changeLanguage = (lng) => {
    i18n.changeLanguage(lng);
    setOpen(false);
  };

  return (
    <div className="langContainer" ref={ref}>
      <button className="langButton" onClick={() => setOpen(!open)}>
        <img src={current.flag} alt={current.label} />
        <span>{current.label}</span>
        <span className={`chevron ${open ? "open" : ""}`}>▼</span>
      </button>

      {open && (
        <div className="langDropdown">
          {languages.map((lang) => (
            <div
              key={lang.value}
              className="langOption"
              onClick={() => changeLanguage(lang.value)}
            >
              <img src={lang.flag} alt={lang.label} />
              <span>{lang.label}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}



















