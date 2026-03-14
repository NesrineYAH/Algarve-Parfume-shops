import React from "react";
import "./Language.scss";
import "../../i18n";
import Select from "react-select";
import { useTranslation } from "react-i18next";

import fr from "../../assets/images/flagsFr.jpg";
import en from "../../assets/images/flagsEn.jpg";
import es from "../../assets/images/flagsEs.jpg";
import pt from "../../assets/images/flagsPt.jpg";

function LanguageSwitcher() {
  const { i18n } = useTranslation();

  const options = [
    {
      value: "fr",
      label: (
        <span className="langOption">
          <img src={fr} alt="Français" />
          Fr
        </span>
      )
    },
    {
      value: "en",
      label: (
        <span className="langOption">
          <img src={en} alt="English" />
          En
        </span>
      )
    },
    {
      value: "es",
      label: (
        <span className="langOption">
          <img src={es} alt="Español" />
          Es
        </span>
      )
    },
    {
      value: "pt",
      label: (
        <span className="langOption">
          <img src={pt} alt="Português" />
          Pt
        </span>
      )
    }
  ];

  const changeLanguage = (selectedOption) => {
    const lng = selectedOption.value;
    i18n.changeLanguage(lng);
  };

  const currentLanguage =
    options.find((opt) => opt.value === i18n.language.substring(0, 2)) ||
    options[0];

  return (
    <div className="languageSwitcher">
      <Select
        value={currentLanguage}
        options={options}
        onChange={changeLanguage}
        isSearchable={false}
      />
    </div>
  );
}

export default LanguageSwitcher;