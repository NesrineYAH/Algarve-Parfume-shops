//Frontend/pages/checkOut 
import React, { useContext, useEffect, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import CheckoutSteps from "../../components/CheckoutSteps/CheckoutSteps";
import OrderService from "../../Services/orderService";
import { CartContext } from "../../context/CartContext";
import "./Checkout.scss";
import { useTranslation } from "react-i18next";


export default function Checkout() {
    const { t } = useTranslation();
  
  const { cartItems, totalPrice } = useContext(CartContext);
  const [checked, setChecked] = useState(false);
  const navigate = useNavigate();

  //  Sécurité : pas d’accès au checkout sans panier
  useEffect(() => {
    if (checked) return;

    if (!cartItems || cartItems.length === 0) {
      navigate("/cart");
    }
    setChecked(true);
  }, [cartItems, navigate, checked]);

  // 🟢 Création de la pré-commande
  const handleOrder = async () => {
    try {
      // Préparation des items pour la pré-commande
      const itemsForOrder = cartItems.map((item) => ({
        productId: item.productId,
        variantId: item.variantId,
        nom: item.nom,
        quantite: Number(item.quantite),
        imageUrl: item.imageUrl,
        options: item.options
          ? {
              size: item.options.size,
              unit: item.options.unit,
              prix: Number(item.options.prix),
            }
          : {},
      }));

      // Données de la pré-commande
      const orderData = {
        items: itemsForOrder,
        totalPrice: Number(totalPrice.toFixed(2)),
        status: "pending",          
        paymentStatus: "pending",   
        createdAt: new Date(),
      };


      const response = await OrderService.createPreOrder(orderData);
                                         
      if (!response?.order?._id) {
        throw new Error("Pré-commande non créée côté serveur");
      }
console.log("PayPal orderData:", orderData);
      // 🔹 Stockage local de l'ID pour continuer le checkout
      localStorage.setItem("preOrderId", response.order._id);

      // ➡️ Étape suivante : livraison
      navigate("/Delivery");
    } catch (error) {
      console.error("❌ Erreur pré-commande :", error);
      alert("Impossible de continuer la commande. Veuillez réessayer.");
    }
  };

  return (
    <div className="checkout-container">
      <CheckoutSteps step={2} />

      <h1>{t("checkOut.h1")} </h1>

      <div className="checkout-summary">
        {cartItems.map((item) => (
          <div key={item.variantId} className="panier-item">
            <img
              src={`https://perfumealgarve.shop${item.imageUrl}`}
              alt={item.nom}
              className="itemImg"
            />
            <div className="item-info">
              <strong>{item.nom}</strong>
              <div>
                {item.options?.size} {item.options?.unit} —{" "}
                {Number(item.options?.prix || 0).toFixed(2)} €
              </div>
              <div>{t("checkOut.Quantity")}: {item.quantite}</div>
            </div>
          </div>
        ))}

        <h3>{t("checkOut.Total")}  : {Number(totalPrice).toFixed(2)} €</h3>

        <div className="checkout-actions">
          <button className="Button" onClick={handleOrder}>{t("checkOut.Confirm")}
          
          </button>

          <Link to="/cart">
            <button className="Button secondary"> {t("checkOut.Modify")}</button>
          </Link>
        </div>
      </div>
    </div>
  );
}





















