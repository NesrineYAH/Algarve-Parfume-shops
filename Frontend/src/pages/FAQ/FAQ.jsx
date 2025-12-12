import React, { useState } from "react";
import "./FAQ.scss";
import { ChevronDown, ChevronUp } from "lucide-react";
import fr from "../../Lang/fr.json"; // importe ton fichier JSON
import { useTranslation } from "react-i18next";

export default function FAQ() {
  const [openIndex, setOpenIndex] = useState(null);
  const { t } = useTranslation();
  const togglePref = (index) => {
    setOpenIndex(openIndex === index ? null : index);
  };
const paymentFaq = t("faq.payment", { returnObjects: true });
  const ordersFaq = t("faq.orders", { returnObjects: true });
  const deliveryFaq = t("faq.delivery", { returnObjects: true });
  const returnsFaq = t("faq.returns", { returnObjects: true });

  return (
    <section id="Faq">
      <div className="Faq-page">
          <h1>{t("faq.PrincipalTitle")}</h1>
        <p>
          Cette page explique comment notre site utilise les cookies pour
          améliorer votre expérience et assurer le bon fonctionnement du
          service.
        </p>
         <h2>{t("faq.PaymentTitle")}</h2>
        <div className="Faq-section">
          {paymentFaq.map((item, index) => (
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
        <h2>{t("faq.OrdersTitle")}</h2>
        <div className="consent-section">
          {ordersFaq.map((item, index) => (
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
         <h2>{t("faq.DeliveryTitle")}</h2>
        <div className="consent-section">
          {deliveryFaq.map((item, index) => (
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
        <h2>{t('faq.ReturnsTitle')}</h2>
        <div className="consent-section">
          {returnsFaq.map((item, index) => (
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
