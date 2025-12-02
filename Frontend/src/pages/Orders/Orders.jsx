import React, { useEffect, useState, useContext } from "react";
import OrderService from "../../Services/orderService";
import "./Orders.scss";
import { CartContext } from "../../context/CartContext";

export default function Orders() {
  const [orders, setOrders] = useState([]); // commandes confirmées
  const [preOrders, setPreOrders] = useState([]); // pré-commandes
  const { cartItems } = useContext(CartContext);

  const user = JSON.parse(localStorage.getItem("user"));

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        if (!user) return;

        const data = await OrderService.getUserOrders(user._id);
        console.log("Data reçue :", data);

        const all = data;

        const pre = all.filter(
          (o) => o.status === "pending" && o.paymentStatus === "pending"
        );

        const confirmed = all.filter(
          (o) => o.status === "confirmed" && o.paymentStatus === "paid"
        );

        setPreOrders(all);
        setOrders([]);
      } catch (err) {
        console.error("Erreur fetch orders:", err);
      }
    };

    fetchOrders();
  }, []);

  const getImageUrl = (imageUrl) =>
    imageUrl ? `http://localhost:5001${imageUrl}` : "/uploads/default.jpg";

  // SUPPRESSION
  const handleDelete = async (orderId) => {
    try {
      await OrderService.deleteOrder(orderId);

      setOrders((prev) => prev.filter((o) => o._id !== orderId));
      setPreOrders((prev) => prev.filter((o) => o._id !== orderId));

      alert("Commande supprimée !");
    } catch (err) {
      console.error(err);
      alert("Erreur suppression commande");
    }
  };

  // CONFIRMATION (transforme pré-commande → commande confirmée)
  const handleUpdate = async (orderId) => {
    try {
      const updated = await OrderService.updateOrder(orderId, {
        status: "confirmed",
        paymentStatus: "paid",
      });

      const updatedOrder = updated.order;

      // enlever de pré-commandes
      setPreOrders((prev) => prev.filter((o) => o._id !== orderId));

      // ajouter dans commandes confirmées
      setOrders((prev) => [...prev, updatedOrder]);

      alert("Commande confirmée !");
    } catch (err) {
      console.error(err);
      alert("Erreur lors de la mise à jour");
    }
  };

  return (
    <div className="orders-container">
      <h1>Mes Commandes</h1>

      {/* ============================ */}
      {/*       PRÉ-COMMANDES         */}
      {/* ============================ */}
      <h2>Pré-commandes</h2>

      {preOrders.length === 0 ? (
        <p>Aucune pré-commande pour le moment.</p>
      ) : (
        preOrders.map((order) => (
          <div className="order-card" key={order._id}>
            <h2>Pré-commande n°{order._id}</h2>

            <p>Status : {order.status}</p>
            <p>Paiement : {order.paymentStatus}</p>

            <div className="order-items">
              {order.items.map((item) => (
                <div
                  className="order-item"
                  key={`${order._id}-${item.variantId}`}
                >
                  <img
                    className="item-image"
                    src={getImageUrl(item.imageUrl)}
                    alt={item.nom}
                  />

                  <div className="item-details">
                    <h3>{item.nom}</h3>
                    <p>
                      Taille : {item.options?.size} {item.options?.unit}
                    </p>
                    <p>Prix : {Number(item.options?.prix).toFixed(2)} €</p>
                    <p>Quantité : {item.quantite}</p>
                  </div>
                </div>
              ))}
            </div>

            <button onClick={() => handleDelete(order._id)} className="Button">
              Supprimer
            </button>

            <button onClick={() => handleUpdate(order._id)} className="Button">
              Confirmer et payer
            </button>
          </div>
        ))
      )}

      <hr />

      {/* ============================ */}
      {/*    COMMANDES CONFIRMÉES     */}
      {/* ============================ */}
      <h2>Commandes Confirmées</h2>

      {orders.length === 0 ? (
        <p>Aucune commande confirmée.</p>
      ) : (
        orders.map((order) => (
          <div className="order-card" key={order._id}>
            <h2>Commande n°{order._id}</h2>

            <p>Status : {order.status}</p>
            <p>Paiement : {order.paymentStatus}</p>

            <div className="order-items">
              {order.items.map((item) => (
                <div
                  className="order-item"
                  key={`${order._id}-${item.variantId}`}
                >
                  <img
                    className="item-image"
                    src={getImageUrl(item.imageUrl)}
                    alt={item.nom}
                  />

                  <div className="item-details">
                    <h3>{item.nom}</h3>
                    <p>
                      Taille : {item.options?.size} {item.options?.unit}
                    </p>
                    <p>Prix : {Number(item.options?.prix).toFixed(2)} €</p>
                    <p>Quantité : {item.quantite}</p>
                  </div>
                </div>
              ))}
            </div>

            <button onClick={() => handleDelete(order._id)} className="Button">
              Supprimer la commande
            </button>
          </div>
        ))
      )}
    </div>
  );
}
