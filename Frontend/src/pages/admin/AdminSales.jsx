// pages/admin/AdminSales.jsx
import React, { useEffect, useState } from "react";
import axios from "axios";

const AdminSales = () => {
  const [orders, setOrders] = useState([]);
  const [totalRevenue, setTotalRevenue] = useState(0);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const res = await axios.get("http://localhost:5001/api/orders/admin", {
          withCredentials: true // cookie HTTP-only
        });
        setOrders(res.data.orders);
        setTotalRevenue(res.data.totalRevenue);
      } catch (err) {
        console.error(err);
      }
    };

    fetchOrders();
  }, []);

  return (
    <div>
      <h2>Tableau des ventes</h2>
      <p>Chiffre d'affaires total : {totalRevenue} €</p>
      <p>Total commandes : {orders.length}</p>

      <table>
        <thead>
          <tr>
            <th>Commande</th>
            <th>Client</th>
            <th>Date</th>
            <th>Produits</th>
            <th>Total</th>
          </tr>
        </thead>
        <tbody>
          {orders.map((order) => {
            const orderTotal = order.products.reduce(
              (sum, p) => sum + p.quantity * p.product.prix,
              0
            );
            return (
              <tr key={order._id}>
                <td>{order._id}</td>
                <td>{order.user.nom} ({order.user.email})</td>
                <td>{new Date(order.createdAt).toLocaleString()}</td>
                <td>
                  {order.products.map((p) => (
                    <div key={p.product._id}>
                      {p.product.nom} x {p.quantity} ({p.product.prix} €)
                    </div>
                  ))}
                </td>
                <td>{orderTotal} €</td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
};

export default AdminSales;
