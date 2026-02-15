//Frontend/src/pages/admin/AdminOrders.jsx
import React, { useEffect, useState } from "react";
import axios from "axios";
import ReturnService from "../../Services/returnService";
import "./admin.scss";

export default function AdminOrders() {
  const [orders, setOrders] = useState([]);
  const [openOrder, setOpenOrder] = useState(null);

  const fetchOrders = async () => {
    const res = await axios.get("http://localhost:5001/api/orders/all", {
      withCredentials: true
    });
    setOrders(res.data);
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  const toggleDetails = (id) => {
    setOpenOrder(openOrder === id ? null : id);
  };

  const shipOrder = async (orderId) => {
    await axios.put(
      `http://localhost:5001/api/orders/${orderId}/ship`,
      {},
      { withCredentials: true }
    );
    await fetchOrders();
  };

  const refundOrder = async (orderId) => {
    await axios.post(
      `http://localhost:5001/api/orders/${orderId}/refund`,
      {},
      { withCredentials: true }
    );
    await fetchOrders();
  };

  const approveProductReturn = async (returnId) => {
    await ReturnService.approveProductReturn(returnId);
    await fetchOrders();
  };

  const markAsReturned = async (orderId, productId) => {
    await ReturnService.markAsReturned(orderId, productId);
    await fetchOrders();
  };

  const refundProduct = async (orderId, productId) => {
    await ReturnService.refundProduct(orderId, productId);
    await fetchOrders();
  };

  return (
    <div className="admin-table">
      <table>
        <thead>
          <tr>
            <th>ID Commande</th>
            <th>Email Client</th>
            <th>Client</th>
            <th>Date</th>
            <th>Pays</th>
            <th>Status</th>
            <th>Expédition</th>
            <th>Montant</th>
            <th>Action</th>
          </tr>
        </thead>

        <tbody>
          {orders.map(order => (
            <React.Fragment key={order._id}>
              <tr>
                <td>{order._id}</td>
                <td>{order.userId?.email}</td>
                <td>{order.userId?.prenom} {order.userId?.nom}</td>
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
                  <button onClick={() => toggleDetails(order._id)}>
                    Détails
                  </button>

                  {order.status === "confirmed" && (
                    <button onClick={() => shipOrder(order._id)}>
                      Expédier
                    </button>
                  )}

                  {order.status === "returned" && (
                    <button
                      onClick={() => refundOrder(order._id)}
                      style={{ background: "orange" }}
                    >
                      Rembourser commande
                    </button>
                  )}

                  {order.status === "refunded" && (
                    <button disabled>Remboursée ✔</button>
                  )}
                </td>
              </tr>

              {openOrder === order._id && (
                <tr className="order-details">
                  <td colSpan="9">
                    <table className="sub-table">
                      <thead>
                        <tr>
                          <th>Produit</th>
                          <th>Quantité</th>
                          <th>Retour</th>
                          <th>Action admin</th>
                        </tr>
                      </thead>

                      <tbody>
                        {order.items.map(item => (
                          <tr key={item.productId}>
                            <td>{item.nom}</td>
                            <td>{item.quantite}</td>

                            <td>
                              <span className={`status ${item.returnStatus}`}>
                                {item.returnStatus}
                              </span>
                            </td>

                            <td>
                              {item.returnStatus === "requested" && (
                           <button
 onClick={() => approveProductReturn(item.options.returnId)}
 // onClick={() => approveProductReturn(item.returnId)}
  style={{ background: "green", color: "white" }}
>
  Approuver retour
</button>

                              )}

                              {item.returnStatus === "approved" && (
                                <button
                                  onClick={() =>
                                    markAsReturned(order._id, item.productId)
                                  }
                                  style={{ background: "blue", color: "white" }}
                                >
                                  Colis reçu
                                </button>
                              )}

                              {item.returnStatus === "returned" && (
                                <button
                                  onClick={() =>
                                    refundProduct(order._id, item.productId)
                                  }
                                  style={{ background: "orange" }}
                                >
                                  Rembourser
                                </button>
                              )}

                              {item.returnStatus === "refunded" && (
                                <button disabled>Remboursé ✔</button>
                              )}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </td>
                </tr>
              )}
            </React.Fragment>
          ))}
        </tbody>
      </table>
    </div>
  );
}
