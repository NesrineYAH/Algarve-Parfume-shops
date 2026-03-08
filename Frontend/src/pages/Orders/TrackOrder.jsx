import React, { useState, useContext, useEffect } from "react"; // ← AJOUTER useEffect
import { useParams, useNavigate } from "react-router-dom";
import { CartContext } from "../../context/CartContext";
import { useTranslation } from "react-i18next";


export default function TrackOrder() {
  const { orderId: orderIdFromUrl } = useParams(); 
  const [orderId, setOrderId] = useState(orderIdFromUrl || ""); 
  const [orderData, setOrderData] = useState(null); 
  const [error, setError] = useState(""); 
  const [showDetails, setShowDetails] = useState(false);
  const [hasSearched, setHasSearched] = useState(false);
  const [showOrderModal, setShowOrderModal] = useState(false);          
  const { addToCartContext } = useContext(CartContext);
  const [selectedItems, setSelectedItems] = useState([]);
  const navigate = useNavigate();
      const { t } = useTranslation();
  

  // ✅ SOLUTION : useEffect pour logger quand orderData change
  useEffect(() => {
    if (orderData) {
      console.log("🔄 ORDER DATA DANS LE STATE:", orderData);
      console.log("📦 ITEMS:", orderData.items);
    }
  }, [orderData]);

  const handleTrackOrder = async () => {
    if (!orderId.trim()) {
      setError("Veuillez entrer un numéro de commande.");
      return;
    }
    setError("");
    setOrderData(null);
    setHasSearched(true);

    try {
      const response = await fetch(
        `http://localhost:5001/api/orders/${orderId}`,
        { 
          method: "GET", 
          credentials: "include",
          headers: {
            'Content-Type': 'application/json'
          }
        }
      );

      if (!response.ok) {
        throw new Error("Commande introuvable");
      }
      
      const data = await response.json();
      
      // ✅ LOG AVANT DE SETTER
      console.log("✅ DONNÉES REÇUES DU SERVEUR:", data);
      
      setOrderData(data);
      
      // ✅ Vérification supplémentaire
      console.log("✅ orderId dans la réponse:", data._id);
      console.log("✅ nombre d'items:", data.items?.length);

    } catch (err) {
      console.error("❌ Erreur:", err);
      setError("Aucune commande trouvée avec ce numéro.");
    }
  };


const markAsDelivered = async () => {
    try {
      const response = await fetch(
        `http://localhost:5001/api/orders/${orderData._id}/deliver`,
        { method: "POST", credentials: "include" }
      );

      if (!response.ok) {
        alert("Impossible de marquer la commande comme reçue.");
        return;
      }

      const updated = await response.json();
      setOrderData(updated.order);
      alert("Merci ! Votre commande est marquée comme reçue.");
    } catch (err) {
      alert("Erreur lors de la confirmation de réception.");
    }
  };

const handleReview = (item) => { 
  const productId = item.productId || item.product?._id; 
  navigate(`/review/${productId}`, {
     state: { orderId: orderData._id } 
    }); 
  };

const handleRebuy = async (item) => {
  try {
    await addToCartContext({
      variantId: item.variantId,
      productId: item.productId,
      nom: item.nom,
      imageUrl: item.imageUrl,
      quantite: 1,
      options: item.options,
    });

    alert("Produit ajouté au panier !");
  } catch (err) {
    console.error(err);
    alert("Erreur lors de l’ajout au panier");
  }
};

  function formatDate(dateString) {
  const date = new Date(dateString);
  const day = String(date.getDate()).padStart(2, "0");
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const year = date.getFullYear();
  return `${day}-${month}-${year}`;
}

const handleReturnRequest = (orderId, item) => {
  let productId = null;

  if (item.productId && typeof item.productId === "object") {
    productId = item.productId._id;
  } else if (typeof item.productId === "string") {
    productId = item.productId;
  } else if (item.product && item.product._id) {
    productId = item.product._id;
  }
console.log("ITEM PRODUCT ID:", item.productId);

  if (!productId) {
    console.error("❌ ID PRODUIT INTROUVABLE — STRUCTURE ITEM :", item);
    alert("Impossible d’identifier le produit pour le retour.");
    return;
  }

  navigate("/retour-produit", {
    state: {
      orderId,
      products: [{ _id: productId }]
    }
  });
};

// Dans votre composant TrackOrder, modifiez la fonction toggleItemSelection
const toggleItemSelection = (item) => {
  // Créer un identifiant unique combinant productId ET variantId
  const itemKey = `${item.productId}-${item.variantId}`;
  
  setSelectedItems((prev) => {
    // Vérifier si cet item est déjà sélectionné
    const exists = prev.some(
      selected => 
        selected.productId === item.productId && 
        selected.variantId === item.variantId
    );
    
    if (exists) {
      // Retirer l'item
      return prev.filter(
        selected => 
          !(selected.productId === item.productId && 
            selected.variantId === item.variantId)
      );
    } else {
      // Ajouter l'item avec productId ET variantId
      return [...prev, {
        productId: item.productId,
        variantId: item.variantId,
        quantity: 1 // quantité par défaut
      }];
    }
  });
};
  return (
    <div style={styles.container}>
      <h1 style={styles.title}> {t("TrackOrder.h1")} </h1>

      <div style={styles.card}>
        <input
          type="text"
          placeholder="Entrez votre numéro de commande"
          value={orderId}
          onChange={(e) => setOrderId(e.target.value)}
          style={styles.input}
        />

        <button onClick={handleTrackOrder} style={styles.button}>
       {t("preOrders.Button")}   
        </button>

        {error && <p style={styles.error}>{error}</p>}

  {hasSearched  &&  orderData &&  (
  <div style={styles.modalOverlay}  > 
    <button
  onClick={() => setShowOrderModal(false)}
  style={styles.closeButton}
>✕</button>

<div style={styles.result}   onClick={(e) => e.stopPropagation()}>
            <h3>{t("preOrders.h3")}  : {orderData._id}</h3>


            <div style={styles.timeline}>
              <div style={orderData.status !== "pending" ? styles.stepActive : styles.step}>
                 {t("TrackOrder.pending")} 
              </div>
              <div style={orderData.status === "confirmed" || orderData.status === "shipped" || orderData.status === "delivered" ? styles.stepActive : styles.step}>
                  {t("TrackOrder.confirmed")} 
              </div>
              <div style={orderData.status === "shipped" || orderData.status === "delivered" ? styles.stepActive : styles.step}>
               {t("TrackOrder.shipped")} 
              </div>
              <div style={orderData.status === "delivered" ? styles.stepActive : styles.step}>
                 {t("TrackOrder.delivered")} 
              </div>
            </div>
       
      <p><strong>{t("preOrders.status")} :</strong> {orderData.status}</p>
      <p><strong>{t("preOrders.Payment")} :</strong> {orderData.paymentStatus}</p>
      <p><strong>{t("preOrders.totalPrice")} :</strong> {orderData.totalPrice} €</p> 
      <p>{t("preOrders.Date")}: {formatDate(orderData.paidAt)}</p>
      
{orderData.status !== "delivered" && (
<button onClick={markAsDelivered} style={styles.button}>{t("TrackOrder.noReception")}</button>)}

   <h4>{t("TrackOrder.h4")}</h4>
<button onClick={() => setShowDetails(!showDetails)}
  style={styles.button}>
  {showDetails ? "Masquer les détails" : "Afficher les détails"}
</button>

    {/* ⭐️ section  de détails commande  */}
 {showDetails && (
  <div>

{orderData.items.map((item, i) => {
  return (
    <div key={i} style={styles.item}>
      

      <div style={styles.block}>
    {/* ✅ IMAGE */}
    
      {item.imageUrl && (
        <img
      src={`http://localhost:5001${item.imageUrl}`}
          alt={item.nom}
          style={styles.img}
        />
      )}
        <div style={styles.blockDetail}> 
                {/* ✅ CHECKBOX avec identification unique */}
      <input
        type="checkbox"
        checked={selectedItems.some(
          selected => 
            selected.productId === item.productId && 
            selected.variantId === item.variantId
        )}
        onChange={() => toggleItemSelection(item)}
      />
        <p><strong>{item.nom}</strong></p>
        <p> {t("preOrders.Size")} : {item.options.size} {item.options.unit}</p>
        <p>{t("preOrders.Price")}  : {item.options.prix} €</p>
        <p>{t("preOrders.Quantity")} : {item.quantite}</p> 
       </div>

        {/* STATUT RETOUR */}
  <p>
  <strong>{t("Orders.Return")} :</strong>{" "}
  {item.returnStatus === "none" && t("TrackOrder.noneReturn")}
  {item.returnStatus === "requested" && t("TrackOrder.requested")}
  {item.returnStatus === "approved" && t("TrackOrder.approved")}
  {item.returnStatus === "returned" && t("TrackOrder.returned")}
  {item.returnStatus === "refunded" && t("TrackOrder.refunded")}
</p>

        <button onClick={() => handleRebuy(item)} style={styles.smallButton}>
           {t("TrackOrder.Redeem")}
        </button>

        <button onClick={() => handleReview(item)} style={styles.smallButton}>
       {t("TrackOrder.leaveReview")}
        </button>
      </div>
    </div>
  );
})}

{/* BOUTON DE RETOUR AVEC LE BON FORMAT */}
<button
  style={{
    ...styles.button,
    opacity: selectedItems.length === 0 ? 0.5 : 1,
    cursor: selectedItems.length === 0 ? "not-allowed" : "pointer"
  }}
  disabled={selectedItems.length === 0}
  onClick={() => {
    navigate("/retour-produit", {
      state: {
        orderId: orderData._id,
        products: selectedItems, // ✅ Maintenant chaque item a productId et variantId
      },
    });
  }}
>  {t("TrackOrder.ReturnRequest")}
   ({selectedItems.length} {t("TrackOrder.Product")} {selectedItems.length > 1 ? 's' : ''})
</button>
  </div>
)}

</div>
</div>
)}

 </div>
 </div>
  );
}

const styles = {
  container: {
    minHeight: "100vh",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    paddingTop: 40,
    backgroundColor: "#f5f5f5",
  },
  block: {
 marginLeft: 10,
 
  },
  blockDetail: {
    padding: 5,
    display: "flex",
    flexDirection: "column",
    alignItems: "center"

  },
  title: {
    fontSize: 28,
    marginBottom: 20,
  },
  card: {
    backgroundColor: "#fff",
    padding: 25,
    borderRadius: 10,
    width: "90%",
    maxWidth: 850,
    boxShadow: "0 4px 10px rgba(0,0,0,0.1)",
  },
  img: {
    width: "12%",
    height: "12%",
    borderRadius: "1rem"
  }, 
  input: {
    width: "100%",
    padding: 12,
    fontSize: 16,
    borderRadius: 6,
    border: "1px solid #ccc",
    marginBottom: 15,
  },
  button: {
    width: "100%",
    padding: 12,
    backgroundColor: "#007bff",
    color: "#fff",
    fontSize: 16,
    border: "none",
    borderRadius: 6,
    cursor: "pointer",
    marginTop: 10,
  },
  error: {
    marginTop: 15,
    color: "red",
    textAlign: "center",
  },
  result: {
    marginTop: 20,
    padding: 15,
    backgroundColor: "#f0f8ff",
    borderRadius: 6,
  },
  timeline: {
    display: "flex",
    justifyContent: "space-between",
    marginBottom: 15,
  },
  step: {
    padding: "6px 10px",
    backgroundColor: "#ddd",
    borderRadius: 5,
    fontSize: 12,
  },
  stepActive: {
    padding: "6px 10px",
    backgroundColor: "#4caf50",
    color: "#fff",
    borderRadius: 5,
    fontSize: 12,
  },
  item: {
    marginBottom: 15,
    padding: 10,
    backgroundColor: "#fff",
    borderRadius: 6,
    border: "1px solid #ddd",
  },
  smallButton: {
    padding: "6px 10px",
    marginRight: 10,
    backgroundColor: "#333",
    color: "#fff",
    border: "none",
    borderRadius: 4,
    cursor: "pointer",
    fontSize: 12,
  },

closeButton: {
  position: "absolute",
  top: 10,
  right: 10,
  background: "red",
  color: "#fff",
  border: "none",
  borderRadius: "50%",
  width: 30,
  height: 30,
  cursor: "pointer",
},



};
