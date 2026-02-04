import React, { useEffect, useState } from "react";
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
    axios.put(
  `http://localhost:5001/api/orders/${orderId}/ship`,
  {},
  { withCredentials: true }
);
    await fetchOrders(); // 🔥 recharge toutes les commandes depuis la BDD
  };

  return (

    <div className="admin-orders-table"> 
    <table>
  <thead >
    <tr>
      <th>ID Commande</th>
      <th>Client</th>
      <th>Date commande</th>
      <th>Pays</th>
      <th>Status</th>
      <th>Date expédition</th>
     <th>le montant de la commande</th>
     
      <th>Action</th>
    </tr>
  </thead>

  <tbody>
    {orders.map(order => (
      <tr key={order._id}>
        <td>{order._id}</td>
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
  {order.status === "confirmed" ? (
    <button onClick={() => shipOrder(order._id)}>
      Expédier
    </button>
  ) : (
    
    <button className="disabled" disabled>
      Non disponible
      <span className="done">✔</span>
    </button>
    
  )}
</td>

      </tr>
    ))}
  </tbody>
</table>

</div>


  );
}

{/*
        <td>
          {order.status !== "shipped" ? (
            <button onClick={() => shipOrder(order._id)}>
              Expédier
            </button>
          ) : (
            <span className="done">✔</span>
          )}
        </td>
    */}