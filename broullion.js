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

exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Vérifie si les deux champs sont présents
    if (!email || !password) {
      return res.status(400).json({ message: "Email et mot de passe requis" });
    }

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(401).json({ message: "Utilisateur non trouvé" });
    }

    if (user.password !== password) {
      return res.status(401).json({ message: "Mot de passe incorrect" });
    }
    const token = jwt.sign(
      { userId: user._id, role: user.role },
      process.env.JWT_SECRET || "secretkey",
      { expiresIn: "1h" }
    );

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
    console.log("ROLE UTILISATEUR :", user.role);
  } catch (err) {
    console.error("Erreur lors du login :", err);
    res.status(500).json({ message: "Erreur serveur" });
  }
};

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
///27/11/2025

/*
router.get("/relays", async (req, res) => {
    const { lat, lng } = req.query;

    if (!lat || !lng) {
        return res.status(400).json({ error: "Latitude et longitude requises" });
    }

    try {
        const body = {
            Enseigne: process.env.MR_ENS,        // Ex: 'BDTEST13'
            Pays: "FR",
            Ville: "",
            CP: "",
            Latitude: lat,
            Longitude: lng,
            Taille: "M",
            Poids: 1000,
            Action: "REL", // Points relais
        };



        const response = await axios.post(
            "https://api.mondialrelay.com/Web_Services.asmx/WSI3_PointRelais_Recherche",
            body,
            { headers: { "Content-Type": "application/json" } }
        );

        const relays = response.data?.RecherchePointRelaisResult?.PointsRelais?.PointRelais_Details || [];

        res.json({ relays });

    } catch (err) {
        console.error("Erreur API Mondial Relay :", err.message);
        res.status(500).json({ error: "Impossible d’obtenir les points relais" });
    }
});

module.exports = router;
*/

//            "https://api.mondialrelay.com/Web_Services/WSI4_PointRelais.asmx/RecherchePointRelais",
//            "https://api.mondialrelay.com/Web_Services.asmx/WSI3_PointRelais_Recherche"