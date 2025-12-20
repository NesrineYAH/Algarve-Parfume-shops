import React from "react";

const MentionsLegales = () => {
  return (
    <div className="legal-page">
      <h1>Mentions légales</h1>

      <section>
        <h2>Éditeur du site</h2>
        <p><strong>Nom du site :</strong> [Nom du site]</p>
        <p><strong>Responsable :</strong> [Nom / Prénom ou Société]</p>
        <p><strong>Statut juridique :</strong> [Auto-entrepreneur / SAS / SARL]</p>
        <p><strong>Adresse :</strong> [Adresse complète]</p>
        <p><strong>Email :</strong> [Email de contact]</p>
        <p><strong>Téléphone :</strong> [Numéro]</p>
        <p><strong>SIRET :</strong> [Numéro SIRET]</p>
        <p><strong>RCS :</strong> [Ville] (si applicable)</p>
        <p><strong>TVA intracommunautaire :</strong> [Si applicable]</p>
      </section>

      <section>
        <h2>Hébergement</h2>
        <p><strong>Hébergeur :</strong> Hostinger</p>
        <p><strong>Adresse :</strong> [Adresse de l’hébergeur]</p>
        <p><strong>Téléphone :</strong> [Numéro]</p>
      </section>

      <section>
        <h2>Conception du site</h2>
        <p>Site développé en <strong>React.js</strong>.</p>
      </section>

      <section>
        <h2>Propriété intellectuelle</h2>
        <p>
          L’ensemble du contenu du site (textes, images, logos, marques, graphismes)
          est protégé par le droit de la propriété intellectuelle.
          Toute reproduction est interdite sans autorisation.
        </p>
        <p>
          Les marques de parfums citées restent la propriété de leurs détenteurs respectifs.
        </p>
      </section>

      <section>
        <h2>Données personnelles</h2>
        <p>
          Les données personnelles collectées sont utilisées uniquement dans le cadre
          de la gestion des commandes et de la relation client, conformément au RGPD.
        </p>
      </section>
    </div>
  );
};

export default MentionsLegales;
