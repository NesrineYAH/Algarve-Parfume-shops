// pages/Orders/Orders.jsx
// pages/Orders/Orders.jsx
import React, { useEffect, useState, useContext } from "react";
import OrderService from "../../Services/orderService";
import "./commande.scss";
import { UserContext } from "../../context/UserContext";
import { Link, useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";

export default function Orders() {
  const { user, loadingUser } = useContext(UserContext);
  const [preOrders, setPreOrders] = useState([]);
  const [orders, setOrders] = useState([]);
  const [refundedOrders, setRefundedOrders] = useState([]);
  const [cancelledOrders, setCancelledOrders] = useState([]);
  const [errorMessage, setErrorMessage] = useState("");
  const [showCancelModal, setShowCancelModal] = useState(false);
  const [selectedOrderId, setSelectedOrderId] = useState(null);
  const [cancelReason, setCancelReason] = useState("");
  const [cancelDescription, setCancelDescription] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [activeFilter, setActiveFilter] = useState("all"); // "all", "paid", "cancelled", "refunded"
  const navigate = useNavigate();
  const { t } = useTranslation();

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

  const openCancelModal = (orderId) => {
    setSelectedOrderId(orderId);
    setCancelReason("");
    setCancelDescription("");
    setShowCancelModal(true);
  };

  const closeCancelModal = () => {
    setShowCancelModal(false);
    setSelectedOrderId(null);
    setCancelReason("");
    setCancelDescription("");
    setErrorMessage("");
  };

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

  // Compter les commandes par statut
  const getOrdersCount = () => {
    return {
      all: preOrders.length + orders.length + cancelledOrders.length + refundedOrders.length,
      paid: orders.length,
      cancelled: cancelledOrders.length,
      refunded: refundedOrders.length
    };
  };

  const counts = getOrdersCount();

  // Filtrer les commandes en fonction du filtre actif
  const shouldShowSection = (section) => {
    if (activeFilter === "all") return true;
    return activeFilter === section;
  };

  return (
    <div className="orders-container">
      {user && <h1>{t("Orders.h1")} {user.prenom}</h1>}

      {errorMessage && (
        <div className="error-banner">
          {errorMessage}
        </div>
      )}

      {/* FILTRES */}
      <div className="orders-filters">
        <button  className="button"
          onClick={() => setActiveFilter('all')}
        >
          Toutes les commandes ({counts.all})
        </button>
        <button 
          className={`button filter-btn paid ${activeFilter === 'paid' ? 'active' : ''}`}
          onClick={() => setActiveFilter('paid')}
        >
          Commandes payées ({counts.paid})
        </button>
        <button 
          className={`button filter-btn cancelled ${activeFilter === 'cancelled' ? 'active' : ''}`}
          onClick={() => setActiveFilter('cancelled')}
        >
          Commandes annulées ({counts.cancelled})
        </button>
        <button 
          className={`button filter-btn refunded ${activeFilter === 'refunded' ? 'active' : ''}`}
          onClick={() => setActiveFilter('refunded')}
        >
          Commandes remboursées ({counts.refunded})
        </button>
      </div>

      {/* 🆕 MODAL D'ANNULATION */}
      {showCancelModal && (
        <div className="modal-overlay" onClick={closeCancelModal}>
          <div className="cancel-modal" onClick={(e) => e.stopPropagation()}>
            <button className="modal-close" onClick={closeCancelModal}>×</button>
            
            <h2>{t("Orders.h2")}</h2>  
            
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
                    <strong>{t("Orders.reason-contentI")}</strong>  
                    <span>{t("Orders.reason-contentII")}</span>  
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
                    <strong>{t("Orders.reason-contentIII")}</strong> 
                    <span>{t("Orders.reason-contentV")}</span>  
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
                    <strong>{t("Orders.reason-contentVI")}</strong> 
                    <span>{t("Orders.reason-contentVVI")} </span> 
                  </div>
                </label>
              </div>

              <div className="cancel-description">
                <label htmlFor="cancelDescription">{t("Orders.cancelDescription")}:  
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
                > {t("Orders.Return")} 
                </button>
                <button 
                  className="btn-cancel" 
                  onClick={submitCancellation}
                  disabled={!cancelReason || isSubmitting}>
                  {isSubmitting ? "Annulation en cours..." : "Confirmer l'annulation"}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* SECTION COMMANDES EN ATTENTE DE PAIEMENT */}
      {shouldShowSection("all") && preOrders.length > 0 && (
        <>
          <h2 className="section-title pending">
            <span className="title-text">⏳ Commandes en attente de paiement</span>
            <span className="count-badge">{preOrders.length}</span>
          </h2>
          {preOrders.map((order) => (
            <div className="order-card pending" key={order._id}>
              <h3>{t("preOrders.h3")} {order._id}</h3> 
              <p>{t("preOrders.Payment")}:  {order.paymentStatus}</p> 
              <p>{t("preOrders.totalPrice")}: {order.totalPrice} €</p>
              <p>{t("preOrders.Date")}: {formatDate(order.paidAt)}</p>

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
                      <p>{t("preOrders.Size")}: {item.options?.size} {item.options?.unit}</p> 
                      <p>{t("preOrders.Price")}: {Number(item.options?.prix).toFixed(2)} €</p> 
                      <p>{t("preOrders.Quantity")} : {item.quantite}</p> 
                    </div>
                  </div>
                ))}
              </div>

              <div className="order_AllButtons">
                <Link to={`/payment/${order._id}`} state={{ order, orderId: order._id }}>
                  <button className="Button pay-btn">Payer maintenant</button> 
                </Link>
                <button
                  className="Button cancel-btn"
                  onClick={() => openCancelModal(order._id)}
                > {t("preOrders.concel")}
                </button>
              </div>
            </div>
          ))}
        </>
      )}

      {/* SECTION COMMANDES PAYÉES */}
      {shouldShowSection("paid") && orders.length > 0 && (
        <>
          <h2 className="section-title paid">
            <span className="title-text">✅ Commandes payées</span>
            <span className="count-badge">{orders.length}</span>
          </h2>
          {orders.map((order) => (
            <div className="order-card paid" key={order._id}> 
              <h3>{t("preOrders.h3")}{order._id}</h3>  
              <p>{t("preOrders.Payment")} : {order.paymentStatus}</p> 
              <p>{t("preOrders.status")} : {order.status}</p>  
              <p>{t("preOrders.totalPrice")}: {order.totalPrice} €</p>  
              <p>{t("preOrders.Date")}: {formatDate(order.paidAt)}</p> 

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
                      <p>{t("preOrders.Size")} : {item.options?.size} {item.options?.unit}</p>
                      <p>{t("preOrders.Price")} : {Number(item.options?.prix).toFixed(2)} €</p>
                      <p>{t("preOrders.Quantity")} : {item.quantite}</p>
                    </div>
                  </div>
                ))}
              </div>

              <div className="order_AllButtons">
                <Link to={`/tracking/${order._id}`}>
                  <button className="Button">Suivre ma commande</button>
                </Link>
                <button
                  className="Button cancel-btn"
                  onClick={() => openCancelModal(order._id)}
                >
                   {t("preOrders.concel")} 
                </button>
                {order.invoiceUrl && (
                  <a href={`http://localhost:5001${order.invoiceUrl}`} 
                     target="_blank"
                     rel="noopener noreferrer">
                    <button className="Button invoice-btn">📄 {t("preOrders.LoadInvoice")}</button>
                  </a>
                )}
              </div>
            </div>
          ))}
        </>
      )}

      {/* SECTION COMMANDES ANNULÉES */}
      {shouldShowSection("cancelled") && cancelledOrders.length > 0 && (
        <>
          <h2 className="section-title cancelled">
            <span className="title-text">❌ Commandes annulées</span>
            <span className="count-badge">{cancelledOrders.length}</span>
          </h2>
          {cancelledOrders.map((order) => (
            <div className="order-card cancelled" key={order._id}>
              <h3>{t("preOrders.h3")} {order._id}</h3>
              <p>{t("preOrders.status")}:  {t("preOrders.concel")} </p>
              {order.cancelReason && (
                <p className="cancel-reason">
                  <strong>{t("preOrders.Reason")} :</strong> {
                    order.cancelReason === 'changement_avis' ? 'Changement d\'avis' :
                    order.cancelReason === 'meilleur_prix' ? 'Meilleur prix trouvé' :
                    order.cancelReason === 'delai_livraison' ? 'Délai trop long' :
                    order.cancelReason
                  }
                </p>
              )}
              {order.cancelDescription && (
                <p className="cancel-description">
                  <strong>Détails :</strong> {order.cancelDescription}
                </p>
              )}
              <p className="cancelled-label"> {t("preOrders.cancelled-label")}</p>
            </div>
          ))}
        </>
      )}

      {/* SECTION COMMANDES REMBOURSÉES */}
      {shouldShowSection("refunded") && refundedOrders.length > 0 && (
        <>
          <h2 className="section-title refunded">
            <span className="title-text">💶 Commandes remboursées</span>
            <span className="count-badge">{refundedOrders.length}</span>
          </h2>
          {refundedOrders.map((order) => (
            <div className="order-card refunded" key={order._id}>
              <h3>{t("preOrders.h3")} {order._id}</h3>
              <p><strong>Statut :</strong> {t("preOrders.refunded")}</p>
              <p><strong>Montant remboursé :</strong> {order.totalPrice} €</p>
              <p><strong>Date de remboursement :</strong> {formatDate(order.refundedAt)}</p>
            </div>
          ))}
        </>
      )}

      {/* SI AUCUNE COMMANDE POUR LE FILTRE SÉLECTIONNÉ */}
      {activeFilter !== "all" && (
        (activeFilter === "paid" && orders.length === 0) ||
        (activeFilter === "cancelled" && cancelledOrders.length === 0) ||
        (activeFilter === "refunded" && refundedOrders.length === 0)
      ) && (
        <div className="no-orders-message">
          <p>Aucune commande {activeFilter === "paid" ? "payée" : activeFilter === "cancelled" ? "annulée" : "remboursée"} pour le moment.</p>
        </div>
      )}

      {/* SI AUCUNE COMMANDE DU TOUT */}
      {preOrders.length === 0 && orders.length === 0 && cancelledOrders.length === 0 && refundedOrders.length === 0 && (
        <div className="no-orders-message">
          <p>{t("preOrders.noOrder")}.</p>
        </div>
      )}
    </div>
  );
}











/*
import React, { useEffect, useState, useContext } from "react";
import OrderService from "../../Services/orderService";
import "./commande.scss";
import { UserContext } from "../../context/UserContext";
import { Link, useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";

export default function Orders() {
  const { user, loadingUser } = useContext(UserContext);
  const [preOrders, setPreOrders] = useState([]);
  const [orders, setOrders] = useState([]);
  const [refundedOrders, setRefundedOrders] = useState([]);
  const [cancelledOrders, setCancelledOrders] = useState([]);
  const [errorMessage, setErrorMessage] = useState("");
  const [showCancelModal, setShowCancelModal] = useState(false);
  const [selectedOrderId, setSelectedOrderId] = useState(null);
  const [cancelReason, setCancelReason] = useState("");
  const [cancelDescription, setCancelDescription] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const navigate = useNavigate();
    const { t } = useTranslation();


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
  const openCancelModal = (orderId) => {
    setSelectedOrderId(orderId);
    setCancelReason("");
    setCancelDescription("");
    setShowCancelModal(true);
  };
  const closeCancelModal = () => {
    setShowCancelModal(false);
    setSelectedOrderId(null);
    setCancelReason("");
    setCancelDescription("");
    setErrorMessage("");
  };
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
      {user && <h1>{t("Orders.h1")} {user.prenom}</h1>}  

      {errorMessage && (
        <div className="error-banner">
          {errorMessage}
        </div>
      )}

      {showCancelModal && (
        <div className="modal-overlay" onClick={closeCancelModal}>
          <div className="cancel-modal" onClick={(e) => e.stopPropagation()}>
            <button className="modal-close" onClick={closeCancelModal}>×</button>
            
            <h2>{t("Orders.h2")}</h2>  
            
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
                    <strong>{t("Orders.reason-contentI")}</strong>  
                    <span>{t("Orders.reason-contentII")}</span>  
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
                    <strong>{t("Orders.reason-contentIII")}</strong> 
                    <span>{t("Orders.reason-contentV")}</span>  
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
                    <strong>{t("Orders.reason-contentVI")}</strong> 
                    <span>{t("Orders.reason-contentVVI")} </span> 
                  </div>
                </label>
              </div>

              <div className="cancel-description">
                <label htmlFor="cancelDescription">{t("Orders.cancelDescription")}:  
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
                > {t("Orders.Return")} 
             
                </button>
                <button 
                  className="btn-cancel" 
                  onClick={submitCancellation}
                  disabled={!cancelReason || isSubmitting}>
                  {isSubmitting ? "Annulation en cours..." : "Confirmer l'annulation"}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

 
      {preOrders.length > 0 && (
        <>
          <h2>{t("preOrders.h2")}</h2> 
          {preOrders.map((order) => (
            <div className="order-card" key={order._id}>
              <h3>{t("preOrders.h3")} {order._id}</h3> 
              <p>{t("preOrders.Payment")}:  {order.paymentStatus}</p> 
              <p>{t("preOrders.totalPrice")}: {order.totalPrice} €</p>
              <p>{t("preOrders.Date")}: {formatDate(order.paidAt)}</p>

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
                      <p>{t("preOrders.Size")}: {item.options?.size} {item.options?.unit}</p> 
                      <p>{t("preOrders.Price")}: {Number(item.options?.prix).toFixed(2)} €</p> 
                      <p>{t("preOrders.Quantity")} : {item.quantite}</p> 
                    </div>
                  </div>
                ))}
              </div>

              <div className="order_AllButtons">
                <Link to={`/payment/${order._id}`} state={{ order, orderId: order._id }}>
                  <button className="Button">{t("preOrders.paye")}</button> 
                </Link>
                <button
                  className="Button"
                  onClick={() => openCancelModal(order._id)}
                > {t("preOrders.concel")}
                </button>
              </div>
            </div>
          ))}
        </>
      )}


      {orders.length > 0 && (
        <>
          <h2>{t("preOrders.h2")}</h2>  
          {orders.map((order) => (
            <div className="order-card" key={order._id}> 
              <h3>{t("preOrders.h3")}{order._id}</h3>  
              <p>{t("preOrders.Payment")} : {order.paymentStatus}</p> 
              <p>{t("preOrders.status")} : {order.status}</p>  
              <p>{t("preOrders.totalPrice")}: {order.totalPrice} €</p>  
              <p>{t("preOrders.Date")}: {formatDate(order.paidAt)}</p> 

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
                      <p>{t("preOrders.Size")} : {item.options?.size} {item.options?.unit}</p>
                      <p>{t("preOrders.Price")} : {Number(item.options?.prix).toFixed(2)} €</p>
                      <p>{t("preOrders.Quantity")} : {item.quantite}</p>
                    </div>
                  </div>
                ))}
              </div>

              <div className="order_AllButtons">
                <Link to={`/tracking/${order._id}`}>
                  <button className="Button">{t("preOrders.Button")}</button>
                </Link>
                <button
                  className="Button"
                  onClick={() => openCancelModal(order._id)}
                >
                   {t("preOrders.concel")} 
                </button>
                {order.invoiceUrl && (
                  <a href={`http://localhost:5001${order.invoiceUrl}`} 
                     target="_blank"
                     rel="noopener noreferrer">
                    <button className="Button">{t("preOrders.LoadInvoice")} </button>
                  </a>
                )}
              </div>
            </div>
          ))}
        </>
      )}

      {cancelledOrders.length > 0 && (
        <>
          <h2>{t("preOrders.h2I")} </h2>
          {cancelledOrders.map((order) => (
            <div className="order-card cancelled" key={order._id}>
              <h3>{t("preOrders.h3")} {order._id}</h3>
              <p>{t("preOrders.status")}:  {t("preOrders.concel")} </p>
              {order.cancelReason && (
                <p className="cancel-reason">{t("preOrders.Reason")} : {
                    order.cancelReason === 'changement_avis' ? 'Changement d\'avis' :
                    order.cancelReason === 'meilleur_prix' ? 'Meilleur prix trouvé' :
                    order.cancelReason === 'delai_livraison' ? 'Délai trop long' :
                    order.cancelReason
                  }
                </p>
              )}
              <p className="cancelled-label"> {t("preOrders.cancelled-label")}</p>
            </div>
          ))}
        </>
      )}

      {refundedOrders.length > 0 && (
        <>
          <h2> {t("preOrders.h2II")} </h2>
          {refundedOrders.map((order) => (
            <div className="order-card refunded" key={order._id}>
              <h3>{t("preOrders.h3")} {order._id}</h3>
              <p>{t("preOrders.status")} : {t("preOrders.refunded")}</p>
              <p>{t("preOrders.Montant")} : {order.totalPrice} €</p>
              <p>{t("preOrders.refundDate")} : {formatDate(order.refundedAt)}</p>
            </div>
          ))}
        </>
      )}


      {preOrders.length === 0 && orders.length === 0 && cancelledOrders.length === 0 && (
        <p> {t("preOrders.noOrder")}.</p>
      )}
    </div>
  );
}
*/
//   const getImageUrl = (imageUrl) =>  imageUrl ? `http://localhost:5001${imageUrl}` : "/uploads/default.jpg";



