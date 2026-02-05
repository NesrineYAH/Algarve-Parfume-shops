// Backend/middleware/auth.js
const jwt = require("jsonwebtoken");
const User = require("../Model/User");
require("dotenv").config();

async function authMiddleware(req, res, next) {   // ⭐ async ajouté ici
  try {
    // 1️⃣ Lire le cookie JWT
    const tokenFromCookie = req.cookies?.token || req.cookies?.jwt;
    const authHeader = req.headers.authorization;

    // 2️⃣ Lire le header Authorization (optionnel)
    const tokenFromHeader = authHeader?.startsWith("Bearer ")
      ? authHeader.split(" ")[1]
      : null;

    // 3️⃣ Priorité au cookie
    const token = tokenFromCookie || tokenFromHeader;
    if (!token) return res.status(401).json({ error: "Non authentifié" });

    // 4️⃣ Vérifier le token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // 5️⃣ Charger l'utilisateur depuis MongoDB
    const user = await User.findById(decoded.userId).select("-password"); // ⭐ plus d'erreur
    if (!user) {
      return res.status(401).json({ error: "Utilisateur introuvable" });
    }

    // 6️⃣ Attacher l'utilisateur complet à req.user
    req.user = user;

    next();
  } catch (error) {
    console.error("Erreur authMiddleware :", error);
    res.status(401).json({ error: "Token invalide" });
  }
}

function isAdmin(req, res, next) {
  if (req.user && (req.user.role === "admin" || req.user.role === "vendeur")) {
    next();
  } else {
    res.status(403).json({ error: "Accès interdit" });
  }
}

module.exports = { authMiddleware, isAdmin };



/*
     // Backend/middleware/auth.js
const jwt = require("jsonwebtoken");
require("dotenv").config();

function authMiddleware(req, res, next) {
  try {
    // 1️⃣ Lire le cookie JWT
    const tokenFromCookie = req.cookies?.token || req.cookies?.jwt;
    const authHeader = req.headers.authorization;

    // 2️⃣ Lire le header Authorization (optionnel)
    const tokenFromHeader = authHeader?.startsWith("Bearer ") ?
      authHeader.split(" ")[1] : null;

    // 3️⃣ Priorité au cookie
    const token = tokenFromCookie || tokenFromHeader; // const token = authHeader.split(" ")[1];
    if (!token) return res.status(401).json({ error: "Non authentifié" });

    const decodedToken = jwt.verify(token, process.env.JWT_SECRET);
    req.user = {
      userId: decodedToken.userId,
      role: decodedToken.role,
      nom: decodedToken.nom,
      prenom: decodedToken.prenom,
      email: decodedToken.email
    };

    next();
  } catch (error) {
    res.status(401).json({ error: "Token invalide" });
  }
}

function isAdmin(req, res, next) {
  if (req.user && (req.user.role === "admin" || req.user.role === "vendeur")) {
    next();
  } else {
    res.status(403).json({ error: "Accès interdit" });
  }
}

module.exports = { authMiddleware, isAdmin };
  */