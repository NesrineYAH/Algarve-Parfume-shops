import React, { useEffect, useState } from "react";
import CheckoutSteps from "../../components/CheckoutSteps/CheckoutSteps";
import OrderService from "../../Services/orderService";
import { useNavigate } from "react-router-dom";

export default function Checkout() {
  const [cart, setCart] = useState([]);
  const [deliveryMode, setDeliveryMode] = useState("domicile");
  const [address, setAddress] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const storedCart = JSON.parse(localStorage.getItem("cart")) || [];
    setCart(storedCart);
  }, []);

  const total = cart.reduce(
    (sum, item) => sum + (item.option?.prix || 0) * item.quantity,
    0
  );

  const handleOrder = async () => {
    if (cart.length === 0) {
      alert("Votre panier est vide");
      return;
    }

    const items = cart.map((item) => ({
      productId: item._id,
      nom: item.nom,
      quantity: item.quantity,
      imageUrl: item.imageUrl,
      option: {
        quantity: item.option?.quantity,
        prix: Number(item.option?.prix || 0),
        stock: item.option?.stock || 0,
      },
    }));

    const orderData = {
      items,
      totalPrice: total,
      delivery: {
        type: deliveryMode,
        address: deliveryMode === "domicile" ? address : "",
      },
    };

    try {
      await OrderService.createOrder(orderData);

      localStorage.removeItem("cart");
      alert("Commande créée avec succès !");
      navigate("/Orders");
    } catch (error) {
      console.error("Erreur création commande :", error);
      alert("Impossible de créer la commande");
    }
  };

  return (
    <div className="checkout-container">
      <CheckoutSteps step={2} />

      <h1>Finaliser la commande</h1>

      <div className="checkout-content">
        <h2>Mode de livraison</h2>

        <select
          value={deliveryMode}
          onChange={(e) => setDeliveryMode(e.target.value)}
        >
          <option value="domicile">Livraison à domicile</option>
          <option value="magasin">Retrait en magasin</option>
          <option value="pointRelais">Point relais</option>
        </select>

        {deliveryMode === "domicile" && (
          <input
            type="text"
            placeholder="Adresse de livraison"
            value={address}
            onChange={(e) => setAddress(e.target.value)}
          />
        )}
      </div>

      <div className="checkout-summary">
        <h2>Total : {total.toFixed(2)} €</h2>

        <button className="validate-order-btn" onClick={handleOrder}>
          Confirmer la commande
        </button>
      </div>
    </div>
  );
}
