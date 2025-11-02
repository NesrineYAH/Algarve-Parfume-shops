const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const User = require("../Model/User");
const { body, validationResult } = require("express-validator");


exports.register = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    // Vérifie si l'utilisateur existe déjà
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: "Cet email est déjà utilisé." });
    }

    // Crée un nouvel utilisateur
    const user = new User({ name, email, password });
    await user.save();

    res.status(201).json({ message: "Utilisateur créé avec succès", user });
  } catch (error) {
    console.error("Erreur dans register :", error);
    res.status(500).json({ message: "Erreur serveur", error: error.message });
  }
};

// ✅ Route de connexion
exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Vérifie si les deux champs sont présents
    if (!email || !password) {
      return res.status(400).json({ message: "Email et mot de passe requis" });
    }

    // Recherche de l'utilisateur
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(401).json({ message: "Utilisateur non trouvé" });
    }

    // Vérifie le mot de passe (en clair)
    if (user.password !== password) {
      return res.status(401).json({ message: "Mot de passe incorrect" });
    }

    // Si tout est bon :
    res.status(200).json({
      message: "Connexion réussie",
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
    });
  } catch (err) {
    console.error("Erreur lors du login :", err);
    res.status(500).json({ message: "Erreur serveur" });
  }
};

// Validation express-validator
exports.validate = (method) => {
  switch (method) {
    case "register":
      return [
        body("email", "Email invalide").isEmail(),
        body("password", "passeword invalide (min 6 caractères)").isLength({
          min: 6,
        }),
      ];
  }
};
