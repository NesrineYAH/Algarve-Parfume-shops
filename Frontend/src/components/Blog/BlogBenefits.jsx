// src/components/BlogBenefits.jsx
import React from "react";
import { Truck, CreditCard, Gift, Package, Tag, Headphones } from "lucide-react";
import { useTranslation } from "react-i18next";
import "./BlogBenefits.scss";

export default function BlogBenefits() {
  const { t } = useTranslation();

  const benefits = [
    { icon: <Truck />, title: t("blog.Delivery"), description: t("blog.DeliveryP") },
    { icon: <CreditCard />, title: t("blog.payment"), description: "" },
    { icon: <Gift />, title: t("blog.presente"), description: "" },
    // { icon: <Package />, title: t("blog.Samples"), description: "" },
    { icon: <Tag />, title: t("blog.Gift_Card"), description: "" },
    { icon: <Headphones />, title: t("blog.Customer_Service"), description: t("blog.Customer_ServiceP") }
  ];

  return (
    // <section className="blog-benefits">
    //   <div className="benefits-container">
    //     {benefits.map((item, index) => (
    //       <div key={index} className="benefit-card">
    //         <div className="icon">{item.icon}</div>
    //         <div className="text">
    //           <h3>{item.title}</h3>
    //           {item.description && <p>{item.description}</p>}
    //         </div>
    //       </div>
    //     ))}
    //   </div>
    // </section>

        <section className="blog-benefits">
      <div className="benefits-container">
      
          <div className="benefit-card">
            <div className="icon"> <Truck /> </div>
            <div className="text">
              <h3>{t("blog.Delivery")}</h3>
           <p>{t("blog.Delivery")}</p>
            </div>
          </div>
   
      <div className="benefit-card">
            <div className="icon"> <CreditCard /> </div>
            <div className="text">
              <h3>{t("blog.payment")}</h3>
           <p>{t("")}</p>
            </div>
       </div>

           <div className="benefit-card">
            <div className="icon"> <Gift /> </div>
            <div className="text">
              <h3>{t("blog.presente")}</h3>
           <p>{t("")}</p>
            </div>
       </div>
       
<a href="/Contact">
                  <div className="benefit-card">
            <div className="icon">  <Headphones /> </div>
            <div className="text">
              <h3>{t("blog.Customer_Service")}</h3>
           <p>{t("blog.Customer_ServiceP")}</p>
            </div>
       </div>
</a>
      </div>
    </section>
  );
}
