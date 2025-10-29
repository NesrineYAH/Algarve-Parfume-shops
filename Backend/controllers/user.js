const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const User = require("../Model/User");
const { body, validationResult } = require("express-validator");

exports.register = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(422).json({ errors: errors.array() });
  }

  try {
    const hash = await bcrypt.hash(req.body.password, 10);
    const user = new User({
        nom: req.body.nom,
      email: req.body.email,
      password: hash,
    });
    await user.save();
    res.status(201).json({ message: "Utilisateur créé !" });
  } catch (error) {
    res.status(500).json({ message: "Erreur serveur", error });
  }
};

exports.login = async (req, res) => {
  try {
    const user = await User.findOne({ email: req.body.email });
    if (!user)
      return res.status(401).json({ message: "Identifiants invalides" });

    const valid = await bcrypt.compare(req.body.password, user.password);
    if (!valid)
      return res.status(401).json({ message: "Identifiants invalides" });

    const token = jwt.sign({ userId: user._id }, "RANDOM_TOKEN_SECRET", {
      expiresIn: "24h",
    });

    res.status(200).json({ userId: user._id, token });
  } catch (error) {
    res.status(500).json({ message: "Erreur serveur", error });
  }
};

// Validation express-validator
exports.validate = (method) => {
  switch (method) {
    case "register":
      return [
        body("email", "Email invalide").isEmail(),
        body("password", "Mot de passe invalide (min 6 caractères)").isLength({
          min: 6,
        }),
      ];
  }
};
