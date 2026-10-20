const mongoose = require("mongoose");
require("dotenv").config();
const configUser = process.env.CONFIG_USER;
const configPassword = process.env.CONFIG_PASSWORD;

const uri = `mongodb+srv://${configUser}:${configPassword}@cluster2710.txi9d11.mongodb.net/parfumesShopsDB?retryWrites=true&w=majority&appName=Cluster2710`;

mongoose
  .connect(uri, { useNewUrlParser: true, useUnifiedTopology: true })

  .then(() => console.log("Connexion à MongoDB réussie parfaite !"))
  .catch((e) => {
    console.error("Erreur de connexion à MongoDB :", e);
  });
module.exports = mongoose;
