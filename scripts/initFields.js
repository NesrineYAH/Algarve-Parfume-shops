const mongoose = require("mongoose");
const Product = require("../Model/product");
require("dotenv").config();

/*
mongoose
    .connect(process.env.MONGO_URI || "mongodb://127.0.0.1:27017/parfumesShopsDB")
    .then(() => console.log("✅ Connexion MongoDB réussie"))
    .catch((err) => console.error("❌ Erreur de connexion MongoDB :", err));
*/

async function initFields() {
    try {
        await mongoose.connect("mongodb://127.0.0.1:27017/parfumesShopsDB", {
        });
        console.log("✅ Connexion MongoDB réussie");

        // Forcer les champs rating et comments pour tous les produits
        await Product.updateMany(
            {},
            { $set: { rating: 0, comments: [] } }
        );

        console.log("Champs rating et comments forcés pour tous les produits !");
        process.exit();
    } catch (error) {
        console.error("Erreur :", error);
        process.exit(1);
    }
}

initFields();
