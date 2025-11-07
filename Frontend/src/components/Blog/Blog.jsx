import React from "react";
import "./Blog.scss";

function Blog() {
  return (
    <section id="reassurance">
      <div className="container">

        <div className="ft-block">
          <a href="/livraison-parfum-offerte">
            <div className="ftb-icon">
              <svg width="40" height="40">
                <use xlinkHref="/themes/transformer/img/svg/icon-svg.svg#delivery"></use>
              </svg>
            </div>
            <div className="ftb-content">
              <div className="ftb-title">Livraison Offerte</div>
              <div className="ftb-subtitle">dès 49€</div>
            </div>
          </a>
        </div>

        {/* ... autres blocs ... */}

      </div>
    </section>
  );
}

// ⚠️ Nécessaire pour pouvoir l’importer ailleurs
export default Blog;
