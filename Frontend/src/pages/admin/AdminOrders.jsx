//AdminOrders.jsx 
import React, { useEffect, useState } from "react";
import OrderService from "../../Services/orderService";


import axios from "axios";
import "./admin.scss";

export default function AdminOrders() {
  const [orders, setOrders] = useState([]);

  const fetchOrders = async () => {
    const res = await axios.get("http://localhost:5001/api/orders/all", {
      withCredentials: true
    });
    setOrders(res.data);
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  const shipOrder = async (orderId) => {
    await axios.put(
      `http://localhost:5001/api/orders/${orderId}/ship`,
      {},
      { withCredentials: true }
    );

    await fetchOrders(); // recharge les commandes
  };
  const refundOrder = async (orderId) => {
  try {
    await OrderService.refundOrder(orderId);
    await fetchOrders(); // recharge la liste
  } catch (error) {
    console.error("Erreur remboursement :", error);
  }
};


  return (
    <div className="admin-table">
      <table>
        <thead>
          <tr>
            <th>ID Commande</th>
            <th>email_Client</th>
            <th>Client</th>
            <th>Date commande</th>
            <th>Pays</th>
            <th>Status</th>
            <th>Date expédition</th>
            <th>Montant</th>
            <th>Action</th>
          </tr>
        </thead>

        <tbody>
          {orders.map(order => (
            <tr key={order._id}>
              <td>{order._id}</td>
             <td>{order.userId?.email}</td>
              <td>
                {order.userId?.prenom} {order.userId?.nom}
              </td>

              <td>{new Date(order.createdAt).toLocaleDateString()}</td>
              

              <td>{order.userId?.pays || "—"}</td>

              <td>
                <span className={`status ${order.status}`}>
                  {order.status}
                </span>
              </td>

              <td>
                {order.shippedAt
                  ? new Date(order.shippedAt).toLocaleDateString()
                  : "—"}
              </td>
              

              <td>{order.totalPrice} €</td>

<td>
  {order.status === "confirmed" && (
    <button onClick={() => shipOrder(order._id)}>
      Expédier
    </button>
  )}

  {order.status === "shipped" && (
    <button disabled>En cours de livraison</button>
  )}

  {order.status === "delivered" && (
    <button disabled>Commande terminée</button>
  )}

  {order.status === "return_requested" && (
    <button disabled>Retour demandé</button>
  )}

  {order.status === "refunded" && (
    <button
      onClick={() => refundOrder(order._id)}
      style={{ background: "orange" }}
    >
      Rembourser
    </button>
  )}

  {order.status === "refunded" && (
    <button disabled>Remboursée ✔</button>
  )}
</td>


            </tr>
          ))}
        </tbody>
      </table>
      
    </div>
  );
}

