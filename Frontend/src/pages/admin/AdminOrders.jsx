//Frontend/src/pages/admin/AdminOrders.jsx
import React, { useEffect, useState } from "react";
import axios from "axios";
import ReturnService from "../../Services/returnService";
import "./admin.scss";

export default function AdminOrders() {
  const [orders, setOrders] = useState([]);
  const [openOrder, setOpenOrder] = useState(null);

  // 🔥 Nouveau : filtre
  const [filter, setFilter] = useState({
    status: "all",
    paymentStatus: "all",
    delivery: "all",
  });

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

  // 🔥 Nouveau : filtrage dynamique
  const filteredOrders = orders.filter(order => {
    const matchStatus =
      filter.status === "all" || order.status === filter.status;

    const matchPayment =
      filter.paymentStatus === "all" || order.paymentStatus === filter.paymentStatus;

    const matchDelivery =
      filter.delivery === "all" || order.delivery === filter.delivery;

    return matchStatus && matchPayment && matchDelivery;
  });

  return (
    <div className="admin-table">

      {/* 🔥 Nouveau : barre de filtres */}
      <div className="filters" style={{ marginBottom: "20px", display: "flex", gap: "20px" }}>
        
        <div>
          <label>Status commande :</label>
          <select
            value={filter.status}
            onChange={(e) => setFilter({ ...filter, status: e.target.value })}
          >
            <option value="all">Tous</option>
            <option value="pending">pending</option>
            <option value="confirmed">confirmed</option>
            <option value="shipped">shipped</option>
            <option value="delivered">delivered</option>
            <option value="return_requested">return_requested</option>
            <option value="returned">returned</option>
            <option value="cancelled">cancelled</option>
            <option value="refunded">refunded</option>
          </select>
        </div>

        <div>
          <label>Paiement :</label>
          <select
            value={filter.paymentStatus}
            onChange={(e) =>
              setFilter({ ...filter, paymentStatus: e.target.value })
            }
          >
            <option value="all">Tous</option>
            <option value="paid">paid</option>
            <option value="unpaid">unpaid</option>
            <option value="failed">failed</option>
            <option value="refunded">refunded</option>
          </select>
        </div>

        <div>
          <label>Livraison :</label>
          <select
            value={filter.delivery}
            onChange={(e) =>
              setFilter({ ...filter, delivery: e.target.value })
            }
          >
            <option value="all">Tous</option>
            <option value="processing">processing</option>
            <option value="shipped">shipped</option>
            <option value="in_transit">in_transit</option>
            <option value="out_for_delivery">out_for_delivery</option>
            <option value="delivered">delivered</option>
          </select>
        </div>

      </div>

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
          {filteredOrders.map(order => (
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
                                  onClick={() => approveProductReturn(item.returnId)}
                                  style={{ background: "green", color: "white" }}
                                >
                                  Approuver retour
                                </button>
                              )}

                              {item.returnStatus === "approved" && (
                                <button
                                  onClick={() => markAsReturned(order._id, item.productId)}
                                  style={{ background: "blue", color: "white", marginLeft: "10px" }}
                                >
                                  Colis reçu
                                </button>
                              )}

                              {item.returnStatus === "returned" && (
                                <button
                                  onClick={() => refundProduct(order._id, item.productId)}
                                  style={{ background: "orange", color: "white", marginLeft: "10px" }}
                                >
                                  Rembourser
                                </button>
                              )}

                              {item.returnStatus === "refunded" && (
                                <span style={{ color: "green", fontWeight: "bold" }}>
                                  ✔ Remboursé
                                </span>
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

