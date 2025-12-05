import React, { useState } from "react";
import { resetPassword } from "../../Services/auth";
import { useParams, useNavigate } from "react-router-dom";

export default function ResetPassword() {
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [message, setMessage] = useState("");
  const { token } = useParams();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    //05/12 // Vérification que les mots de passe correspondent
    if (password !== confirmPassword) {
      setMessage("❌ Les mots de passe ne correspondent pas.");
      return;
    }

    const res = await resetPassword(token, password);
    setMessage(res.message);

    if (res.message.includes("succès")) {
      setTimeout(() => navigate("/login"), 1500);
    }
  };

  return (
    <div className="Auth-container">
      <h2>Réinitialiser le mot de passe</h2>
      <form onSubmit={handleSubmit}>
        <input
          type="password"
          placeholder="Nouveau mot de passe"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
            <input
          type="password"
          placeholder="Confirmer votre mot de passe"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
          required
        />

        <button>Changer</button>
      </form>
      <p>{message}</p>
    </div>
  );
}
/*
nesrinebekkar@gmail.com
Manelbek87*




*/
