import React, { useState } from "react";
import "./FAQ.scss";
import { ChevronDown, ChevronUp } from "lucide-react";
import fr from "../../Lang/fr.json"; // importe ton fichier JSON

export default function FAQ() {
  const [openIndex, setOpenIndex] = useState(null);

  const togglePref = (index) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <section id="Faq">
      <div className="cookie-page">
        <h1>Foire Aux Questions</h1>
        <p>
          Cette page explique comment notre site utilise les cookies pour
          améliorer votre expérience et assurer le bon fonctionnement du
          service.
        </p>
        <h2>Paiement</h2>
        <div className="consent-section">
          {fr.faqDataP.map((item, index) => (
            <article className="option" key={index}>
              <div className="option__div" onClick={() => togglePref(index)}>
                {openIndex === index ? (
                  <ChevronUp size={22} />
                ) : (
                  <ChevronDown size={22} />
                )}
                <h3>{item.question}</h3>
              </div>

              {openIndex === index && (
                <div className="option__contenu contenu">
                  <p>{item.answer}</p>
                </div>
              )}
            </article>
          ))}
        </div>
        {/** */}
        <h2>Commandes</h2>
        <div className="consent-section">
          {fr.faqDataC.map((item, index) => (
            <article className="option" key={index}>
              <div className="option__div" onClick={() => togglePref(index)}>
                {openIndex === index ? (
                  <ChevronUp size={22} />
                ) : (
                  <ChevronDown size={22} />
                )}
                <h3>{item.question}</h3>
              </div>

              {openIndex === index && (
                <div className="option__contenu contenu">
                  <p>{item.answer}</p>
                </div>
              )}
            </article>
          ))}
        </div>
        <h2>Livraison</h2>
        <div className="consent-section">
          {fr.faqDataL.map((item, index) => (
            <article className="option" key={index}>
              <div className="option__div" onClick={() => togglePref(index)}>
                {openIndex === index ? (
                  <ChevronUp size={22} />
                ) : (
                  <ChevronDown size={22} />
                )}
                <h3>{item.question}</h3>
              </div>

              {openIndex === index && (
                <div className="option__contenu contenu">
                  <p>{item.answer}</p>
                </div>
              )}
            </article>
          ))}
        </div>
        <h2>Retours et reboursement </h2>
        <div className="consent-section">
          {fr.faqDataR.map((item, index) => (
            <article className="option" key={index}>
              <div className="option__div" onClick={() => togglePref(index)}>
                {openIndex === index ? (
                  <ChevronUp size={22} />
                ) : (
                  <ChevronDown size={22} />
                )}
                <h3>{item.question}</h3>
              </div>

              {openIndex === index && (
                <div className="option__contenu contenu">
                  <p>{item.answer}</p>
                </div>
              )}
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
