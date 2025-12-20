import React from "react";
import "./PageSite.scss";

const SecuriteProduits = () => {
  return (
    <div className="legal-page">
      <h1>Sécurité Générale des Produits</h1>

      <section>
        <h2>1. Cadre réglementaire</h2>
        <p>
          La présente page a pour objectif d’informer les consommateurs sur les mesures
          mises en place par <strong>[Nom du site]</strong> afin de garantir la sécurité des
          produits proposés à la vente, conformément au
          <strong> Règlement (UE) 2023/988 relatif à la Sécurité Générale des Produits (RSGP)</strong>.
        </p>
      </section>

      <section>
        <h2>2. Produits concernés</h2>
        <p>
          Les produits concernés par le présent règlement sont les parfums commercialisés
          sur le site <strong>[Nom du site]</strong>, destinés à un usage cosmétique.
        </p>
      </section>

      <section>
        <h2>3. Conformité et sécurité des produits</h2>
        <p>
          Tous les parfums proposés à la vente sont :
        </p>
        <ul>
          <li>Conformes à la réglementation européenne en vigueur</li>
          <li>Fabriqués et conditionnés selon les normes de sécurité applicables</li>
          <li>Destinés à un usage normal ou raisonnablement prévisible</li>
        </ul>
        <p>
          Les produits sont fournis par des fabricants ou distributeurs respectant
          les obligations légales en matière de sécurité des produits.
        </p>
      </section>

      <section>
        <h2>4. Informations et traçabilité</h2>
        <p>
          Chaque produit commercialisé dispose d’informations permettant :
        </p>
        <ul>
          <li>L’identification du produit</li>
          <li>L’identification du fabricant ou du fournisseur</li>
          <li>La traçabilité du lot lorsque cela est applicable</li>
        </ul>
      </section>

      <section>
        <h2>5. Avertissements et précautions d’usage</h2>
        <p>
          Les parfums doivent être utilisés conformément aux indications figurant
          sur l’emballage.  
          Il est recommandé de :
        </p>
        <ul>
          <li>Éviter le contact avec les yeux</li>
          <li>Ne pas utiliser sur une peau irritée ou lésée</li>
          <li>Tenir hors de portée des enfants</li>
          <li>Effectuer un test cutané préalable en cas de peau sensible</li>
        </ul>
      </section>

      <section>
        <h2>6. Signalement d’un produit dangereux</h2>
        <p>
          Si un client estime qu’un produit présente un risque pour sa santé ou sa sécurité,
          il est invité à contacter immédiatement :
        </p>
        <p>
          <strong>Email :</strong> [Email de contact sécurité]<br />
          <strong>Objet :</strong> Signalement sécurité produit
        </p>
        <p>
          Toute réclamation sera traitée avec la plus grande attention et, le cas échéant,
          des mesures correctives seront prises (retrait, rappel produit, information des autorités).
        </p>
      </section>

      <section>
        <h2>7. Retrait et rappel de produits</h2>
        <p>
          En cas de risque avéré, <strong>[Nom du site]</strong> s’engage à :
        </p>
        <ul>
          <li>Informer immédiatement les consommateurs concernés</li>
          <li>Retirer le produit de la vente</li>
          <li>Procéder à un rappel si nécessaire</li>
          <li>Collaborer avec les autorités compétentes</li>
        </ul>
      </section>

      <section>
        <h2>8. Contact</h2>
        <p>
          Pour toute question relative à la sécurité des produits, vous pouvez nous contacter à :
        </p>
        <p>
          <strong>[Nom de l’entreprise]</strong><br />
          <strong>Email :</strong> [Email de contact]<br />
          <strong>Adresse :</strong> [Adresse complète]
        </p>
      </section>
    </div>
  );
};

export default SecuriteProduits;
