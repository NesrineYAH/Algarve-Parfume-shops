import React from "react";
import { useTranslation } from "react-i18next";

const QuiSommesNous = () => {
  const { t } = useTranslation();

  return (
    <section className="qui-sommes-nous">
      <div className="container">
        <h1>{t("about.title")}</h1>

        <p>{t("about.paragraph1")}</p>
        <p>{t("about.paragraph2")}</p>
        <p>{t("about.paragraph3")}</p>
        <p>{t("about.paragraph4")}</p>
        <p>{t("about.paragraph5")}</p>
        <p>{t("about.paragraph6")}</p>
      </div>
    </section>
  );
};

export default QuiSommesNous;

