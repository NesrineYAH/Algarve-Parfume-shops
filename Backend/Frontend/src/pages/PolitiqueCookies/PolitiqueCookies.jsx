import React, { useState } from 'react';
import './PolitiqueCookies.scss';
import { ChevronDown, ChevronUp } from "lucide-react";
import { useTranslation } from "react-i18next";

export default function PolitiqueCookies() {
  const { t } = useTranslation();

  // État des préférences
  const [preferences, setPreferences] = useState({
    pref: false,
    necessary: false,
    analytics: false,
    marketing: false,
    audience: false,
    develop: false,
  });

  const [message, setMessage] = useState("");

  // États d'ouverture des sections
  const [openPref, setOpenPref] = useState(false);
  const [openAnalytics, setOpenAnalytics] = useState(false);
  const [openNecessary, setOpenNecessary] = useState(false);
  const [openAudience, setOpenAudience] = useState(false);
  const [openDevelop, setOpenDevelop] = useState(false);

  // Toggles
  const togglePref = () => setOpenPref(!openPref);
  const toggleAnalytics = () => setOpenAnalytics(!openAnalytics);
  const toggleNecessary = () => setOpenNecessary(!openNecessary);
  const toggleAudience = () => setOpenAudience(!openAudience);
  const toggleDevelop = () => setOpenDevelop(!openDevelop);

  // Checkbox changement
  const handleChange = (e) => {
    const { name, checked } = e.target;
    setPreferences({ ...preferences, [name]: checked });
  };

  // Enregistrer
  const handleSave = () => {
    localStorage.setItem("cookie-consent", JSON.stringify(preferences));
    setMessage(t("cookie.saved_message"));
  };

  // Refuser tout
  const handleRejectAll = () => {
    const reset = {
      pref: false,
      necessary: false,
      analytics: false,
      marketing: false,
      audience: false,
      develop: false,
    };

    setPreferences(reset);
    localStorage.setItem("cookie-consent", JSON.stringify(reset));
    setMessage(t("cookie.rejected_message"));
  };

  return (
    <div className="cookie-page">
      <h1>{t("cookie.title")}</h1>

      <p>{t("cookie.intro")}</p>

      <h2>{t("cookie.categories")}</h2>
      <p>{t("cookie.modify")}</p>

      <div className="consent-section">

        {/* PREFERENCES */}
        <article className="option">
          <div className="option__div" onClick={togglePref}>
            {openPref ? <ChevronUp size={22} /> : <ChevronDown size={22} />}
            <h3>{t("cookie.pref_title")}</h3>

            <input
              type="checkbox"
              name="pref"
              checked={preferences.pref}
              onChange={handleChange}
            />
          </div>

          {openPref && (
            <div className="option__contenu contenu">
              <p>{t("cookie.pref_desc")}</p>
            </div>
          )}
        </article>

        {/* ANALYTICS */}
        <article className="option">
          <div className="option__div" onClick={toggleAnalytics}>
            {openAnalytics ? <ChevronUp size={22} /> : <ChevronDown size={22} />}
            <h3>{t("cookie.analytics_title")}</h3>

            <input
              type="checkbox"
              name="analytics"
              checked={preferences.analytics}
              onChange={handleChange}
            />
          </div>

          {openAnalytics && (
            <div className="option__contenu contenu">
              <p>{t("cookie.analytics_desc")}</p>
            </div>
          )}
        </article>

        {/* NECESSARY */}
        <article className="option">
          <div className="option__div" onClick={toggleNecessary}>
            {openNecessary ? <ChevronUp size={22} /> : <ChevronDown size={22} />}
            <h3>{t("cookie.necessary_title")}</h3>

            <input
              type="checkbox"
              name="necessary"
              checked={preferences.necessary}
              onChange={handleChange}
            />
          </div>

          {openNecessary && (
            <div className="option__contenu contenu">
              <p>{t("cookie.necessary_desc")}</p>
            </div>
          )}
        </article>

        {/* AUDIENCE */}
        <article className="option">
          <div className="option__div" onClick={toggleAudience}>
            {openAudience ? <ChevronUp size={22} /> : <ChevronDown size={22} />}
            <h3>{t("cookie.audience_title")}</h3>

            <input
              type="checkbox"
              name="audience"
              checked={preferences.audience}
              onChange={handleChange}
            />
          </div>

          {openAudience && (
            <div className="option__contenu contenu">
              <p>{t("cookie.audience_desc")}</p>
            </div>
          )}
        </article>

        {/* DEVELOPMENT */}
        <article className="option">
          <div className="option__div" onClick={toggleDevelop}>
            {openDevelop ? <ChevronUp size={22} /> : <ChevronDown size={22} />}
            <h3>{t("cookie.develop_title")}</h3>

            <input
              type="checkbox"
              name="develop"
              checked={preferences.develop}
              onChange={handleChange}
            />
          </div>

          {openDevelop && (
            <div className="option__contenu contenu">
              <p>{t("cookie.develop_desc")}</p>
            </div>
          )}
        </article>

        {/* BUTTONS */}
        <div className="actions">
          <button className="btn-outline" onClick={handleRejectAll}>
            {t("cookie.reject_all")}
          </button>

          <button className="btn-primary" onClick={handleSave}>
            {t("cookie.save")}
          </button>
        </div>

        {message && <p className="feedback">{message}</p>}
      </div>
    </div>
  );
}

