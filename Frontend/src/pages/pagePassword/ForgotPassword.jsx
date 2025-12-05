import React, { useState } from "react";
import { forgotPassword } from "../../Services/auth";

export default function ForgotPassword() {
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    const res = await forgotPassword(email);
    setMessage(res.message);
  };

  return (
    <div>
      <h2>Mot de passe oublié</h2>
      <form onSubmit={handleSubmit}>
        <input 
          type="email" 
          placeholder="Votre email" 
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <button>Envoyer</button>
      </form>
      <p>{message}</p>
    </div>
  );
}
