import React, { useEffect, useState, useContext } from "react";
import { useNavigate, Link } from "react-router-dom";
import CheckoutSteps from "../../components/CheckoutSteps/CheckoutSteps";
import OrderService from "../../Services/orderService";
import { CartContext } from "../../context/CartContext";
import { UserContext } from "../../context/UserContext";

import "./Checkout.scss";

export default function Checkout() {
  const { cartItems } = useContext(CartContext);
// const cart = cartItems; // 🔥 PLUS DE localStorage

  const [cart, setCart] = useState([]);
  const [deliveryMode, setDeliveryMode] = useState("domicile");
  const [address, setAddress] = useState("");
  const navigate = useNavigate();
  

useEffect(() => {
  const fetchCart = async () => {
    try {
      // 🟢 1️⃣ Essayer MongoDB via API
      const token = localStorage.getItem("token");

      if (token) {
        const res = await fetch("http://localhost:5001/api/carts", {
          headers: {
           Authorization: `Bearer ${token}`,
  //          Authorization: `Bearer ${localStorage.getItem("token")}`,

          },
        });

        if (res.ok) {
          const data = await res.json();

          if (data.items && data.items.length > 0) {
            setCart(data.items);
            return; // ✅ panier MongoDB utilisé
          }
        }
      }

      // 🟡 2️⃣ Fallback localStorage
      const localCart = JSON.parse(localStorage.getItem("cart")) || [];
      setCart(localCart);
    } catch (err) {
      console.error("❌ Erreur chargement panier :", err);

      // 🔴 3️⃣ Fallback ultime
      const localCart = JSON.parse(localStorage.getItem("cart")) || [];
      setCart(localCart);
    }
  };

  fetchCart();
}, []);


  // Fonction pour récupérer une option valide pour chaque produit
  const getSelectedOption = (item) => {
    if (!item.options) return { size: 0, unit: "ml", prix: 0 }; // fallback
    if (Array.isArray(item.options) && item.options.length > 0)
      return item.options[0]; // tableau
    if (typeof item.options === "object") return item.options; // objet déjà
    return { size: 0, unit: "ml", prix: 0 }; // fallback sûr
  };

  // Calcul du prix total
  const total = cart.reduce((sum, item) => {
    const opt = getSelectedOption(item);
    const qty = Number(item.quantite || 1);
    const price = Number(opt.prix || 0);
    return sum + price * qty;
  }, 0);

const handleOrder = async () => {
  if (!cart || cart.length === 0) {
    alert("Votre panier est vide");
    return;
  }

  try {
const itemsForOrder = cart.map((item) => {
  const opt = getSelectedOption(item);
  return {
    productId: item.productId,   // ✔ uniquement le vrai productId
    variantId: item.variantId,
    nom: item.nom,
    quantite: Number(item.quantite || 1),
    imageUrl: item.imageUrl || "",
    options: {
      size: Number(opt.size || 0),
      unit: opt.unit || "ml",
      prix: Number(opt.prix || 0),
    },
  };
});


    const orderData = {
      items: itemsForOrder,
      totalPrice: Number(total.toFixed(2)),
      delivery: {
        type: deliveryMode,
        address: deliveryMode === "domicile" ? address : "",
      },
      status: "pending",
      paymentStatus: "pending",
    };

    // 🟢 Création de la pré-commande
    const response = await OrderService.createPreOrder(orderData);
    const preOrderId = response.order._id;

    localStorage.setItem("preOrderId", preOrderId);

    // ➡️ Étape suivante : paiement
    navigate("/Delivery");
  } catch (error) {
    console.error("Erreur création pré-commande :", error.response || error);
    alert("❌ Impossible de passer à l’étape paiement");
  }
};

  return (
    <div className="checkout-container">
      <CheckoutSteps step={2} />

      <h1>Finaliser la commande</h1>

      <div className="checkout-summary">
        <h2>Résumé du panier</h2>
        {cart.length === 0 ? (
          <p>Votre panier est vide.</p>
        ) : (
          cart.map((item, index) => {
            const opt = getSelectedOption(item);
            return (
              <div key={`${item.variantId}-${index}`} className="panier-item">
                <img
                  src={
                    item.imageUrl
                      ? `http://localhost:5001${item.imageUrl}`
                      : "/placeholder.png"
                  }
                  alt={item.nom}
                  className="itemImg"
                />
                <div>
                  <strong>{item.nom || item.name}</strong>
                  <div>
                    <small>
                      {opt.size} {opt.unit} — {Number(opt.prix).toFixed(2)} €
                    </small>
                  </div>
                </div>
                <div>
                  <span>Quantité: {item.quantite || item.quantity || 1}</span>
                </div>
              </div>
            );
          })
        )}

        <h3>Total : {total.toFixed(2)} €</h3>

        <div style={{ marginTop: 12 }}>
          <button className="Button" onClick={handleOrder}>
            Confirmer la commande
          </button>
        </div>

        <Link to="/cart">
          <button className="Button" style={{ marginTop: 8 }}>
            Modifier le panier
          </button>
        </Link>
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