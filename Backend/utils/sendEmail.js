const User = require("../models/User");
const jwt = require("jsonwebtoken");
const sendEmail = require("../utils/sendEmail");

exports.register = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: "Cet email est déjà utilisé." });
    }

    const user = new User({ name, email, password });
    await user.save();

    // ✅ Envoi de l’email de confirmation
    const html = `
      <h2>Bienvenue, ${name} 🌸</h2>
      <p>Merci de vous être inscrit sur <strong>Algarve Parfume</strong>.</p>
      <p>Votre compte est maintenant actif.</p>
      <p>Connectez-vous dès maintenant pour découvrir nos parfums :</p>
      <a href="http://localhost:5173/login"
         style="background:#c278ff;color:white;padding:10px 15px;text-decoration:none;border-radius:8px;">Se connecter</a>
      <br><br>
      <p>À bientôt 💐</p>
    `;

    await sendEmail(email, "Bienvenue sur Algarve Parfume", html);

    res.status(201).json({ message: "Utilisateur créé avec succès. Email envoyé.", user });
  } catch (error) {
    console.error("Erreur dans register :", error);
    res.status(500).json({ message: "Erreur serveur", error: error.message });
  }
};
