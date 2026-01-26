// pages/Orders/Orders.jsx
import React, { useEffect, useState, useContext } from "react";
import OrderService from "../../Services/orderService";
import "./Orders.scss";
import { UserContext } from "../../context/UserContext";
import { Link } from "react-router-dom";

export default function Orders() {
  const { user } = useContext(UserContext);
  const [preOrders, setPreOrders] = useState([]);
  const [orders, setOrders] = useState([]);

  useEffect(() => {
    if (!user?._id) return;

    const fetchOrders = async () => {
      try {
        const data = await OrderService.getUserOrders(user._id);
        setPreOrders(data.preOrders || []);
        setOrders(data.orders || []);
      } catch (err) {
        console.error("Erreur récupération commandes :", err);
      }
    };

    fetchOrders();
  }, [user]);

  const getImageUrl = (imageUrl) =>
    imageUrl ? `http://localhost:5001${imageUrl}` : "/uploads/default.jpg";

  const handleDelete = async (orderId) => {
    await OrderService.deleteOrder(orderId);
    setPreOrders((prev) => prev.filter((o) => o._id !== orderId));
    setOrders((prev) => prev.filter((o) => o._id !== orderId));
  };

  const handleCancel = async (orderId) => {
    await OrderService.cancelOrder(orderId);
    setPreOrders((prev) => prev.filter((o) => o._id !== orderId));
  };

return (
  <div className="orders-container">
    {user && (
      <h1>Bonjour {user.prenom}</h1>
    )}

    <h2>Mes Commandes</h2>
    {/* SI pré-commandes → afficher uniquement les pré-commandes */}
    {preOrders.length > 0 ? (
      <>

        {preOrders.map((order) => (
          <div className="order-card" key={order._id}>
            <h3>Commande n°{order._id}</h3>
            <p>Paiement : {order.paymentStatus}</p>
            <p>Prix Total : {order.totalPrice} €</p>
         <p>
  Date de création :{" "}
  {new Date(order.createdAt).toLocaleString("fr-FR", {
    day: "2-digit",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  })}
</p>


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
              <button onClick={() => handleDelete(order._id)} className="Button">
                Supprimer
              </button>
                <Link to={`/payment/${order._id}`}>
                  <button className="Button">Payer</button>
                </Link>
           <button className="Button" onClick={() => handleCancel(order._id)}>
                  Annuler
                </button>
            </div>
          </div>
        ))}
      </>
    ) : (
      <>
        {/* SINON → afficher les commandes confirmées */}
        <h2>Commandes Confirmées</h2>
        {orders.length === 0 ? (
          <p>Aucune commande confirmée.</p>
        ) : (
          orders.map((order) => (
            <div className="order-card" key={order._id}>
              <h2>Commande n°{order._id}</h2>
              <h4>Paiement : {order.paymentStatus}</h4>
              <h4>Prix Total : {order.totalPrice} €</h4>

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
                <button onClick={() => handleDelete(order._id)} className="Button">
                  Supprimer la commande
                </button>
                <Link to={`/payment/${order._id}`}>
                  <button className="Button">Passer au paiement</button>
                </Link>
                <Link><button className="Button">Suivre ma commande</button></Link>
                <Link><button className="Button">Confirmer la réception</button></Link>
                <Link><button className="Button">Suivez votre Commande</button></Link>
              </div>
            </div>
          ))
        )}
      </>
    )}
  </div>
);

}

/*
  return (
    <div className="orders-container">
      {user && (
        <h1>
          Bonjour {user.prenom}  
        </h1>
      )}

      <h2>Mes Commandes</h2>

      {preOrders.length === 0 ? (
        <p>Aucune pré-commande pour le moment.</p>
      ) : (
        preOrders.map((order) => (
          <div className="order-card" key={order._id}>
            
            <h3>commande n°{order._id}</h3>   
            <h4>Paiement : {order.paymentStatus}</h4>
            <h4>Prix Total : {order.totalPrice} € </h4>
        
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
                    <p>
                      Taille : {item.options?.size} {item.options?.unit}
                    </p>
                    <p>Prix : {Number(item.options?.prix).toFixed(2)} €</p>
                    <p>Quantité : {item.quantite}</p>
                  </div>
                </div>
              ))}
            </div>
            <div className="order_AllButtons">
            <button onClick={() => handleDelete(order._id)} className="Button">
              Supprimer
            </button>
             <Link to={`/payment/${order._id}`}>
            <button className="Button">Confirmer et payer</button></Link>
            </div>
          </div>
        ))
      )}

      <h2>Commandes Confirmées</h2>
      {orders.length === 0 ? (
        <p>Aucune commande confirmée.</p>
      ) : (
        orders.map((order) => (
          <div className="order-card" key={order._id}>
     
            <h2>Commande n°{order._id}</h2>  
            <h4>Paiement : {order.paymentStatus}</h4>
            <h4>Prix Total : {order.totalPrice} € </h4>
          
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
                    <p>
                      Taille : {item.options?.size} {item.options?.unit}
                    </p>
                    <p>Prix : {Number(item.options?.prix).toFixed(2)} €</p>
                    <p>Quantité : {item.quantite}</p>
                  </div>
                </div>
              ))}
            </div>

            <div className="order_AllButtons">
            <button onClick={() => handleDelete(order._id)} className="Button">
              Supprimer la commande
            </button>
        <Link to={`/payment/${order._id}`}> <button className="Button">Passer au payment</button> </Link>
        <Link><button className="Button"> suivre ma commande </button></Link>
                <Link><button className="Button"> Confirmer la réception </button></Link>
            </div>   
          </div>
        ))
      )}
    </div>
  );
*/




/*
export default function Orders() {
  const [preOrders, setPreOrders] = useState([]);
  const [orders, setOrders] = useState([]);
  const { user } = useContext(UserContext);

  useEffect(() => {
    const fetchOrders = async () => {
      if (!user || !user._id){
         console.log("Utilisateur non défini ou _id manquant :", user);
          return;
        }

      try {
        console.log("Utilisateur connecté :", user);

        const data = await OrderService.getUserOrders(user._id);
        console.log("Data reçue :", data);

        setPreOrders(data.preOrders || []);
        setOrders(data.orders || []);
      } catch (err) {
        console.error("Erreur fetch orders:", err);
      }
    };

    fetchOrders();
  }, [user]);

  const getImageUrl = (imageUrl) =>
    imageUrl ? `http://localhost:5001${imageUrl}` : "/uploads/default.jpg";

  const handleDelete = async (orderId) => {
    try {
      await OrderService.deleteOrder(orderId);
      setPreOrders((prev) => prev.filter((o) => o._id !== orderId));
      setOrders((prev) => prev.filter((o) => o._id !== orderId));
      alert("Commande supprimée !");
    } catch (err) {
      console.error(err);
      alert("Erreur suppression commande");
    }
  };

  const handleUpdate = async (orderId) => {
    try {
      const updated = await OrderService.updateOrder(orderId, {
        status: "confirmed",
        paymentStatus: "paid",
      });
      const updatedOrder = updated.order;

      // Retire des pré-commandes et ajoute aux commandes confirmées
      setPreOrders((prev) => prev.filter((o) => o._id !== orderId));
      setOrders((prev) => [...prev, updatedOrder]);

      alert("Commande confirmée !");
    } catch (err) {
      console.error(err);
      alert("Erreur lors de la mise à jour");
    }
  };

  return (
    <div className="orders-container">
      <h1>Mes Commandes</h1>

      {user && (
        <p>
          Bonjour {user.prenom} {user.nom} ({user.email})
        </p>
      )}

      <h2>Pré-commandes</h2>
      {preOrders.length === 0 ? (
        <p>Aucune pré-commande pour le moment.</p>
      ) : (
        preOrders.map((order) => (
          <div className="order-card" key={order._id}>
            <h3>Pré-commande n°{order._id}</h3>
            <p>Status : {order.status}</p>
            <p>Paiement : {order.paymentStatus}</p>

            <div className="order-items">
              {order.items.map((item, idx) => (
                <div className="order-item" key={idx}>
                  <img
                    className="item-image"
                    src={getImageUrl(item.imageUrl)}
                    alt={item.nom}
                  />
                  <div className="item-details">
                    <h4>{item.nom}</h4>
                    <p>
                      Taille : {item.options?.size} {item.options?.unit}
                    </p>
                    <p>Prix : {Number(item.options?.prix).toFixed(2)} €</p>
                    <p>Quantité : {item.quantite}</p>
                  </div>
                </div>
              ))}
            </div>

            <button onClick={() => handleDelete(order._id)} className="Button">
              Supprimer
            </button>
            <button onClick={() => handleUpdate(order._id)} className="Button">
              Confirmer et payer
            </button>
          </div>
        ))
      )}

      <h2>Commandes Confirmées</h2>
      {orders.length === 0 ? (
        <p>Aucune commande confirmée.</p>
      ) : (
        orders.map((order) => (
          <div className="order-card" key={order._id}>
            <h3>Commande n°{order._id}</h3>
            <p>Status : {order.status}</p>
            <p>Paiement : {order.paymentStatus}</p>

            <div className="order-items">
              {order.items.map((item, idx) => (
                <div className="order-item" key={idx}>
                  <img
                    className="item-image"
                    src={getImageUrl(item.imageUrl)}
                    alt={item.nom}
                  />
                  <div className="item-details">
                    <h4>{item.nom}</h4>
                    <p>
                      Taille : {item.options?.size} {item.options?.unit}
                    </p>
                    <p>Prix : {Number(item.options?.prix).toFixed(2)} €</p>
                    <p>Quantité : {item.quantite}</p>
                  </div>
                </div>
              ))}
            </div>

            <button onClick={() => handleDelete(order._id)} className="Button">
              Supprimer la commande
            </button>
          </div>
        ))
      )}
    </div>
  );
}
*/


/*
export default function Orders() {
  console.log("Orders page loaded");

  const [orders, setOrders] = useState([]);
  const [preOrders, setPreOrders] = useState([]);
  const { user } = useContext(UserContext);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        if (!user) {
          console.log("Aucun utilisateur connecté");
          return;
        }
        console.log("Utilisateur connecté :", user);
        const data = await OrderService.getUserOrders(user._id);
        console.log("Data reçue :", data);

        const pre = data.filter(
          (o) => o.status === "pending" && o.paymentStatus === "pending"
        );
        const orders  = data.filter(
          (o) => o.status === "confirmed" && o.paymentStatus === "paid"
        );

        setPreOrders(pre);
        setOrders(orders);
      } catch (err) {
        console.error("Erreur fetch orders:", err);
      }
    };

    console.log("user:", user);
    fetchOrders();
  }, [user]); // ✅ relance si user change

  const getImageUrl = (imageUrl) =>
    imageUrl ? `http://localhost:5001${imageUrl}` : "/uploads/default.jpg";

  // SUPPRESSION
  const handleDelete = async (orderId) => {
    try {
      await OrderService.deleteOrder(orderId);
      setOrders((prev) => prev.filter((o) => o._id !== orderId));
      setPreOrders((prev) => prev.filter((o) => o._id !== orderId));
      alert("Commande supprimée !");
    } catch (err) {
      console.error(err);
      alert("Erreur suppression commande");
    }
  };

  // CONFIRMATION
  const handleUpdate = async (orderId) => {
    try {
      const updated = await OrderService.updateOrder(orderId, {
        status: "confirmed",
        paymentStatus: "paid",
      });

      const updatedOrder = updated.order;

      setPreOrders((prev) => prev.filter((o) => o._id !== orderId));
      setOrders((prev) => [...prev, updatedOrder]);

      alert("Commande confirmée !");
    } catch (err) {
      console.error(err);
      alert("Erreur lors de la mise à jour");
    }
  };

  return (
    <div className="orders-container">
      <h1>Mes Commandes</h1>

      {user && (
        <p>
          Bonjour {user.prenom} {user.nom} ({user.email})
        </p>
      )}

      <h2>Pré-commandes</h2>
      {preOrders.length === 0 ? (
        <p>Aucune pré-commande pour le moment.</p>
      ) : (
        preOrders.map((order) => (
          <div className="order-card" key={order._id}>
            <h2>Pré-commande n°{order._id}</h2>
            <p>Status : {order.status}</p>
            <p>Paiement : {order.paymentStatus}</p>

            <div className="order-items">
              {order.items.map((item) => (
                <div
                  className="order-item"
                  key={`${order._id}-${item.variantId}`}
                >
                  <img
                    className="item-image"
                    src={getImageUrl(item.imageUrl)}
                    alt={item.nom}
                  />
                  <div className="item-details">
                    <h3>{item.nom}</h3>
                    <p>
                      Taille : {item.options?.size} {item.options?.unit}
                    </p>
                    <p>Prix : {Number(item.options?.prix).toFixed(2)} €</p>
                    <p>Quantité : {item.quantite}</p>
                  </div>
                </div>
              ))}
            </div>

            <button onClick={() => handleDelete(order._id)} className="Button">
              Supprimer
            </button>
            <button onClick={() => handleUpdate(order._id)} className="Button">
              Confirmer et payer
            </button>
          </div>
        ))
      )}

      <h2>Commandes Confirmées</h2>
      {orders.length === 0 ? (
        <p>Aucune commande confirmée.</p>
      ) : (
        orders.map((order) => (
          <div className="order-card" key={order._id}>
            <h2>Commande n°{order._id}</h2>
            <p>Status : {order.status}</p>
            <p>Paiement : {order.paymentStatus}</p>

            <div className="order-items">
              {order.items.map((item) => (
                <div
                  className="order-item"
                  key={`${order._id}-${item.variantId}`}
                >
                  <img
                    className="item-image"
                    src={getImageUrl(item.imageUrl)}
                    alt={item.nom}
                  />
                  <div className="item-details">
                    <h3>{item.nom}</h3>
                    <p>
                      Taille : {item.options?.size} {item.options?.unit}
                    </p>
                    <p>Prix : {Number(item.options?.prix).toFixed(2)} €</p>
                    <p>Quantité : {item.quantite}</p>
                  </div>
                </div>
              ))}
            </div>

            <button onClick={() => handleDelete(order._id)} className="Button">
              Supprimer la commande
            </button>
          </div>
        ))
      )}
    </div>
  );
}
*/
/*
On ajoute UserContext dans Orders.jsx pour :

    Savoir quel utilisateur est connecté.

    Charger ses commandes depuis l’API avec son user._id.

    Afficher ses infos (nom, prénom, email).

    Simplifier le code en évitant de manipuler localStorage directement.

👉 Bref, UserContext = source unique de vérité pour l’utilisateur connecté, exactement comme CartContext l’est pour le panier.
 */
