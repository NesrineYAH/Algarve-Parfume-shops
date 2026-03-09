import React from "react";
import { useTranslation } from "react-i18next";
import nature from '../../assets/images/Naure forum sante.avif'
import "./BlogPage.scss";

const BlogPage = () => {
  const { t } = useTranslation();

  return (
    <div className="blog-container" >
      <header className="blog-header" >
  
                   <h1>{t("blog.title")}  </h1>
        <img src={nature}  alt="photo nature parfum" />
   
  

        <p>{t("blog.subtitle")}</p>
      </header>
        <p>        Découvrez nos produits bien-être, pour une expérience holistique. Huiles de massage, roll-ons pratiques aux huiles essentielles, compléments alimentaires, gamme ORL, et solutions respiratoires. Pour sommeil et détente, tisanes et thés apaisants. Inspirés par le Mont-Ventoux, formulés avec soin pour votre bien-être.
</p>
      <section className="blog-section">
        <h2>{t("blog.section1.title")} </h2>
        <p>{t("blog.section1.text")}</p>
      </section>

      <section className="blog-section">
        <h2>{t("blog.section2.title")} </h2>
        <p>{t("blog.section2.text")}</p>
      </section>

      <section className="blog-section">
        <h2>{t("blog.section3.title")} </h2>
        <p>{t("blog.section3.text")}</p>
      </section>

      <section className="blog-section">
        <h2>{t("blog.section4.title")}</h2>
        <p>{t("blog.section4.text")}</p>
      </section>

      <footer className="blog-footer">
        <p>{t("blog.footer")}</p>
      </footer>
    </div>
  );
};

export default BlogPage;
