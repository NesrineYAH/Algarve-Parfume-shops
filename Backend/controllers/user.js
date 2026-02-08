//  controllers/users.js
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const User = require("../Model/User");
const Order = require("../Model/Order");
const { body } = require("express-validator");
require("dotenv").config();
const { sendEmail } = require("../utils/mailer");
const crypto = require("crypto");
const mongoose = require("mongoose");

const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const passwordRegex = /^(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*])[\w!@#$%^&*]{8,32}$/;
const signatureToken = process.env.JWT_SECRET;

exports.register = async (req, res) => {
  try {
    const { nom, prenom, email, password } = req.body;

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
    const user = new User({ nom, prenom, email, password: hashedPassword });
    await user.save();

    // ⚡ Envoi du mail de bienvenue
    await sendEmail({
      to: email,
      subject: "Bienvenue sur notre plateforme  Algarve Parfume !",
      text: `Bonjour ${prenom}, merci de vous être inscrit sur notre plateforme !`,
      html: `<p>Bonjour <b>${prenom}</b>,</p><p>Merci de vous être inscrit sur notre plateforme !</p>`,
    });

    res.status(201).json({ message: "Utilisateur créé avec succès", user });
  } catch (error) {
    console.error("Erreur dans register :", error);
    res.status(500).json({ message: "Erreur serveur", error: error.message });
  }
};
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
      {
        userId: user._id,
        role: user.role,
        nom: user.nom,
        prenom: user.prenom,
        email: user.email   // optionnel si tu veux aussi l’avoir
      },
      signatureToken,
      { expiresIn: "24h" }
    );

    // ⭐ AJOUT ESSENTIEL : envoyer le token dans un cookie
    res.cookie("token", token, {
      httpOnly: true,
      secure: false, // true en production
      sameSite: "lax",
      maxAge: 24 * 60 * 60 * 1000,
    });

    console.log("Token généré :", token);
    console.log("ROLE UTILISATEUR :", user.role);
    console.log("Nom UTILISATEUR :", user.nom);

    res.status(200).json({
      token,
      user: {
        _id: user._id,
        nom: user.nom,
        prenom: user.prenom,
        email: user.email,
        role: user.role, // 👈 IMPORTANT !
      },
    });
  } catch (error) {
    console.error("Erreur dans login :", error);
    res.status(500).json({ message: "Erreur serveur", error: error.message });
  }
};
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
exports.forgotPassword = async (req, res) => {
  try {
    const { email } = req.body;

    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ message: "Email introuvable" });

    // Générer un token aléatoire
    const resetToken = crypto.randomBytes(32).toString("hex");

    user.resetPasswordToken = resetToken;
    user.resetPasswordExpires = Date.now() + 15 * 60 * 1000; // 15 min
    await user.save();

    // Lien vers frontend
    const resetLink = `http://localhost:5173/reset-password/${resetToken}`;

    await sendEmail({
      to: email,
      subject: "Réinitialisation du mot de passe",
      html: `
        <p>Bonjour,</p>
        <p>Cliquez sur ce lien pour réinitialiser votre mot de passe :</p>
        <a href="${resetLink}">Réinitialiser mon mot de passe</a>
        <p>Le lien expire dans 15 minutes.</p>
      `,
    });

    res.json({ message: "Email envoyé !" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Erreur serveur" });
  }
};
exports.resetPassword = async (req, res) => {
  try {
    const { token } = req.params;
    const { password } = req.body;

    const user = await User.findOne({
      resetPasswordToken: token,
      resetPasswordExpires: { $gt: Date.now() }, // token non expiré
    });

    if (!user)
      return res.status(400).json({ message: "Token invalide ou expiré" });

    user.password = await bcrypt.hash(password, 10);
    user.resetPasswordToken = undefined;
    user.resetPasswordExpires = undefined;

    await user.save();

    res.json({ message: "Mot de passe modifié avec succès !" });
  } catch (err) {
    res.status(500).json({ message: "Erreur serveur" });
  }
};
exports.getUsers = async (req, res) => {
  try {
    const users = await User.find().select("-password"); // exclure le mot de passe
    res.status(200).json(users);
  } catch (error) {
    console.error("Erreur récupération utilisateurs :", error);
    res.status(500).json({ message: "Erreur serveur", error: error.message });
  }
};
exports.getUserById = async (req, res) => {
  try {
    const user = await User.findById(req.params.id).select("-password");
    if (!user) return res.status(404).json({ message: "Utilisateur introuvable" });
    res.status(200).json(user);
  } catch (error) {
    console.error("Erreur récupération utilisateur :", error);
    res.status(500).json({ message: "Erreur serveur", error: error.message });
  }
};
exports.getUserOrders = async (req, res) => {
  try {
    const userId = req.params.userId;

    const orders = await Order.find({ userId }).sort({ createdAt: -1 });

    const preOrders = orders.filter(
      (o) => o.status !== "paid" && o.status !== "cancelled"
    );

    const paidOrders = orders.filter(
      (o) => o.status === "paid"
    );

    const cancelledOrders = orders.filter(
      (o) => o.status === "cancelled"
    );

    res.json({
      preOrders,
      orders: paidOrders,
      cancelledOrders,
    });

  } catch (err) {
    console.error("Erreur getUserOrders :", err);
    res.status(500).json({ error: "Erreur serveur" });
  }
};
exports.logout = (req, res) => {
  res.clearCookie("token", {
    httpOnly: true,
    secure: false, // true en production HTTPS
    sameSite: "lax",
  });

  res.status(200).json({ message: "Déconnexion réussie" });
};
// user.js de controllers getCurrentUser Récupérer l'utilisateur connecté via le cookie JWT
exports.getCurrentUser = async (req, res) => {
  try {
    // req.user est déjà rempli par authMiddleware
    if (!req.user) {
      return res.status(401).json({ error: "Utilisateur non authentifié" });
    }

    res.status(200).json({ user: req.user });
  } catch (error) {
    console.error("Erreur getCurrentUser :", error);
    res.status(500).json({ error: "Erreur serveur" });
  }
};
//sellers
// controllers/userCtrl.js

exports.getUsersByRole = async (req, res) => {
  try {
    const role = req.params.role;
    const users = await User.find({ role });
    res.json(users);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};







