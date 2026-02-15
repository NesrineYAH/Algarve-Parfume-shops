//Frontend/pages/RetourProdtuit.jsx 
import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import ReturnService from "../../Services/returnService";
import "./Product.scss";

export default function RetourProduit() {
  const navigate = useNavigate();
  const location = useLocation();
  const [reason, setReason] = useState("");
  const [description, setDescription] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // Récupération des données passées par TrackOrder
  const { orderId, products } = location.state || {};

  // Redirection si les données sont manquantes
  useEffect(() => {
    if (!location.state || !orderId || !products || products.length === 0) {
      setError("Informations de retour manquantes");
      setTimeout(() => navigate("/MonCompte"), 3000);
    }
  }, [location.state, orderId, products, navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!reason) {
      setError("Veuillez sélectionner une raison");
      return;
    }

    setLoading(true);
    setError("");

    try {
      // ✅ Formatage des produits pour correspondre EXACTEMENT à ce qu'attend le controller
      const formattedProducts = products.map(p => ({
        productId: p.productId || p._id, // Support des deux formats
        variantId: p.variantId,           // 👈 AJOUT ESSENTIEL du variantId
        quantity: p.quantity || 1          // Quantité par défaut
      }));

      console.log("📦 Envoi des produits:", formattedProducts); // Debug

      const res = await ReturnService.createReturn({
        orderId,
        products: formattedProducts,
        reason,
        description: description.trim() || undefined,
      });

      if (res.success) {
        // Afficher un message de succès avant redirection
        alert("✅ Demande de retour créée avec succès ! Un email vous a été envoyé.");
        navigate("/MonCompte", { 
          state: { returnSuccess: true, returnId: res.returnId } 
        });
      } else {
        setError(res.message || "Erreur lors de la création du retour");
      }
    } catch (err) {
      console.error("❌ Erreur retour:", err);
      setError(err.response?.data?.message || "Une erreur est survenue");
    } finally {
      setLoading(false);
    }
  };

  // Affichage des produits sélectionnés
  const renderSelectedProducts = () => {
    if (!products || products.length === 0) return null;

    return (
      <div className="selected-products">
        <h3>Produits à retourner :</h3>
        {products.map((product, index) => (
          <div key={index} className="product-item">
            <p>
              <strong>Produit {index + 1} :</strong>
              {product.nom && ` ${product.nom}`}
              {product.size && ` - Taille: ${product.size}`}
              {product.unit && ` ${product.unit}`}
            </p>
            <p className="product-detail">
              Quantité: {product.quantity || 1}
            </p>
          </div>
        ))}
      </div>
    );
  };

  if (error && !products) {
    return (
      <div className="return-container error-container">
        <h2>❌ Erreur</h2>
        <p>{error}</p>
        <p>Redirection vers votre compte...</p>
        <button onClick={() => navigate("/MonCompte")}>
          Retour maintenant
        </button>
      </div>
    );
  }

  return (
    <div className="return-container">
      <h2>Demande de retour</h2>
      
      {renderSelectedProducts()}

      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="reason">Raison du retour *</label>
          <select 
            id="reason"
            value={reason} 
            onChange={(e) => {
              setReason(e.target.value);
              setError("");
            }} 
            required
            disabled={loading}
          >
            <option value="">Choisir une raison...</option>
            <option value="defectueux">Produit défectueux</option>
            <option value="taille">Mauvaise taille / ne correspond pas</option>
            <option value="description">Ne correspond pas à la description</option>
            <option value="commande">Erreur dans ma commande</option>
            <option value="livraison">Problème de livraison</option>
            <option value="autre">Autre</option>
          </select>
        </div>

        <div className="form-group">
          <label htmlFor="description">Description (optionnel)</label>
          <textarea
            id="description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Expliquez brièvement le problème..."
            rows="4"
            disabled={loading}
          />
        </div>

        {error && (
          <div className="error-message">
            ⚠️ {error}
          </div>
        )}

        <div className="form-actions">
          <button 
            type="button" 
            onClick={() => navigate(-1)}
            className="btn-secondary"
            disabled={loading}
          >
            Annuler
          </button>
          <button 
            type="submit" 
            className="btn-primary"
            disabled={loading || !reason}
          >
            {loading ? "Envoi en cours..." : "Envoyer la demande"}
          </button>
        </div>
      </form>
    </div>
  );
}