const Address = require("../Model/Address");

// Ajouter une adresse
exports.addAddress = async (req, res) => {
    try {
        const { street, city, postalCode, country, type } = req.body;

        // ✔️ Le bon userId
        const userId = req.user.userId;

        const newAddress = new Address({
            userId,
            street,
            city,
            postalCode,
            country,
            type
        });

        await newAddress.save();

        res.status(201).json({
            message: "Adresse ajoutée avec succès",
            address: newAddress
        });

    } catch (error) {
        res.status(500).json({
            message: "Erreur serveur",
            error: error.message
        });
    }
};


// Récupérer toutes les adresses d'un utilisateur
exports.getAddresses = async (req, res) => {
    try {
        const userId = req.user.id;
        const addresses = await Address.find({ user: userId });
        res.json(addresses);
    } catch (error) {
        res.status(500).json({ message: "Erreur serveur", error: error.message });
    }
};

// Supprimer une adresse
exports.deleteAddress = async (req, res) => {
    try {
        const { id } = req.params;
        await Address.findByIdAndDelete(id);
        res.json({ message: "Adresse supprimée" });
    } catch (error) {
        res.status(500).json({ message: "Erreur serveur", error: error.message });
    }
};


