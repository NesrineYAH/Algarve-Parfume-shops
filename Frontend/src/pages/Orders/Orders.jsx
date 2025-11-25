import React, { useEffect, useState } from "react";
import OrderService from "../../Services/orderService";
import "./Orders.scss";

function Orders() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    async function fetchOrders() {
      try {
        const data = await OrderService.getAllOrders();
        setOrders(data);
      } catch {
        setError("Impossible de récupérer les commandes.");
      } finally {
        setLoading(false);
      }
    }
    fetchOrders();
  }, []);

  if (loading) return <p className="loading">Chargement...</p>;
  if (error) return <p className="error">{error}</p>;

  return (
    <div className="orders-container">
      <h1 className="orders-title">Mes Commandes</h1>

      {orders.length === 0 ? (
        <p className="no-orders">Aucune commande trouvée.</p>
      ) : (
        orders.map((order) => (
          <div className="order-card" key={order._id}>
            <div className="order-header">
              <span>Commande n° {order._id}</span>
              <span className={`status ${order.status}`}>{order.status}</span>
            </div>

            <div className="order-items">
              {order.items.map((item, idx) => (
                <div className="order-item" key={idx}>
                  <img
                    src={item.image || "/placeholder.png"}
                    alt={item.name}
                    className="item-image"
                  />
                  <div>
                    <p className="item-name">{item.name}</p>
                    <p className="item-qty">Quantité : {item.quantity}</p>
                  </div>
                </div>
              ))}
            </div>

            <div className="order-footer">
              <p>
                Total : <strong>{order.totalPrice} €</strong>
              </p>
              <p>Adresse : {order.addresses}</p>
            </div>
          </div>
        ))
      )}
    </div>
  );
}

export default Orders;
