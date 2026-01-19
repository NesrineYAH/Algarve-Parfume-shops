import React, { useContext, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import CheckoutSteps from "../../components/CheckoutSteps/CheckoutSteps";
import OrderService from "../../Services/orderService";
import { CartContext } from "../../context/CartContext";
import "./Checkout.scss";

export default function Checkout() {
  const { cartItems, totalPrice } = useContext(CartContext);
  const navigate = useNavigate();

  // 🔐 Sécurité : pas d’accès au checkout sans panier
  useEffect(() => {
    if (!cartItems || cartItems.length === 0) {
      navigate("/cart");
    }
  }, [cartItems, navigate]);

  // 🟢 Création de la pré-commande
  const handleOrder = async () => {
    try {
      const itemsForOrder = cartItems.map((item) => ({
        productId: item.productId,
        variantId: item.variantId,
        nom: item.nom,
        quantite: Number(item.quantite),
        imageUrl: item.imageUrl,
        options: {
          size: item.options.size,
          unit: item.options.unit,
          prix: Number(item.options.prix),
        },
      }));

      const orderData = {
        items: itemsForOrder,
        totalPrice: Number(totalPrice.toFixed(2)),
        status: "pending",
        paymentStatus: "pending",
      };

      const response = await OrderService.createPreOrder(orderData);

      if (!response?.order?._id) {
        throw new Error("Pré-commande non créée");
      }

      localStorage.setItem("preOrderId", response.order._id);

      // ➡️ Étape suivante
      navigate("/Delivery");
    } catch (error) {
      console.error("❌ Erreur pré-commande :", error);
      alert("Impossible de continuer la commande");
    }
  };

  return (
    <div className="checkout-container">
      <CheckoutSteps step={2} />

      <h1>Récapitulatif de votre commande</h1>

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
                {item.options.size} {item.options.unit} —{" "}
                {Number(item.options.prix).toFixed(2)} €
              </div>
              <div>Quantité : {item.quantite}</div>
            </div>
          </div>
        ))}

        <h3>Total : {Number(totalPrice).toFixed(2)} €</h3>

        <div className="checkout-actions">
          <button className="Button" onClick={handleOrder}>
            Confirmer la commande
          </button>

          <Link to="/cart">
            <button className="Button secondary">
              Modifier le panier
            </button>
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