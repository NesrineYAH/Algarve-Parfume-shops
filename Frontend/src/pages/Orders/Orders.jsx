// pages/Orders/Orders.jsx
import React, { useEffect, useState, useContext } from "react";
import OrderService from "../../Services/orderService";
import "./Orders.scss";
import { UserContext } from "../../context/UserContext";
import { Link, useNavigate } from "react-router-dom";

export default function Orders() {
  const { user } = useContext(UserContext);

  const [preOrders, setPreOrders] = useState([]);
  const [orders, setOrders] = useState([]);
  const [cancelledOrders, setCancelledOrders] = useState([]);
    const navigate = useNavigate();

useEffect(() => {
  
  if (!user) {
    navigate("/authentification");
    return;
  }

  // 🔥 2. Si user existe mais pas encore son _id → on attend
  if (!user._id) return;

  // 🔥 3. Sinon on peut charger les commandes
  const fetchOrders = async () => {
    try {
      const data = await OrderService.getUserOrders(user._id);

      setPreOrders(data.preOrders || []);
      setOrders(data.orders || []);
      setCancelledOrders(data.cancelledOrders || []);
    } catch (err) {
      console.error("Erreur récupération commandes :", err);
    }
  };

  fetchOrders();
}, [user]);

  const getImageUrl = (url) => {
    if (!url) return "/uploads/default.jpg";
    if (url.startsWith("http")) return url;
    return `http://localhost:5001${url}`;
  };

  const handleCancel = async (orderId) => {
    try {
      await OrderService.cancelOrder(orderId);

      // Retirer la commande des listes actives
      setPreOrders((prev) => prev.filter((o) => o._id !== orderId));
      setOrders((prev) => prev.filter((o) => o._id !== orderId));

      // Ajouter dans les annulées
      setCancelledOrders((prev) => [
        ...prev,
        { _id: orderId, status: "cancelled" }
      ]);

    } catch (err) {
      console.error("Erreur lors de l'annulation :", err);
    }
  };

  const handleDelete = async (orderId) => {
    try {
      await OrderService.deleteOrder(orderId);

      setPreOrders((prev) => prev.filter((o) => o._id !== orderId));
      setOrders((prev) => prev.filter((o) => o._id !== orderId));
      setCancelledOrders((prev) => prev.filter((o) => o._id !== orderId));
    } catch (err) {
      console.error("Erreur suppression commande :", err);
    }
  };

  return (
    <div className="orders-container">
      {user && <h1>Bonjour {user.prenom}</h1>}

      {preOrders.length > 0 && (
        <>
          <h2>Pré-commandes</h2>

          {preOrders.map((order) => (
            <div className="order-card" key={order._id}>
              <h3>Commande n°{order._id}</h3>
              <p>Paiement : {order.paymentStatus}</p>
              <p>Prix Total : {order.totalPrice} €</p>
              <p>Date: {order.paidAt}</p>

              <div className="order-items">
                {order.items.map((item, idx) => (
                  <div className="order-item" key={idx}>
                    <img
                      className="item-image"
                      src={getImageUrl(item.imageUrl)}
                      alt={item.nom}
                    />
                    <div className="item-details">
                      <h3>{item.nom}</h3>
                      <p>Taille : {item.options?.size} {item.options?.unit}</p>
                      <p>Prix : {Number(item.options?.prix).toFixed(2)} €</p>
                      <p>Quantité : {item.quantite}</p>
                    </div>
                  </div>
                ))}
              </div>

              <div className="order_AllButtons">
                <button onClick={() => handleDelete(order._id)} className="Button">
                  Supprimer
                </button>

                <Link to={`/payment/${order._id}`} state={{ order, orderId: order._id }}>
                  <button className="Button">Payer</button>
                </Link>

                <button className="Button" onClick={() => handleCancel(order._id)}>
                  Annuler
                </button>
              </div>
            </div>
          ))}
        </>
      )}

      {/* SECTION COMMANDES PAYÉES */}
      {orders.length > 0 && (
        <>
          <h2>Commandes Confirmées</h2>

          {orders.map((order) => (
            <div className="order-card" key={order._id}>
              <h3>Commande n°{order._id}</h3>
              <p>Paiement : {order.paymentStatus}</p>
              <p>Prix Total : {order.totalPrice} €</p>

              <div className="order-items">
                {order.items.map((item, idx) => (
                  <div className="order-item" key={idx}>
                    <img
                      className="item-image"
                      src={getImageUrl(item.imageUrl)}
                      alt={item.nom}
                    />
                    <div className="item-details">
                      <h3>{item.nom}</h3>
                      <p>Taille : {item.options?.size} {item.options?.unit}</p>
                      <p>Prix : {Number(item.options?.prix).toFixed(2)} €</p>
                      <p>Quantité : {item.quantite}</p>
                    </div>
                  </div>
                ))}
              </div>

              <div className="order_AllButtons">
                <button onClick={() => handleDelete(order._id)} className="Button">
                  Supprimer
                </button>

                <Link to={`/tracking/${order._id}`}>
                  <button className="Button">Suivre ma commande</button>
                </Link>

                {/* <button onClick={() =>
                 navigate("/retour-produit", {
                  state: { orderId: order._id, productId: item.product._id },
                   }) }> Demander un retour </button> */}

              </div>
            </div>
          ))}
        </>
      )}

      {/* SECTION COMMANDES ANNULÉES */}
      {cancelledOrders.length > 0 && (
        <>
          <h2>Commandes Annulées</h2>

          {cancelledOrders.map((order) => (
            <div className="order-card cancelled" key={order._id}>
              <h3>Commande n°{order._id}</h3>
              <p>Status : Annulée</p>

              <p className="cancelled-label">Cette commande a été annulée</p>
            </div>
          ))}
        </>
      )}

      {/* SI AUCUNE COMMANDE */}
      {preOrders.length === 0 && orders.length === 0 && cancelledOrders.length === 0 && (
        <p>Aucune commande pour le moment.</p>
      )}
    </div>
  );
}





//   const getImageUrl = (imageUrl) =>  imageUrl ? `http://localhost:5001${imageUrl}` : "/uploads/default.jpg";



