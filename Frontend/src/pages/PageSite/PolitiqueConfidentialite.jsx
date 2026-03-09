import React from "react";
import { useTranslation } from "react-i18next";
import "./PageSite.scss";

const PolitiqueConfidentialite = () => {

  const { t } = useTranslation();

  return (
    <div id="legal-page">

      <h1>{t("privacy.title")}</h1>

      <section>
        <h2>{t("privacy.introTitle")}</h2>
        <p>{t("privacy.introText")}</p>
      </section>

      <section>
        <h2>{t("privacy.controllerTitle")}</h2>
        <p>{t("privacy.controllerText")}</p>
        <ul>
          <li><strong>{t("privacy.company")}</strong></li>
          <li><strong>{t("privacy.address")}</strong></li>
          <li><strong>{t("privacy.email")}</strong></li>
        </ul>
      </section>

      <section>
        <h2>{t("privacy.dataTitle")}</h2>
        <p>{t("privacy.dataText")}</p>
        <ul>
          <li>{t("privacy.data1")}</li>
          <li>{t("privacy.data2")}</li>
          <li>{t("privacy.data3")}</li>
          <li>{t("privacy.data4")}</li>
          <li>{t("privacy.data5")}</li>
          <li>{t("privacy.data6")}</li>
        </ul>
      </section>

      <section>
        <h2>{t("privacy.purposeTitle")}</h2>
        <p>{t("privacy.purposeText")}</p>
        <ul>
          <li>{t("privacy.purpose1")}</li>
          <li>{t("privacy.purpose2")}</li>
          <li>{t("privacy.purpose3")}</li>
          <li>{t("privacy.purpose4")}</li>
          <li>{t("privacy.purpose5")}</li>
        </ul>
      </section>

      <section>
        <h2>{t("privacy.retentionTitle")}</h2>
        <p>{t("privacy.retentionText")}</p>
        <ul>
          <li>{t("privacy.retention1")}</li>
          <li>{t("privacy.retention2")}</li>
          <li>{t("privacy.retention3")}</li>
        </ul>
      </section>

      <section>
        <h2>{t("privacy.shareTitle")}</h2>
        <p>{t("privacy.shareText")}</p>
        <ul>
          <li>{t("privacy.share1")}</li>
          <li>{t("privacy.share2")}</li>
          <li>{t("privacy.share3")}</li>
        </ul>
        <p>{t("privacy.shareNote")}</p>
      </section>

      <section>
        <h2>{t("privacy.securityTitle")}</h2>
        <p>{t("privacy.securityText")}</p>
      </section>

      <section>
        <h2>{t("privacy.rightsTitle")}</h2>
        <p>{t("privacy.rightsText")}</p>
        <ul>
          <li>{t("privacy.right1")}</li>
          <li>{t("privacy.right2")}</li>
          <li>{t("privacy.right3")}</li>
          <li>{t("privacy.right4")}</li>
          <li>{t("privacy.right5")}</li>
          <li>{t("privacy.right6")}</li>
        </ul>
        <p>{t("privacy.contact")}</p>
      </section>

      <section>
        <h2>{t("privacy.cookiesTitle")}</h2>
        <p>{t("privacy.cookiesText")}</p>
      </section>

      <section>
        <h2>{t("privacy.updateTitle")}</h2>
        <p>{t("privacy.updateText")}</p>
      </section>

    </div>
  );
};

export default PolitiqueConfidentialite;