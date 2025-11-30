import React, { useEffect, useState, useContext } from "react";
import OrderService from "../../Services/orderService";
// import CheckoutSteps from "../../components/CheckoutSteps/CheckoutSteps";
import "./Orders.scss";
import { Link } from "react-router-dom";
import { CartContext } from "../../context/CartContext";

export default function Orders() {
  const [orders, setOrders] = useState([]);
  const { cartItems } = useContext(CartContext);

  const user = JSON.parse(localStorage.getItem("user")); // récup user connecté

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        if (!user) {
          console.warn("Aucun utilisateur connecté.");
          setOrders([]);
          return;
        }
        // 👉 si tu veux TOUTES les commandes, remets getAllOrders()
        const data = await OrderService.getUserOrders(user._id);
        setOrders(data);
      } catch (err) {
        console.error("Erreur lors de la récupération des commandes :", err);
      }
    };

    fetchOrders();
  }, []);

  const getImageUrl = (imageUrl) =>
    imageUrl ? `http://localhost:5001${imageUrl}` : "/uploads/default.jpg";

  const handleDelete = async (orderId) => {
    try {
      await OrderService.deleteOrder(orderId);
      setOrders((prev) => prev.filter((order) => order._id !== orderId));
      alert("Commande supprimée !");
    } catch (err) {
      alert("Erreur suppression commande");
      console.error(err);
    }
  };

  const handleUpdate = async (orderId, newStatus) => {
    try {
      const updated = await OrderService.updateOrder(orderId, {
        status: newStatus,
      });

      setOrders((prev) =>
        prev.map((order) =>
          order._id === orderId
            ? { ...order, status: updated.order.status }
            : order
        )
      );

      alert("Commande mise à jour !");
    } catch (err) {
      alert("Erreur modification commande");
      console.error(err);
    }
  };

  return (
    <div className="orders-container">
      <h1>Mes Commandes</h1>

      {orders.length === 0 ? (
        <p>Aucune commande pour le moment.</p>
      ) : (
        orders.map((order) => (
          <div className="order-card" key={order._id}>
            <h2>Commande n°{order._id}</h2>

            <p>
              Client : {order.userId?.name || "Inconnu"} -{" "}
              {order.userId?.email || "Inconnu"}
            </p>

            <p>Total : {Number(order.totalPrice).toFixed(2)} €</p>
            <p>Status : {order.status}</p>

            <div className="order-items">
              {order.items.map((item) => (
                <div
                  className="order-item"
                  key={`${order._id}-${item.productId?._id || item.productId}`}
                >
                  <img
                    className="item-image"
                    src={getImageUrl(item.imageUrl)}
                    alt={item.nom || item.name}
                  />

                  <div className="item-details">
                    <h3>{item.nom || item.name}</h3>

                    <p>Option : {item.options?.size || "—"}</p>

                    <p>
                      Prix :{" "}
                      {Number(item.options?.prix ?? item.prix ?? 0).toFixed(2)}{" "}
                      €
                    </p>

                    <p>Quantité : {item.options?.unit ?? item.quantity ?? 1}</p>
                  </div>
                </div>
              ))}
            </div>

            <button onClick={() => handleDelete(order._id)} className="Button">
              Supprimer la commande
            </button>

            <button
              onClick={() => handleUpdate(order._id, "confirmed")}
              className="Button"
            >
              Confirmer la commande
            </button>

            <button className="Button">Modifier la commande</button>

            <Link to="/payment" state={{ cart: cartItems }}>
              <button className="Button">Passer au paiement</button>
            </Link>
          </div>
        ))
      )}
    </div>
  );
}

/*
export default function Orders() {
  const [orders, setOrders] = useState([]);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const data = await OrderService.getAllOrders();
        setOrders(data);
      } catch (err) {
        console.error("Erreur lors de la récupération des commandes :", err);
      }
    };

    fetchOrders();
  }, []);

  const getImageUrl = (imageUrl) =>
    imageUrl
      ? `http://localhost:5001${imageUrl}`
      : `http://localhost:5001/uploads/`;

  return (
    <div className="orders-container">
      <h1>Mes Commandes</h1>
      {orders.length === 0 ? (
        <p>Aucune commande pour le moment.</p>
      ) : (
        orders.map((order) => (
          <div className="order-card" key={order._id}>
            <h2>Commande n°{order._id}</h2>
            <p>
              Client : {order.userId?.name || "Inconnu"} -{" "}
              {order.userId?.email || "Inconnu"}
            </p>
            <p>Adresse : {order.address}</p>
            <p>Total : {(order.totalPrice ?? 0).toFixed(2)} €</p>
            <p>Status : {order.status}</p>

            <div className="order-items">
              {order.items.map((item) => (
                <div className="order-item" key={item.productId}>
                  <img
                    className="item-image"
                    src={getImageUrl(item.imageUrl)}
                    alt={item.name}
                  />
                  <div className="item-details">
                    <h3>{item.name}</h3>
                    <p>Prix : {(item.prix ?? 0).toFixed(2)} €</p>
                    <p>Quantité : {item.quantity}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))
      )}
    </div>
  );
}
*/
/*
//Version celle du 28/11 le 2ème code 
export default function Orders() {
  const [orders, setOrders] = useState([]);
  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const data = await OrderService.getAllOrders();
        setOrders(data);
      } catch (err) {
        console.error("Erreur lors de la récupération des commandes :", err);
      }
    };

    fetchOrders();
  }, []);
  const getImageUrl = (imageUrl) =>
    imageUrl ? `http://localhost:5001${imageUrl}` : "/uploads/default.jpg";

  const handleDelete = async (orderId) => {
    try {
      await OrderService.deleteOrder(orderId);
      setOrders((prev) => prev.filter((order) => order._id !== orderId));
      alert("✅ Commande supprimée avec succès !");
    } catch (err) {
      console.error("Erreur lors de la suppression :", err);
      alert("❌ Impossible de supprimer la commande");
    }
  };

  const handleUpdate = async (orderId, newStatus) => {
    try {
      const updated = await OrderService.updateOrder(orderId, {
        status: newStatus,
      });
      setOrders((prev) =>
        prev.map((order) =>
          order._id === orderId
            ? { ...order, status: updated.order.status }
            : order
        )
      );
      alert("✅ Commande mise à jour !");
    } catch (err) {
      console.error("Erreur lors de la modification :", err);
      alert("❌ Impossible de modifier la commande");
    }
  };

  return (
    <div className="orders-container">
      <CheckoutSteps step={2} />
      <h1>Mes Commandes</h1>
      {orders.length === 0 ? (
        <p>Aucune commande pour le moment.</p>
      ) : (
        orders.map((order) => (
          <div className="order-card" key={order._id}>
            <h2>Commande n°{order._id}</h2>
            <p>
              Client : {order.userId?.nom || "Inconnu"} -{" "}
              {order.userId?.email || "Inconnu"}
            </p>
            <p>Adresse : {order.address}</p>
            <p>Total : {Number(order.totalPrice ?? 0).toFixed(2)} €</p>
            <p>Status : {order.status}</p>

            <div className="order-items">
              {order.items.map((item) => (
                <div
                  className="order-item"
                  key={`${order._id}-${item.productId}`}
                >
                  <img
                    className="item-image"
                    src={getImageUrl(item.imageUrl)}
                    alt={item.name}
                  />
                  <div className="item-details">
                    <h3>{item.name}</h3>
                    <p>Prix : {Number(item.prix ?? 0).toFixed(2)} €</p>
                    <p>Quantité : {item.quantity}</p>
                  </div>
                </div>
              ))}
            </div>

            <button
              className="delete-order-btn Button"
              onClick={() => handleDelete(order._id)}
            >
              Supprimer la commande
            </button>

            <button
              className="update-order-btn Button"
              onClick={() => handleUpdate(order._id, "confirmed")}
            >
              Confirmer la commande
            </button>

            <Link to="/delivery">
              <button className="delivery-btn Button">
                Choisir un mode de livraison
              </button>
            </Link>
          </div>
        ))
      )}
    </div>
  );
}
*/
