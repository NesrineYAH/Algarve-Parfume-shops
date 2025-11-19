const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const User = require("../Model/User");
const { body } = require("express-validator");
require("dotenv").config();
const sendEmail = require("../utils/mailer"); //const { sendEmail } = require("../utils/mailer");  → ça correspond à module.exports = sendEmail.

const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const passwordRegex = /^(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*])[\w!@#$%^&*]{8,32}$/;
const signatureToken = process.env.JWT_SECRET;

// ✅ REGISTER
exports.register = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    // Validation email & password
    if (!emailRegex.test(email))
      return res.status(400).json({ message: "Email invalide" });
    if (!passwordRegex.test(password))
      return res.status(400).json({
        message:
          "Mot de passe invalide (8-32 caractères, 1 majuscule, 1 chiffre, 1 spécial !@#$%^&*)",
      });

    // Vérifie si l'utilisateur existe déjà
    const existingUser = await User.findOne({ email });
    if (existingUser)
      return res.status(400).json({ message: "Cet email est déjà utilisé." });

    // Hachage du mot de passe
    const hashedPassword = await bcrypt.hash(password, 10);

    // Création de l'utilisateur
    const user = new User({ name, email, password: hashedPassword });
    await user.save();

    // ⚡ Envoi du mail de bienvenue
    await sendEmail({
      to: email,
      subject: "Bienvenue sur notre plateforme  Algarve Parfume !",
      text: `Bonjour ${name}, merci de vous être inscrit sur notre plateforme !`,
      html: `<p>Bonjour <b>${name}</b>,</p><p>Merci de vous être inscrit sur notre plateforme !</p>`,
    });

    res.status(201).json({ message: "Utilisateur créé avec succès", user });
  } catch (error) {
    console.error("Erreur dans register :", error);
    res.status(500).json({ message: "Erreur serveur", error: error.message });
  }
};

// ✅ LOGIN
exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });
    if (!user) {
      return res
        .status(401)
        .json({ message: "Paire login/mot de passe incorrecte" });
    }

    const valid = await bcrypt.compare(password, user.password);
    if (!valid) {
      return res
        .status(401)
        .json({ message: "Paire login/mot de passe incorrecte" });
    }

    const token = jwt.sign(
      { userId: user._id, role: user.role },
      signatureToken,
      { expiresIn: "24h" }
    );

    console.log("Token généré :", token);
    console.log("ROLE UTILISATEUR :", user.role);

    res.status(200).json({
      userId: user._id,
      role: user.role,
      token,
    });
  } catch (error) {
    console.error("Erreur dans login :", error);
    res.status(500).json({ message: "Erreur serveur", error: error.message });
  }
};

// ✅ VALIDATION EXPRESS-VALIDATOR
exports.validate = (method) => {
  switch (method) {
    case "register":
      return [
        body("email", "Email invalide").isEmail(),
        body(
          "password",
          "Mot de passe invalide (min 8 caractères, majuscule, chiffre, caractère spécial)"
        ).matches(passwordRegex),
      ];
    case "login":
      return [
        body("email", "Email invalide").isEmail(),
        body("password", "Mot de passe requis").notEmpty(),
      ];
  }
};
