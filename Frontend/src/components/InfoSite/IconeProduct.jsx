import React from 'react';
import { Truck, RotateCcw, Lock } from 'lucide-react';
import './InfoSite.scss';

const ReassuranceBanner = () => {
  const items = [
    {
      id: 1,
      icon: <Truck className="reassurance-icon" />,
      title: "LIVRAISON OFFERTE",
      subtitle: "Dès 25€ d'achat",
    },
    {
      id: 2,
      icon: <RotateCcw className="reassurance-icon" />,
      title: "RETOURS FACILES",
      subtitle: "14 jours pour changer d'avis",
    },
    {
      id: 3,
      icon: <Lock className="reassurance-icon" />,
      title: "PAIEMENT SÉCURISÉ",
      subtitle: "100% sécurisé",
    },
  ];

  return (
    <section className="reassurance">
      <div className="reassurance__container">
        {items.map((item, index) => (
          <React.Fragment key={item.id}>
            <div className="reassurance__item">
              <div className="icon-wrapper">{item.icon}</div>
              <div className="text-wrapper">
                <h4 className="reassurance__title">{item.title}</h4>
                <p className="reassurance__subtitle">{item.subtitle}</p>
              </div>
            </div>
            {/* Ajout d'une séparation verticale entre les éléments */}
            {index < items.length - 1 && <div className="reassurance__divider" />}
          </React.Fragment>
        ))}
      </div>
    </section>
  );
};

export default ReassuranceBanner;