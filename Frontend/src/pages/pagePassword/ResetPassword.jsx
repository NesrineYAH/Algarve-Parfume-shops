import React, { useState } from "react";
import { resetPassword } from "../../Services/auth";
import { useParams, useNavigate } from "react-router-dom";

export default function ResetPassword() {
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const { token } = useParams();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    const res = await resetPassword(token, password);
    setMessage(res.message);

    if (res.message.includes("succès")) {
      setTimeout(() => navigate("/login"), 1500);
    }
  };

  return (
    <div>
      <h2>Réinitialiser le mot de passe</h2>
      <form onSubmit={handleSubmit}>
        <input
          type="password"
          placeholder="Nouveau mot de passe"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
        <button>Changer</button>
      </form>
      <p>{message}</p>
    </div>
  );
}
