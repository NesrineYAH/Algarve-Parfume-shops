// pages/Orders/Orders.jsx
import React, { useEffect, useState, useContext } from "react";
import OrderService from "../../Services/orderService";
import "./Orders.scss";
import { UserContext } from "../../context/UserContext";
import { Link, useNavigate } from "react-router-dom";

export default function Orders() {
  const { user, loadingUser } = useContext(UserContext);
  const [preOrders, setPreOrders] = useState([]);
  const [orders, setOrders] = useState([]);
  const [refundedOrders, setRefundedOrders]  = useState([]); 
  const [cancelledOrders, setCancelledOrders] = useState([]);
  const [errorMessage, setErrorMessage] = useState("");

    const navigate = useNavigate();

    

useEffect(() => {
  
   if (loadingUser) return;  // ⏳ On attend que le user soit chargé 
  if (!user) {
    navigate("/authentification");
    return;
  }

  if (!user._id) return;

  const fetchOrders = async () => {
    try {
  //    const data = await OrderService.getUserOrders(user._id);
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

  const handleCancel = async (orderId) => {
    try {
      await OrderService.cancelOrder(orderId);
      setPreOrders((prev) => prev.filter((o) => o._id !== orderId));
      setOrders((prev) => prev.filter((o) => o._id !== orderId));
      setCancelledOrders((prev) => [...prev,{ _id: orderId, status: "cancelled" } ]);
    } catch (err) {
    const errorMessage = err.response?.data?.message || "Erreur lors de l'annulation.";
 setErrorMessage(errorMessage);  
  setTimeout(() => setErrorMessage(""), 4000);
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
          onClick={() => {if (window.confirm("Êtes-vous sûr de vouloir annuler cette commande ?")) {
      handleCancel(order._id); } }} >Annuler </button>

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
          onClick={() => {if (window.confirm("Êtes-vous sûr de vouloir annuler cette commande ?")) {
      handleCancel(order._id); } }} >Annuler </button>

  {/* Optionnel : afficher la facture même remboursée */}
   
        {order.invoiceUrl && (
        <a href={`http://localhost:5001${order.invoiceUrl}`} 
            target="_blank"
          rel="noopener noreferrer">  <button className="Button"> Télécharger la facture</button></a>
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

              <p className="cancelled-label">Cette commande a été annulée</p>
            </div>
          ))}
        </>
      )}
 
      {/* SI AUCUNE COMMANDE */}
      {preOrders.length === 0 && orders.length === 0 && cancelledOrders.length === 0 && (
        <p>Aucune commande pour le moment.</p>
      )}

            {/*SECTION COMMANDES ANNULÉES REMBOURS*/}
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


      
    </div>
  );
}



//   const getImageUrl = (imageUrl) =>  imageUrl ? `http://localhost:5001${imageUrl}` : "/uploads/default.jpg";



