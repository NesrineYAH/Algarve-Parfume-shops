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

  // 🔐 Sécurité : pas d’accès au checkout sans panier
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
        status: "pending",          // pré-commande en attente
        paymentStatus: "pending",   // paiement en attente
        createdAt: new Date(),
      };

      // ✅ Envoi au serveur pour enregistrer la pré-commande
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
              src={`http://localhost:5001${item.imageUrl}`}
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























  /* 25/12/2025
const handleOrder = async () => {
  try {
    const preOrderId = localStorage.getItem("preOrderId");

    if (!preOrderId) {
      alert("Aucune pré-commande trouvée");
      navigate("/cart");
      return;
    }

    await OrderService.finalizeOrder(preOrderId);

    alert("✅ Commande confirmée !");
    localStorage.removeItem("cart");
    localStorage.removeItem("preOrderId");

    navigate("/confirmation");
  } catch (error) {
    console.error("Erreur finalisation :", error.response || error);
    alert("❌ Impossible de confirmer la commande");
  }
};
*/

      {/* Choix du mode de livraison 
      <div style={{ marginTop: 20 }}>
        <label>
          <input
            type="radio"
            value="domicile"
            checked={deliveryMode === "domicile"}
            onChange={(e) => setDeliveryMode(e.target.value)}
          />{" "}
          Livraison à domicile
        </label>
        <label style={{ marginLeft: 10 }}>
          <input
            type="radio"
            value="relais"
            checked={deliveryMode === "relais"}
            onChange={(e) => setDeliveryMode(e.target.value)}
          />{" "}
          Point relais
        </label>
      </div>

      {deliveryMode === "domicile" && (
        <div style={{ marginTop: 12 }}>
          <input
            type="text"
            value={address}
            onChange={(e) => setAddress(e.target.value)}
            placeholder="Adresse de livraison"
          />
        </div>
      )}
*/}



  /*
   const handleOrder = async () => {
    if (!cart || cart.length === 0) {
      alert("Votre panier est vide");
      return;
    }

    const itemsForOrder = cart.map((item) => {
      const opt = getSelectedOption(item);
      return {
        productId: item.productId || item._id,
        variantId: item.variantId,
        nom: item.nom || "Produit",
        quantite: Number(item.quantite || 1),
        imageUrl: item.imageUrl || "",
        options: {
          size: Number(opt.size || 0),
          unit: opt.unit || "ml",
          prix: Number(opt.prix || 0),
        },
      };
    });

    const updatedOrderData = {
      items: itemsForOrder,
      totalPrice: Number(total.toFixed(2)),
      delivery: {
        type: deliveryMode,
        address: deliveryMode === "domicile" ? address : "",
      },
    };

    try {
      const preOrderId = localStorage.getItem("preOrderId");
      if (!preOrderId) throw new Error("Aucune pré-commande trouvée !");
      await OrderService.updateOrder(preOrderId, updatedOrderData);
      console.log("Pré-commande mise à jour :", preOrderId);

      alert("✅ Pré-commande enregistrée avec succès !");
      navigate("/delivery");
    } catch (error) {
      console.error("Erreur lors de la pré-commande :", error);
      alert("❌ Impossible d’enregistrer la pré-commande");
    }
  };
*/
  // Pré-commande