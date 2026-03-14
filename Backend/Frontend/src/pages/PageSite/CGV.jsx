import React from "react";
import { useTranslation } from "react-i18next";

const CGV = () => {
  const { t } = useTranslation();

  return (
    <div id="legal-page">
      <h1>{t("CGV.title")}</h1>

      <section>
        <h2>{t("CGV.article1Title")}</h2>
        <p>{t("CGV.article1Text")}</p>
      </section>

      <section>
        <h2>{t("CGV.article2Title")}</h2>
        <p>{t("CGV.article2Text")}</p>
      </section>

      <section>
        <h2>{t("CGV.article3Title")}</h2>
        <p>{t("CGV.article3Text")}</p>
      </section>

      <section>
        <h2>{t("CGV.article4Title")}</h2>
        <p>{t("CGV.article4Text")}</p>
      </section>

      <section>
        <h2>{t("CGV.article5Title")}</h2>
        <p>{t("CGV.article5Text")}</p>
      </section>

      <section>
        <h2>{t("CGV.article6Title")}</h2>
        <p>{t("CGV.article6Text")}</p>
      </section>

      <section>
        <h2>{t("CGV.article7Title")}</h2>
        <p>{t("CGV.article7Text1")}</p>
        <p>{t("CGV.article7Text2")}</p>
      </section>

      <section>
        <h2>{t("CGV.article8Title")}</h2>
        <p>{t("CGV.article8Text")}</p>
      </section>

      <section>
        <h2>{t("CGV.article9Title")}</h2>
        <p>{t("CGV.article9Text")}</p>
      </section>

      <section>
        <h2>{t("CGV.article10Title")}</h2>
        <p>{t("CGV.article10Text")}</p>
      </section>
    </div>
  );
};

export default CGV;

