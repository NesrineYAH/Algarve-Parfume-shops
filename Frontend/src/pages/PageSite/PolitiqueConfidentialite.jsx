import React from "react";
import "./PageSite.scss";

const PolitiqueConfidentialite = () => {
  return (
    <div className="legal-page">
      <h1>Politique de confidentialité</h1>

      <section>
        <h2>1. Introduction</h2>
        <p>
          La présente politique de confidentialité a pour objectif d’informer les utilisateurs
          du site <strong>https://perfumealgarve.com</strong> sur la manière dont leurs données personnelles
          sont collectées, utilisées et protégées, conformément au
          Règlement Général sur la Protection des Données (RGPD).
        </p>
      </section>

      <section>
        <h2>2. Responsable du traitement</h2>
        <p>
          Le responsable du traitement des données est :
        </p>
        <ul>
          <li><strong>Perfume Algarv :</strong></li>
          <li><strong>Adresse :</strong> 3VCW+33 Quarteira, Portugal</li>
          <li><strong>Email :</strong> contact@perfumealgarve.com</li>
        </ul>
      </section>

      <section>
        <h2>3. Données collectées</h2>
        <p>
          Les données personnelles collectées sur le site peuvent inclure :
        </p>
        <ul>
          <li>Nom et prénom</li>
          <li>Adresse email</li>
          <li>Adresse postale</li>
          <li>Numéro de téléphone</li>
          <li>Données de commande et de paiement</li>
          <li>Adresse IP et données de navigation</li>
        </ul>
      </section>

      <section>
        <h2>4. Finalités du traitement</h2>
        <p>
          Les données personnelles sont collectées pour les finalités suivantes :
        </p>
        <ul>
          <li>Gestion des commandes et livraisons</li>
          <li>Gestion de la relation client</li>
          <li>Traitement des paiements</li>
          <li>Respect des obligations légales</li>
          <li>Amélioration de l’expérience utilisateur</li>
        </ul>
      </section>

      <section>
        <h2>5. Durée de conservation</h2>
        <p>
          Les données personnelles sont conservées uniquement pendant la durée
          nécessaire aux finalités pour lesquelles elles ont été collectées :
        </p>
        <ul>
          <li>Données clients : durée de la relation commerciale</li>
          <li>Données de facturation : 10 ans (obligation légale)</li>
          <li>Données de navigation : 13 mois maximum</li>
        </ul>
      </section>

      <section>
        <h2>6. Partage des données</h2>
        <p>
          Les données personnelles peuvent être transmises aux prestataires suivants :
        </p>
        <ul>
          <li>Prestataires de paiement (Stripe, PayPal, etc.)</li>
          <li>Transporteurs et services de livraison</li>
          <li>Prestataires techniques (hébergement, maintenance)</li>
        </ul>
        <p>
          Aucune donnée personnelle n’est vendue à des tiers.
        </p>
      </section>

      <section>
        <h2>7. Sécurité des données</h2>
        <p>
          Le site met en œuvre des mesures techniques et organisationnelles
          afin de garantir la sécurité et la confidentialité des données personnelles.
        </p>
      </section>

      <section>
        <h2>8. Droits des utilisateurs</h2>
        <p>
          Conformément au RGPD, l’utilisateur dispose des droits suivants :
        </p>
        <ul>
          <li>Droit d’accès</li>
          <li>Droit de rectification</li>
          <li>Droit à l’effacement</li>
          <li>Droit à la limitation du traitement</li>
          <li>Droit d’opposition</li>
          <li>Droit à la portabilité des données</li>
        </ul>
        <p>
          Pour exercer ces droits, l’utilisateur peut contacter :
          <strong> [Email de contact]</strong>
        </p>
      </section>

      <section>
        <h2>9. Cookies</h2>
        <p>
          Le site utilise des cookies afin d’améliorer l’expérience utilisateur
          et de mesurer l’audience.  
          L’utilisateur peut configurer ou refuser les cookies via son navigateur
          ou un bandeau de consentement.
        </p>
      </section>

      <section>
        <h2>10. Modification de la politique</h2>
        <p>
          La présente politique de confidentialité peut être modifiée à tout moment.
          La version en vigueur est celle publiée sur le site.
        </p>
      </section>
    </div>
  );
};

export default PolitiqueConfidentialite;
