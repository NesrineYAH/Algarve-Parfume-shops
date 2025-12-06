const jwt = require("jsonwebtoken");
require("dotenv").config();

function authMiddleware(req, res, next) {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader) return res.status(401).json({ error: "Token manquant" });

    const token = authHeader.split(" ")[1];
    if (!token) return res.status(401).json({ error: "Non authentifié" });

    const decodedToken = jwt.verify(token, process.env.JWT_SECRET);
    req.user = {
      //userId: decodedToken._Id,
      userId: decodedToken._id,
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
