// pages/Orders/Orders.jsx
import React, { useEffect, useState, useContext } from "react";
import OrderService from "../../Services/orderService";
import "./commande.scss";
import { UserContext } from "../../context/UserContext";
import { Link, useNavigate } from "react-router-dom";

export default function Orders() {
  const { user, loadingUser } = useContext(UserContext);
  const [preOrders, setPreOrders] = useState([]);
  const [orders, setOrders] = useState([]);
  const [refundedOrders, setRefundedOrders] = useState([]);
  const [cancelledOrders, setCancelledOrders] = useState([]);
  const [errorMessage, setErrorMessage] = useState("");
  
  // 🆕 États pour le modal d'annulation
  const [showCancelModal, setShowCancelModal] = useState(false);
  const [selectedOrderId, setSelectedOrderId] = useState(null);
  const [cancelReason, setCancelReason] = useState("");
  const [cancelDescription, setCancelDescription] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const navigate = useNavigate();

  useEffect(() => {
    if (loadingUser) return;
    if (!user) {
      navigate("/authentification");
      return;
    }
    if (!user._id) return;

    const fetchOrders = async () => {
      try {
        const data = await OrderService.getUserOrders();
        setPreOrders(data.preOrders || []);
        setOrders(data.orders || []);
        setCancelledOrders(data.cancelledOrders || []);
        setRefundedOrders(data.refundedOrders || []);
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

  // 🆕 Fonction pour ouvrir le modal d'annulation
  const openCancelModal = (orderId) => {
    setSelectedOrderId(orderId);
    setCancelReason("");
    setCancelDescription("");
    setShowCancelModal(true);
  };

  // 🆕 Fonction pour fermer le modal
  const closeCancelModal = () => {
    setShowCancelModal(false);
    setSelectedOrderId(null);
    setCancelReason("");
    setCancelDescription("");
    setErrorMessage("");
  };

  // 🆕 Fonction pour soumettre l'annulation avec la raison
  const submitCancellation = async () => {
    if (!cancelReason) {
      setErrorMessage("Veuillez sélectionner une raison d'annulation");
      return;
    }

    setIsSubmitting(true);
    setErrorMessage("");

    try {
      await OrderService.cancelOrder(selectedOrderId, {
        reason: cancelReason,
        description: cancelDescription
      });

      // Mise à jour des listes
      setPreOrders((prev) => prev.filter((o) => o._id !== selectedOrderId));
      setOrders((prev) => prev.filter((o) => o._id !== selectedOrderId));
      setCancelledOrders((prev) => [
        ...prev,
        {
          _id: selectedOrderId,
          status: "cancelled",
          cancelledAt: new Date(),
          cancelReason: cancelReason,
          cancelDescription: cancelDescription
        }
      ]);

      closeCancelModal();
    } catch (err) {
      const errorMessage = err.response?.data?.message || "Erreur lors de l'annulation.";
      setErrorMessage(errorMessage);
    } finally {
      setIsSubmitting(false);
    }
  };

  function formatDate(dateString) {
    const date = new Date(dateString);
    const day = String(date.getDate()).padStart(2, "0");
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const year = date.getFullYear();
    return `${day}-${month}-${year}`;
  }

  return (
    <div className="orders-container">
      {user && <h1>Bonjour {user.prenom}</h1>}

      {errorMessage && (
        <div className="error-banner">
          {errorMessage}
        </div>
      )}

      {/* 🆕 MODAL D'ANNULATION */}
      {showCancelModal && (
        <div className="modal-overlay" onClick={closeCancelModal}>
          <div className="cancel-modal" onClick={(e) => e.stopPropagation()}>
            <button className="modal-close" onClick={closeCancelModal}>×</button>
            
            <h2>Pourquoi annulez-vous cette commande ?</h2>
            
            <div className="modal-content">
              <div className="cancel-reasons">
                <label className={`reason-option ${cancelReason === 'changement_avis' ? 'selected' : ''}`}>
                  <input
                    type="radio"
                    name="cancelReason"
                    value="changement_avis"
                    checked={cancelReason === 'changement_avis'}
                    onChange={(e) => setCancelReason(e.target.value)}
                  />
                  <div className="reason-content">
                    <strong>Changement d'avis</strong>
                    <span>Je ne souhaite plus ce produit</span>
                  </div>
                </label>

                <label className={`reason-option ${cancelReason === 'meilleur_prix' ? 'selected' : ''}`}>
                  <input
                    type="radio"
                    name="cancelReason"
                    value="meilleur_prix"
                    checked={cancelReason === 'meilleur_prix'}
                    onChange={(e) => setCancelReason(e.target.value)}
                  />
                  <div className="reason-content">
                    <strong>J'ai trouvé moins cher ailleurs</strong>
                    <span>Je souhaite comparer les prix</span>
                  </div>
                </label>

                <label className={`reason-option ${cancelReason === 'delai_livraison' ? 'selected' : ''}`}>
                  <input
                    type="radio"
                    name="cancelReason"
                    value="delai_livraison"
                    checked={cancelReason === 'delai_livraison'}
                    onChange={(e) => setCancelReason(e.target.value)}
                  />
                  <div className="reason-content">
                    <strong>Délai de livraison trop long</strong>
                    <span>Je ne peux pas attendre</span>
                  </div>
                </label>
              </div>

              <div className="cancel-description">
                <label htmlFor="cancelDescription">
                  Détails supplémentaires (optionnel) :
                </label>
                <textarea
                  id="cancelDescription"
                  value={cancelDescription}
                  onChange={(e) => setCancelDescription(e.target.value)}
                  placeholder="Pouvez-vous nous en dire plus ?"
                  rows="3"
                />
              </div>

              {errorMessage && (
                <div className="modal-error">
                  ⚠️ {errorMessage}
                </div>
              )}

              <div className="modal-actions">
                <button 
                  className="btn-secondary" 
                  onClick={closeCancelModal}
                  disabled={isSubmitting}
                >
                  Retour
                </button>
                <button 
                  className="btn-cancel" 
                  onClick={submitCancellation}
                  disabled={!cancelReason || isSubmitting}
                >
                  {isSubmitting ? "Annulation en cours..." : "Confirmer l'annulation"}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* SECTION PRÉ-COMMANDES */}
      {preOrders.length > 0 && (
        <>
          <h2>Pré-commandes</h2>
          {preOrders.map((order) => (
            <div className="order-card" key={order._id}>
              <h3>Commande n°{order._id}</h3>
              <p>Paiement : {order.paymentStatus}</p>
              <p>Prix Total : {order.totalPrice} €</p>
              <p>Date: {formatDate(order.paidAt)}</p>

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
                <Link to={`/payment/${order._id}`} state={{ order, orderId: order._id }}>
                  <button className="Button">Payer</button>
                </Link>
                <button
                  className="Button"
                  onClick={() => openCancelModal(order._id)}
                >
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
              <p>Status : {order.status}</p>
              <p>Prix Total : {order.totalPrice} €</p>
              <p>Date: {formatDate(order.paidAt)}</p>

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
                <Link to={`/tracking/${order._id}`}>
                  <button className="Button">Suivre ma commande</button>
                </Link>
                <button
                  className="Button"
                  onClick={() => openCancelModal(order._id)}
                >
                  Annuler
                </button>
                {order.invoiceUrl && (
                  <a href={`http://localhost:5001${order.invoiceUrl}`} 
                     target="_blank"
                     rel="noopener noreferrer">
                    <button className="Button">Télécharger la facture</button>
                  </a>
                )}
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
              {order.cancelReason && (
                <p className="cancel-reason">
                  Raison : {
                    order.cancelReason === 'changement_avis' ? 'Changement d\'avis' :
                    order.cancelReason === 'meilleur_prix' ? 'Meilleur prix trouvé' :
                    order.cancelReason === 'delai_livraison' ? 'Délai trop long' :
                    order.cancelReason
                  }
                </p>
              )}
              <p className="cancelled-label">Cette commande a été annulée</p>
            </div>
          ))}
        </>
      )}

      {/* SECTION COMMANDES REMBOURSÉES */}
      {refundedOrders.length > 0 && (
        <>
          <h2>Commandes Remboursées</h2>
          {refundedOrders.map((order) => (
            <div className="order-card refunded" key={order._id}>
              <h3>Commande n°{order._id}</h3>
              <p>Status : Remboursée</p>
              <p>Montant : {order.totalPrice} €</p>
              <p>Date du remboursement : {formatDate(order.refundedAt)}</p>
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



