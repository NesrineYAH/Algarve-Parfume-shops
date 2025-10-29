import React, { useEffect, useState } from 'react';
import { getOrders } from '../services/orderService';

function Orders() {
  const [orders, setOrders] = useState([]);

  useEffect(() => {
    async function fetchOrders() {
      const data = await getOrders();
      setOrders(data);
    }
    fetchOrders();
  }, []);

  return (
    <div>
      <h2>Mes commandes</h2>
      {orders.map((o, i) => (
        <div key={i}>
          <p>Total: {o.total} €</p>
          <p>Statut: {o.statut}</p>
        </div>
      ))}
    </div>
  );
}

export default Orders;
