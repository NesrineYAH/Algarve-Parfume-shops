import React, { useState, useContext, useEffect } from "react"; // ← AJOUTER useEffect
import { useParams, useNavigate } from "react-router-dom";
import { CartContext } from "../../context/CartContext";

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
      <h1 style={styles.title}>Suivre votre commande</h1>

      <div style={styles.card}>
        <input
          type="text"
          placeholder="Entrez votre numéro de commande"
          value={orderId}
          onChange={(e) => setOrderId(e.target.value)}
          style={styles.input}
        />

        <button onClick={handleTrackOrder} style={styles.button}>
          Suivre la commande
        </button>

        {error && <p style={styles.error}>{error}</p>}

  {hasSearched  &&  orderData &&  (
  <div style={styles.modalOverlay}  > 
    <button
  onClick={() => setShowOrderModal(false)}
  style={styles.closeButton}
>✕</button>

<div style={styles.result}   onClick={(e) => e.stopPropagation()}>
            <h3>Commande : {orderData._id}</h3>


            <div style={styles.timeline}>
              <div style={orderData.status !== "pending" ? styles.stepActive : styles.step}>
                Préparée
              </div>
              <div style={orderData.status === "confirmed" || orderData.status === "shipped" || orderData.status === "delivered" ? styles.stepActive : styles.step}>
                Confirmée
              </div>
              <div style={orderData.status === "shipped" || orderData.status === "delivered" ? styles.stepActive : styles.step}>
                Expédiée
              </div>
              <div style={orderData.status === "delivered" ? styles.stepActive : styles.step}>
                Livrée
              </div>
            </div>
        
        
      <p><strong>Statut :</strong> {orderData.status}</p>
      <p><strong>Paiement :</strong> {orderData.paymentStatus}</p>
      <p><strong>Total :</strong> {orderData.totalPrice} €</p> 
      <p>Date: {formatDate(orderData.paidAt)}</p>
      
{orderData.status !== "delivered" && (
<button onClick={markAsDelivered} style={styles.button}>J’ai reçu ma commande</button>)}

   <h4>Détails des articles</h4>
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

      {/* ✅ IMAGE */}
      {item.imageUrl && (
        <img
          src={item.imageUrl}
          alt={item.nom}
          style={{ width: 80, height: 80, objectFit: "cover", marginLeft: 10 }}
        />
      )}

      <div style={{ marginLeft: 10 }}>
        <p><strong>{item.nom}</strong></p>
        <p>Taille : {item.options.size} {item.options.unit}</p>
        <p>Prix : {item.options.prix} €</p>
        <p>Quantité : {item.quantite}</p>

        {/* STATUT RETOUR */}
        <p>
          <strong>Retour :</strong>{" "}
          {item.returnStatus === "none" && "Aucun retour demandé"}
          {item.returnStatus === "requested" && "Demande envoyée"}
          {item.returnStatus === "approved" && "Retour approuvé"}
          {item.returnStatus === "returned" && "Colis reçu"}
          {item.returnStatus === "refunded" && "Remboursé ✔"}
        </p>

        <button onClick={() => handleRebuy(item)} style={styles.smallButton}>
          Racheter
        </button>

        <button onClick={() => handleReview(item)} style={styles.smallButton}>
          Laisser un avis
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
>
  Demander un retour ({selectedItems.length} produit{selectedItems.length > 1 ? 's' : ''})
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
    width: "25%",
    height: "25%",
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
  //03/02
  /*
modalOverlay: {
  position: "fixed",
  top: 0,
  left: 0,
  width: "100%",
  height: "100%",
  background: "rgba(0,0,0,0.5)",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  zIndex: 1000,
},
*/

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

/*
credentials: "include" force le navigateur à envoyer :
    les cookies
    donc ton JWT
    donc l’utilisateur est authentifié
    donc la route fonctionne
*/
//15/02
{/*
<button
  style={styles.button}
  disabled={selectedItems.length === 0}
  onClick={() => {
    const formattedProducts = selectedItems.map(id => {
      if (typeof id === 'object' && (id._id || id.productId)) {
        return {
          productId: id._id || id.productId
        };
      }
      return { productId: id };
    });

    console.log("Produits formatés envoyés:", formattedProducts); 

    navigate("/retour-produit", {
      state: {
        orderId: orderData._id,
        products: formattedProducts,
      },
    });
  }}
>
  Demander un retour ({selectedItems.length})
</button>
 */}
 //15/02

{/*
 <button
      onClick={() => handleReturnRequest(orderData._id, selectedItems[0])}
      style={styles.smallButton}
    >
      Demander un retour
    </button>
    */}
    
    {/* ⭐️ section avant  

{orderData.items.map((item, i) => (
  <div key={i} style={styles.item}>
    <p><strong>{item.nom}</strong></p>
    <p>Taille : {item.options.size} {item.options.unit}</p>
    <p>Prix : {item.options.prix} €</p>
    <p>Quantité : {item.quantite}</p>

    <p>
      <strong>Retour :</strong>{" "}
      {item.returnStatus === "none" && "Aucun retour demandé"}
      {item.returnStatus === "requested" && "Demande envoyée"}
      {item.returnStatus === "approved" && "Retour approuvé — envoyez le colis"}
      {item.returnStatus === "returned" && "Colis reçu par le vendeur"}
      {item.returnStatus === "refunded" && "Produit remboursé ✔"}
    </p>

    <button
      onClick={() => handleRebuy(item)}
      style={styles.smallButton}
    >
      Racheter
    </button>

    <button onClick={() => handleReview(item)} 
      style={styles.smallButton}
    >
      Laisser un avis
    </button>

    <button
      onClick={() => handleReturnRequest(orderData._id, item)}
      style={styles.smallButton}
    >
      Demander un retour
    </button>
  </div>
))}
*/}