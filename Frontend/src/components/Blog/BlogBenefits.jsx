// src/components/BlogBenefits.jsx
import React from "react";
import { Truck, CreditCard, Gift, Package, Tag, Headphones } from "lucide-react";
import "./BlogBenefits.scss";

const benefits = [
  { icon: <Truck />, title: "Livraison gratuite", description: "à partir de 25 €" },
  { icon: <CreditCard />, title: "Paiement sécurisé", description: "" },
  { icon: <Gift />, title: "Emballage cadeau offert", description: "" },
  { icon: <Package />, title: "Échantillons offerts", description: "" },
  { icon: <Tag />, title: "Carte cadeau", description: "" },
  { icon: <Headphones />, title: "Service client", description: "6j/7" },
];

export default function BlogBenefits() {
  return (
    <section className="blog-benefits">
      <div className="benefits-container">
        {benefits.map((item, index) => (
          <div key={index} className="benefit-card">
            <div className="icon">{item.icon}</div>
            <div className="text">
              <h3>{item.title}</h3>
              {item.description && <p>{item.description}</p>}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
