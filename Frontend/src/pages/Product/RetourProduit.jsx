//Frontend/pages/retour 
import React, { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import ReturnService from "../../Services/returnService";
import "./Product.scss";

export default function RetourProduit() {
  const navigate = useNavigate();
  const { state } = useLocation(); // orderId + productId
  const { orderId, productId } = state;

  const [reason, setReason] = useState("");
  const [description, setDescription] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();

    const res = await ReturnService.createReturn({
      orderId,
      productId,
      reason,
      description,
    });

    if (res.success) {
      navigate("/MonCompte");
    }
  };

  return (
    <div className="return-container">
      <h2>Demande de retour</h2>

      <form onSubmit={handleSubmit}>
        <label>Raison du retour</label>
        <select value={reason} onChange={(e) => setReason(e.target.value)} required>
          <option value="">Choisir...</option>
          <option value="defectueux">Produit défectueux</option>
          <option value="taille">Mauvaise taille</option>
          <option value="description">Ne correspond pas à la description</option>
          <option value="autre">Autre</option>
        </select>

        <label>Description (optionnel)</label>
        <textarea
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        />

        <button type="submit">Envoyer la demande</button>
      </form>
    </div>
  );
}
