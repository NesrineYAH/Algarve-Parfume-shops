import React, { useEffect, useState, useContext } from "react";
import OrderService from "../../Services/orderService";
import "./Orders.scss";
import { UserContext } from "../../context/UserContext";

export default function Orders() {
  console.log("Orders page loaded");

  const [orders, setOrders] = useState([]);
  const [preOrders, setPreOrders] = useState([]);

  // ✅ Récupération du user depuis UserContext
  const { user } = useContext(UserContext);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        if (!user) {
          console.log("Aucun utilisateur connecté");
          return;
        }
        console.log("Utilisateur connecté :", user);
        // ⚡ Utilisation de l'ID du user depuis le contexte
        const data = await OrderService.getUserOrders(user._id);
        console.log("Data reçue :", data);

        // Séparation pré-commandes et confirmées
        const pre = data.filter(
          (o) => o.status === "pending" && o.paymentStatus === "pending"
        );
        const confirmed = data.filter(
          (o) => o.status === "confirmed" && o.paymentStatus === "paid"
        );

        setPreOrders(pre);
        setOrders(confirmed);
      } catch (err) {
        console.error("Erreur fetch orders:", err);
      }
    };

    console.log("user:", user);
    fetchOrders();
  }, [user]); // ✅ relance si user change

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

  // CONFIRMATION
  const handleUpdate = async (orderId) => {
    try {
      const updated = await OrderService.updateOrder(orderId, {
        status: "confirmed",
        paymentStatus: "paid",
      });

      const updatedOrder = updated.order;

      setPreOrders((prev) => prev.filter((o) => o._id !== orderId));
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

      {/* ✅ Affichage du nom/prénom si dispo */}
      {user && (
        <p>
          Bonjour {user.prenom} {user.nom} ({user.email})
        </p>
      )}

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

/*
On ajoute UserContext dans Orders.jsx pour :

    Savoir quel utilisateur est connecté.

    Charger ses commandes depuis l’API avec son user._id.

    Afficher ses infos (nom, prénom, email).

    Simplifier le code en évitant de manipuler localStorage directement.

👉 Bref, UserContext = source unique de vérité pour l’utilisateur connecté, exactement comme CartContext l’est pour le panier.
 */
