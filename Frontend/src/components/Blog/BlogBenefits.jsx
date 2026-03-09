// src/components/BlogBenefits.jsx
import React from "react";
import { Truck, CreditCard, Gift, Package, Tag, Headphones } from "lucide-react";
import { useTranslation } from "react-i18next";
import "./BlogBenefits.scss";

export default function BlogBenefits() {
  const { t } = useTranslation();

  const benefits = [
    { icon: <Truck />, title: t("Blog.Delivery"), description: t("Blog.DeliveryP") },
    { icon: <CreditCard />, title: t("Blog.payment"), description: "" },
    { icon: <Gift />, title: t("Blog.presente"), description: "" },
    // { icon: <Package />, title: t("blog.Samples"), description: "" },
    { icon: <Tag />, title: t("Blog.Gift_Card"), description: "" },
    { icon: <Headphones />, title: t("Blog.Customer_Service"), description: t("Blog.Customer_ServiceP") }
  ];

  return (

        <section className="blog-benefits">
      <div className="benefits-container">
      
          <div className="benefit-card">
            <div className="icon"> <Truck /> </div>
            <div className="text">
              <h3>{t("Blog.Delivery")}</h3>
           <p>{t("Blog.Delivery")}</p>
            </div>
          </div>
   
      <div className="benefit-card">
            <div className="icon"> <CreditCard /> </div>
            <div className="text">
              <h3>{t("Blog.payment")}</h3>
           <p>{t("")}</p>
            </div>
       </div>

           <div className="benefit-card">
            <div className="icon"> <Gift /> </div>
            <div className="text">
              <h3>{t("Blog.presente")}</h3>
           <p>{t("")}</p>
            </div>
       </div>
       
<a href="/Contact">
                  <div className="benefit-card">
            <div className="icon">  <Headphones /> </div>
            <div className="text">
              <h3>{t("Blog.Customer_Service")}</h3>
           <p>{t("Blog.Customer_ServiceP")}</p>
            </div>
       </div>
</a>
      </div>
    </section>
  );
}
