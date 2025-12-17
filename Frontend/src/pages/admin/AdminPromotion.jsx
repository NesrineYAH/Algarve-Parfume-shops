import { useState } from "react";
import axios from "axios";

const AdminPromotion = () => {
  const [title, setTitle] = useState("");
  const [message, setMessage] = useState("");
  const [imageFile, setImageFile] = useState(null);
  const [success, setSuccess] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    try {
      const token = localStorage.getItem("token");

      const formData = new FormData();
      formData.append("title", title);
      formData.append("message", message);
      if (imageFile) {
        formData.append("image", imageFile); // champ image
      }

      await axios.post(
        "http://localhost:5001/api/promotions",
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "multipart/form-data",
          },
        }
      );

      setSuccess("Promotion envoyée avec succès !");
      setTitle("");
      setMessage("");
      setImageFile(null);
    } catch (err) {
      console.error(err);
      setError("Erreur lors de l’envoi de la promotion");
    }
  };

  return (
    <div className="admin-promo edit-product">
      <h2>Créer une promotion</h2>

      <form onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="Titre de la promo"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />

        <input
          type="file"
          accept="image/*"
          onChange={(e) => setImageFile(e.target.files[0])}
        />

        <textarea
          placeholder="Message promotionnel"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
        />

        <button type="submit">Envoyer la promotion</button>

        {error && <p className="error">{error}</p>}
        {success && <p className="success">{success}</p>}
      </form>
    </div>
  );
};

export default AdminPromotion;
